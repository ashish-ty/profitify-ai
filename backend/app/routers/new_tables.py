from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.models.new_tables import (
    # Service Register
    ServiceRegisterCreate, ServiceRegisterUpdate, ServiceRegisterResponse,
    # Trial Balance
    TrialBalanceCreate, TrialBalanceUpdate, TrialBalanceResponse,
    # Expense Wise
    ExpenseWiseCreate, ExpenseWiseUpdate, ExpenseWiseResponse,
    # Variable Cost Bill Wise
    VariableCostBillWiseCreate, VariableCostBillWiseUpdate, VariableCostBillWiseResponse,
    # HR Data
    HRDataCreate, HRDataUpdate, HRDataResponse,
    # Occupancy Register
    OccupancyRegisterCreate, OccupancyRegisterUpdate, OccupancyRegisterResponse,
    # OT Register
    OTRegisterCreate, OTRegisterUpdate, OTRegisterResponse,
    # Consumption Data
    ConsumptionDataCreate, ConsumptionDataUpdate, ConsumptionDataResponse,
    # Connected Load
    ConnectedLoadCreate, ConnectedLoadUpdate, ConnectedLoadResponse,
    # Fixed Asset Register
    FixedAssetRegisterCreate, FixedAssetRegisterUpdate, FixedAssetRegisterResponse,
    # TAT Data
    TATDataCreate, TATDataUpdate, TATDataResponse,
    # Cost Center
    CostCenterCreate, CostCenterUpdate, CostCenterResponse,
    # Secondary Cost Driver
    SecondaryCostDriverCreate, SecondaryCostDriverUpdate, SecondaryCostDriverResponse,
)
from app.routers.auth import get_current_user
from app.core.database import get_supabase_client, get_supabase_admin_client

router = APIRouter()

def convert_dates_to_strings(record: dict) -> dict:
    """Convert date and datetime fields to strings for JSON serialization"""
    converted = record.copy()
    
    # Date fields that need conversion
    date_fields = [
        'date_of_final_bill', 'service_date', 'date_of_joining', 'date_of_resignation',
        'patient_admission_date', 'patient_discharge_date', 'date_of_final_bill',
        'transaction_date'
    ]
    
    # Time fields that need conversion
    time_fields = ['on_table_time', 'incision_time', 'finish_time']
    
    # Datetime fields that need conversion
    datetime_fields = ['bed_assign_datetime', 'bed_release_datetime']
    
    for field in date_fields + time_fields + datetime_fields:
        if field in converted and converted[field]:
            if hasattr(converted[field], 'isoformat'):
                converted[field] = converted[field].isoformat()
            elif isinstance(converted[field], str):
                # Already a string, keep as is
                pass
    
    # Convert decimal fields to float for JSON serialization
    decimal_fields = [
        'gross_amount', 'discount', 'net_amount', 'performing_doctor_share',
        'pharmacy_material_cost', 'outsource_share', 'amount', 'amount_second',
        'quantity', 'rate', 'transaction_value', 'connected_load', 'running_load',
        'standby_load', 'total_load_kg', 'bio_medical_equipments', 'engineering_equipments',
        'furniture_fixture', 'others', 'efforts_allocation', 'efforts_sub_allocation',
        'utilization', 'basic_pay', 'allowances', 'other_benefits', 'overtime',
        'bonus', 'epf', 'esic', 'any_other_contribution', 'gross_total',
        'deduction', 'net_salary'
    ]
    
    for field in decimal_fields:
        if field in converted and converted[field] is not None:
            try:
                converted[field] = float(converted[field])
            except (ValueError, TypeError):
                pass
    
    return converted

# Service Register endpoints
@router.post("/service-register/", response_model=ServiceRegisterResponse)
async def create_service_register(
    data: ServiceRegisterCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create service register entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert date fields to string format
        if record.get("date_of_final_bill"):
            record["date_of_final_bill"] = record["date_of_final_bill"].isoformat()
        if record.get("service_date"):
            record["service_date"] = record["service_date"].isoformat()
        
        # Convert decimal fields to float
        for field in ["gross_amount", "discount", "net_amount", "performing_doctor_share", "pharmacy_material_cost", "outsource_share"]:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("service_register").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create service register entry"
            )
        
        return ServiceRegisterResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create service register entry: {str(e)}"
        )

@router.get("/service-register/", response_model=List[ServiceRegisterResponse])
async def get_service_register(
    month: Optional[str] = None,
    patient_type: Optional[str] = None,
    service_department: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get service register entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching service register for user: {current_user['id']}")
        
        query = supabase.table("service_register").select("*").eq("user_id", current_user["id"])
        
        if month:
            query = query.eq("month", month)
        if patient_type:
            query = query.eq("patient_type", patient_type)
        if service_department:
            query = query.eq("service_department", service_department)
        
        result = query.order("date_of_final_bill", desc=True).execute()
        
        print(f"Found {len(result.data)} service register records")
        
        return [ServiceRegisterResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching service register: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve service register entries: {str(e)}"
        )

@router.put("/service-register/{record_id}", response_model=ServiceRegisterResponse)
async def update_service_register(
    record_id: str,
    data: ServiceRegisterUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update service register entry"""
    supabase = get_supabase_admin_client()
    
    try:
        # Check if record exists and belongs to user
        existing = supabase.table("service_register").select("*").eq(
            "id", record_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service register entry not found"
            )
        
        # Update only provided fields
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        
        # Convert date fields to string format
        for field in ["date_of_final_bill", "service_date"]:
            if update_data.get(field):
                update_data[field] = update_data[field].isoformat()
        
        # Convert decimal fields to float
        for field in ["gross_amount", "discount", "net_amount", "performing_doctor_share", "pharmacy_material_cost", "outsource_share"]:
            if update_data.get(field):
                update_data[field] = float(update_data[field])
        
        update_data["updated_at"] = "now()"
        
        result = supabase.table("service_register").update(update_data).eq(
            "id", record_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update service register entry"
            )
        
        return ServiceRegisterResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update service register entry: {str(e)}"
        )

@router.delete("/service-register/{record_id}")
async def delete_service_register(
    record_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete service register entry"""
    supabase = get_supabase_admin_client()
    
    try:
        # Check if record exists and belongs to user
        existing = supabase.table("service_register").select("*").eq(
            "id", record_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service register entry not found"
            )
        
        # Delete record
        result = supabase.table("service_register").delete().eq("id", record_id).execute()
        
        return {"message": "Service register entry deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete service register entry: {str(e)}"
        )

# Trial Balance endpoints
@router.post("/trial-balance/", response_model=TrialBalanceResponse)
async def create_trial_balance(
    data: TrialBalanceCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create trial balance entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert decimal fields to float
        for field in ["amount", "amount_second"]:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("trial_balance").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create trial balance entry"
            )
        
        return TrialBalanceResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create trial balance entry: {str(e)}"
        )

@router.get("/trial-balance/", response_model=List[TrialBalanceResponse])
async def get_trial_balance(
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get trial balance entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching trial balance for user: {current_user['id']}")
        
        query = supabase.table("trial_balance").select("*").eq("user_id", current_user["id"])
        
        if category:
            query = query.eq("category", category)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} trial balance records")
        
        return [TrialBalanceResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching trial balance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trial balance entries: {str(e)}"
        )

# Expense Wise endpoints
@router.post("/expense-wise/", response_model=ExpenseWiseResponse)
async def create_expense_wise(
    data: ExpenseWiseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create expense wise entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert decimal fields to float
        if record.get("amount"):
            record["amount"] = float(record["amount"])
        
        result = supabase.table("expense_wise").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create expense wise entry"
            )
        
        return ExpenseWiseResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create expense wise entry: {str(e)}"
        )

@router.get("/expense-wise/", response_model=List[ExpenseWiseResponse])
async def get_expense_wise(
    nature_of_data: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get expense wise entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching expense wise for user: {current_user['id']}")
        
        query = supabase.table("expense_wise").select("*").eq("user_id", current_user["id"])
        
        if nature_of_data:
            query = query.eq("nature_of_data", nature_of_data)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} expense wise records")
        
        return [ExpenseWiseResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching expense wise: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve expense wise entries: {str(e)}"
        )

# Variable Cost Bill Wise endpoints
@router.post("/variable-cost-bill-wise/", response_model=VariableCostBillWiseResponse)
async def create_variable_cost_bill_wise(
    data: VariableCostBillWiseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create variable cost bill wise entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert decimal fields to float
        decimal_fields = [
            "pharmacy_charged_to_patient", "medical_surgical_consumables", "implants_and_prosthetics",
            "non_medical_consumables", "fee_for_service", "incentives_to_doctors",
            "patient_food_beverages", "laboratory_test_outsource", "other_outsourced_services_1",
            "other_outsourced_services_2", "other_outsourced_services_3", "brokerage_commission",
            "provision_for_bad_debts"
        ]
        
        for field in decimal_fields:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("variable_cost_bill_wise").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create variable cost bill wise entry"
            )
        
        return VariableCostBillWiseResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create variable cost bill wise entry: {str(e)}"
        )

@router.get("/variable-cost-bill-wise/", response_model=List[VariableCostBillWiseResponse])
async def get_variable_cost_bill_wise(
    patient_type: Optional[str] = None,
    bill_no: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get variable cost bill wise entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching variable cost bill wise for user: {current_user['id']}")
        
        query = supabase.table("variable_cost_bill_wise").select("*").eq("user_id", current_user["id"])
        
        if patient_type:
            query = query.eq("patient_type", patient_type)
        if bill_no:
            query = query.eq("bill_no", bill_no)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} variable cost bill wise records")
        
        return [VariableCostBillWiseResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching variable cost bill wise: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve variable cost bill wise entries: {str(e)}"
        )

# HR Data endpoints
@router.post("/hr-data/", response_model=HRDataResponse)
async def create_hr_data(
    data: HRDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create HR data entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert date fields to string format
        for field in ["date_of_joining", "date_of_resignation"]:
            if record.get(field):
                record[field] = record[field].isoformat()
        
        # Convert decimal fields to float
        decimal_fields = [
            "efforts_allocation", "efforts_sub_allocation", "utilization", "basic_pay",
            "allowances", "other_benefits", "overtime", "bonus", "epf", "esic",
            "any_other_contribution", "gross_total", "deduction", "net_salary"
        ]
        
        for field in decimal_fields:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("hr_data").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create HR data entry"
            )
        
        return HRDataResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create HR data entry: {str(e)}"
        )

@router.get("/hr-data/", response_model=List[HRDataResponse])
async def get_hr_data(
    department: Optional[str] = None,
    period: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get HR data entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching HR data for user: {current_user['id']}")
        
        query = supabase.table("hr_data").select("*").eq("user_id", current_user["id"])
        
        if department:
            query = query.eq("department", department)
        if period:
            query = query.eq("period", period)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} HR data records")
        
        return [HRDataResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching HR data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve HR data entries: {str(e)}"
        )

# Occupancy Register endpoints
@router.post("/occupancy-register/", response_model=OccupancyRegisterResponse)
async def create_occupancy_register(
    data: OccupancyRegisterCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create occupancy register entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert date fields to string format
        for field in ["patient_admission_date", "patient_discharge_date", "date_of_final_bill"]:
            if record.get(field):
                record[field] = record[field].isoformat()
        
        # Convert datetime fields to string format
        for field in ["bed_assign_datetime", "bed_release_datetime"]:
            if record.get(field):
                record[field] = record[field].isoformat()
        
        result = supabase.table("occupancy_register").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create occupancy register entry"
            )
        
        return OccupancyRegisterResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create occupancy register entry: {str(e)}"
        )

@router.get("/occupancy-register/", response_model=List[OccupancyRegisterResponse])
async def get_occupancy_register(
    ward_code: Optional[str] = None,
    uhid: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get occupancy register entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching occupancy register for user: {current_user['id']}")
        
        query = supabase.table("occupancy_register").select("*").eq("user_id", current_user["id"])
        
        if ward_code:
            query = query.eq("ward_code", ward_code)
        if uhid:
            query = query.eq("uhid", uhid)
        
        result = query.order("patient_admission_date", desc=True).execute()
        
        print(f"Found {len(result.data)} occupancy register records")
        
        return [OccupancyRegisterResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching occupancy register: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve occupancy register entries: {str(e)}"
        )

# OT Register endpoints
@router.post("/ot-register/", response_model=OTRegisterResponse)
async def create_ot_register(
    data: OTRegisterCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create OT register entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert date fields to string format
        for field in ["patient_admission_date", "patient_discharge_date", "service_date"]:
            if record.get(field):
                record[field] = record[field].isoformat()
        
        # Convert time fields to string format
        for field in ["on_table_time", "incision_time", "finish_time"]:
            if record.get(field):
                record[field] = record[field].isoformat()
        
        result = supabase.table("ot_register").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create OT register entry"
            )
        
        return OTRegisterResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create OT register entry: {str(e)}"
        )

@router.get("/ot-register/", response_model=List[OTRegisterResponse])
async def get_ot_register(
    performing_doctor_department: Optional[str] = None,
    nature_of_procedure: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get OT register entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching OT register for user: {current_user['id']}")
        
        query = supabase.table("ot_register").select("*").eq("user_id", current_user["id"])
        
        if performing_doctor_department:
            query = query.eq("performing_doctor_department", performing_doctor_department)
        if nature_of_procedure:
            query = query.eq("nature_of_procedure", nature_of_procedure)
        
        result = query.order("service_date", desc=True).execute()
        
        print(f"Found {len(result.data)} OT register records")
        
        return [OTRegisterResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching OT register: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve OT register entries: {str(e)}"
        )

# Consumption Data endpoints
@router.post("/consumption-data/", response_model=ConsumptionDataResponse)
async def create_consumption_data(
    data: ConsumptionDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create consumption data entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert date fields to string format
        if record.get("transaction_date"):
            record["transaction_date"] = record["transaction_date"].isoformat()
        
        # Convert decimal fields to float
        for field in ["quantity", "rate", "transaction_value"]:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("consumption_data").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create consumption data entry"
            )
        
        return ConsumptionDataResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create consumption data entry: {str(e)}"
        )

@router.get("/consumption-data/", response_model=List[ConsumptionDataResponse])
async def get_consumption_data(
    cost_centre: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get consumption data entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching consumption data for user: {current_user['id']}")
        
        query = supabase.table("consumption_data").select("*").eq("user_id", current_user["id"])
        
        if cost_centre:
            query = query.eq("cost_centre", cost_centre)
        
        result = query.order("transaction_date", desc=True).execute()
        
        print(f"Found {len(result.data)} consumption data records")
        
        return [ConsumptionDataResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching consumption data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve consumption data entries: {str(e)}"
        )

# Connected Load endpoints
@router.post("/connected-load/", response_model=ConnectedLoadResponse)
async def create_connected_load(
    data: ConnectedLoadCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create connected load entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert decimal fields to float
        for field in ["connected_load", "running_load", "standby_load", "total_load_kg"]:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("connected_load").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create connected load entry"
            )
        
        return ConnectedLoadResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create connected load entry: {str(e)}"
        )

@router.get("/connected-load/", response_model=List[ConnectedLoadResponse])
async def get_connected_load(
    sub_cost_centre: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get connected load entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching connected load for user: {current_user['id']}")
        
        query = supabase.table("connected_load").select("*").eq("user_id", current_user["id"])
        
        if sub_cost_centre:
            query = query.eq("sub_cost_centre", sub_cost_centre)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} connected load records")
        
        return [ConnectedLoadResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching connected load: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve connected load entries: {str(e)}"
        )

# Fixed Asset Register endpoints
@router.post("/fixed-asset-register/", response_model=FixedAssetRegisterResponse)
async def create_fixed_asset_register(
    data: FixedAssetRegisterCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create fixed asset register entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert decimal fields to float
        for field in ["bio_medical_equipments", "engineering_equipments", "furniture_fixture", "others"]:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("fixed_asset_register").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create fixed asset register entry"
            )
        
        return FixedAssetRegisterResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create fixed asset register entry: {str(e)}"
        )

@router.get("/fixed-asset-register/", response_model=List[FixedAssetRegisterResponse])
async def get_fixed_asset_register(
    sub_cost_centre: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get fixed asset register entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching fixed asset register for user: {current_user['id']}")
        
        query = supabase.table("fixed_asset_register").select("*").eq("user_id", current_user["id"])
        
        if sub_cost_centre:
            query = query.eq("sub_cost_centre", sub_cost_centre)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} fixed asset register records")
        
        return [FixedAssetRegisterResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching fixed asset register: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve fixed asset register entries: {str(e)}"
        )

# TAT Data endpoints
@router.post("/tat-data/", response_model=TATDataResponse)
async def create_tat_data(
    data: TATDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create TAT data entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        result = supabase.table("tat_data").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create TAT data entry"
            )
        
        return TATDataResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create TAT data entry: {str(e)}"
        )

@router.get("/tat-data/", response_model=List[TATDataResponse])
async def get_tat_data(
    sub_cost_centre: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get TAT data entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching TAT data for user: {current_user['id']}")
        
        query = supabase.table("tat_data").select("*").eq("user_id", current_user["id"])
        
        if sub_cost_centre:
            query = query.eq("sub_cost_centre", sub_cost_centre)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} TAT data records")
        
        return [TATDataResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching TAT data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve TAT data entries: {str(e)}"
        )

# Cost Center endpoints
@router.post("/cost-center/", response_model=CostCenterResponse)
async def create_cost_center(
    data: CostCenterCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create cost center entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        result = supabase.table("cost_center").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create cost center entry"
            )
        
        return CostCenterResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create cost center entry: {str(e)}"
        )

@router.get("/cost-center/", response_model=List[CostCenterResponse])
async def get_cost_center(
    cc_type: Optional[str] = None,
    cost_centre: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get cost center entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching cost center for user: {current_user['id']}")
        
        query = supabase.table("cost_center").select("*").eq("user_id", current_user["id"])
        
        if cc_type:
            query = query.eq("cc_type", cc_type)
        if cost_centre:
            query = query.eq("cost_centre", cost_centre)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} cost center records")
        
        return [CostCenterResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching cost center: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve cost center entries: {str(e)}"
        )

# Secondary Cost Driver endpoints
@router.post("/secondary-cost-driver/", response_model=SecondaryCostDriverResponse)
async def create_secondary_cost_driver(
    data: SecondaryCostDriverCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create secondary cost driver entry"""
    supabase = get_supabase_admin_client()
    
    try:
        record = {
            "user_id": current_user["id"],
            **data.dict()
        }
        
        # Convert decimal fields to float
        decimal_fields = [
            "ot_time_hours", "other_unit_1_allocation_ratio", "other_unit_2_allocation_ratio",
            "other_unit_3_allocation_ratio", "other_unit_4_allocation_ratio", "other_unit_5_allocation_ratio",
            "surgical_store_issue_ratio", "central_store_issue_ratio", "non_surgical_store_issue_ratio",
            "stationery_housekeeping_issue_ratio", "doctor_fee_for_service_ratio",
            "consultant_retainer_fee_mg_bonus_ratio", "brokerage_commission",
            "efforts_of_supply_chain_department", "area_in_sq_meter", "actual_water_utilization",
            "actual_gas_utilization", "actual_vacuum_utilization"
        ]
        
        for field in decimal_fields:
            if record.get(field):
                record[field] = float(record[field])
        
        result = supabase.table("secondary_cost_driver").insert(record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create secondary cost driver entry"
            )
        
        return SecondaryCostDriverResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create secondary cost driver entry: {str(e)}"
        )

@router.get("/secondary-cost-driver/", response_model=List[SecondaryCostDriverResponse])
async def get_secondary_cost_driver(
    sub_cost_centre: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get secondary cost driver entries with optional filtering"""
    supabase = get_supabase_admin_client()
    
    try:
        print(f"Fetching secondary cost driver for user: {current_user['id']}")
        
        query = supabase.table("secondary_cost_driver").select("*").eq("user_id", current_user["id"])
        
        if sub_cost_centre:
            query = query.eq("sub_cost_centre", sub_cost_centre)
        
        result = query.order("created_at", desc=True).execute()
        
        print(f"Found {len(result.data)} secondary cost driver records")
        
        return [SecondaryCostDriverResponse(**convert_dates_to_strings(record)) for record in result.data]
        
    except Exception as e:
        print(f"Error fetching secondary cost driver: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve secondary cost driver entries: {str(e)}"
        )

# Generic update and delete endpoints for all tables
@router.put("/trial-balance/{record_id}", response_model=TrialBalanceResponse)
async def update_trial_balance(
    record_id: str,
    data: TrialBalanceUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update trial balance entry"""
    supabase = get_supabase_admin_client()
    
    try:
        existing = supabase.table("trial_balance").select("*").eq(
            "id", record_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trial balance entry not found"
            )
        
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        
        # Convert decimal fields to float
        for field in ["amount", "amount_second"]:
            if update_data.get(field):
                update_data[field] = float(update_data[field])
        
        update_data["updated_at"] = "now()"
        
        result = supabase.table("trial_balance").update(update_data).eq(
            "id", record_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update trial balance entry"
            )
        
        return TrialBalanceResponse(**convert_dates_to_strings(result.data[0]))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update trial balance entry: {str(e)}"
        )

@router.delete("/trial-balance/{record_id}")
async def delete_trial_balance(
    record_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete trial balance entry"""
    supabase = get_supabase_admin_client()
    
    try:
        existing = supabase.table("trial_balance").select("*").eq(
            "id", record_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trial balance entry not found"
            )
        
        result = supabase.table("trial_balance").delete().eq("id", record_id).execute()
        
        return {"message": "Trial balance entry deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trial balance entry: {str(e)}"
        )
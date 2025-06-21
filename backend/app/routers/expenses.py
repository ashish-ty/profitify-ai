from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from decimal import Decimal
from app.models.expense import ExpenseDataCreate, ExpenseDataUpdate, ExpenseDataResponse, ExpenseSummary
from app.routers.auth import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()

@router.post("/", response_model=ExpenseDataResponse)
async def create_expense_data(
    expense_data: ExpenseDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create expense data entry"""
    supabase = get_supabase_client()
    
    try:
        # Calculate total expenses
        total_expenses = (
            expense_data.pharmacy + expense_data.material_non_medical +
            expense_data.doctor_share + expense_data.salary_wages +
            expense_data.power_fuel + expense_data.admin_financial +
            expense_data.repair_maintenance + expense_data.sales_marketing +
            expense_data.depreciation
        )
        
        # Create expense record
        expense_record = {
            "user_id": current_user["id"],
            "month": expense_data.month,
            "year": expense_data.year,
            "pharmacy": float(expense_data.pharmacy),
            "material_non_medical": float(expense_data.material_non_medical),
            "doctor_share": float(expense_data.doctor_share),
            "salary_wages": float(expense_data.salary_wages),
            "power_fuel": float(expense_data.power_fuel),
            "admin_financial": float(expense_data.admin_financial),
            "repair_maintenance": float(expense_data.repair_maintenance),
            "sales_marketing": float(expense_data.sales_marketing),
            "depreciation": float(expense_data.depreciation),
            "total_expenses": float(total_expenses)
        }
        
        result = supabase.table("expense_data").insert(expense_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create expense data"
            )
        
        return ExpenseDataResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create expense data: {str(e)}"
        )

@router.get("/", response_model=List[ExpenseDataResponse])
async def get_expense_data(
    year: Optional[int] = None,
    month: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get expense data with optional filtering"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("expense_data").select("*").eq("user_id", current_user["id"])
        
        if year:
            query = query.eq("year", year)
        if month:
            query = query.eq("month", month)
        
        result = query.order("year", desc=True).order("month", desc=True).execute()
        return [ExpenseDataResponse(**record) for record in result.data]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve expense data: {str(e)}"
        )

@router.get("/summary", response_model=ExpenseSummary)
async def get_expense_summary(
    year: Optional[int] = None,
    month: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get expense summary with category breakdown"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("expense_data").select("*").eq("user_id", current_user["id"])
        
        if year:
            query = query.eq("year", year)
        if month:
            query = query.eq("month", month)
        
        result = query.execute()
        data = result.data
        
        if not data:
            return ExpenseSummary(
                total_expenses=Decimal("0"),
                category_breakdown={}
            )
        
        # Calculate totals
        total_expenses = sum(Decimal(str(record["total_expenses"])) for record in data)
        
        # Calculate category breakdown
        categories = [
            "pharmacy", "material_non_medical", "doctor_share", "salary_wages",
            "power_fuel", "admin_financial", "repair_maintenance", 
            "sales_marketing", "depreciation"
        ]
        
        category_breakdown = {}
        for category in categories:
            category_total = sum(Decimal(str(record[category])) for record in data)
            category_breakdown[category] = {
                "amount": float(category_total),
                "percentage": float((category_total / total_expenses * 100) if total_expenses > 0 else 0)
            }
        
        return ExpenseSummary(
            total_expenses=total_expenses,
            category_breakdown=category_breakdown
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate expense summary: {str(e)}"
        )

@router.put("/{expense_id}", response_model=ExpenseDataResponse)
async def update_expense_data(
    expense_id: str,
    expense_update: ExpenseDataUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update expense data entry"""
    supabase = get_supabase_client()
    
    try:
        # Check if expense data exists and belongs to user
        existing = supabase.table("expense_data").select("*").eq(
            "id", expense_id
        ).eq("user_id", current_user["id"]).execute()
        
        print(existing.data)
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense data not found"
            )
       
        # Update only provided fields
        update_data = {k: float(v) for k, v in expense_update.dict().items() if v is not None}
        
        # Recalculate total expenses
        current_record = existing.data[0]
        categories = [
            "pharmacy", "material_non_medical", "doctor_share", "salary_wages",
            "power_fuel", "admin_financial", "repair_maintenance", 
            "sales_marketing", "depreciation"
        ]
        
        total_expenses = 0
        for category in categories:
            value = float(update_data.get(category, current_record[category]))
            total_expenses += value
        
        update_data["total_expenses"] = str(total_expenses)
        update_data["updated_at"] = "now()"
        
        print(update_data)
        
        result = supabase.table("expense_data").update(update_data).eq(
            "id", expense_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update expense data"
            )
        
        return ExpenseDataResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update expense data: {str(e)}"
        )

@router.delete("/{expense_id}")
async def delete_expense_data(
    expense_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete expense data entry"""
    supabase = get_supabase_client()
    
    try:
        # Check if expense data exists and belongs to user
        existing = supabase.table("expense_data").select("*").eq(
            "id", expense_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense data not found"
            )
        
        # Delete expense data
        result = supabase.table("expense_data").delete().eq("id", expense_id).execute()
        
        return {"message": "Expense data deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete expense data: {str(e)}"
        )
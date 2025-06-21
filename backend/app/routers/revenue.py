from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from decimal import Decimal
from app.models.revenue import RevenueDataCreate, RevenueDataUpdate, RevenueDataResponse, RevenueSummary
from app.routers.auth import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()

@router.post("/", response_model=RevenueDataResponse)
async def create_revenue_data(
    revenue_data: RevenueDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create revenue data entry"""
    supabase = get_supabase_client()
    
    try:
        # Calculate net amount
        net_amount = revenue_data.gross_amount - revenue_data.discount
        
        # Create revenue record
        revenue_record = {
            "user_id": current_user["id"],
            "month": revenue_data.month,
            "year": revenue_data.year,
            "patient_type": revenue_data.patient_type,
            "specialty": revenue_data.specialty,
            "billing_category": revenue_data.billing_category,
            "number_of_patients": revenue_data.number_of_patients,
            "bed_days_icu": revenue_data.bed_days_icu,
            "bed_days_non_icu": revenue_data.bed_days_non_icu,
            "gross_amount": float(revenue_data.gross_amount),
            "discount": float(revenue_data.discount),
            "net_amount": float(net_amount)
        }
        
        result = supabase.table("revenue_data").insert(revenue_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create revenue data"
            )
        
        return RevenueDataResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create revenue data: {str(e)}"
        )

@router.get("/", response_model=List[RevenueDataResponse])
async def get_revenue_data(
    year: Optional[int] = None,
    month: Optional[str] = None,
    patient_type: Optional[str] = None,
    specialty: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get revenue data with optional filtering"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        
        if year:
            query = query.eq("year", year)
        if month:
            query = query.eq("month", month)
        if patient_type:
            query = query.eq("patient_type", patient_type)
        if specialty:
            query = query.eq("specialty", specialty)
        
        result = query.order("year", desc=True).order("month", desc=True).execute()
        
        return [RevenueDataResponse(**record) for record in result.data]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve revenue data: {str(e)}"
        )

@router.get("/summary", response_model=RevenueSummary)
async def get_revenue_summary(
    year: Optional[int] = None,
    month: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get revenue summary with breakdowns"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        
        if year:
            query = query.eq("year", year)
        if month:
            query = query.eq("month", month)
        
        result = query.execute()
        data = result.data
        
        # Calculate totals
        total_patients = sum(record["number_of_patients"] for record in data)
        total_gross_amount = sum(Decimal(str(record["gross_amount"])) for record in data)
        total_discount = sum(Decimal(str(record["discount"])) for record in data)
        total_net_amount = total_gross_amount - total_discount
                
        # Calculate breakdowns
        patient_type_breakdown = {}
        specialty_breakdown = {}
        billing_category_breakdown = {}
        
        for record in data:
            # Patient type breakdown
            pt = record["patient_type"]
            if pt not in patient_type_breakdown:
                patient_type_breakdown[pt] = {"patients": 0, "net_amount": 0}
            patient_type_breakdown[pt]["patients"] += record["number_of_patients"]
            patient_type_breakdown[pt]["net_amount"] += float(record["net_amount"])
            
            # Specialty breakdown
            spec = record["specialty"]
            if spec not in specialty_breakdown:
                specialty_breakdown[spec] = {"patients": 0, "net_amount": 0}
            specialty_breakdown[spec]["patients"] += record["number_of_patients"]
            specialty_breakdown[spec]["net_amount"] += float(record["net_amount"])
            
            # Billing category breakdown
            bc = record["billing_category"]
            if bc not in billing_category_breakdown:
                billing_category_breakdown[bc] = {"patients": 0, "net_amount": 0}
            billing_category_breakdown[bc]["patients"] += record["number_of_patients"]
            billing_category_breakdown[bc]["net_amount"] += float(record["net_amount"])
        
        return RevenueSummary(
            total_patients=total_patients,
            total_gross_amount=total_gross_amount,
            total_discount=total_discount,
            total_net_amount=total_net_amount,
            patient_type_breakdown=patient_type_breakdown,
            specialty_breakdown=specialty_breakdown,
            billing_category_breakdown=billing_category_breakdown
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate revenue summary: {str(e)}"
        )

@router.put("/{revenue_id}", response_model=RevenueDataResponse)
async def update_revenue_data(
    revenue_id: str,
    revenue_update: RevenueDataUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update revenue data entry"""
    supabase = get_supabase_client()
    
    try:
        # Check if revenue data exists and belongs to user
        existing = supabase.table("revenue_data").select("*").eq(
            "id", revenue_id
        ).eq("user_id", current_user["id"]).execute()
        
        print(existing.data)
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Revenue data not found"
            )
        
        # Update only provided fields
        update_data = {k: int(v) for k, v in revenue_update.dict().items() if v is not None}
        
        # Recalculate net amount if gross_amount or discount changed
        if "gross_amount" in update_data or "discount" in update_data:
            current_record = existing.data[0]
            new_gross = float(update_data.get("gross_amount", current_record["gross_amount"]))
            new_discount = float(update_data.get("discount", current_record["discount"]))
            update_data["net_amount"] = new_gross - new_discount
        
        update_data["updated_at"] = "now()"
        
        print(update_data)
        
        result = supabase.table("revenue_data").update(update_data).eq(
            "id", revenue_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update revenue data"
            )
        
        return RevenueDataResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update revenue data: {str(e)}"
        )

@router.delete("/{revenue_id}")
async def delete_revenue_data(
    revenue_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete revenue data entry"""
    supabase = get_supabase_client()
    
    try:
        # Check if revenue data exists and belongs to user
        existing = supabase.table("revenue_data").select("*").eq(
            "id", revenue_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Revenue data not found"
            )
        
        # Delete revenue data
        result = supabase.table("revenue_data").delete().eq("id", revenue_id).execute()
        
        return {"message": "Revenue data deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete revenue data: {str(e)}"
        )
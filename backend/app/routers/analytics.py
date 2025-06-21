from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional, Dict, Any
from decimal import Decimal
from app.routers.auth import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()

@router.get("/dashboard-metrics")
async def get_dashboard_metrics(
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get key metrics for dashboard overview"""
    supabase = get_supabase_client()
    
    try:
        # Get revenue data
        revenue_query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        if year:
            revenue_query = revenue_query.eq("year", year)
        revenue_result = revenue_query.execute()
        
        # Get expense data
        expense_query = supabase.table("expense_data").select("*").eq("user_id", current_user["id"])
        if year:
            expense_query = expense_query.eq("year", year)
        expense_result = expense_query.execute()
        
        # Calculate metrics
        total_revenue = sum(float(record["net_amount"]) for record in revenue_result.data)
        total_expenses = sum(float(record["total_expenses"]) for record in expense_result.data)
        net_profit = total_revenue - total_expenses
        total_patients = sum(record["number_of_patients"] for record in revenue_result.data)
        
        # Calculate profit margin
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return {
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "net_profit": net_profit,
            "profit_margin": profit_margin,
            "total_patients": total_patients,
            "revenue_per_patient": total_revenue / total_patients if total_patients > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate dashboard metrics: {str(e)}"
        )

@router.get("/revenue-trends")
async def get_revenue_trends(
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get revenue trends by month"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        if year:
            query = query.eq("year", year)
        
        result = query.execute()
        
        # Group by month
        monthly_revenue = {}
        for record in result.data:
            month = record["month"]
            if month not in monthly_revenue:
                monthly_revenue[month] = {
                    "revenue": 0,
                    "patients": 0,
                    "opd_revenue": 0,
                    "ipd_revenue": 0
                }
            
            monthly_revenue[month]["revenue"] += float(record["net_amount"])
            monthly_revenue[month]["patients"] += record["number_of_patients"]
            
            if record["patient_type"] == "OPD":
                monthly_revenue[month]["opd_revenue"] += float(record["net_amount"])
            else:
                monthly_revenue[month]["ipd_revenue"] += float(record["net_amount"])
        
        return monthly_revenue
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate revenue trends: {str(e)}"
        )

@router.get("/expense-analysis")
async def get_expense_analysis(
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed expense analysis"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("expense_data").select("*").eq("user_id", current_user["id"])
        if year:
            query = query.eq("year", year)
        
        result = query.execute()
        
        if not result.data:
            return {"monthly_expenses": {}, "category_analysis": {}}
        
        # Monthly expense trends
        monthly_expenses = {}
        category_totals = {}
        
        categories = [
            "pharmacy", "material_non_medical", "doctor_share", "salary_wages",
            "power_fuel", "admin_financial", "repair_maintenance", 
            "sales_marketing", "depreciation"
        ]
        
        for record in result.data:
            month = record["month"]
            if month not in monthly_expenses:
                monthly_expenses[month] = {"total": 0}
            
            monthly_expenses[month]["total"] += float(record["total_expenses"])
            
            # Category analysis
            for category in categories:
                if category not in category_totals:
                    category_totals[category] = 0
                category_totals[category] += float(record[category])
        
        # Calculate category percentages
        total_all_expenses = sum(category_totals.values())
        category_analysis = {}
        for category, total in category_totals.items():
            category_analysis[category] = {
                "amount": total,
                "percentage": (total / total_all_expenses * 100) if total_all_expenses > 0 else 0
            }
        
        return {
            "monthly_expenses": monthly_expenses,
            "category_analysis": category_analysis
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze expenses: {str(e)}"
        )

@router.get("/profitability-analysis")
async def get_profitability_analysis(
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get profitability analysis by department and time"""
    supabase = get_supabase_client()
    
    try:
        # Get revenue by specialty
        revenue_query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        if year:
            revenue_query = revenue_query.eq("year", year)
        revenue_result = revenue_query.execute()
        
        # Get total expenses
        expense_query = supabase.table("expense_data").select("*").eq("user_id", current_user["id"])
        if year:
            expense_query = expense_query.eq("year", year)
        expense_result = expense_query.execute()
        
        total_expenses = sum(float(record["total_expenses"]) for record in expense_result.data)
        total_revenue = sum(float(record["net_amount"]) for record in revenue_result.data)
        
        # Analyze by specialty
        specialty_analysis = {}
        for record in revenue_result.data:
            specialty = record["specialty"]
            if specialty not in specialty_analysis:
                specialty_analysis[specialty] = {
                    "revenue": 0,
                    "patients": 0,
                    "revenue_per_patient": 0
                }
            
            specialty_analysis[specialty]["revenue"] += float(record["net_amount"])
            specialty_analysis[specialty]["patients"] += record["number_of_patients"]
        
        # Calculate revenue per patient and estimated profit margin
        for specialty in specialty_analysis:
            data = specialty_analysis[specialty]
            if data["patients"] > 0:
                data["revenue_per_patient"] = data["revenue"] / data["patients"]
            
            # Estimate department expenses (proportional to revenue)
            if total_revenue > 0:
                estimated_expenses = (data["revenue"] / total_revenue) * total_expenses
                data["estimated_profit"] = data["revenue"] - estimated_expenses
                data["profit_margin"] = (data["estimated_profit"] / data["revenue"] * 100) if data["revenue"] > 0 else 0
        
        return {
            "specialty_analysis": specialty_analysis,
            "overall_profit_margin": ((total_revenue - total_expenses) / total_revenue * 100) if total_revenue > 0 else 0,
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "net_profit": total_revenue - total_expenses
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze profitability: {str(e)}"
        )

@router.get("/patient-volume-analysis")
async def get_patient_volume_analysis(
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get patient volume vs revenue correlation analysis"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        if year:
            query = query.eq("year", year)
        
        result = query.execute()
        
        # Monthly volume vs revenue
        monthly_data = {}
        for record in result.data:
            month = record["month"]
            if month not in monthly_data:
                monthly_data[month] = {"patients": 0, "revenue": 0}
            
            monthly_data[month]["patients"] += record["number_of_patients"]
            monthly_data[month]["revenue"] += float(record["net_amount"])
        
        # Calculate correlation coefficient (simplified)
        if len(monthly_data) > 1:
            patients = [data["patients"] for data in monthly_data.values()]
            revenues = [data["revenue"] for data in monthly_data.values()]
            
            # Simple correlation calculation
            n = len(patients)
            sum_x = sum(patients)
            sum_y = sum(revenues)
            sum_xy = sum(p * r for p, r in zip(patients, revenues))
            sum_x2 = sum(p * p for p in patients)
            sum_y2 = sum(r * r for r in revenues)
            
            correlation = (n * sum_xy - sum_x * sum_y) / (
                ((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y)) ** 0.5
            ) if (n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y) > 0 else 0
        else:
            correlation = 0
        
        return {
            "monthly_data": monthly_data,
            "correlation_coefficient": correlation,
            "total_patients": sum(data["patients"] for data in monthly_data.values()),
            "total_revenue": sum(data["revenue"] for data in monthly_data.values()),
            "average_revenue_per_patient": sum(data["revenue"] for data in monthly_data.values()) / sum(data["patients"] for data in monthly_data.values()) if sum(data["patients"] for data in monthly_data.values()) > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze patient volume: {str(e)}"
        )
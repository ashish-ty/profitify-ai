"""
Revenue Analytics Router with Pandas Operations
Provides advanced revenue analysis and insights
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional, Dict, Any
import pandas as pd
from decimal import Decimal
from datetime import datetime
from app.routers.auth import get_current_user
from app.core.database import get_supabase_client
import numpy as np

router = APIRouter()

@router.get("/analysis")
async def get_revenue_analysis(
    year: Optional[int] = None,
    months: Optional[int] = 6,  # Number of months to analyze
    current_user: dict = Depends(get_current_user)
):
    """Get comprehensive revenue analysis using pandas operations"""
    supabase = get_supabase_client()
    
    try:
        # Get revenue data
        query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        if year:
            query = query.eq("year", year)
        
        result = query.execute()
        
        if not result.data:
            return {
                "message": "No revenue data found",
                "metrics": {},
                "trends": {},
                "insights": []
            }
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(result.data)
        
        # Convert numeric columns
        numeric_columns = ['number_of_patients', 'bed_days_icu', 'bed_days_non_icu', 
                          'gross_amount', 'discount', 'net_amount']
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Convert dates
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # Sort by year and month
        month_order = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
        df['month_num'] = df['month'].map({month: i for i, month in enumerate(month_order)})
        df = df.sort_values(['year', 'month_num'])
        
        # Calculate key metrics
        metrics = calculate_revenue_metrics(df)
        
        # Calculate trends
        trends = calculate_revenue_trends(df, months)
        
        # Generate insights
        insights = generate_revenue_insights(df)
        
        # Calculate specialty analysis
        specialty_analysis = calculate_specialty_analysis(df)
        
        # Calculate patient type analysis
        patient_type_analysis = calculate_patient_type_analysis(df)
        
        # Calculate payment method analysis
        payment_analysis = calculate_payment_analysis(df)
        
        return {
            "metrics": metrics,
            "trends": trends,
            "insights": insights,
            "specialty_analysis": specialty_analysis,
            "patient_type_analysis": patient_type_analysis,
            "payment_analysis": payment_analysis,
            "data_period": {
                "start_date": df['created_at'].min().isoformat() if not df.empty else None,
                "end_date": df['created_at'].max().isoformat() if not df.empty else None,
                "total_records": len(df)
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze revenue data: {str(e)}"
        )

def calculate_revenue_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate key revenue metrics using pandas operations"""
    if df.empty:
        return {}
    
    total_revenue = df['net_amount'].sum()
    total_gross = df['gross_amount'].sum()
    total_discount = df['discount'].sum()
    total_patients = df['number_of_patients'].sum()
    
    # Calculate growth rates
    monthly_revenue = df.groupby(['year', 'month'])['net_amount'].sum().reset_index()
    if len(monthly_revenue) > 1:
        latest_month = monthly_revenue.iloc[-1]['net_amount']
        previous_month = monthly_revenue.iloc[-2]['net_amount']
        monthly_growth = ((latest_month - previous_month) / previous_month * 100) if previous_month > 0 else 0
    else:
        monthly_growth = 0
    
    # Calculate average revenue per patient
    avg_revenue_per_patient = total_revenue / total_patients if total_patients > 0 else 0
    
    # Calculate discount rate
    discount_rate = (total_discount / total_gross * 100) if total_gross > 0 else 0
    
    return {
        "total_revenue": float(total_revenue),
        "total_gross_amount": float(total_gross),
        "total_discount": float(total_discount),
        "total_patients": int(total_patients),
        "monthly_growth_rate": round(monthly_growth, 2),
        "avg_revenue_per_patient": round(avg_revenue_per_patient, 2),
        "discount_rate": round(discount_rate, 2),
        "daily_avg_revenue": round(total_revenue / 30, 2)  # Assuming 30 days average
    }

def calculate_revenue_trends(df: pd.DataFrame, months: int) -> Dict[str, Any]:
    """Calculate revenue trends over specified months"""
    if df.empty:
        return {}
    
    # Monthly trends
    monthly_trends = df.groupby(['year', 'month']).agg({
        'net_amount': 'sum',
        'number_of_patients': 'sum',
        'gross_amount': 'sum',
        'discount': 'sum'
    }).reset_index()
    
    # Sort by year and month
    month_order = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']
    monthly_trends['month_num'] = monthly_trends['month'].map({month: i for i, month in enumerate(month_order)})
    monthly_trends = monthly_trends.sort_values(['year', 'month_num']).tail(months)
    
    # Calculate month-over-month changes
    monthly_trends['revenue_change'] = monthly_trends['net_amount'].pct_change() * 100
    monthly_trends['patient_change'] = monthly_trends['number_of_patients'].pct_change() * 100
    
    trends_data = []
    for _, row in monthly_trends.iterrows():
        trends_data.append({
            "month": row['month'],
            "year": int(row['year']),
            "revenue": float(row['net_amount']),
            "patients": int(row['number_of_patients']),
            "gross_amount": float(row['gross_amount']),
            "discount": float(row['discount']),
            "revenue_change": round(row['revenue_change'], 2) if pd.notna(row['revenue_change']) else 0,
            "patient_change": round(row['patient_change'], 2) if pd.notna(row['patient_change']) else 0
        })
    
    return {
        "monthly_trends": trends_data,
        "trend_direction": "increasing" if len(trends_data) > 1 and trends_data[-1]["revenue"] > trends_data[0]["revenue"] else "stable"
    }

def calculate_specialty_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze revenue by specialty"""
    if df.empty:
        return {}
    
    specialty_stats = df.groupby('specialty').agg({
        'net_amount': ['sum', 'mean'],
        'number_of_patients': 'sum',
        'gross_amount': 'sum',
        'discount': 'sum'
    }).round(2)
    
    specialty_stats.columns = ['total_revenue', 'avg_revenue', 'total_patients', 'gross_amount', 'discount']
    specialty_stats['revenue_per_patient'] = (specialty_stats['total_revenue'] / specialty_stats['total_patients']).round(2)
    specialty_stats['discount_rate'] = ((specialty_stats['discount'] / specialty_stats['gross_amount']) * 100).round(2)
    
    # Calculate percentage of total revenue
    total_revenue = specialty_stats['total_revenue'].sum()
    specialty_stats['revenue_percentage'] = ((specialty_stats['total_revenue'] / total_revenue) * 100).round(2)
    
    specialty_data = {}
    for specialty, row in specialty_stats.iterrows():
        specialty_data[specialty] = {
            "total_revenue": float(row['total_revenue']),
            "avg_revenue": float(row['avg_revenue']),
            "total_patients": int(row['total_patients']),
            "revenue_per_patient": float(row['revenue_per_patient']),
            "discount_rate": float(row['discount_rate']),
            "revenue_percentage": float(row['revenue_percentage'])
        }
    
    # Replace NaN with None
    specialty_data = {k: v for k, v in specialty_data.items() if pd.notna(v)}
    
    return specialty_data

def calculate_patient_type_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze revenue by patient type (OPD vs IPD)"""
    if df.empty:
        return {}
    
    patient_type_stats = df.groupby('patient_type').agg({
        'net_amount': 'sum',
        'number_of_patients': 'sum',
        'bed_days_icu': 'sum',
        'bed_days_non_icu': 'sum'
    }).round(2)
    
    total_revenue = patient_type_stats['net_amount'].sum()
    
    patient_type_data = {}
    for patient_type, row in patient_type_stats.iterrows():
        revenue_percentage = (row['net_amount'] / total_revenue * 100) if total_revenue > 0 else 0
        revenue_per_patient = (row['net_amount'] / row['number_of_patients']) if row['number_of_patients'] > 0 else 0
        
        patient_type_data[patient_type] = {
            "total_revenue": float(row['net_amount']),
            "total_patients": int(row['number_of_patients']),
            "revenue_percentage": round(revenue_percentage, 2),
            "revenue_per_patient": round(revenue_per_patient, 2),
            "bed_days_icu": int(row['bed_days_icu']) if pd.notna(row['bed_days_icu']) else 0,
            "bed_days_non_icu": int(row['bed_days_non_icu']) if pd.notna(row['bed_days_non_icu']) else 0
        }
    
    return patient_type_data

def calculate_payment_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze revenue by billing category (Cash vs Credit)"""
    if df.empty:
        return {}
    
    payment_stats = df.groupby('billing_category').agg({
        'net_amount': 'sum',
        'number_of_patients': 'sum',
        'discount': 'sum',
        'gross_amount': 'sum'
    }).round(2)
    
    total_revenue = payment_stats['net_amount'].sum()
    
    payment_data = {}
    for billing_category, row in payment_stats.iterrows():
        revenue_percentage = (row['net_amount'] / total_revenue * 100) if total_revenue > 0 else 0
        discount_rate = (row['discount'] / row['gross_amount'] * 100) if row['gross_amount'] > 0 else 0
        
        payment_data[billing_category] = {
            "total_revenue": float(row['net_amount']),
            "total_patients": int(row['number_of_patients']),
            "revenue_percentage": round(revenue_percentage, 2),
            "discount_rate": round(discount_rate, 2),
            "avg_discount": round(row['discount'] / row['number_of_patients'], 2) if row['number_of_patients'] > 0 else 0
        }
    
    return payment_data

def generate_revenue_insights(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Generate AI-powered insights from revenue data"""
    insights = []
    
    if df.empty:
        return insights
    
    # Insight 1: Best performing specialty
    specialty_revenue = df.groupby('specialty')['net_amount'].sum()
    best_specialty = specialty_revenue.idxmax()
    best_specialty_revenue = specialty_revenue.max()
    
    insights.append({
        "type": "growth_opportunity",
        "title": "Top Performing Specialty",
        "description": f"{best_specialty} generates the highest revenue (${best_specialty_revenue:,.0f}). Consider expanding this department's capacity.",
        "impact": "high",
        "category": "specialty"
    })
    
    # Insight 2: Patient type analysis
    patient_type_revenue = df.groupby('patient_type')['net_amount'].sum()
    if 'IPD' in patient_type_revenue.index and 'OPD' in patient_type_revenue.index:
        ipd_per_patient = df[df['patient_type'] == 'IPD']['net_amount'].sum() / df[df['patient_type'] == 'IPD']['number_of_patients'].sum()
        opd_per_patient = df[df['patient_type'] == 'OPD']['net_amount'].sum() / df[df['patient_type'] == 'OPD']['number_of_patients'].sum()
        
        if ipd_per_patient > opd_per_patient:
            ratio = ipd_per_patient / opd_per_patient
            insights.append({
                "type": "patient_volume_insight",
                "title": "IPD Revenue Opportunity",
                "description": f"IPD patients generate {ratio:.1f}x more revenue per patient than OPD. Focus on converting appropriate OPD cases to IPD.",
                "impact": "medium",
                "category": "patient_type"
            })
    
    # Insight 3: Seasonal patterns
    monthly_revenue = df.groupby('month')['net_amount'].sum()
    if len(monthly_revenue) > 1:
        peak_month = monthly_revenue.idxmax()
        peak_revenue = monthly_revenue.max()
        
        insights.append({
            "type": "seasonal_pattern",
            "title": "Peak Revenue Period",
            "description": f"{peak_month} shows highest revenue (${peak_revenue:,.0f}). Plan capacity and staffing for peak periods.",
            "impact": "medium",
            "category": "seasonal"
        })
    
    # Insight 4: Discount optimization
    avg_discount_rate = (df['discount'].sum() / df['gross_amount'].sum() * 100)
    if avg_discount_rate > 10:  # If discount rate is high
        potential_savings = df['discount'].sum() * 0.2  # 20% reduction in discounts
        insights.append({
            "type": "revenue_optimization",
            "title": "Discount Optimization",
            "description": f"Current discount rate is {avg_discount_rate:.1f}%. Reducing by 20% could increase revenue by ${potential_savings:,.0f}.",
            "impact": "high",
            "category": "pricing"
        })
    
    return insights

@router.get("/specialty-comparison")
async def get_specialty_comparison(
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed specialty comparison analysis"""
    supabase = get_supabase_client()
    
    try:
        # Get revenue data
        query = supabase.table("revenue_data").select("*").eq("user_id", current_user["id"])
        if year:
            query = query.eq("year", year)
        
        result = query.execute()
        
        if not result.data:
            return {"message": "No data found"}
        
        df = pd.DataFrame(result.data)
        
        # Convert numeric columns
        numeric_columns = ['number_of_patients', 'gross_amount', 'discount', 'net_amount']
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Calculate detailed specialty metrics
        specialty_metrics = df.groupby('specialty').agg({
            'net_amount': ['sum', 'mean', 'std'],
            'number_of_patients': 'sum',
            'gross_amount': 'sum',
            'discount': 'sum'
        }).round(2)
        
        specialty_metrics.columns = ['total_revenue', 'avg_revenue', 'revenue_std', 
                                   'total_patients', 'gross_amount', 'total_discount']
        
        # Calculate additional metrics
        specialty_metrics['revenue_per_patient'] = (specialty_metrics['total_revenue'] / specialty_metrics['total_patients']).round(2)
        specialty_metrics['discount_rate'] = ((specialty_metrics['total_discount'] / specialty_metrics['gross_amount']) * 100).round(2)
        specialty_metrics['revenue_consistency'] = (specialty_metrics['revenue_std'] / specialty_metrics['avg_revenue']).round(2)
        
        # Rank specialties
        specialty_metrics['revenue_rank'] = specialty_metrics['total_revenue'].rank(ascending=False)
        specialty_metrics['efficiency_rank'] = specialty_metrics['revenue_per_patient'].rank(ascending=False)
        
        comparison_data = {}
        specialty_metrics = specialty_metrics.replace({np.nan: None})
        for specialty, row in specialty_metrics.iterrows():
            comparison_data[specialty] = {
                "total_revenue": float(row['total_revenue']),
                "avg_revenue": float(row['avg_revenue']),
                "total_patients": int(row['total_patients']),
                "revenue_per_patient": float(row['revenue_per_patient']),
                "discount_rate": float(row['discount_rate']),
                "revenue_consistency": row['revenue_consistency'],
                "revenue_rank": int(row['revenue_rank']),
                "efficiency_rank": int(row['efficiency_rank'])
            }
            
        print(comparison_data)
        
        return {
            "specialty_comparison": comparison_data,
            "summary": {
                "total_specialties": len(comparison_data),
                "highest_revenue": max(comparison_data.values(), key=lambda x: x['total_revenue']),
                "most_efficient": max(comparison_data.values(), key=lambda x: x['revenue_per_patient'])
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate specialty comparison: {str(e)}"
        )
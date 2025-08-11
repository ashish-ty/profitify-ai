"""
Cost Analysis API Router
Provides endpoints for service-wise cost analysis
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.responses import StreamingResponse
from typing import Optional, Dict, Any
from datetime import datetime
import pandas as pd
import json
import io
import logging

from app.models.cost_analysis import (
    CostAnalysisFilters,
    CostAnalysisResponse,
    CostSummaryMetrics,
    CostAnalysisExportRequest,
    ServiceCostBreakdown
)
from app.logic.cost_module import CostAnalysisModule
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/service-wise-analysis", response_model=CostAnalysisResponse)
async def get_service_wise_cost_analysis(
    filters: Optional[CostAnalysisFilters] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate comprehensive service-wise cost analysis
    Returns detailed cost breakdown for each service with activity-based costing
    """
    try:
        cost_module = CostAnalysisModule(current_user["id"])
        
        # Convert filters to dict
        filter_dict = filters.dict(exclude_none=True) if filters else {}
        
        # Generate cost analysis
        cost_df = await cost_module.generate_service_wise_cost_analysis(filter_dict)
        
        if cost_df.empty:
            return CostAnalysisResponse(
                services=[],
                summary={},
                filters_applied=filter_dict,
                generated_at=datetime.now(),
                total_records=0
            )
        
        # Convert DataFrame to list of ServiceCostBreakdown
        services = []
        for _, row in cost_df.iterrows():
            # Calculate derived metrics
            total_allocated_cost = (row.get('cm', 0) + row.get('ew', 0) + 
                                  row.get('hr', 0) + row.get('cn', 0))
            
            total_variable_cost = (
                row.get('pharmacy_charged_to_patient', 0) +
                row.get('medical_surgical_consumables_charged_to_patient', 0) +
                row.get('implants_and_prosthetics_charged_to_patient', 0) +
                row.get('non_medical_consumables_charged_to_patient', 0) +
                row.get('fee_for_service', 0) +
                row.get('incentives_to_consultants_treating_doctors', 0) +
                row.get('patient_food_beverages_outsource_service', 0) +
                row.get('laboratory_test_outsource_service', 0) +
                row.get('any_other_patient_related_outsourced_services_1', 0) +
                row.get('any_other_patient_related_outsourced_services_2', 0) +
                row.get('any_other_patient_related_outsourced_services_3', 0) +
                row.get('brokerage_commission', 0) +
                row.get('provision_for_deduction_bad_debts', 0)
            )
            
            total_cost = total_allocated_cost + total_variable_cost
            
            # Calculate revenue from service register data (would need to be added)
            # For now, using a placeholder calculation
            estimated_revenue = total_cost * 1.2  # Assuming 20% margin
            profit = estimated_revenue - total_cost
            profit_margin = (profit / estimated_revenue * 100) if estimated_revenue > 0 else 0
            
            service = ServiceCostBreakdown(
                ipd_number=str(row.get('ipd_number', '')),
                bill_no=str(row.get('bill_no', '')),
                service_name=str(row.get('service_name', '')),
                doctor_name=str(row.get('doctor_name', '')),
                cm=float(row.get('cm', 0)),
                ew=float(row.get('ew', 0)),
                hr=float(row.get('hr', 0)),
                cn=float(row.get('cn', 0)),
                pharmacy_charged_to_patient=float(row.get('pharmacy_charged_to_patient', 0)),
                medical_surgical_consumables_charged_to_patient=float(row.get('medical_surgical_consumables_charged_to_patient', 0)),
                implants_and_prosthetics_charged_to_patient=float(row.get('implants_and_prosthetics_charged_to_patient', 0)),
                non_medical_consumables_charged_to_patient=float(row.get('non_medical_consumables_charged_to_patient', 0)),
                fee_for_service=float(row.get('fee_for_service', 0)),
                incentives_to_consultants_treating_doctors=float(row.get('incentives_to_consultants_treating_doctors', 0)),
                patient_food_beverages_outsource_service=float(row.get('patient_food_beverages_outsource_service', 0)),
                laboratory_test_outsource_service=float(row.get('laboratory_test_outsource_service', 0)),
                any_other_patient_related_outsourced_services_1=float(row.get('any_other_patient_related_outsourced_services_1', 0)),
                any_other_patient_related_outsourced_services_2=float(row.get('any_other_patient_related_outsourced_services_2', 0)),
                any_other_patient_related_outsourced_services_3=float(row.get('any_other_patient_related_outsourced_services_3', 0)),
                brokerage_commission=float(row.get('brokerage_commission', 0)),
                provision_for_deduction_bad_debts=float(row.get('provision_for_deduction_bad_debts', 0)),
                total_allocated_cost=float(total_allocated_cost),
                total_variable_cost=float(total_variable_cost),
                total_cost=float(total_cost),
                profit=float(profit),
                profit_margin_percent=float(profit_margin)
            )
            services.append(service)
        
        # Get summary metrics
        summary = await cost_module.get_cost_summary_metrics(filter_dict)
        
        return CostAnalysisResponse(
            services=services,
            summary=summary,
            filters_applied=filter_dict,
            generated_at=datetime.now(),
            total_records=len(services)
        )
        
    except Exception as e:
        logger.error(f"Error in service-wise cost analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cost analysis: {str(e)}"
        )

@router.get("/summary-metrics", response_model=CostSummaryMetrics)
async def get_cost_summary_metrics(
    month: Optional[str] = Query(None, description="Filter by month"),
    year: Optional[int] = Query(None, description="Filter by year"),
    department: Optional[str] = Query(None, description="Filter by department"),
    current_user: dict = Depends(get_current_user)
):
    """Get summary metrics for cost analysis"""
    try:
        cost_module = CostAnalysisModule(current_user["id"])
        
        filters = {}
        if month:
            filters['month'] = month
        if year:
            filters['year'] = year
        if department:
            filters['department'] = department
        
        summary = await cost_module.get_cost_summary_metrics(filters)
        
        if not summary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No cost data found for the specified filters"
            )
        
        return CostSummaryMetrics(**summary)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting cost summary metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get cost summary: {str(e)}"
        )

@router.post("/export")
async def export_cost_analysis(
    export_request: CostAnalysisExportRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Export cost analysis data in JSON or CSV format
    """
    try:
        cost_module = CostAnalysisModule(current_user["id"])
        
        # Convert filters to dict
        filter_dict = export_request.filters.dict(exclude_none=True) if export_request.filters else {}
        
        # Generate cost analysis
        cost_df = await cost_module.generate_service_wise_cost_analysis(filter_dict)
        
        if cost_df.empty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No data available for export"
            )
        
        if export_request.format.lower() == 'csv':
            # Export as CSV
            output = io.StringIO()
            cost_df.to_csv(output, index=False)
            output.seek(0)
            
            return StreamingResponse(
                io.BytesIO(output.getvalue().encode()),
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=service_wise_cost_analysis.csv"}
            )
        
        else:
            # Export as JSON
            result = {
                'data': cost_df.to_dict('records'),
                'generated_at': datetime.now().isoformat(),
                'filters_applied': filter_dict,
                'total_records': len(cost_df)
            }
            
            if export_request.include_summary:
                summary = await cost_module.get_cost_summary_metrics(filter_dict)
                result['summary'] = summary
            
            return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting cost analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export cost analysis: {str(e)}"
        )

@router.get("/department-breakdown")
async def get_department_cost_breakdown(
    month: Optional[str] = Query(None, description="Filter by month"),
    year: Optional[int] = Query(None, description="Filter by year"),
    current_user: dict = Depends(get_current_user)
):
    """Get cost breakdown by department"""
    try:
        cost_module = CostAnalysisModule(current_user["id"])
        
        filters = {}
        if month:
            filters['month'] = month
        if year:
            filters['year'] = year
        
        cost_df = await cost_module.generate_service_wise_cost_analysis(filters)
        
        if cost_df.empty:
            return {"departments": [], "total_departments": 0}
        
        # Group by department
        dept_summary = cost_df.groupby('department').agg({
            'total_revenue': 'sum',
            'total_allocated_cost': 'sum',
            'profit': 'sum',
            'total_quantity': 'sum',
            'service_name': 'count'  # Count of services
        }).reset_index()
        
        dept_summary['profit_margin'] = (
            dept_summary['profit'] / dept_summary['total_revenue'] * 100
        ).round(2)
        
        dept_summary['avg_cost_per_service'] = (
            dept_summary['total_allocated_cost'] / dept_summary['service_name']
        ).round(2)
        
        dept_summary = dept_summary.sort_values('profit_margin', ascending=False)
        
        departments = []
        for _, row in dept_summary.iterrows():
            departments.append({
                'department': row['department'],
                'total_revenue': float(row['total_revenue']),
                'total_costs': float(row['total_allocated_cost']),
                'profit': float(row['profit']),
                'profit_margin': float(row['profit_margin']),
                'service_count': int(row['service_name']),
                'total_quantity': int(row['total_quantity']),
                'avg_cost_per_service': float(row['avg_cost_per_service'])
            })
        
        return {
            'departments': departments,
            'total_departments': len(departments),
            'filters_applied': filters
        }
        
    except Exception as e:
        logger.error(f"Error getting department breakdown: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get department breakdown: {str(e)}"
        )

@router.get("/cost-optimization-recommendations")
async def get_cost_optimization_recommendations(
    current_user: dict = Depends(get_current_user)
):
    """Get AI-powered cost optimization recommendations"""
    try:
        cost_module = CostAnalysisModule(current_user["id"])
        
        cost_df = await cost_module.generate_service_wise_cost_analysis()
        
        if cost_df.empty:
            return {"recommendations": [], "total_recommendations": 0}
        
        recommendations = []
        
        # High-cost services with low margins
        high_cost_low_margin = cost_df[
            (cost_df['total_allocated_cost'] > cost_df['total_allocated_cost'].quantile(0.75)) &
            (cost_df['profit_margin_percent'] < cost_df['profit_margin_percent'].quantile(0.25))
        ]
        
        for _, service in high_cost_low_margin.iterrows():
            recommendations.append({
                'type': 'cost_reduction',
                'priority': 'high',
                'service': service['service_name'],
                'department': service['department'],
                'current_margin': float(service['profit_margin_percent']),
                'recommendation': f"Focus on reducing costs for {service['service_name']}. Current margin is {service['profit_margin_percent']:.1f}%",
                'potential_impact': 'High cost reduction potential',
                'action_items': [
                    'Review pharmacy cost allocation',
                    'Optimize material usage',
                    'Evaluate outsourcing options'
                ]
            })
        
        # High-margin services for expansion
        high_margin_services = cost_df[
            cost_df['profit_margin_percent'] > cost_df['profit_margin_percent'].quantile(0.8)
        ].head(3)
        
        for _, service in high_margin_services.iterrows():
            recommendations.append({
                'type': 'expansion_opportunity',
                'priority': 'medium',
                'service': service['service_name'],
                'department': service['department'],
                'current_margin': float(service['profit_margin_percent']),
                'recommendation': f"Consider expanding {service['service_name']} capacity. High margin of {service['profit_margin_percent']:.1f}%",
                'potential_impact': 'Revenue growth opportunity',
                'action_items': [
                    'Increase service capacity',
                    'Marketing focus',
                    'Staff training'
                ]
            })
        
        return {
            'recommendations': recommendations,
            'total_recommendations': len(recommendations),
            'analysis_date': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting optimization recommendations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )
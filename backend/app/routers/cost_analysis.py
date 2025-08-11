"""
Simplified Cost Analysis API Router
Single endpoint for cost analysis data
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from datetime import datetime
import logging

from app.models.cost_analysis import (
    CostAnalysisFilters,
    CostAnalysisResponse,
    ServiceCostRecord
)
from app.logic.cost_module import CostAnalysisModule
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[ServiceCostRecord])
async def get_cost_analysis_data(
    month: Optional[str] = Query(None, description="Filter by month"),
    year: Optional[int] = Query(None, description="Filter by year"),
    department: Optional[str] = Query(None, description="Filter by department"),
    service_name: Optional[str] = Query(None, description="Filter by service name"),
    patient_type: Optional[str] = Query(None, description="Filter by patient type"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get service-wise cost analysis data
    Returns the cost output DataFrame as a list of records
    """
    try:
        cost_module = CostAnalysisModule(current_user["id"])
        
        # Build filters
        filters = {}
        if month:
            filters['month'] = month
        if year:
            filters['year'] = year
        if department:
            filters['department'] = department
        if service_name:
            filters['service_name'] = service_name
        if patient_type:
            filters['patient_type'] = patient_type
        
        # Generate cost analysis
        cost_df = await cost_module.generate_service_wise_cost_analysis(filters)
        
        if cost_df.empty:
            return []
        
        # Convert DataFrame to list of ServiceCostRecord
        records = []
        for _, row in cost_df.iterrows():
            record = ServiceCostRecord(
                ipd_number=str(row.get('ipd_number', '')),
                service_name=str(row.get('service_name', '')),
                cm=float(row.get('cm', 0)),
                ew=float(row.get('ew', 0)),
                hr=float(row.get('hr', 0)),
                cn=float(row.get('cn', 0)),
                bill_no=str(row.get('bill_no', '')),
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
                doctor_name=str(row.get('doctor_name', ''))
            )
            records.append(record)
        
        return records
        
    except Exception as e:
        logger.error(f"Error in cost analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cost analysis: {str(e)}"
        )
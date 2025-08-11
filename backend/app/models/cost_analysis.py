"""
Simplified Pydantic models for cost analysis
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CostAnalysisFilters(BaseModel):
    month: Optional[str] = None
    year: Optional[int] = None
    department: Optional[str] = None
    service_name: Optional[str] = None
    patient_type: Optional[str] = None

class ServiceCostRecord(BaseModel):
    ipd_number: str
    service_name: str
    cm: float
    ew: float
    hr: float
    cn: float
    bill_no: str
    pharmacy_charged_to_patient: float
    medical_surgical_consumables_charged_to_patient: float
    implants_and_prosthetics_charged_to_patient: float
    non_medical_consumables_charged_to_patient: float
    fee_for_service: float
    incentives_to_consultants_treating_doctors: float
    patient_food_beverages_outsource_service: float
    laboratory_test_outsource_service: float
    any_other_patient_related_outsourced_services_1: float
    any_other_patient_related_outsourced_services_2: float
    any_other_patient_related_outsourced_services_3: float
    brokerage_commission: float
    provision_for_deduction_bad_debts: float
    doctor_name: str

class CostAnalysisResponse(BaseModel):
    data: List[ServiceCostRecord]
    total_records: int
    generated_at: datetime
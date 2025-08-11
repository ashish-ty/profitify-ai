"""
Pydantic models for cost analysis endpoints
"""
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class CostAnalysisFilters(BaseModel):
    month: Optional[str] = None
    year: Optional[int] = None
    department: Optional[str] = None
    service_name: Optional[str] = None
    patient_type: Optional[str] = None

class ServiceCostBreakdown(BaseModel):
    ipd_number: str
    bill_no: str
    service_name: str
    doctor_name: str
    
    # Allocated costs from cost module
    cm: float  # Consumption/Materials cost
    ew: float  # Expense wise cost
    hr: float  # HR/Labor cost
    cn: float  # Connected load/Utilities cost
    
    # Variable costs from bill
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
    
    # Calculated metrics
    total_allocated_cost: float
    total_variable_cost: float
    total_cost: float
    profit: float
    profit_margin_percent: float

class CostAnalysisResponse(BaseModel):
    services: List[ServiceCostBreakdown]
    summary: Dict[str, Any]
    filters_applied: Dict[str, Any]
    generated_at: datetime
    total_records: int

class CostSummaryMetrics(BaseModel):
    total_services: int
    total_revenue: float
    total_allocated_costs: float
    overall_profit_margin: float
    most_profitable_service: Dict[str, Any]
    least_profitable_service: Dict[str, Any]
    cost_breakdown: Dict[str, float]
    optimization_opportunities: Dict[str, int]

class CostAnalysisExportRequest(BaseModel):
    format: str = 'json'  # 'json' or 'csv'
    filters: Optional[CostAnalysisFilters] = None
    include_summary: bool = True
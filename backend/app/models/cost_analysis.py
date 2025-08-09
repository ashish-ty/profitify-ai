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
    service_id: str
    department: str
    service_name: str
    total_revenue: float
    total_quantity: int
    revenue_per_unit: float
    
    # Direct costs
    direct_pharmacy_cost: float
    direct_materials_cost: float
    direct_labor_cost: float
    
    # Allocated costs
    allocated_overhead_cost: float
    allocated_utilities_cost: float
    allocated_admin_cost: float
    allocated_facilities_cost: float
    
    # Totals and metrics
    total_allocated_cost: float
    cost_per_unit: float
    profit: float
    profit_margin_percent: float
    
    # Cost breakdown percentages
    pharmacy_cost_percent: float
    materials_cost_percent: float
    labor_cost_percent: float
    overhead_cost_percent: float
    
    # Performance indicators
    cost_efficiency_score: float
    profitability_rank: int
    cost_optimization_potential: str

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
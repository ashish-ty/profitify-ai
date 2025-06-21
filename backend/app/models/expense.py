from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ExpenseDataBase(BaseModel):
    month: str
    year: int
    pharmacy: Decimal
    material_non_medical: Decimal
    doctor_share: Decimal
    salary_wages: Decimal
    power_fuel: Decimal
    admin_financial: Decimal
    repair_maintenance: Decimal
    sales_marketing: Decimal
    depreciation: Decimal

class ExpenseDataCreate(ExpenseDataBase):
    pass

class ExpenseDataUpdate(BaseModel):
    pharmacy: Optional[Decimal] = None
    material_non_medical: Optional[Decimal] = None
    doctor_share: Optional[Decimal] = None
    salary_wages: Optional[Decimal] = None
    power_fuel: Optional[Decimal] = None
    admin_financial: Optional[Decimal] = None
    repair_maintenance: Optional[Decimal] = None
    sales_marketing: Optional[Decimal] = None
    depreciation: Optional[Decimal] = None

class ExpenseDataResponse(ExpenseDataBase):
    id: str
    user_id: str
    total_expenses: Decimal
    created_at: datetime
    updated_at: Optional[datetime] = None

class ExpenseSummary(BaseModel):
    total_expenses: Decimal
    category_breakdown: dict
    month_over_month_change: Optional[dict] = None
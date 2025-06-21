from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from decimal import Decimal

class RevenueDataBase(BaseModel):
    month: str
    year: int
    patient_type: Literal['OPD', 'IPD']
    specialty: Literal['Cardiology', 'Oncology', 'Neurology', 'Gynaecology']
    billing_category: Literal['Cash', 'Credit']
    number_of_patients: int
    bed_days_icu: Optional[int] = 0
    bed_days_non_icu: Optional[int] = 0
    gross_amount: Decimal
    discount: Decimal

class RevenueDataCreate(RevenueDataBase):
    pass

class RevenueDataUpdate(BaseModel):
    number_of_patients: Optional[int] = None
    bed_days_icu: Optional[int] = None
    bed_days_non_icu: Optional[int] = None
    gross_amount: Optional[Decimal] = None
    discount: Optional[Decimal] = None

class RevenueDataResponse(RevenueDataBase):
    id: str
    user_id: str
    net_amount: Decimal
    created_at: datetime
    updated_at: Optional[datetime] = None

class RevenueSummary(BaseModel):
    total_patients: int
    total_gross_amount: Decimal
    total_discount: Decimal
    total_net_amount: Decimal
    patient_type_breakdown: dict
    specialty_breakdown: dict
    billing_category_breakdown: dict
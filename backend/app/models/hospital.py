from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HospitalMetadataBase(BaseModel):
    month: str
    year: int
    beds_icu: int
    beds_non_icu: int
    number_of_nurses: int
    resident_doctors: int
    technician_staff: int

class HospitalMetadataCreate(HospitalMetadataBase):
    pass

class HospitalMetadataUpdate(BaseModel):
    beds_icu: Optional[int] = None
    beds_non_icu: Optional[int] = None
    number_of_nurses: Optional[int] = None
    resident_doctors: Optional[int] = None
    technician_staff: Optional[int] = None

class HospitalMetadataResponse(HospitalMetadataBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, time
from decimal import Decimal

# Service Register Models (Revenue Tab)
class ServiceRegisterBase(BaseModel):
    date_of_final_bill: date
    month: str
    bill_no: str
    patient_type: str
    reg_no: str
    ipd_number: Optional[str] = None
    payor_type: str
    payor_alias_name: Optional[str] = None
    admitting_doctor_name: str
    admitting_doctor_department_speciality_name: str
    performing_doctor_name: str
    performing_doctor_department_speciality_name: str
    refering_doctor_name: Optional[str] = None
    refering_doctor_department_speciality_name: Optional[str] = None
    service_name: str
    service_department: str
    service_sub_department: Optional[str] = None
    service_status: str = 'Active'
    is_packaged: bool = False
    is_outsourced: bool = False
    quantity: int = 1
    gross_amount: Decimal = Decimal('0')
    discount: Decimal = Decimal('0')
    net_amount: Decimal = Decimal('0')
    emergency_charges_applied: bool = False
    performing_doctor_share_if_applicable: Decimal = Decimal('0')
    cost_of_pharmacy_material_billed_to_patient: Decimal = Decimal('0')
    share_of_outsource_service_billed: Decimal = Decimal('0')
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    service_tat: Optional[str] = None
    service_date: date

class ServiceRegisterCreate(ServiceRegisterBase):
    pass

class ServiceRegisterUpdate(BaseModel):
    date_of_final_bill: Optional[date] = None
    month: Optional[str] = None
    bill_no: Optional[str] = None
    patient_type: Optional[str] = None
    reg_no: Optional[str] = None
    ipd_number: Optional[str] = None
    payor_type: Optional[str] = None
    payor_alias_name: Optional[str] = None
    admitting_doctor_name: Optional[str] = None
    admitting_doctor_department_speciality_name: Optional[str] = None
    performing_doctor_name: Optional[str] = None
    performing_doctor_department_speciality_name: Optional[str] = None
    refering_doctor_name: Optional[str] = None
    refering_doctor_department_speciality_name: Optional[str] = None
    service_name: Optional[str] = None
    service_department: Optional[str] = None
    service_sub_department: Optional[str] = None
    service_status: Optional[str] = None
    is_packaged: Optional[bool] = None
    is_outsourced: Optional[bool] = None
    quantity: Optional[int] = None
    gross_amount: Optional[Decimal] = None
    discount: Optional[Decimal] = None
    net_amount: Optional[Decimal] = None
    emergency_charges_applied: Optional[bool] = None
    performing_doctor_share_if_applicable: Optional[Decimal] = None
    cost_of_pharmacy_material_billed_to_patient: Optional[Decimal] = None
    share_of_outsource_service_billed: Optional[Decimal] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    service_tat: Optional[str] = None
    service_date: Optional[date] = None

class ServiceRegisterResponse(ServiceRegisterBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Trial Balance Models (Expense Tab)
class TrialBalanceBase(BaseModel):
    category_code: str
    category: str
    grouping_code: str
    grouping: str
    ledger_code: str
    ledger_name: str
    alias_code: Optional[str] = None
    alias_name: Optional[str] = None
    amount: Decimal = Decimal('0')
    remarks: Optional[str] = None
    primary_cost_driver: Optional[str] = None
    category_code_2: Optional[str] = None
    category_2: Optional[str] = None
    amount_2: Decimal = Decimal('0')

class TrialBalanceCreate(TrialBalanceBase):
    pass

class TrialBalanceUpdate(BaseModel):
    category_code: Optional[str] = None
    category: Optional[str] = None
    grouping_code: Optional[str] = None
    grouping: Optional[str] = None
    ledger_code: Optional[str] = None
    ledger_name: Optional[str] = None
    alias_code: Optional[str] = None
    alias_name: Optional[str] = None
    amount: Optional[Decimal] = None
    remarks: Optional[str] = None
    primary_cost_driver: Optional[str] = None
    category_code_2: Optional[str] = None
    category_2: Optional[str] = None
    amount_2: Optional[Decimal] = None

class TrialBalanceResponse(TrialBalanceBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Expense Wise Models (Expense Tab) - No changes needed
class ExpenseWiseBase(BaseModel):
    nature_of_data: str
    ledger_code: str
    ledger_name: str
    alias_name: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    amount: Decimal = Decimal('0')
    remarks: Optional[str] = None

class ExpenseWiseCreate(ExpenseWiseBase):
    pass

class ExpenseWiseUpdate(BaseModel):
    nature_of_data: Optional[str] = None
    ledger_code: Optional[str] = None
    ledger_name: Optional[str] = None
    alias_name: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    amount: Optional[Decimal] = None
    remarks: Optional[str] = None

class ExpenseWiseResponse(ExpenseWiseBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Variable Cost Bill Wise Models (Expense Tab)
class VariableCostBillWiseBase(BaseModel):
    patient_type: str
    reg_no: str
    ipd_number: Optional[str] = None
    bill_no: str
    pharmacy_charged_to_patient: Decimal = Decimal('0')
    medical_surgical_consumables_charged_to_patient: Decimal = Decimal('0')
    implants_and_prosthetics_charged_to_patient: Decimal = Decimal('0')
    non_medical_consumables_charged_to_patient: Decimal = Decimal('0')
    fee_for_service: Decimal = Decimal('0')
    incentives_to_consultants_treating_doctors: Decimal = Decimal('0')
    patient_food_beverages_outsource_service: Decimal = Decimal('0')
    laboratory_test_outsource_service: Decimal = Decimal('0')
    any_other_patient_related_outsourced_services_1: Decimal = Decimal('0')
    any_other_patient_related_outsourced_services_2: Decimal = Decimal('0')
    any_other_patient_related_outsourced_services_3: Decimal = Decimal('0')
    brokerage_commission: Decimal = Decimal('0')
    provision_for_deduction_bad_debts: Decimal = Decimal('0')
    doctor_name: Optional[str] = None
    service_name: Optional[str] = None
    payor_type: Optional[str] = None

class VariableCostBillWiseCreate(VariableCostBillWiseBase):
    pass

class VariableCostBillWiseUpdate(BaseModel):
    patient_type: Optional[str] = None
    reg_no: Optional[str] = None
    ipd_number: Optional[str] = None
    bill_no: Optional[str] = None
    pharmacy_charged_to_patient: Optional[Decimal] = None
    medical_surgical_consumables_charged_to_patient: Optional[Decimal] = None
    implants_and_prosthetics_charged_to_patient: Optional[Decimal] = None
    non_medical_consumables_charged_to_patient: Optional[Decimal] = None
    fee_for_service: Optional[Decimal] = None
    incentives_to_consultants_treating_doctors: Optional[Decimal] = None
    patient_food_beverages_outsource_service: Optional[Decimal] = None
    laboratory_test_outsource_service: Optional[Decimal] = None
    any_other_patient_related_outsourced_services_1: Optional[Decimal] = None
    any_other_patient_related_outsourced_services_2: Optional[Decimal] = None
    any_other_patient_related_outsourced_services_3: Optional[Decimal] = None
    brokerage_commission: Optional[Decimal] = None
    provision_for_deduction_bad_debts: Optional[Decimal] = None
    doctor_name: Optional[str] = None
    service_name: Optional[str] = None
    payor_type: Optional[str] = None

class VariableCostBillWiseResponse(VariableCostBillWiseBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# HR Data Models (Expense Tab)
class HRDataBase(BaseModel):
    nature_of_data: str
    group_code: str
    group_name: str
    sub_group_code: Optional[str] = None
    sub_group_name: Optional[str] = None
    associate_code: str
    associate_name: str
    period: str
    date_of_joining: Optional[date] = None
    date_of_resignation: Optional[date] = None
    working_period: Optional[str] = None
    department: str
    sub_department: Optional[str] = None
    designation: str
    efforts_category: Optional[str] = None
    master_for_multiple: Optional[str] = None
    nature_of_allocation: Optional[str] = None
    efforts_allocation: Decimal = Decimal('0')
    efforts_sub_allocation: Decimal = Decimal('0')
    utilization: Decimal = Decimal('0')
    available_hours: int = 0
    actual_hours: int = 0
    cost_centre_code: Optional[str] = None
    cost_centre_name: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    basic_pay: Decimal = Decimal('0')
    allowances: Decimal = Decimal('0')
    other_benefits: Decimal = Decimal('0')
    overtime: Decimal = Decimal('0')
    bonus: Decimal = Decimal('0')
    epf: Decimal = Decimal('0')
    esic: Decimal = Decimal('0')
    any_other_contribution: Decimal = Decimal('0')
    gross_total: Decimal = Decimal('0')
    deduction: Decimal = Decimal('0')
    net_salary: Decimal = Decimal('0')
    no_of_headcount: int = 1

class HRDataCreate(HRDataBase):
    pass

class HRDataUpdate(BaseModel):
    nature_of_data: Optional[str] = None
    group_code: Optional[str] = None
    group_name: Optional[str] = None
    sub_group_code: Optional[str] = None
    sub_group_name: Optional[str] = None
    associate_code: Optional[str] = None
    associate_name: Optional[str] = None
    period: Optional[str] = None
    date_of_joining: Optional[date] = None
    date_of_resignation: Optional[date] = None
    working_period: Optional[str] = None
    department: Optional[str] = None
    sub_department: Optional[str] = None
    designation: Optional[str] = None
    efforts_category: Optional[str] = None
    master_for_multiple: Optional[str] = None
    nature_of_allocation: Optional[str] = None
    efforts_allocation: Optional[Decimal] = None
    efforts_sub_allocation: Optional[Decimal] = None
    utilization: Optional[Decimal] = None
    available_hours: Optional[int] = None
    actual_hours: Optional[int] = None
    cost_centre_code: Optional[str] = None
    cost_centre_name: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    basic_pay: Optional[Decimal] = None
    allowances: Optional[Decimal] = None
    other_benefits: Optional[Decimal] = None
    overtime: Optional[Decimal] = None
    bonus: Optional[Decimal] = None
    epf: Optional[Decimal] = None
    esic: Optional[Decimal] = None
    any_other_contribution: Optional[Decimal] = None
    gross_total: Optional[Decimal] = None
    deduction: Optional[Decimal] = None
    net_salary: Optional[Decimal] = None
    no_of_headcount: Optional[int] = None

class HRDataResponse(HRDataBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Occupancy Register Models (Metadata Tab)
class OccupancyRegisterBase(BaseModel):
    nature_of_data: str
    medical_record_number_or_registration_number_uhid: str
    patient_admission_date: date
    patient_discharge_date: Optional[date] = None
    ipd_number: Optional[str] = None
    date_of_final_bill: Optional[date] = None
    bill_no: Optional[str] = None
    sub_cost_centre_code: str
    sub_cost_centre: str
    bed_number: str
    length_of_stay_in_hours: int = 0
    the_date_time_at_which_patient_was_transferred_to_this_bed: Optional[datetime] = None
    the_date_time_at_which_patient_left_this_bed: Optional[datetime] = None
    ward_category_code: Optional[str] = None
    bed_category_name: Optional[str] = None
    payor_type: Optional[str] = None
    service_name: Optional[str] = None

class OccupancyRegisterCreate(OccupancyRegisterBase):
    pass

class OccupancyRegisterUpdate(BaseModel):
    nature_of_data: Optional[str] = None
    medical_record_number_or_registration_number_uhid: Optional[str] = None
    patient_admission_date: Optional[date] = None
    patient_discharge_date: Optional[date] = None
    ipd_number: Optional[str] = None
    date_of_final_bill: Optional[date] = None
    bill_no: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    bed_number: Optional[str] = None
    length_of_stay_in_hours: Optional[int] = None
    the_date_time_at_which_patient_was_transferred_to_this_bed: Optional[datetime] = None
    the_date_time_at_which_patient_left_this_bed: Optional[datetime] = None
    ward_category_code: Optional[str] = None
    bed_category_name: Optional[str] = None
    payor_type: Optional[str] = None
    service_name: Optional[str] = None

class OccupancyRegisterResponse(OccupancyRegisterBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# OT Register Models (Metadata Tab)
class OTRegisterBase(BaseModel):
    s_no: str
    medical_record_number_or_registration_number_uhid: str
    bill_no: str
    patient_admission_date: date
    patient_discharge_date: Optional[date] = None
    ipd_number: Optional[str] = None
    service_date: date
    service_name: str
    performing_doctor_name: str
    performing_doctor_department_speciality_name: str
    anaesthesist_name: Optional[str] = None
    anesthesia_type: Optional[str] = None
    type_of_procedure: Optional[str] = None
    nature_of_procedure: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    on_table_time: Optional[time] = None
    incision_time: Optional[time] = None
    finish_time: Optional[time] = None
    procedure_time: Optional[str] = None
    change_over_time: Optional[str] = None
    total_time: Optional[str] = None
    remarks: Optional[str] = None
    payor_type: Optional[str] = None

class OTRegisterCreate(OTRegisterBase):
    pass

class OTRegisterUpdate(BaseModel):
    s_no: Optional[str] = None
    medical_record_number_or_registration_number_uhid: Optional[str] = None
    bill_no: Optional[str] = None
    patient_admission_date: Optional[date] = None
    patient_discharge_date: Optional[date] = None
    ipd_number: Optional[str] = None
    service_date: Optional[date] = None
    service_name: Optional[str] = None
    performing_doctor_name: Optional[str] = None
    performing_doctor_department_speciality_name: Optional[str] = None
    anaesthesist_name: Optional[str] = None
    anesthesia_type: Optional[str] = None
    type_of_procedure: Optional[str] = None
    nature_of_procedure: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    on_table_time: Optional[time] = None
    incision_time: Optional[time] = None
    finish_time: Optional[time] = None
    procedure_time: Optional[str] = None
    change_over_time: Optional[str] = None
    total_time: Optional[str] = None
    remarks: Optional[str] = None
    payor_type: Optional[str] = None

class OTRegisterResponse(OTRegisterBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Consumption Data Models (Metadata Tab)
class ConsumptionDataBase(BaseModel):
    s_no: str
    cost_centre_code: str
    cost_centre: str
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    transaction_date: date
    from_store: Optional[str] = None
    to_store: Optional[str] = None
    sku_name: str
    ledger_code: Optional[str] = None
    ledger_name: Optional[str] = None
    unit_of_measurement: Optional[str] = None
    quantity: Decimal = Decimal('0')
    rate: Decimal = Decimal('0')
    transaction_value_excluding_tax: Decimal = Decimal('0')
    remarks: Optional[str] = None

class ConsumptionDataCreate(ConsumptionDataBase):
    pass

class ConsumptionDataUpdate(BaseModel):
    s_no: Optional[str] = None
    cost_centre_code: Optional[str] = None
    cost_centre: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    transaction_date: Optional[date] = None
    from_store: Optional[str] = None
    to_store: Optional[str] = None
    sku_name: Optional[str] = None
    ledger_code: Optional[str] = None
    ledger_name: Optional[str] = None
    unit_of_measurement: Optional[str] = None
    quantity: Optional[Decimal] = None
    rate: Optional[Decimal] = None
    transaction_value_excluding_tax: Optional[Decimal] = None
    remarks: Optional[str] = None

class ConsumptionDataResponse(ConsumptionDataBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Connected Load Models (Metadata Tab)
class ConnectedLoadBase(BaseModel):
    s_no: str
    sub_cost_centre_code: str
    sub_cost_centre: str
    connected_load: Decimal = Decimal('0')
    running_load: Decimal = Decimal('0')
    standby_load: Decimal = Decimal('0')
    days: int = 0
    hours: int = 0
    total_load_kg: Decimal = Decimal('0')
    remarks: Optional[str] = None

class ConnectedLoadCreate(ConnectedLoadBase):
    pass

class ConnectedLoadUpdate(BaseModel):
    s_no: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    connected_load: Optional[Decimal] = None
    running_load: Optional[Decimal] = None
    standby_load: Optional[Decimal] = None
    days: Optional[int] = None
    hours: Optional[int] = None
    total_load_kg: Optional[Decimal] = None
    remarks: Optional[str] = None

class ConnectedLoadResponse(ConnectedLoadBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Fixed Asset Register Models (Metadata Tab)
class FixedAssetRegisterBase(BaseModel):
    s_no: str
    sub_cost_centre_code: str
    sub_cost_centre: str
    bio_medical_equipments: Decimal = Decimal('0')
    engineering_equipments: Decimal = Decimal('0')
    furniture_fixture: Decimal = Decimal('0')
    others: Decimal = Decimal('0')
    remarks: Optional[str] = None

class FixedAssetRegisterCreate(FixedAssetRegisterBase):
    pass

class FixedAssetRegisterUpdate(BaseModel):
    s_no: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    bio_medical_equipments: Optional[Decimal] = None
    engineering_equipments: Optional[Decimal] = None
    furniture_fixture: Optional[Decimal] = None
    others: Optional[Decimal] = None
    remarks: Optional[str] = None

class FixedAssetRegisterResponse(FixedAssetRegisterBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# TAT Data Models (Metadata Tab)
class TATDataBase(BaseModel):
    s_no: str
    sub_cost_centre_code: str
    sub_cost_centre: str
    tat: str
    remarks: Optional[str] = None

class TATDataCreate(TATDataBase):
    pass

class TATDataUpdate(BaseModel):
    s_no: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    tat: Optional[str] = None
    remarks: Optional[str] = None

class TATDataResponse(TATDataBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Cost Center Models (Metadata Tab) - No changes needed
class CostCenterBase(BaseModel):
    cc_type: str
    cost_centre_code: str
    cost_centre_category: Optional[str] = None
    cost_centre: str
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    alias_code: Optional[str] = None
    alias_name: Optional[str] = None
    cost_driver: Optional[str] = None
    source_of_driver: Optional[str] = None
    remarks: Optional[str] = None

class CostCenterCreate(CostCenterBase):
    pass

class CostCenterUpdate(BaseModel):
    cc_type: Optional[str] = None
    cost_centre_code: Optional[str] = None
    cost_centre_category: Optional[str] = None
    cost_centre: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    alias_code: Optional[str] = None
    alias_name: Optional[str] = None
    cost_driver: Optional[str] = None
    source_of_driver: Optional[str] = None
    remarks: Optional[str] = None

class CostCenterResponse(CostCenterBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Secondary Cost Driver Models (Metadata Tab)
class SecondaryCostDriverBase(BaseModel):
    s_no: str
    sub_cost_centre_code: str
    sub_cost_centre: str
    nursing_hostel_occupancy: int = 0
    doctors_hostel_occupancy: int = 0
    staff_accomodation_occupancy: int = 0
    frequency_of_audit: int = 0
    no_of_it_users: int = 0
    no_of_transaction_in_finance_billing_cost_centre: int = 0
    list_of_equipment_for_which_loan_was_taken: Optional[str] = None
    no_of_trips_km: int = 0
    no_of_laboratory_test: int = 0
    no_of_sample_collected_report_dispatch: int = 0
    no_of_home_sample_collection: int = 0
    no_of_radiology_test: int = 0
    no_of_neuro_test: int = 0
    no_of_cardiac_test: int = 0
    no_of_nuclear_medicine_test: int = 0
    no_of_ivf_consultation: int = 0
    ot_time_hours: Decimal = Decimal('0')
    ccu_occupancy: int = 0
    micu_occupancy: int = 0
    picu_occupancy: int = 0
    nicu_occupancy: int = 0
    hdu_occupancy: int = 0
    issolation_room_occupancy: int = 0
    gw_occupancy: int = 0
    pw_sr_occupancy: int = 0
    sw_ts_occupancy: int = 0
    dw_occupancy: int = 0
    head_office: int = 0
    other_unit_1_allocation_ratio: Decimal = Decimal('0')
    other_unit_2_allocation_ratio: Decimal = Decimal('0')
    other_unit_3_allocation_ratio: Decimal = Decimal('0')
    other_unit_4_allocation_ratio: Decimal = Decimal('0')
    other_unit_5_allocation_ratio: Decimal = Decimal('0')
    no_of_patient_op_ip: int = 0
    no_of_corporate_patient_op_ip: int = 0
    no_of_institutional_patient_op_ip: int = 0
    no_of_international_patient_op_ip: int = 0
    no_of_ip_patients: int = 0
    no_of_credit_ip_patients: int = 0
    surgical_store_issue_ratio: Decimal = Decimal('0')
    central_store_issue_ratio: Decimal = Decimal('0')
    non_surgical_store_issue_ratio: Decimal = Decimal('0')
    stationery_housekeeping_issue_ratio: Decimal = Decimal('0')
    no_of_doctors: int = 0
    doctor_fee_for_service_ratio: Decimal = Decimal('0')
    consultant_retainer_fee_mg_bonus_ratio: Decimal = Decimal('0')
    no_of_nursing_staff: int = 0
    nursing_station_1_for_care_units: int = 0
    nursing_station_2_for_care_units: int = 0
    nursing_station_3_for_care_units: int = 0
    nursing_station_4_for_care_units: int = 0
    nursing_station_5_for_care_units: int = 0
    service_under_op_billing_1: int = 0
    service_under_op_billing_2: int = 0
    service_under_op_billing_3: int = 0
    service_under_op_billing_4: int = 0
    brokerage_commission: Decimal = Decimal('0')
    no_of_cssd_set_issued: int = 0
    no_of_diet_served: int = 0
    no_of_ward_boy: int = 0
    no_of_housekeeping_staff: int = 0
    no_of_fumigation_cycle_performed_standard_resource_allocation_ratio: int = 0
    volume_of_cloth_load: int = 0
    efforts_of_supply_chain_department: Decimal = Decimal('0')
    area_in_sq_meter: Decimal = Decimal('0')
    no_of_security_staff_deployed_no_of_exits: int = 0
    actual_water_utilization_standard_utilization_ratio: Decimal = Decimal('0')
    actual_gas_utilization_standard_utilization_ratio: Decimal = Decimal('0')
    actual_vaccume_utilization_standard_utilization_ratio: Decimal = Decimal('0')
    civil: Optional[str] = None

class SecondaryCostDriverCreate(SecondaryCostDriverBase):
    pass

class SecondaryCostDriverUpdate(BaseModel):
    # Only include key fields for update to keep it manageable
    s_no: Optional[str] = None
    sub_cost_centre_code: Optional[str] = None
    sub_cost_centre: Optional[str] = None
    no_of_patient_op_ip: Optional[int] = None
    no_of_ip_patients: Optional[int] = None
    no_of_doctors: Optional[int] = None
    no_of_nursing_staff: Optional[int] = None
    ot_time_hours: Optional[Decimal] = None
    area_in_sq_meter: Optional[Decimal] = None

class SecondaryCostDriverResponse(SecondaryCostDriverBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
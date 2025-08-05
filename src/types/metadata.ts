// New metadata table types for the current system
export interface OccupancyRegisterNew {
  id: string;
  nature_of_data: string;
  medical_record_number_or_registration_number_uhid: string;
  patient_admission_date: string;
  patient_discharge_date: string;
  ipd_number: string;
  date_of_final_bill: string;
  bill_no: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  bed_number: string;
  length_of_stay_in_hours: number;
  the_date_time_at_which_patient_was_transferred_to_this_bed: string;
  the_date_time_at_which_patient_left_this_bed: string;
  ward_category_code: string;
  bed_category_name: string;
  payor_type: string;
  service_name: string;
  created_at: string;
  updated_at?: string;
}

export interface OTRegister {
  id: string;
  s_no: string;
  medical_record_number_or_registration_number_uhid: string;
  bill_no: string;
  patient_admission_date: string;
  patient_discharge_date: string;
  ipd_number: string;
  service_date: string;
  service_name: string;
  performing_doctor_name: string;
  performing_doctor_department_speciality_name: string;
  anaesthesist_name: string;
  anesthesia_type: string;
  type_of_procedure: string;
  nature_of_procedure: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  on_table_time: string;
  incision_time: string;
  finish_time: string;
  procedure_time: string;
  change_over_time: string;
  total_time: string;
  remarks: string;
  payor_type: string;
  created_at: string;
  updated_at?: string;
}

export interface ConsumptionData {
  id: string;
  s_no: string;
  cost_centre_code: string;
  cost_centre: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  transaction_date: string;
  from_store: string;
  to_store: string;
  sku_name: string;
  ledger_code: string;
  ledger_name: string;
  unit_of_measurement: string;
  quantity: number;
  rate: number;
  transaction_value_excluding_tax: number;
  remarks: string;
  created_at: string;
  updated_at?: string;
}

export interface ConnectedLoad {
  id: string;
  s_no: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  connected_load: number;
  running_load: number;
  standby_load: number;
  days: number;
  hours: number;
  total_load_kg: number;
  remarks: string;
  created_at: string;
  updated_at?: string;
}

export interface FixedAssetRegister {
  id: string;
  s_no: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  bio_medical_equipments: number;
  engineering_equipments: number;
  furniture_fixture: number;
  others: number;
  remarks: string;
  created_at: string;
  updated_at?: string;
}

export interface TATData {
  id: string;
  s_no: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  tat: string;
  remarks: string;
  created_at: string;
  updated_at?: string;
}

export interface CostCenter {
  id: string;
  cc_type: string;
  cost_centre_code: string;
  cost_centre_category: string;
  cost_centre: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  alias_code: string;
  alias_name: string;
  cost_driver: string;
  source_of_driver: string;
  remarks: string;
  created_at: string;
  updated_at?: string;
}

export interface SecondaryCostDriver {
  id: string;
  s_no: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
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
  no_of_patient_op_ip: number;
  no_of_corporate_patient_op_ip: int = 0
  no_of_institutional_patient_op_ip: int = 0
  no_of_international_patient_op_ip: int = 0
  no_of_ip_patients: number;
  no_of_credit_ip_patients: int = 0
  surgical_store_issue_ratio: Decimal = Decimal('0')
  central_store_issue_ratio: Decimal = Decimal('0')
  non_surgical_store_issue_ratio: Decimal = Decimal('0')
  stationery_housekeeping_issue_ratio: Decimal = Decimal('0')
  no_of_doctors: number;
  doctor_fee_for_service_ratio: Decimal = Decimal('0')
  consultant_retainer_fee_mg_bonus_ratio: Decimal = Decimal('0')
  no_of_nursing_staff: number;
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
  created_at: string;
  updated_at?: string;
}
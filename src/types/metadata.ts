// New metadata table types for the current system
export interface OccupancyRegisterNew {
  id: string;
  nature_of_data: string;
  uhid: string;
  patient_admission_date: string;
  patient_discharge_date: string;
  ipd_number: string;
  date_of_final_bill: string;
  bill_no: string;
  ward_code: string;
  ward_name: string;
  bed_number: string;
  length_of_stay_in_hours: number;
  bed_assign_datetime: string;
  bed_release_datetime: string;
  ward_category_code: string;
  bed_category_name: string;
  payor_type: string;
  service_name: string;
  created_at: string;
  updated_at?: string;
}

export interface OTRegister {
  id: string;
  serial_no: string;
  uhid: string;
  patient_bill_number: string;
  patient_admission_date: string;
  patient_discharge_date: string;
  ipd_number: string;
  service_date: string;
  service_name: string;
  performing_doctor_name: string;
  performing_doctor_department: string;
  anaesthetist_name: string;
  anesthesia_type: string;
  type_of_procedure: string;
  nature_of_procedure: string;
  operation_theatre_code: string;
  operation_theatre_name: string;
  on_table_time: string;
  incision_time: string;
  finish_time: string;
  procedure_time: string;
  change_over_time: string;
  total_time: string;
  remarks: string;
  payor_type: string;
  service_name_second: string;
  created_at: string;
  updated_at?: string;
}

export interface ConsumptionData {
  id: string;
  serial_no: string;
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
  transaction_value: number;
  remarks: string;
  created_at: string;
  updated_at?: string;
}

export interface ConnectedLoad {
  id: string;
  serial_no: string;
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
  serial_no: string;
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
  serial_no: string;
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
  serial_no: string;
  sub_cost_centre_code: string;
  sub_cost_centre: string;
  no_of_patient_op_ip: number;
  no_of_ip_patients: number;
  no_of_doctors: number;
  no_of_nursing_staff: number;
  ot_time_hours: number;
  area_in_sq_meter: number;
  no_of_laboratory_test: number;
  no_of_radiology_test: number;
  no_of_cardiac_test: number;
  // Additional fields available but not displayed in table for brevity
  created_at: string;
  updated_at?: string;
}
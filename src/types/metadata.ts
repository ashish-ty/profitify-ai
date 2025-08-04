// OT-Cath Lab Register Table
export interface OTCathLabRegister {
  No: string;
  UHID: string;
  BillNo: string;
  AdmissionDate: string;
  DischargeDate: string;
  IPDNo: string;
  ServiceDate: string;
  ServiceName: string;
  DoctorID: string;
  DoctorName: string;
  DeptCode: string;
  Department: string;
  Anesthetist: string;
  AnesthesiaCode: string;
  AnesthesiaType: string;
  ProcedureType: string;
  ProcedureNature: string;
  OTCode: string;
  OTName: string;
  OnTable: string;
  IncisionTime: string;
  FinishTime: string;
  ProcedureTime: number;
  ChangeoverTime: number;
  TotalTime: number;
  Remarks: string;
}

// Occupancy Register Table
export interface OccupancyRegister {
  UHID: string;
  PatientBillNo: string;
  AdmissionDate: string;
  DischargeDate: string;
  IPDNo: string;
  FinalBillDate: string;
  BillNo: string;
  WardCode: string;
  WardName: string;
  BedNo: string;
  StayHours: number;
  BedAssignTime: string;
  BedReleaseTime: string;
  WardCatCode: string;
  BedCatName: string;
  Category: string;
}

// Power Consumption Table
export interface PowerConsumption {
  No: string;
  SubCCCode: string;
  SubCC: string;
  ConnLoad: number;
  RunLoad: number;
  StdbyLoad: number;
  Days: number;
  Hrs: number;
  TotalLoadKg: number;
  Notes: string;
}

// New metadata table types based on your specifications
export interface OccupancyRegisterNew {
  NatureOfData: string;
  UHID: string;
  PatientAdmissionDate: string;
  PatientDischargeDate: string;
  IPDNumber: string;
  DateOfFinalBill: string;
  BillNo: string;
  WardCode: string;
  WardName: string;
  BedNumber: string;
  LengthOfStayInHours: number;
  BedAssignDateTime: string;
  BedReleaseDateTime: string;
  WardCategoryCode: string;
  BedCategoryName: string;
  PayorType: string;
  ServiceName: string;
}

export interface OTRegister {
  SerialNo: string;
  UHID: string;
  PatientBillNumber: string;
  PatientAdmissionDate: string;
  PatientDischargeDate: string;
  IPDNumber: string;
  ServiceDate: string;
  ServiceName: string;
  PerformingDoctorName: string;
  PerformingDoctorDepartment: string;
  AnaesthesistName: string;
  AnesthesiaType: string;
  TypeOfProcedure: string;
  NatureOfProcedure: string;
  OperationTheatreCode: string;
  OperationTheatreName: string;
  OnTableTime: string;
  IncisionTime: string;
  FinishTime: string;
  ProcedureTime: string;
  ChangeOverTime: string;
  TotalTime: string;
  Remarks: string;
  PayorType: string;
  ServiceNameSecond: string;
}

export interface ConsumptionData {
  SerialNo: string;
  CostCentreCode: string;
  CostCentre: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  TransactionDate: string;
  FromStore: string;
  ToStore: string;
  SKUName: string;
  LedgerCode: string;
  LedgerName: string;
  UnitOfMeasurement: string;
  Quantity: number;
  Rate: number;
  TransactionValue: number;
  Remarks: string;
}

export interface ConnectedLoad {
  SerialNo: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  ConnectedLoad: number;
  RunningLoad: number;
  StandbyLoad: number;
  Days: number;
  Hours: number;
  TotalLoadKg: number;
  Remarks: string;
}

export interface FixedAssetRegister {
  SerialNo: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  BioMedicalEquipments: number;
  EngineeringEquipments: number;
  FurnitureFixture: number;
  Others: number;
  Remarks: string;
}

export interface TATData {
  SerialNo: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  TAT: string;
  Remarks: string;
}

export interface CostCenter {
  CCType: string;
  CostCentreCode: string;
  CostCentreCategory: string;
  CostCentre: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  AliasCode: string;
  AliasName: string;
  CostDriver: string;
  SourceOfDriver: string;
  Remarks: string;
}

export interface SecondaryCostDriver {
  SerialNo: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  nursing_hostel_occupancy: number;
  doctors_hostel_occupancy: number;
  staff_accommodation_occupancy: number;
  frequency_of_audit: number;
  no_of_it_users: number;
  no_of_transaction_in_finance_billing: number;
  list_of_equipment_for_loan: string;
  no_of_trips_km: number;
  no_of_laboratory_test: number;
  no_of_sample_collected_report_dispatch: number;
  no_of_home_sample_collection: number;
  no_of_radiology_test: number;
  no_of_neuro_test: number;
  no_of_cardiac_test: number;
  no_of_nuclear_medicine_test: number;
  no_of_ivf_consultation: number;
  ot_time_hours: number;
  ccu_occupancy: number;
  micu_occupancy: number;
  picu_occupancy: number;
  nicu_occupancy: number;
  hdu_occupancy: number;
  isolation_room_occupancy: number;
  gw_occupancy: number;
  pwsr_occupancy: number;
  swts_occupancy: number;
  dw_occupancy: number;
  head_office: number;
  other_unit_1_allocation_ratio: number;
  other_unit_2_allocation_ratio: number;
  other_unit_3_allocation_ratio: number;
  other_unit_4_allocation_ratio: number;
  other_unit_5_allocation_ratio: number;
  no_of_patient_op_ip: number;
  no_of_corporate_patient_op_ip: number;
  no_of_institutional_patient_op_ip: number;
  no_of_international_patient_op_ip: number;
  no_of_ip_patients: number;
  no_of_credit_ip_patients: number;
  surgical_store_issue_ratio: number;
  central_store_issue_ratio: number;
  non_surgical_store_issue_ratio: number;
  stationery_housekeeping_issue_ratio: number;
  no_of_doctors: number;
  doctor_fee_for_service_ratio: number;
  consultant_retainer_fee_mg_bonus_ratio: number;
  no_of_nursing_staff: number;
  nursing_station_1_for_care_units: number;
  nursing_station_2_for_care_units: number;
  nursing_station_3_for_care_units: number;
  nursing_station_4_for_care_units: number;
  nursing_station_5_for_care_units: number;
  service_under_op_billing_1: number;
  service_under_op_billing_2: number;
  service_under_op_billing_3: number;
  service_under_op_billing_4: number;
  brokerage_commission: number;
  no_of_cssd_set_issued: number;
  no_of_diet_served: number;
  no_of_ward_boy: number;
  no_of_housekeeping_staff: number;
  no_of_fumigation_cycle_performed: number;
  volume_of_cloth_load: number;
  efforts_of_supply_chain_department: number;
  area_in_sq_meter: number;
  no_of_security_staff_deployed: number;
  actual_water_utilization: number;
  actual_gas_utilization: number;
  actual_vacuum_utilization: number;
  civil: string;
}
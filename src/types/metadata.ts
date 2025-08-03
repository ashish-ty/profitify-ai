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
  NursingHostelOccupancy: number;
  DoctorsHostelOccupancy: number;
  StaffAccommodationOccupancy: number;
  FrequencyOfAudit: number;
  NoOfITUsers: number;
  NoOfTransactionInFinanceBilling: number;
  ListOfEquipmentForLoan: string;
  NoOfTripsKm: number;
  NoOfLaboratoryTest: number;
  NoOfSampleCollectedReportDispatch: number;
  NoOfHomeSampleCollection: number;
  NoOfRadiologyTest: number;
  NoOfNeuroTest: number;
  NoOfCardiacTest: number;
  NoOfNuclearMedicineTest: number;
  NoOfIVFConsultation: number;
  OTTimeHours: number;
  CCUOccupancy: number;
  MICUOccupancy: number;
  PICUOccupancy: number;
  NICUOccupancy: number;
  HDUOccupancy: number;
  IsolationRoomOccupancy: number;
  GWOccupancy: number;
  PWSROccupancy: number;
  SWTSOccupancy: number;
  DWOccupancy: number;
  HeadOffice: number;
  OtherUnit1AllocationRatio: number;
  OtherUnit2AllocationRatio: number;
  OtherUnit3AllocationRatio: number;
  OtherUnit4AllocationRatio: number;
  OtherUnit5AllocationRatio: number;
  NoOfPatientOPIP: number;
  NoOfCorporatePatientOPIP: number;
  NoOfInstitutionalPatientOPIP: number;
  NoOfInternationalPatientOPIP: number;
  NoOfIPPatients: number;
  NoOfCreditIPPatients: number;
  SurgicalStoreIssueRatio: number;
  CentralStoreIssueRatio: number;
  NonSurgicalStoreIssueRatio: number;
  StationeryHousekeepingIssueRatio: number;
  NoOfDoctors: number;
  DoctorFeeForServiceRatio: number;
  ConsultantRetainerFeeMGBonusRatio: number;
  NoOfNursingStaff: number;
  NursingStation1ForCareUnits: number;
  NursingStation2ForCareUnits: number;
  NursingStation3ForCareUnits: number;
  NursingStation4ForCareUnits: number;
  NursingStation5ForCareUnits: number;
  ServiceUnderOPBilling1: number;
  ServiceUnderOPBilling2: number;
  ServiceUnderOPBilling3: number;
  ServiceUnderOPBilling4: number;
  BrokerageCommission: number;
  NoOfCSSDSetIssued: number;
  NoOfDietServed: number;
  NoOfWardBoy: number;
  NoOfHousekeepingStaff: number;
  NoOfFumigationCyclePerformed: number;
  VolumeOfClothLoad: number;
  EffortsOfSupplyChainDepartment: number;
  AreaInSqMeter: number;
  NoOfSecurityStaffDeployed: number;
  ActualWaterUtilization: number;
  ActualGasUtilization: number;
  ActualVaccumeUtilization: number;
  Civil: string;
}
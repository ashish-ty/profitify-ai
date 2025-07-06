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
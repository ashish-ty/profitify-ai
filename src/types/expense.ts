// Trial Balance Table
export interface TrialBalance {
  Code: string;
  Ledger: string;
  Alias: string;
  Date: string;
  Month: string;
  PostID: string;
  Desc: string;
  OpenBal: number;
  Debit: number;
  Credit: number;
  CloseBal: number;
  NetBal: number;
  Notes: string;
}

// Doctor Share Table
export interface DoctorShare {
  Month: string;
  DoctorID: string;
  DeptCode: string;
  DeptSpecialty: string;
  DoctorName: string;
  ServiceFee: number;
  RetainerFee: number;
  Incentives: number;
  Notes: string;
}

// Variable Cost Bill wise Table
export interface VariableCostBillWise {
  BillNo: string;
  Pharmacy: number;
  MedSurgConsumables: number;
  ImplantsProsthetics: number;
  NonMedConsumables: number;
  Fee: number;
  DoctorTreating: number;
  ServiceTreating: number;
  Incentives: number;
  DoctorConsultant: number;
  ServiceConsultant: number;
  FoodOutsource: number;
  LabOutsource: number;
  ServiceLab: number;
  OtherOutsource1: number;
  ServiceOther1: number;
  OtherOutsource2: number;
  ServiceOther2: number;
  OtherOutsource3: number;
  ServiceOther3: number;
  BrokerageCommission: number;
  BadDebtsProvision: number;
}

// HR Salary Sheet Table
export interface HRSalarySheet {
  GroupID: string;
  GroupName: string;
  SubGroupID: string;
  SubGroupName: string;
  EmpID: string;
  EmpName: string;
  Period: string;
  JoinDate: string;
  ResignDate: string;
  Tenure: number;
  Dept: string;
  SubDept: string;
  Title: string;
  EffortCat: string;
  MasterFlag: boolean;
  AllocationType: string;
  EffortAlloc: number;
  SubEffortAlloc: number;
  Utilization: number;
  AvailableHrs: number;
  ActualHrs: number;
  CostCentreID: string;
  CostCentreName: string;
  SubCostCentreID: string;
  SubCostCentreName: string;
  BasicPay: number;
  Allowances: number;
  Benefits: number;
  Overtime: number;
  Bonus: number;
  EPF: number;
  ESIC: number;
  OtherContrib: number;
  GrossPay: number;
  Deductions: number;
  NetPay: number;
}

// New expense table types based on your specifications
export interface TrialBalanceNew {
  CategoryCode: string;
  Category: string;
  GroupingCode: string;
  Grouping: string;
  LedgerCode: string;
  LedgerName: string;
  AliasCode: string;
  AliasName: string;
  Amount: number;
  Remarks: string;
  PrimaryCostDriver: string;
  CategoryCodeSecond: string;
  CategorySecond: string;
  AmountSecond: number;
}

export interface ExpenseWise {
  NatureOfData: string;
  LedgerCode: string;
  LedgerName: string;
  AliasName: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  Amount: number;
  Remarks: string;
}

export interface VariableCostBillWiseNew {
  PatientType: string;
  RegNo: string;
  IPDNumber: string;
  BillNo: string;
  PharmacyChargedToPatient: number;
  MedicalSurgicalConsumablesChargedToPatient: number;
  ImplantsAndProstheticsChargedToPatient: number;
  NonMedicalConsumablesChargedToPatient: number;
  FeeForService: number;
  IncentivesToConsultantsTreatingDoctors: number;
  PatientFoodBeveragesOutsourceService: number;
  LaboratoryTestOutsourceService: number;
  AnyOtherPatientRelatedOutsourcedServices1: number;
  AnyOtherPatientRelatedOutsourcedServices2: number;
  AnyOtherPatientRelatedOutsourcedServices3: number;
  BrokerageCommission: number;
  ProvisionForDeductionBadDebts: number;
  DoctorName: string;
  ServiceName: string;
  PayorType: string;
}

export interface HRNew {
  NatureOfData: string;
  GroupCode: string;
  GroupName: string;
  SubGroupCode: string;
  SubGroupName: string;
  AssociateCode: string;
  AssociateName: string;
  Period: string;
  DateOfJoining: string;
  DateOfResignation: string;
  WorkingPeriod: string;
  Department: string;
  SubDepartment: string;
  Designation: string;
  EffortsCategory: string;
  MasterForMultiple: string;
  NatureOfAllocation: string;
  EffortsAllocation: number;
  EffortsSubAllocation: number;
  Utilization: number;
  AvailableHours: number;
  ActualHours: number;
  CostCentreCode: string;
  CostCentreName: string;
  SubCostCentreCode: string;
  SubCostCentre: string;
  BasicPay: number;
  Allowances: number;
  OtherBenefits: number;
  Overtime: number;
  Bonus: number;
  EPF: number;
  ESIC: number;
  AnyOtherContribution: number;
  GrossTotal: number;
  Deduction: number;
  NetSalary: number;
  NoOfHeadcount: number;
}
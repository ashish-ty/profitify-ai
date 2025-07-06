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
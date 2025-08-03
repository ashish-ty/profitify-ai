import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../../Common/DataTable';
import { TrialBalanceNew, ExpenseWise, VariableCostBillWiseNew, HRNew } from '../../../types/expense';
import { FileText, Calculator, DollarSign, Users } from 'lucide-react';

// Dummy data for Trial Balance
const dummyTrialBalance: TrialBalanceNew[] = [
  {
    CategoryCode: 'CAT001',
    Category: 'Medical Equipment',
    GroupingCode: 'GRP001',
    Grouping: 'Fixed Assets',
    LedgerCode: 'LED001',
    LedgerName: 'CT Scanner',
    AliasCode: 'CT001',
    AliasName: 'CT Machine',
    Amount: 2500000,
    Remarks: 'Main CT scanner',
    PrimaryCostDriver: 'Number of scans',
    CategoryCodeSecond: 'CAT001',
    CategorySecond: 'Medical Equipment',
    AmountSecond: 2500000
  },
  {
    CategoryCode: 'CAT002',
    Category: 'Pharmacy',
    GroupingCode: 'GRP002',
    Grouping: 'Variable Costs',
    LedgerCode: 'LED002',
    LedgerName: 'Cardiac Medicines',
    AliasCode: 'CARD001',
    AliasName: 'Heart Drugs',
    Amount: 180000,
    Remarks: 'Monthly pharmacy stock',
    PrimaryCostDriver: 'Number of patients',
    CategoryCodeSecond: 'CAT002',
    CategorySecond: 'Pharmacy',
    AmountSecond: 180000
  },
  {
    CategoryCode: 'CAT003',
    Category: 'Staff Salaries',
    GroupingCode: 'GRP003',
    Grouping: 'Personnel Costs',
    LedgerCode: 'LED003',
    LedgerName: 'Doctor Salaries',
    AliasCode: 'DOC001',
    AliasName: 'Medical Staff',
    Amount: 450000,
    Remarks: 'Monthly doctor salaries',
    PrimaryCostDriver: 'Number of doctors',
    CategoryCodeSecond: 'CAT003',
    CategorySecond: 'Staff Salaries',
    AmountSecond: 450000
  },
  {
    CategoryCode: 'CAT004',
    Category: 'Utilities',
    GroupingCode: 'GRP004',
    Grouping: 'Operating Expenses',
    LedgerCode: 'LED004',
    LedgerName: 'Electricity',
    AliasCode: 'ELEC001',
    AliasName: 'Power Supply',
    Amount: 85000,
    Remarks: 'Monthly electricity bill',
    PrimaryCostDriver: 'kWh consumed',
    CategoryCodeSecond: 'CAT004',
    CategorySecond: 'Utilities',
    AmountSecond: 85000
  },
  {
    CategoryCode: 'CAT005',
    Category: 'Administrative',
    GroupingCode: 'GRP005',
    Grouping: 'Overhead Costs',
    LedgerCode: 'LED005',
    LedgerName: 'Office Supplies',
    AliasCode: 'OFF001',
    AliasName: 'Stationery',
    Amount: 25000,
    Remarks: 'Monthly office expenses',
    PrimaryCostDriver: 'Number of staff',
    CategoryCodeSecond: 'CAT005',
    CategorySecond: 'Administrative',
    AmountSecond: 25000
  }
];

// Dummy data for Expense Wise
const dummyExpenseWise: ExpenseWise[] = [
  {
    NatureOfData: 'Direct Cost',
    LedgerCode: 'LED001',
    LedgerName: 'Pharmacy Supplies',
    AliasName: 'Medical Drugs',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Cardiology Pharmacy',
    Amount: 85000,
    Remarks: 'Cardiac medications and supplies'
  },
  {
    NatureOfData: 'Indirect Cost',
    LedgerCode: 'LED002',
    LedgerName: 'Electricity',
    AliasName: 'Power Supply',
    SubCostCentreCode: 'SCC002',
    SubCostCentre: 'ICU',
    Amount: 45000,
    Remarks: 'ICU power consumption'
  },
  {
    NatureOfData: 'Direct Cost',
    LedgerCode: 'LED003',
    LedgerName: 'Medical Consumables',
    AliasName: 'Surgical Items',
    SubCostCentreCode: 'SCC003',
    SubCostCentre: 'Operation Theatre',
    Amount: 65000,
    Remarks: 'OT consumables and instruments'
  },
  {
    NatureOfData: 'Overhead',
    LedgerCode: 'LED004',
    LedgerName: 'Administrative Expenses',
    AliasName: 'Admin Costs',
    SubCostCentreCode: 'SCC004',
    SubCostCentre: 'Administration',
    Amount: 35000,
    Remarks: 'General administrative expenses'
  },
  {
    NatureOfData: 'Direct Cost',
    LedgerCode: 'LED005',
    LedgerName: 'Laboratory Reagents',
    AliasName: 'Lab Supplies',
    SubCostCentreCode: 'SCC005',
    SubCostCentre: 'Laboratory',
    Amount: 28000,
    Remarks: 'Lab testing materials'
  }
];

// Dummy data for Variable Cost Bill Wise
const dummyVariableCostBillWise: VariableCostBillWiseNew[] = [
  {
    PatientType: 'IPD',
    RegNo: 'REG001',
    IPDNumber: 'IPD2024001',
    BillNo: 'B001',
    PharmacyChargedToPatient: 8500,
    MedicalSurgicalConsumables: 12000,
    ImplantsAndProsthetics: 25000,
    NonMedicalConsumables: 1500,
    FeeForService: 15000,
    IncentivesToDoctors: 3000,
    PatientFoodBeverages: 1200,
    LaboratoryTestOutsource: 4500,
    OtherOutsourcedServices1: 3000,
    OtherOutsourcedServices2: 2000,
    OtherOutsourcedServices3: 1500,
    BrokerageCommission: 2500,
    ProvisionForBadDebts: 1000,
    DoctorName: 'Dr. Smith',
    ServiceName: 'Cardiac Surgery',
    PayorType: 'Insurance'
  },
  {
    PatientType: 'OPD',
    RegNo: 'REG002',
    IPDNumber: '',
    BillNo: 'B002',
    PharmacyChargedToPatient: 3500,
    MedicalSurgicalConsumables: 2000,
    ImplantsAndProsthetics: 0,
    NonMedicalConsumables: 500,
    FeeForService: 5000,
    IncentivesToDoctors: 1000,
    PatientFoodBeverages: 0,
    LaboratoryTestOutsource: 1500,
    OtherOutsourcedServices1: 800,
    OtherOutsourcedServices2: 0,
    OtherOutsourcedServices3: 0,
    BrokerageCommission: 500,
    ProvisionForBadDebts: 200,
    DoctorName: 'Dr. Johnson',
    ServiceName: 'Consultation',
    PayorType: 'Cash'
  },
  {
    PatientType: 'IPD',
    RegNo: 'REG003',
    IPDNumber: 'IPD2024003',
    BillNo: 'B003',
    PharmacyChargedToPatient: 15000,
    MedicalSurgicalConsumables: 18000,
    ImplantsAndProsthetics: 45000,
    NonMedicalConsumables: 2500,
    FeeForService: 25000,
    IncentivesToDoctors: 5000,
    PatientFoodBeverages: 2000,
    LaboratoryTestOutsource: 8000,
    OtherOutsourcedServices1: 5000,
    OtherOutsourcedServices2: 3500,
    OtherOutsourcedServices3: 2000,
    BrokerageCommission: 4000,
    ProvisionForBadDebts: 2000,
    DoctorName: 'Dr. Brown',
    ServiceName: 'Neurosurgery',
    PayorType: 'Insurance'
  },
  {
    PatientType: 'OPD',
    RegNo: 'REG004',
    IPDNumber: '',
    BillNo: 'B004',
    PharmacyChargedToPatient: 2800,
    MedicalSurgicalConsumables: 1200,
    ImplantsAndProsthetics: 0,
    NonMedicalConsumables: 300,
    FeeForService: 3500,
    IncentivesToDoctors: 700,
    PatientFoodBeverages: 0,
    LaboratoryTestOutsource: 2000,
    OtherOutsourcedServices1: 500,
    OtherOutsourcedServices2: 0,
    OtherOutsourcedServices3: 0,
    BrokerageCommission: 350,
    ProvisionForBadDebts: 150,
    DoctorName: 'Dr. Wilson',
    ServiceName: 'Gynecology Consultation',
    PayorType: 'Cash'
  },
  {
    PatientType: 'IPD',
    RegNo: 'REG005',
    IPDNumber: 'IPD2024005',
    BillNo: 'B005',
    PharmacyChargedToPatient: 22000,
    MedicalSurgicalConsumables: 28000,
    ImplantsAndProsthetics: 65000,
    NonMedicalConsumables: 3000,
    FeeForService: 35000,
    IncentivesToDoctors: 7000,
    PatientFoodBeverages: 2500,
    LaboratoryTestOutsource: 12000,
    OtherOutsourcedServices1: 8000,
    OtherOutsourcedServices2: 5000,
    OtherOutsourcedServices3: 3000,
    BrokerageCommission: 6000,
    ProvisionForBadDebts: 3000,
    DoctorName: 'Dr. Davis',
    ServiceName: 'Oncology Treatment',
    PayorType: 'Insurance'
  }
];

// Dummy data for HR
const dummyHR: HRNew[] = [
  {
    NatureOfData: 'Medical Staff',
    GroupCode: 'GRP001',
    GroupName: 'Doctors',
    SubGroupCode: 'SG001',
    SubGroupName: 'Senior Consultants',
    AssociateCode: 'EMP001',
    AssociateName: 'Dr. Smith',
    Period: 'January 2024',
    DateOfJoining: '15/01/2020',
    DateOfResignation: '',
    WorkingPeriod: '4 years',
    Department: 'Cardiology',
    SubDepartment: 'Interventional',
    Designation: 'Senior Consultant',
    EffortsCategory: 'Clinical',
    MasterForMultiple: 'Yes',
    NatureOfAllocation: 'Direct',
    EffortsAllocation: 100,
    EffortsSubAllocation: 80,
    Utilization: 85,
    AvailableHours: 160,
    ActualHours: 136,
    CostCentreCode: 'CC001',
    CostCentreName: 'Cardiology Dept',
    SubCostCentreCode: 'SCC001',
    SubCostCentreName: 'Cath Lab',
    BasicPay: 180000,
    Allowances: 45000,
    OtherBenefits: 25000,
    Overtime: 8000,
    Bonus: 15000,
    EPF: 18000,
    ESIC: 2500,
    AnyOtherContribution: 3000,
    GrossTotal: 296500,
    Deduction: 23500,
    NetSalary: 273000,
    NoOfHeadcount: 1
  },
  {
    NatureOfData: 'Nursing Staff',
    GroupCode: 'GRP002',
    GroupName: 'Nurses',
    SubGroupCode: 'SG002',
    SubGroupName: 'Staff Nurses',
    AssociateCode: 'EMP002',
    AssociateName: 'Sarah Johnson',
    Period: 'January 2024',
    DateOfJoining: '20/03/2019',
    DateOfResignation: '',
    WorkingPeriod: '5 years',
    Department: 'ICU',
    SubDepartment: 'Cardiac ICU',
    Designation: 'Senior Staff Nurse',
    EffortsCategory: 'Clinical',
    MasterForMultiple: 'No',
    NatureOfAllocation: 'Direct',
    EffortsAllocation: 100,
    EffortsSubAllocation: 100,
    Utilization: 95,
    AvailableHours: 160,
    ActualHours: 152,
    CostCentreCode: 'CC002',
    CostCentreName: 'ICU',
    SubCostCentreCode: 'SCC002',
    SubCostCentreName: 'Cardiac ICU',
    BasicPay: 45000,
    Allowances: 12000,
    OtherBenefits: 8000,
    Overtime: 5000,
    Bonus: 3000,
    EPF: 4500,
    ESIC: 800,
    AnyOtherContribution: 1000,
    GrossTotal: 79300,
    Deduction: 6300,
    NetSalary: 73000,
    NoOfHeadcount: 1
  },
  {
    NatureOfData: 'Support Staff',
    GroupCode: 'GRP003',
    GroupName: 'Technicians',
    SubGroupCode: 'SG003',
    SubGroupName: 'Lab Technicians',
    AssociateCode: 'EMP003',
    AssociateName: 'Mike Brown',
    Period: 'January 2024',
    DateOfJoining: '10/06/2021',
    DateOfResignation: '',
    WorkingPeriod: '3 years',
    Department: 'Laboratory',
    SubDepartment: 'Biochemistry',
    Designation: 'Senior Technician',
    EffortsCategory: 'Technical',
    MasterForMultiple: 'No',
    NatureOfAllocation: 'Indirect',
    EffortsAllocation: 80,
    EffortsSubAllocation: 60,
    Utilization: 90,
    AvailableHours: 160,
    ActualHours: 144,
    CostCentreCode: 'CC003',
    CostCentreName: 'Laboratory',
    SubCostCentreCode: 'SCC003',
    SubCostCentreName: 'Biochemistry Lab',
    BasicPay: 35000,
    Allowances: 8000,
    OtherBenefits: 5000,
    Overtime: 3000,
    Bonus: 2000,
    EPF: 3500,
    ESIC: 600,
    AnyOtherContribution: 800,
    GrossTotal: 57900,
    Deduction: 4900,
    NetSalary: 53000,
    NoOfHeadcount: 1
  },
  {
    NatureOfData: 'Administrative',
    GroupCode: 'GRP004',
    GroupName: 'Administration',
    SubGroupCode: 'SG004',
    SubGroupName: 'Finance',
    AssociateCode: 'EMP004',
    AssociateName: 'Lisa Davis',
    Period: 'January 2024',
    DateOfJoining: '15/11/2020',
    DateOfResignation: '',
    WorkingPeriod: '3 years',
    Department: 'Finance',
    SubDepartment: 'Accounts',
    Designation: 'Finance Manager',
    EffortsCategory: 'Administrative',
    MasterForMultiple: 'No',
    NatureOfAllocation: 'Indirect',
    EffortsAllocation: 100,
    EffortsSubAllocation: 100,
    Utilization: 92,
    AvailableHours: 160,
    ActualHours: 147,
    CostCentreCode: 'CC005',
    CostCentreName: 'Administration',
    SubCostCentreCode: 'SCC005',
    SubCostCentreName: 'Finance Dept',
    BasicPay: 75000,
    Allowances: 18000,
    OtherBenefits: 12000,
    Overtime: 4000,
    Bonus: 6000,
    EPF: 7500,
    ESIC: 1200,
    AnyOtherContribution: 1500,
    GrossTotal: 125200,
    Deduction: 10200,
    NetSalary: 115000,
    NoOfHeadcount: 1
  },
  {
    NatureOfData: 'Medical Staff',
    GroupCode: 'GRP001',
    GroupName: 'Doctors',
    SubGroupCode: 'SG005',
    SubGroupName: 'Junior Consultants',
    AssociateCode: 'EMP005',
    AssociateName: 'Dr. Kumar',
    Period: 'January 2024',
    DateOfJoining: '01/09/2022',
    DateOfResignation: '',
    WorkingPeriod: '1.5 years',
    Department: 'Emergency',
    SubDepartment: 'Emergency Medicine',
    Designation: 'Emergency Physician',
    EffortsCategory: 'Clinical',
    MasterForMultiple: 'No',
    NatureOfAllocation: 'Direct',
    EffortsAllocation: 100,
    EffortsSubAllocation: 90,
    Utilization: 88,
    AvailableHours: 160,
    ActualHours: 141,
    CostCentreCode: 'CC006',
    CostCentreName: 'Emergency Dept',
    SubCostCentreCode: 'SCC006',
    SubCostCentreName: 'Emergency Room',
    BasicPay: 120000,
    Allowances: 30000,
    OtherBenefits: 18000,
    Overtime: 12000,
    Bonus: 8000,
    EPF: 12000,
    ESIC: 1800,
    AnyOtherContribution: 2000,
    GrossTotal: 203800,
    Deduction: 15800,
    NetSalary: 188000,
    NoOfHeadcount: 1
  }
];

// Column definitions
const trialBalanceColumns: TableColumn[] = [
  { key: 'CategoryCode', label: 'Category Code', width: '120px', sortable: true },
  { key: 'Category', label: 'Category', width: '150px', sortable: true },
  { key: 'GroupingCode', label: 'Grouping Code', width: '120px', sortable: true },
  { key: 'Grouping', label: 'Grouping', width: '150px', sortable: true },
  { key: 'LedgerCode', label: 'Ledger Code', width: '120px', sortable: true },
  { key: 'LedgerName', label: 'Ledger Name', width: '180px', sortable: true },
  { key: 'AliasCode', label: 'Alias Code', width: '100px', sortable: true },
  { key: 'AliasName', label: 'Alias Name', width: '150px', sortable: true },
  { key: 'Amount', label: 'Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '200px', sortable: true },
  { key: 'PrimaryCostDriver', label: 'Primary Cost Driver', width: '150px', sortable: true }
];

const expenseWiseColumns: TableColumn[] = [
  { key: 'NatureOfData', label: 'Nature of Data', width: '120px', sortable: true },
  { key: 'LedgerCode', label: 'Ledger Code', width: '120px', sortable: true },
  { key: 'LedgerName', label: 'Ledger Name', width: '180px', sortable: true },
  { key: 'AliasName', label: 'Alias Name', width: '150px', sortable: true },
  { key: 'SubCostCentreCode', label: 'Sub Cost Centre Code', width: '150px', sortable: true },
  { key: 'SubCostCentre', label: 'Sub Cost Centre', width: '180px', sortable: true },
  { key: 'Amount', label: 'Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '200px', sortable: true }
];

const variableCostColumns: TableColumn[] = [
  { key: 'PatientType', label: 'Patient Type', width: '100px', sortable: true },
  { key: 'RegNo', label: 'Reg. No.', width: '100px', sortable: true },
  { key: 'IPDNumber', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'BillNo', label: 'Bill No.', width: '100px', sortable: true },
  { key: 'PharmacyChargedToPatient', label: 'Pharmacy', width: '120px', type: 'currency', sortable: true },
  { key: 'MedicalSurgicalConsumables', label: 'Med & Surgical', width: '130px', type: 'currency', sortable: true },
  { key: 'ImplantsAndProsthetics', label: 'Implants', width: '120px', type: 'currency', sortable: true },
  { key: 'NonMedicalConsumables', label: 'Non-Medical', width: '120px', type: 'currency', sortable: true },
  { key: 'FeeForService', label: 'Fee for Service', width: '120px', type: 'currency', sortable: true },
  { key: 'IncentivesToDoctors', label: 'Doctor Incentives', width: '130px', type: 'currency', sortable: true },
  { key: 'PatientFoodBeverages', label: 'Food & Beverages', width: '130px', type: 'currency', sortable: true },
  { key: 'LaboratoryTestOutsource', label: 'Lab Outsource', width: '120px', type: 'currency', sortable: true },
  { key: 'OtherOutsourcedServices1', label: 'Other Outsource 1', width: '140px', type: 'currency', sortable: true },
  { key: 'OtherOutsourcedServices2', label: 'Other Outsource 2', width: '140px', type: 'currency', sortable: true },
  { key: 'OtherOutsourcedServices3', label: 'Other Outsource 3', width: '140px', type: 'currency', sortable: true },
  { key: 'BrokerageCommission', label: 'Brokerage', width: '120px', type: 'currency', sortable: true },
  { key: 'ProvisionForBadDebts', label: 'Bad Debts', width: '120px', type: 'currency', sortable: true },
  { key: 'DoctorName', label: 'Doctor Name', width: '150px', sortable: true },
  { key: 'ServiceName', label: 'Service Name', width: '180px', sortable: true },
  { key: 'PayorType', label: 'Payor Type', width: '100px', sortable: true }
];

const hrColumns: TableColumn[] = [
  { key: 'NatureOfData', label: 'Nature of Data', width: '120px', sortable: true },
  { key: 'GroupName', label: 'Group Name', width: '120px', sortable: true },
  { key: 'SubGroupName', label: 'Sub Group Name', width: '130px', sortable: true },
  { key: 'AssociateName', label: 'Employee Name', width: '150px', sortable: true },
  { key: 'Period', label: 'Period', width: '120px', sortable: true },
  { key: 'Department', label: 'Department', width: '120px', sortable: true },
  { key: 'SubDepartment', label: 'Sub Department', width: '130px', sortable: true },
  { key: 'Designation', label: 'Designation', width: '150px', sortable: true },
  { key: 'WorkingPeriod', label: 'Working Period', width: '120px', sortable: true },
  { key: 'BasicPay', label: 'Basic Pay', width: '120px', type: 'currency', sortable: true },
  { key: 'Allowances', label: 'Allowances', width: '120px', type: 'currency', sortable: true },
  { key: 'OtherBenefits', label: 'Benefits', width: '100px', type: 'currency', sortable: true },
  { key: 'GrossTotal', label: 'Gross Total', width: '120px', type: 'currency', sortable: true },
  { key: 'Deduction', label: 'Deductions', width: '120px', type: 'currency', sortable: true },
  { key: 'NetSalary', label: 'Net Salary', width: '120px', type: 'currency', sortable: true },
  { key: 'Utilization', label: 'Utilization %', width: '120px', type: 'number', sortable: true },
  { key: 'NoOfHeadcount', label: 'Headcount', width: '100px', type: 'number', sortable: true }
];

export function ExpenseTablesNew() {
  const [activeTable, setActiveTable] = useState<'trial-balance' | 'expense-wise' | 'variable-cost' | 'hr'>('trial-balance');
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceNew[]>([]);
  const [expenseWiseData, setExpenseWiseData] = useState<ExpenseWise[]>([]);
  const [variableCostData, setVariableCostData] = useState<VariableCostBillWiseNew[]>([]);
  const [hrData, setHRData] = useState<HRNew[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTrialBalanceData(dummyTrialBalance);
      setExpenseWiseData(dummyExpenseWise);
      setVariableCostData(dummyVariableCostBillWise);
      setHRData(dummyHR);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleRowClick = (row: any) => {
    console.log('Expense row clicked:', row);
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case 'trial-balance':
        return trialBalanceData;
      case 'expense-wise':
        return expenseWiseData;
      case 'variable-cost':
        return variableCostData;
      case 'hr':
        return hrData;
      default:
        return [];
    }
  };

  const getCurrentColumns = () => {
    switch (activeTable) {
      case 'trial-balance':
        return trialBalanceColumns;
      case 'expense-wise':
        return expenseWiseColumns;
      case 'variable-cost':
        return variableCostColumns;
      case 'hr':
        return hrColumns;
      default:
        return [];
    }
  };

  const getTableTitle = () => {
    switch (activeTable) {
      case 'trial-balance':
        return 'Trial Balance';
      case 'expense-wise':
        return 'Expense Wise';
      case 'variable-cost':
        return 'Variable Cost Bill Wise';
      case 'hr':
        return 'HR Salary Sheet';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-primary-900">Expense Data</h2>
          <div className="flex bg-accent-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTable('trial-balance')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'trial-balance'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Trial Balance</span>
            </button>
            <button
              onClick={() => setActiveTable('expense-wise')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'expense-wise'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Expense Wise</span>
            </button>
            <button
              onClick={() => setActiveTable('variable-cost')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'variable-cost'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Variable Cost</span>
            </button>
            <button
              onClick={() => setActiveTable('hr')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'hr'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>HR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Table */}
      <DataTable
        columns={getCurrentColumns()}
        data={getCurrentData()}
        title={getTableTitle()}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        filterable={true}
        exportable={true}
        pageSize={10}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTable === 'trial-balance' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Amount</h3>
              <p className="text-2xl font-bold text-primary-900">
                ${trialBalanceData.reduce((sum, item) => sum + item.Amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Categories</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(trialBalanceData.map(item => item.Category)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Ledgers</h3>
              <p className="text-2xl font-bold text-green-600">{trialBalanceData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Amount</h3>
              <p className="text-2xl font-bold text-purple-600">
                ${trialBalanceData.length > 0 ? Math.round(trialBalanceData.reduce((sum, item) => sum + item.Amount, 0) / trialBalanceData.length).toLocaleString() : 0}
              </p>
            </div>
          </>
        )}

        {activeTable === 'expense-wise' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">
                ${expenseWiseData.reduce((sum, item) => sum + item.Amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Direct Costs</h3>
              <p className="text-2xl font-bold text-green-600">
                ${expenseWiseData.filter(item => item.NatureOfData === 'Direct Cost').reduce((sum, item) => sum + item.Amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Indirect Costs</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${expenseWiseData.filter(item => item.NatureOfData === 'Indirect Cost').reduce((sum, item) => sum + item.Amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Cost Centres</h3>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(expenseWiseData.map(item => item.SubCostCentre)).size}
              </p>
            </div>
          </>
        )}

        {activeTable === 'variable-cost' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Bills</h3>
              <p className="text-2xl font-bold text-primary-900">{variableCostData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Pharmacy</h3>
              <p className="text-2xl font-bold text-green-600">
                ${variableCostData.reduce((sum, item) => sum + item.PharmacyChargedToPatient, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Implants</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${variableCostData.reduce((sum, item) => sum + item.ImplantsAndProsthetics, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">IPD Bills</h3>
              <p className="text-2xl font-bold text-purple-600">
                {variableCostData.filter(item => item.PatientType === 'IPD').length}
              </p>
            </div>
          </>
        )}

        {activeTable === 'hr' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Employees</h3>
              <p className="text-2xl font-bold text-primary-900">{hrData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Gross Pay</h3>
              <p className="text-2xl font-bold text-green-600">
                ${hrData.reduce((sum, item) => sum + item.GrossTotal, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Net Pay</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${hrData.reduce((sum, item) => sum + item.NetSalary, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Utilization</h3>
              <p className="text-2xl font-bold text-purple-600">
                {hrData.length > 0 ? Math.round(hrData.reduce((sum, item) => sum + item.Utilization, 0) / hrData.length) : 0}%
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
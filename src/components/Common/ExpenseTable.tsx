import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from './DataTable';
import { TrialBalance, DoctorShare, VariableCostBillWise, HRSalarySheet } from '../../types/expense';
import { FileText, Users, Calculator, DollarSign } from 'lucide-react';

// Dummy data for Trial Balance
const dummyTrialBalance: TrialBalance[] = [
  {
    Code: 'TB001',
    Ledger: 'Cash Account',
    Alias: 'CASH',
    Date: '2024-01-31',
    Month: 'January',
    PostID: 'P001',
    Desc: 'Monthly cash transactions',
    OpenBal: 500000,
    Debit: 250000,
    Credit: 180000,
    CloseBal: 570000,
    NetBal: 570000,
    Notes: 'Regular operations'
  },
  {
    Code: 'TB002',
    Ledger: 'Medical Equipment',
    Alias: 'MEDEQ',
    Date: '2024-01-31',
    Month: 'January',
    PostID: 'P002',
    Desc: 'Equipment depreciation',
    OpenBal: 2500000,
    Debit: 0,
    Credit: 25000,
    CloseBal: 2475000,
    NetBal: 2475000,
    Notes: 'Monthly depreciation'
  },
  {
    Code: 'TB003',
    Ledger: 'Pharmacy Inventory',
    Alias: 'PHARMA',
    Date: '2024-01-31',
    Month: 'January',
    PostID: 'P003',
    Desc: 'Pharmacy stock valuation',
    OpenBal: 180000,
    Debit: 85000,
    Credit: 92000,
    CloseBal: 173000,
    NetBal: 173000,
    Notes: 'Stock movement'
  },
  {
    Code: 'TB004',
    Ledger: 'Accounts Payable',
    Alias: 'AP',
    Date: '2024-01-31',
    Month: 'January',
    PostID: 'P004',
    Desc: 'Vendor payments',
    OpenBal: 320000,
    Debit: 150000,
    Credit: 180000,
    CloseBal: 350000,
    NetBal: 350000,
    Notes: 'Outstanding payments'
  },
  {
    Code: 'TB005',
    Ledger: 'Revenue Account',
    Alias: 'REV',
    Date: '2024-01-31',
    Month: 'January',
    PostID: 'P005',
    Desc: 'Patient revenue',
    OpenBal: 0,
    Debit: 0,
    Credit: 850000,
    CloseBal: 850000,
    NetBal: 850000,
    Notes: 'Monthly revenue'
  }
];

// Dummy data for Doctor Share
const dummyDoctorShare: DoctorShare[] = [
  {
    Month: 'January',
    DoctorID: 'DOC001',
    DeptCode: 'CARD',
    DeptSpecialty: 'Cardiology',
    DoctorName: 'Dr. Smith',
    ServiceFee: 85000,
    RetainerFee: 25000,
    Incentives: 12000,
    Notes: 'Senior consultant'
  },
  {
    Month: 'January',
    DoctorID: 'DOC002',
    DeptCode: 'ONCO',
    DeptSpecialty: 'Oncology',
    DoctorName: 'Dr. Johnson',
    ServiceFee: 92000,
    RetainerFee: 30000,
    Incentives: 15000,
    Notes: 'Department head'
  },
  {
    Month: 'January',
    DoctorID: 'DOC003',
    DeptCode: 'NEURO',
    DeptSpecialty: 'Neurology',
    DoctorName: 'Dr. Brown',
    ServiceFee: 78000,
    RetainerFee: 22000,
    Incentives: 10000,
    Notes: 'Associate consultant'
  },
  {
    Month: 'January',
    DoctorID: 'DOC004',
    DeptCode: 'GYNEC',
    DeptSpecialty: 'Gynaecology',
    DoctorName: 'Dr. Wilson',
    ServiceFee: 88000,
    RetainerFee: 28000,
    Incentives: 14000,
    Notes: 'Senior specialist'
  },
  {
    Month: 'January',
    DoctorID: 'DOC005',
    DeptCode: 'CARD',
    DeptSpecialty: 'Cardiology',
    DoctorName: 'Dr. Davis',
    ServiceFee: 65000,
    RetainerFee: 18000,
    Incentives: 8000,
    Notes: 'Junior consultant'
  }
];

// Dummy data for Variable Cost Bill wise
const dummyVariableCost: VariableCostBillWise[] = [
  {
    BillNo: 'B001',
    Pharmacy: 8500,
    MedSurgConsumables: 12000,
    ImplantsProsthetics: 25000,
    NonMedConsumables: 1500,
    Fee: 15000,
    DoctorTreating: 18000,
    ServiceTreating: 8000,
    Incentives: 3000,
    DoctorConsultant: 5000,
    ServiceConsultant: 2500,
    FoodOutsource: 1200,
    LabOutsource: 4500,
    ServiceLab: 2000,
    OtherOutsource1: 3000,
    ServiceOther1: 1500,
    OtherOutsource2: 2000,
    ServiceOther2: 1000,
    OtherOutsource3: 1500,
    ServiceOther3: 800,
    BrokerageCommission: 2500,
    BadDebtsProvision: 1000
  },
  {
    BillNo: 'B002',
    Pharmacy: 12000,
    MedSurgConsumables: 18000,
    ImplantsProsthetics: 35000,
    NonMedConsumables: 2000,
    Fee: 22000,
    DoctorTreating: 25000,
    ServiceTreating: 12000,
    Incentives: 4500,
    DoctorConsultant: 8000,
    ServiceConsultant: 4000,
    FoodOutsource: 1800,
    LabOutsource: 6500,
    ServiceLab: 3000,
    OtherOutsource1: 4000,
    ServiceOther1: 2000,
    OtherOutsource2: 3000,
    ServiceOther2: 1500,
    OtherOutsource3: 2000,
    ServiceOther3: 1200,
    BrokerageCommission: 3500,
    BadDebtsProvision: 1500
  },
  {
    BillNo: 'B003',
    Pharmacy: 6500,
    MedSurgConsumables: 9000,
    ImplantsProsthetics: 15000,
    NonMedConsumables: 1000,
    Fee: 12000,
    DoctorTreating: 14000,
    ServiceTreating: 6000,
    Incentives: 2000,
    DoctorConsultant: 4000,
    ServiceConsultant: 2000,
    FoodOutsource: 800,
    LabOutsource: 3000,
    ServiceLab: 1500,
    OtherOutsource1: 2000,
    ServiceOther1: 1000,
    OtherOutsource2: 1500,
    ServiceOther2: 800,
    OtherOutsource3: 1000,
    ServiceOther3: 600,
    BrokerageCommission: 1800,
    BadDebtsProvision: 800
  },
  {
    BillNo: 'B004',
    Pharmacy: 15000,
    MedSurgConsumables: 22000,
    ImplantsProsthetics: 45000,
    NonMedConsumables: 2500,
    Fee: 28000,
    DoctorTreating: 32000,
    ServiceTreating: 15000,
    Incentives: 6000,
    DoctorConsultant: 10000,
    ServiceConsultant: 5000,
    FoodOutsource: 2200,
    LabOutsource: 8000,
    ServiceLab: 4000,
    OtherOutsource1: 5000,
    ServiceOther1: 2500,
    OtherOutsource2: 4000,
    ServiceOther2: 2000,
    OtherOutsource3: 3000,
    ServiceOther3: 1500,
    BrokerageCommission: 4500,
    BadDebtsProvision: 2000
  },
  {
    BillNo: 'B005',
    Pharmacy: 9500,
    MedSurgConsumables: 14000,
    ImplantsProsthetics: 20000,
    NonMedConsumables: 1800,
    Fee: 18000,
    DoctorTreating: 20000,
    ServiceTreating: 9000,
    Incentives: 3500,
    DoctorConsultant: 6000,
    ServiceConsultant: 3000,
    FoodOutsource: 1400,
    LabOutsource: 5000,
    ServiceLab: 2500,
    OtherOutsource1: 3500,
    ServiceOther1: 1800,
    OtherOutsource2: 2500,
    ServiceOther2: 1200,
    OtherOutsource3: 1800,
    ServiceOther3: 1000,
    BrokerageCommission: 2800,
    BadDebtsProvision: 1200
  }
];

// Dummy data for HR Salary Sheet
const dummyHRSalary: HRSalarySheet[] = [
  {
    GroupID: 'GRP001',
    GroupName: 'Medical Staff',
    SubGroupID: 'SG001',
    SubGroupName: 'Doctors',
    EmpID: 'EMP001',
    EmpName: 'Dr. Smith',
    Period: 'January 2024',
    JoinDate: '2020-01-15',
    ResignDate: '',
    Tenure: 4,
    Dept: 'Cardiology',
    SubDept: 'Interventional',
    Title: 'Senior Consultant',
    EffortCat: 'Clinical',
    MasterFlag: true,
    AllocationType: 'Direct',
    EffortAlloc: 100,
    SubEffortAlloc: 80,
    Utilization: 85,
    AvailableHrs: 160,
    ActualHrs: 136,
    CostCentreID: 'CC001',
    CostCentreName: 'Cardiology Dept',
    SubCostCentreID: 'SCC001',
    SubCostCentreName: 'Cath Lab',
    BasicPay: 180000,
    Allowances: 45000,
    Benefits: 25000,
    Overtime: 8000,
    Bonus: 15000,
    EPF: 18000,
    ESIC: 2500,
    OtherContrib: 3000,
    GrossPay: 273000,
    Deductions: 23500,
    NetPay: 249500
  },
  {
    GroupID: 'GRP002',
    GroupName: 'Nursing Staff',
    SubGroupID: 'SG002',
    SubGroupName: 'Staff Nurses',
    EmpID: 'EMP002',
    EmpName: 'Sarah Johnson',
    Period: 'January 2024',
    JoinDate: '2019-03-20',
    ResignDate: '',
    Tenure: 5,
    Dept: 'ICU',
    SubDept: 'Cardiac ICU',
    Title: 'Senior Staff Nurse',
    EffortCat: 'Clinical',
    MasterFlag: false,
    AllocationType: 'Direct',
    EffortAlloc: 100,
    SubEffortAlloc: 100,
    Utilization: 95,
    AvailableHrs: 160,
    ActualHrs: 152,
    CostCentreID: 'CC002',
    CostCentreName: 'ICU',
    SubCostCentreID: 'SCC002',
    SubCostCentreName: 'Cardiac ICU',
    BasicPay: 45000,
    Allowances: 12000,
    Benefits: 8000,
    Overtime: 5000,
    Bonus: 3000,
    EPF: 4500,
    ESIC: 800,
    OtherContrib: 1000,
    GrossPay: 73000,
    Deductions: 6300,
    NetPay: 66700
  },
  {
    GroupID: 'GRP003',
    GroupName: 'Support Staff',
    SubGroupID: 'SG003',
    SubGroupName: 'Technicians',
    EmpID: 'EMP003',
    EmpName: 'Mike Brown',
    Period: 'January 2024',
    JoinDate: '2021-06-10',
    ResignDate: '',
    Tenure: 3,
    Dept: 'Radiology',
    SubDept: 'CT Scan',
    Title: 'Senior Technician',
    EffortCat: 'Technical',
    MasterFlag: false,
    AllocationType: 'Indirect',
    EffortAlloc: 80,
    SubEffortAlloc: 60,
    Utilization: 90,
    AvailableHrs: 160,
    ActualHrs: 144,
    CostCentreID: 'CC003',
    CostCentreName: 'Radiology',
    SubCostCentreID: 'SCC003',
    SubCostCentreName: 'CT Scan Unit',
    BasicPay: 35000,
    Allowances: 8000,
    Benefits: 5000,
    Overtime: 3000,
    Bonus: 2000,
    EPF: 3500,
    ESIC: 600,
    OtherContrib: 800,
    GrossPay: 53000,
    Deductions: 4900,
    NetPay: 48100
  },
  {
    GroupID: 'GRP001',
    GroupName: 'Medical Staff',
    SubGroupID: 'SG001',
    SubGroupName: 'Doctors',
    EmpID: 'EMP004',
    EmpName: 'Dr. Wilson',
    Period: 'January 2024',
    JoinDate: '2018-09-01',
    ResignDate: '',
    Tenure: 5,
    Dept: 'Oncology',
    SubDept: 'Medical Oncology',
    Title: 'Consultant',
    EffortCat: 'Clinical',
    MasterFlag: true,
    AllocationType: 'Direct',
    EffortAlloc: 100,
    SubEffortAlloc: 90,
    Utilization: 88,
    AvailableHrs: 160,
    ActualHrs: 141,
    CostCentreID: 'CC004',
    CostCentreName: 'Oncology Dept',
    SubCostCentreID: 'SCC004',
    SubCostCentreName: 'Chemo Unit',
    BasicPay: 160000,
    Allowances: 40000,
    Benefits: 22000,
    Overtime: 6000,
    Bonus: 12000,
    EPF: 16000,
    ESIC: 2200,
    OtherContrib: 2800,
    GrossPay: 240000,
    Deductions: 21000,
    NetPay: 219000
  },
  {
    GroupID: 'GRP004',
    GroupName: 'Administrative',
    SubGroupID: 'SG004',
    SubGroupName: 'Finance',
    EmpID: 'EMP005',
    EmpName: 'Lisa Davis',
    Period: 'January 2024',
    JoinDate: '2020-11-15',
    ResignDate: '',
    Tenure: 3,
    Dept: 'Finance',
    SubDept: 'Accounts',
    Title: 'Finance Manager',
    EffortCat: 'Administrative',
    MasterFlag: false,
    AllocationType: 'Indirect',
    EffortAlloc: 100,
    SubEffortAlloc: 100,
    Utilization: 92,
    AvailableHrs: 160,
    ActualHrs: 147,
    CostCentreID: 'CC005',
    CostCentreName: 'Administration',
    SubCostCentreID: 'SCC005',
    SubCostCentreName: 'Finance Dept',
    BasicPay: 75000,
    Allowances: 18000,
    Benefits: 12000,
    Overtime: 4000,
    Bonus: 6000,
    EPF: 7500,
    ESIC: 1200,
    OtherContrib: 1500,
    GrossPay: 115000,
    Deductions: 10200,
    NetPay: 104800
  }
];

// Column definitions for each table
const trialBalanceColumns: TableColumn[] = [
  { key: 'Code', label: 'Code', width: '80px', sortable: true },
  { key: 'Ledger', label: 'Ledger', width: '150px', sortable: true },
  { key: 'Alias', label: 'Alias', width: '80px', sortable: true },
  { key: 'Date', label: 'Date', width: '100px', type: 'date', sortable: true },
  { key: 'Month', label: 'Month', width: '100px', sortable: true },
  { key: 'PostID', label: 'Post ID', width: '80px', sortable: true },
  { key: 'Desc', label: 'Description', width: '150px', sortable: true },
  { key: 'OpenBal', label: 'Open Bal', width: '100px', type: 'currency', sortable: true },
  { key: 'Debit', label: 'Debit', width: '100px', type: 'currency', sortable: true },
  { key: 'Credit', label: 'Credit', width: '100px', type: 'currency', sortable: true },
  { key: 'CloseBal', label: 'Close Bal', width: '100px', type: 'currency', sortable: true },
  { key: 'NetBal', label: 'Net Bal', width: '100px', type: 'currency', sortable: true },
  { key: 'Notes', label: 'Notes', width: '120px', sortable: true }
];

const doctorShareColumns: TableColumn[] = [
  { key: 'Month', label: 'Month', width: '100px', sortable: true },
  { key: 'DoctorID', label: 'Doctor ID', width: '100px', sortable: true },
  { key: 'DeptCode', label: 'Dept Code', width: '100px', sortable: true },
  { key: 'DeptSpecialty', label: 'Dept / Specialty', width: '150px', sortable: true },
  { key: 'DoctorName', label: 'Doctor Name', width: '150px', sortable: true },
  { key: 'ServiceFee', label: 'Service Fee', width: '120px', type: 'currency', sortable: true },
  { key: 'RetainerFee', label: 'Retainer Fee', width: '120px', type: 'currency', sortable: true },
  { key: 'Incentives', label: 'Incentives', width: '120px', type: 'currency', sortable: true },
  { key: 'Notes', label: 'Notes', width: '120px', sortable: true }
];

const variableCostColumns: TableColumn[] = [
  { key: 'BillNo', label: 'Bill No', width: '100px', sortable: true },
  { key: 'Pharmacy', label: 'Pharmacy', width: '100px', type: 'currency', sortable: true },
  { key: 'MedSurgConsumables', label: 'Med & Surg', width: '120px', type: 'currency', sortable: true },
  { key: 'ImplantsProsthetics', label: 'Implants', width: '100px', type: 'currency', sortable: true },
  { key: 'NonMedConsumables', label: 'Non-Med', width: '100px', type: 'currency', sortable: true },
  { key: 'Fee', label: 'Fee', width: '80px', type: 'currency', sortable: true },
  { key: 'DoctorTreating', label: 'Doc (Treating)', width: '120px', type: 'currency', sortable: true },
  { key: 'ServiceTreating', label: 'Service (Treating)', width: '130px', type: 'currency', sortable: true },
  { key: 'Incentives', label: 'Incentives', width: '100px', type: 'currency', sortable: true },
  { key: 'DoctorConsultant', label: 'Doc (Consultant)', width: '130px', type: 'currency', sortable: true },
  { key: 'ServiceConsultant', label: 'Service (Consultant)', width: '140px', type: 'currency', sortable: true },
  { key: 'FoodOutsource', label: 'Food Outsource', width: '120px', type: 'currency', sortable: true },
  { key: 'LabOutsource', label: 'Lab Outsource', width: '120px', type: 'currency', sortable: true },
  { key: 'BrokerageCommission', label: 'Brokerage', width: '100px', type: 'currency', sortable: true },
  { key: 'BadDebtsProvision', label: 'Bad Debts', width: '100px', type: 'currency', sortable: true }
];

const hrSalaryColumns: TableColumn[] = [
  { key: 'EmpID', label: 'Emp ID', width: '80px', sortable: true },
  { key: 'EmpName', label: 'Employee Name', width: '150px', sortable: true },
  { key: 'Period', label: 'Period', width: '120px', sortable: true },
  { key: 'Dept', label: 'Department', width: '120px', sortable: true },
  { key: 'SubDept', label: 'Sub Dept', width: '120px', sortable: true },
  { key: 'Title', label: 'Title', width: '150px', sortable: true },
  { key: 'Tenure', label: 'Tenure', width: '80px', type: 'number', sortable: true },
  { key: 'BasicPay', label: 'Basic Pay', width: '120px', type: 'currency', sortable: true },
  { key: 'Allowances', label: 'Allowances', width: '120px', type: 'currency', sortable: true },
  { key: 'Benefits', label: 'Benefits', width: '100px', type: 'currency', sortable: true },
  { key: 'GrossPay', label: 'Gross Pay', width: '120px', type: 'currency', sortable: true },
  { key: 'Deductions', label: 'Deductions', width: '120px', type: 'currency', sortable: true },
  { key: 'NetPay', label: 'Net Pay', width: '120px', type: 'currency', sortable: true },
  { key: 'Utilization', label: 'Utilization %', width: '120px', type: 'number', sortable: true }
];

export function ExpenseTable() {
  const [activeTable, setActiveTable] = useState<'trial-balance' | 'doctor-share' | 'variable-cost' | 'hr-salary'>('trial-balance');
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalance[]>([]);
  const [doctorShareData, setDoctorShareData] = useState<DoctorShare[]>([]);
  const [variableCostData, setVariableCostData] = useState<VariableCostBillWise[]>([]);
  const [hrSalaryData, setHRSalaryData] = useState<HRSalarySheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTrialBalanceData(dummyTrialBalance);
      setDoctorShareData(dummyDoctorShare);
      setVariableCostData(dummyVariableCost);
      setHRSalaryData(dummyHRSalary);
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
      case 'doctor-share':
        return doctorShareData;
      case 'variable-cost':
        return variableCostData;
      case 'hr-salary':
        return hrSalaryData;
      default:
        return [];
    }
  };

  const getCurrentColumns = () => {
    switch (activeTable) {
      case 'trial-balance':
        return trialBalanceColumns;
      case 'doctor-share':
        return doctorShareColumns;
      case 'variable-cost':
        return variableCostColumns;
      case 'hr-salary':
        return hrSalaryColumns;
      default:
        return [];
    }
  };

  const getTableTitle = () => {
    switch (activeTable) {
      case 'trial-balance':
        return 'Trial Balance';
      case 'doctor-share':
        return 'Doctor Share';
      case 'variable-cost':
        return 'Variable Cost Bill wise';
      case 'hr-salary':
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
              onClick={() => setActiveTable('doctor-share')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'doctor-share'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Doctor Share</span>
            </button>
            <button
              onClick={() => setActiveTable('variable-cost')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'variable-cost'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Variable Cost</span>
            </button>
            <button
              onClick={() => setActiveTable('hr-salary')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'hr-salary'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>HR Salary</span>
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
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Debits</h3>
              <p className="text-2xl font-bold text-green-600">
                ${trialBalanceData.reduce((sum, item) => sum + item.Debit, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Credits</h3>
              <p className="text-2xl font-bold text-red-600">
                ${trialBalanceData.reduce((sum, item) => sum + item.Credit, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Net Balance</h3>
              <p className="text-2xl font-bold text-primary-900">
                ${trialBalanceData.reduce((sum, item) => sum + item.NetBal, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Accounts</h3>
              <p className="text-2xl font-bold text-blue-600">{trialBalanceData.length}</p>
            </div>
          </>
        )}

        {activeTable === 'doctor-share' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Service Fees</h3>
              <p className="text-2xl font-bold text-green-600">
                ${doctorShareData.reduce((sum, item) => sum + item.ServiceFee, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Retainer</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${doctorShareData.reduce((sum, item) => sum + item.RetainerFee, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Incentives</h3>
              <p className="text-2xl font-bold text-purple-600">
                ${doctorShareData.reduce((sum, item) => sum + item.Incentives, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Active Doctors</h3>
              <p className="text-2xl font-bold text-primary-900">{doctorShareData.length}</p>
            </div>
          </>
        )}

        {activeTable === 'variable-cost' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Pharmacy</h3>
              <p className="text-2xl font-bold text-green-600">
                ${variableCostData.reduce((sum, item) => sum + item.Pharmacy, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Implants</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${variableCostData.reduce((sum, item) => sum + item.ImplantsProsthetics, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Doctor Fees</h3>
              <p className="text-2xl font-bold text-purple-600">
                ${variableCostData.reduce((sum, item) => sum + item.DoctorTreating + item.DoctorConsultant, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Bills</h3>
              <p className="text-2xl font-bold text-primary-900">{variableCostData.length}</p>
            </div>
          </>
        )}

        {activeTable === 'hr-salary' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Gross Pay</h3>
              <p className="text-2xl font-bold text-green-600">
                ${hrSalaryData.reduce((sum, item) => sum + item.GrossPay, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Net Pay</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${hrSalaryData.reduce((sum, item) => sum + item.NetPay, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Deductions</h3>
              <p className="text-2xl font-bold text-red-600">
                ${hrSalaryData.reduce((sum, item) => sum + item.Deductions, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Employees</h3>
              <p className="text-2xl font-bold text-primary-900">{hrSalaryData.length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
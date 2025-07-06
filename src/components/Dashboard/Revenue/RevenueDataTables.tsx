import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../../Common/DataTable';
import { BillRegister, PatientServiceRegister } from '../../../types/revenue';
import { FileText, Activity, Plus } from 'lucide-react';

// Dummy data for demonstration
const dummyBillRegister: BillRegister[] = [
  {
    UHID: 'UH001',
    IPD_No: 'IPD2024001',
    Bill_No: 'B001',
    City_State: 'Mumbai, MH',
    Gender_Age: 'M/45',
    Admission_Date: '2024-01-15',
    Discharge_Date: '2024-01-20',
    Doctor_ID: 'DOC001',
    Dept_Code: 'CARD',
    Dept_Name: 'Cardiology',
    Doctor_Name: 'Dr. Smith',
    Bill_Type: 'IPD',
    Bill_Month: 'January',
    Patient_Category: 'General',
    Gross_Bill: 125000,
    Discount_Amount: 5000,
    Net_Bill: 120000,
    ICU_Days: 2,
    NonICU_Days: 3,
    Payor_Type: 'Insurance',
    Insurance_Name: 'Star Health',
    Payment_Mode: 'Credit',
    Billing_Category: 'Credit',
    CoPay1: 'Patient',
    CoPay1_Amount: 10000,
    CoPay2: 'Insurance',
    CoPay2_Amount: 110000,
    CoPay3: '',
    CoPay3_Amount: 0,
    CoPay4: '',
    CoPay4_Amount: 0
  },
  {
    UHID: 'UH002',
    IPD_No: 'IPD2024002',
    Bill_No: 'B002',
    City_State: 'Delhi, DL',
    Gender_Age: 'F/32',
    Admission_Date: '2024-01-18',
    Discharge_Date: '2024-01-22',
    Doctor_ID: 'DOC002',
    Dept_Code: 'ONCO',
    Dept_Name: 'Oncology',
    Doctor_Name: 'Dr. Johnson',
    Bill_Type: 'IPD',
    Bill_Month: 'January',
    Patient_Category: 'VIP',
    Gross_Bill: 180000,
    Discount_Amount: 8000,
    Net_Bill: 172000,
    ICU_Days: 1,
    NonICU_Days: 4,
    Payor_Type: 'Cash',
    Insurance_Name: '',
    Payment_Mode: 'Cash',
    Billing_Category: 'Cash',
    CoPay1: 'Patient',
    CoPay1_Amount: 172000,
    CoPay2: '',
    CoPay2_Amount: 0,
    CoPay3: '',
    CoPay3_Amount: 0,
    CoPay4: '',
    CoPay4_Amount: 0
  }
];

const dummyPatientServiceRegister: PatientServiceRegister[] = [
  {
    SerialNo: 'S001',
    IPDNo: 'IPD2024001',
    AdmitDocID: 'DOC001',
    AdmitDeptCode: 'CARD',
    AdmitDeptName: 'Cardiology',
    AdmitDocName: 'Dr. Smith',
    PerformDocID: 'DOC001',
    PerformDocName: 'Dr. Smith',
    PerformDeptCode: 'CARD',
    PerformDeptName: 'Cardiology',
    ReferringDocID: 'DOC003',
    ReferringDocName: 'Dr. Brown',
    ReferringDeptCode: 'GEN',
    ReferringDeptName: 'General Medicine',
    FinalBillDate: '2024-01-20',
    BillNo: 'B001',
    ServiceCode: 'ECHO001',
    ServiceName: 'Echocardiography',
    ServiceDeptID: 'CARD',
    ServiceDeptName: 'Cardiology',
    ServiceSubDeptID: 'ECHO',
    ServiceSubDeptName: 'Echo Lab',
    ServiceStatus: 'Completed',
    IsPackaged: false,
    IsOutsourced: false,
    Quantity: 1,
    GrossAmount: 8500,
    Discount: 500,
    NetAmount: 8000,
    EmergencyChargeApplied: false,
    PerformDocShare: 1700,
    PharmaMaterialCost: 200,
    OutsourceShare: 0,
    SubCostCenterCode: 'CC001',
    ServiceLocation: 'Echo Lab',
    ServiceDate: '2024-01-16'
  },
  {
    SerialNo: 'S002',
    IPDNo: 'IPD2024001',
    AdmitDocID: 'DOC001',
    AdmitDeptCode: 'CARD',
    AdmitDeptName: 'Cardiology',
    AdmitDocName: 'Dr. Smith',
    PerformDocID: 'DOC004',
    PerformDocName: 'Dr. Wilson',
    PerformDeptCode: 'RAD',
    PerformDeptName: 'Radiology',
    ReferringDocID: 'DOC001',
    ReferringDocName: 'Dr. Smith',
    ReferringDeptCode: 'CARD',
    ReferringDeptName: 'Cardiology',
    FinalBillDate: '2024-01-20',
    BillNo: 'B001',
    ServiceCode: 'CT001',
    ServiceName: 'CT Scan Chest',
    ServiceDeptID: 'RAD',
    ServiceDeptName: 'Radiology',
    ServiceSubDeptID: 'CT',
    ServiceSubDeptName: 'CT Scan',
    ServiceStatus: 'Completed',
    IsPackaged: false,
    IsOutsourced: true,
    Quantity: 1,
    GrossAmount: 12000,
    Discount: 1000,
    NetAmount: 11000,
    EmergencyChargeApplied: false,
    PerformDocShare: 2200,
    PharmaMaterialCost: 0,
    OutsourceShare: 3000,
    SubCostCenterCode: 'CC002',
    ServiceLocation: 'Radiology',
    ServiceDate: '2024-01-17'
  }
];

const billRegisterColumns: TableColumn[] = [
  { key: 'UHID', label: 'UHID', width: '100px', sortable: true },
  { key: 'IPD_No', label: 'IPD No', width: '120px', sortable: true },
  { key: 'Bill_No', label: 'Bill No', width: '100px', sortable: true },
  { key: 'Patient_Category', label: 'Category', width: '100px', sortable: true },
  { key: 'Doctor_Name', label: 'Doctor', width: '150px', sortable: true },
  { key: 'Dept_Name', label: 'Department', width: '120px', sortable: true },
  { key: 'Admission_Date', label: 'Admission', width: '120px', type: 'date', sortable: true },
  { key: 'Discharge_Date', label: 'Discharge', width: '120px', type: 'date', sortable: true },
  { key: 'Gross_Bill', label: 'Gross Bill', width: '120px', type: 'currency', sortable: true },
  { key: 'Discount_Amount', label: 'Discount', width: '100px', type: 'currency', sortable: true },
  { key: 'Net_Bill', label: 'Net Bill', width: '120px', type: 'currency', sortable: true },
  { key: 'ICU_Days', label: 'ICU Days', width: '80px', type: 'number', sortable: true },
  { key: 'NonICU_Days', label: 'Non-ICU Days', width: '100px', type: 'number', sortable: true },
  { key: 'Payment_Mode', label: 'Payment', width: '100px', sortable: true },
  { key: 'Insurance_Name', label: 'Insurance', width: '120px', sortable: true }
];

const patientServiceColumns: TableColumn[] = [
  { key: 'SerialNo', label: 'Serial No', width: '100px', sortable: true },
  { key: 'IPDNo', label: 'IPD No', width: '120px', sortable: true },
  { key: 'ServiceCode', label: 'Service Code', width: '120px', sortable: true },
  { key: 'ServiceName', label: 'Service Name', width: '200px', sortable: true },
  { key: 'PerformDocName', label: 'Performing Doctor', width: '150px', sortable: true },
  { key: 'ServiceDeptName', label: 'Department', width: '120px', sortable: true },
  { key: 'ServiceDate', label: 'Service Date', width: '120px', type: 'date', sortable: true },
  { key: 'Quantity', label: 'Qty', width: '60px', type: 'number', sortable: true },
  { key: 'GrossAmount', label: 'Gross Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'Discount', label: 'Discount', width: '100px', type: 'currency', sortable: true },
  { key: 'NetAmount', label: 'Net Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'PerformDocShare', label: 'Doc Share', width: '100px', type: 'currency', sortable: true },
  { key: 'PharmaMaterialCost', label: 'Material Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'IsOutsourced', label: 'Outsourced', width: '100px', sortable: true },
  { key: 'ServiceStatus', label: 'Status', width: '100px', sortable: true }
];

export function RevenueDataTables() {
  const [activeTable, setActiveTable] = useState<'bill-register' | 'patient-service'>('bill-register');
  const [billData, setBillData] = useState<BillRegister[]>([]);
  const [serviceData, setServiceData] = useState<PatientServiceRegister[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setBillData(dummyBillRegister);
      setServiceData(dummyPatientServiceRegister);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    // Handle row click - could open a modal or navigate to detail view
  };

  return (
    <div className="space-y-6">
      {/* Table Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-primary-900">Revenue Data</h2>
          <div className="flex bg-accent-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTable('bill-register')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'bill-register'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Bill Register</span>
            </button>
            <button
              onClick={() => setActiveTable('patient-service')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'patient-service'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Patient Service Register</span>
            </button>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add New Record</span>
        </button>
      </div>

      {/* Active Table */}
      {activeTable === 'bill-register' ? (
        <DataTable
          columns={billRegisterColumns}
          data={billData}
          title="Bill Register"
          isLoading={isLoading}
          onRowClick={handleRowClick}
          searchable={true}
          filterable={true}
          exportable={true}
          pageSize={10}
        />
      ) : (
        <DataTable
          columns={patientServiceColumns}
          data={serviceData}
          title="Patient Service Register"
          isLoading={isLoading}
          onRowClick={handleRowClick}
          searchable={true}
          filterable={true}
          exportable={true}
          pageSize={10}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Bills</h3>
          <p className="text-2xl font-bold text-primary-900">{billData.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ${billData.reduce((sum, bill) => sum + bill.Net_Bill, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Services</h3>
          <p className="text-2xl font-bold text-primary-900">{serviceData.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Bill Value</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${billData.length > 0 ? Math.round(billData.reduce((sum, bill) => sum + bill.Net_Bill, 0) / billData.length).toLocaleString() : 0}
          </p>
        </div>
      </div>
    </div>
  );
}
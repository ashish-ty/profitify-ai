import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../../Common/DataTable';
import { ServiceRegister } from '../../../types/revenue';

// Dummy data for Service Register
const dummyServiceRegister: ServiceRegister[] = [
  {
    DateOfFinalBill: '15/01/24',
    Month: 'January',
    BillNo: 'B001',
    PatientType: 'IPD',
    RegNo: 'REG001',
    IPDNumber: 'IPD2024001',
    PayorType: 'Insurance',
    PayorAliasName: 'Star Health',
    AdmittingDoctorName: 'Dr. Smith',
    AdmittingDoctorDepartment: 'Cardiology',
    PerformingDoctorName: 'Dr. Smith',
    PerformingDoctorDepartment: 'Cardiology',
    ReferingDoctorName: 'Dr. Brown',
    ReferingDoctorDepartment: 'General Medicine',
    ServiceName: 'Echocardiography',
    ServiceDepartment: 'Cardiology',
    ServiceSubDepartment: 'Echo Lab',
    ServiceStatus: 'Active',
    IsPackaged: 'No',
    IsOutsourced: 'No',
    Quantity: 1,
    GrossAmount: 8500,
    Discount: 500,
    NetAmount: 8000,
    EmergencyCharges: 'No',
    PerformingDoctorShare: 1700,
    PharmacyMaterialCost: 200,
    OutsourceShare: 0,
    SubCostCentreCode: 'CC001',
    SubCostCentreName: 'Echo Lab',
    ServiceTAT: '2 hours',
    ServiceDate: '16/01/24'
  },
  {
    DateOfFinalBill: '20/01/24',
    Month: 'January',
    BillNo: 'B002',
    PatientType: 'IPD',
    RegNo: 'REG002',
    IPDNumber: 'IPD2024002',
    PayorType: 'Cash',
    PayorAliasName: 'Self Pay',
    AdmittingDoctorName: 'Dr. Johnson',
    AdmittingDoctorDepartment: 'Oncology',
    PerformingDoctorName: 'Dr. Wilson',
    PerformingDoctorDepartment: 'Radiology',
    ReferingDoctorName: 'Dr. Johnson',
    ReferingDoctorDepartment: 'Oncology',
    ServiceName: 'CT Scan Chest',
    ServiceDepartment: 'Radiology',
    ServiceSubDepartment: 'CT Scan',
    ServiceStatus: 'Active',
    IsPackaged: 'No',
    IsOutsourced: 'Yes',
    Quantity: 1,
    GrossAmount: 12000,
    Discount: 1000,
    NetAmount: 11000,
    EmergencyCharges: 'No',
    PerformingDoctorShare: 2200,
    PharmacyMaterialCost: 0,
    OutsourceShare: 3000,
    SubCostCentreCode: 'CC002',
    SubCostCentreName: 'Radiology',
    ServiceTAT: '4 hours',
    ServiceDate: '17/01/24'
  },
  {
    DateOfFinalBill: '25/01/24',
    Month: 'January',
    BillNo: 'B003',
    PatientType: 'OPD',
    RegNo: 'REG003',
    IPDNumber: '',
    PayorType: 'Insurance',
    PayorAliasName: 'HDFC ERGO',
    AdmittingDoctorName: 'Dr. Wilson',
    AdmittingDoctorDepartment: 'Gynaecology',
    PerformingDoctorName: 'Dr. Wilson',
    PerformingDoctorDepartment: 'Gynaecology',
    ReferingDoctorName: '',
    ReferingDoctorDepartment: '',
    ServiceName: 'Ultrasound Pelvis',
    ServiceDepartment: 'Gynaecology',
    ServiceSubDepartment: 'Ultrasound',
    ServiceStatus: 'Active',
    IsPackaged: 'No',
    IsOutsourced: 'No',
    Quantity: 1,
    GrossAmount: 3500,
    Discount: 200,
    NetAmount: 3300,
    EmergencyCharges: 'No',
    PerformingDoctorShare: 700,
    PharmacyMaterialCost: 50,
    OutsourceShare: 0,
    SubCostCentreCode: 'CC004',
    SubCostCentreName: 'OPD',
    ServiceTAT: '30 minutes',
    ServiceDate: '25/01/24'
  },
  {
    DateOfFinalBill: '28/01/24',
    Month: 'January',
    BillNo: 'B004',
    PatientType: 'OPD',
    RegNo: 'REG004',
    IPDNumber: '',
    PayorType: 'Cash',
    PayorAliasName: 'Self Pay',
    AdmittingDoctorName: 'Dr. Brown',
    AdmittingDoctorDepartment: 'Neurology',
    PerformingDoctorName: 'Dr. Miller',
    PerformingDoctorDepartment: 'Laboratory',
    ReferingDoctorName: 'Dr. Brown',
    ReferingDoctorDepartment: 'Neurology',
    ServiceName: 'MRI Brain',
    ServiceDepartment: 'Radiology',
    ServiceSubDepartment: 'MRI Unit',
    ServiceStatus: 'Active',
    IsPackaged: 'Yes',
    IsOutsourced: 'No',
    Quantity: 1,
    GrossAmount: 15000,
    Discount: 1000,
    NetAmount: 14000,
    EmergencyCharges: 'Yes',
    PerformingDoctorShare: 3000,
    PharmacyMaterialCost: 0,
    OutsourceShare: 0,
    SubCostCentreCode: 'CC003',
    SubCostCentreName: 'MRI Unit',
    ServiceTAT: '6 hours',
    ServiceDate: '23/01/24'
  },
  {
    DateOfFinalBill: '30/01/24',
    Month: 'January',
    BillNo: 'B005',
    PatientType: 'IPD',
    RegNo: 'REG005',
    IPDNumber: 'IPD2024005',
    PayorType: 'Insurance',
    PayorAliasName: 'LIC Health',
    AdmittingDoctorName: 'Dr. Davis',
    AdmittingDoctorDepartment: 'Cardiology',
    PerformingDoctorName: 'Dr. Davis',
    PerformingDoctorDepartment: 'Cardiology',
    ReferingDoctorName: 'Dr. Kumar',
    ReferingDoctorDepartment: 'Emergency',
    ServiceName: 'Angioplasty',
    ServiceDepartment: 'Cardiology',
    ServiceSubDepartment: 'Cath Lab',
    ServiceStatus: 'Active',
    IsPackaged: 'No',
    IsOutsourced: 'No',
    Quantity: 1,
    GrossAmount: 85000,
    Discount: 5000,
    NetAmount: 80000,
    EmergencyCharges: 'Yes',
    PerformingDoctorShare: 17000,
    PharmacyMaterialCost: 25000,
    OutsourceShare: 0,
    SubCostCentreCode: 'CC006',
    SubCostCentreName: 'Cath Lab',
    ServiceTAT: '3 hours',
    ServiceDate: '26/01/24'
  }
];

const serviceRegisterColumns: TableColumn[] = [
  { key: 'DateOfFinalBill', label: 'Final Bill Date', width: '120px', sortable: true },
  { key: 'Month', label: 'Month', width: '100px', sortable: true },
  { key: 'BillNo', label: 'Bill No.', width: '100px', sortable: true },
  { key: 'PatientType', label: 'Patient Type', width: '100px', sortable: true },
  { key: 'RegNo', label: 'Reg. No.', width: '100px', sortable: true },
  { key: 'IPDNumber', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'PayorType', label: 'Payor Type', width: '100px', sortable: true },
  { key: 'PayorAliasName', label: 'Payor Name', width: '120px', sortable: true },
  { key: 'AdmittingDoctorName', label: 'Admitting Doctor', width: '150px', sortable: true },
  { key: 'AdmittingDoctorDepartment', label: 'Admitting Dept', width: '130px', sortable: true },
  { key: 'PerformingDoctorName', label: 'Performing Doctor', width: '150px', sortable: true },
  { key: 'PerformingDoctorDepartment', label: 'Performing Dept', width: '130px', sortable: true },
  { key: 'ReferingDoctorName', label: 'Referring Doctor', width: '150px', sortable: true },
  { key: 'ReferingDoctorDepartment', label: 'Referring Dept', width: '130px', sortable: true },
  { key: 'ServiceName', label: 'Service Name', width: '180px', sortable: true },
  { key: 'ServiceDepartment', label: 'Service Dept', width: '120px', sortable: true },
  { key: 'ServiceSubDepartment', label: 'Service Sub Dept', width: '130px', sortable: true },
  { key: 'ServiceStatus', label: 'Status', width: '80px', sortable: true },
  { key: 'IsPackaged', label: 'Packaged', width: '80px', sortable: true },
  { key: 'IsOutsourced', label: 'Outsourced', width: '90px', sortable: true },
  { key: 'Quantity', label: 'Quantity', width: '80px', type: 'number', sortable: true },
  { key: 'GrossAmount', label: 'Gross Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'Discount', label: 'Discount', width: '100px', type: 'currency', sortable: true },
  { key: 'NetAmount', label: 'Net Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'EmergencyCharges', label: 'Emergency', width: '90px', sortable: true },
  { key: 'PerformingDoctorShare', label: 'Doctor Share', width: '120px', type: 'currency', sortable: true },
  { key: 'PharmacyMaterialCost', label: 'Material Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'OutsourceShare', label: 'Outsource Share', width: '130px', type: 'currency', sortable: true },
  { key: 'SubCostCentreCode', label: 'Cost Centre Code', width: '130px', sortable: true },
  { key: 'SubCostCentreName', label: 'Cost Centre Name', width: '130px', sortable: true },
  { key: 'ServiceTAT', label: 'Service TAT', width: '100px', sortable: true },
  { key: 'ServiceDate', label: 'Service Date', width: '120px', sortable: true }
];

export function ServiceRegisterTable() {
  const [serviceData, setServiceData] = useState<ServiceRegister[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setServiceData(dummyServiceRegister);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleRowClick = (row: ServiceRegister) => {
    console.log('Service register row clicked:', row);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">Service Register</h2>
      </div>

      <DataTable
        columns={serviceRegisterColumns}
        data={serviceData}
        title="Service Register"
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        filterable={true}
        exportable={true}
        pageSize={10}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Services</h3>
          <p className="text-2xl font-bold text-primary-900">{serviceData.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ${serviceData.reduce((sum, service) => sum + service.NetAmount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Outsourced Services</h3>
          <p className="text-2xl font-bold text-blue-600">
            {serviceData.filter(service => service.IsOutsourced === 'Yes').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Emergency Services</h3>
          <p className="text-2xl font-bold text-red-600">
            {serviceData.filter(service => service.EmergencyCharges === 'Yes').length}
          </p>
        </div>
      </div>
    </div>
  );
}
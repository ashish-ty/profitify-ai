import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from './DataTable';
import { OTCathLabRegister, OccupancyRegister, PowerConsumption } from '../../types/metadata';
import { Activity, Bed, Zap } from 'lucide-react';

// Dummy data for OT-Cath Lab Register
const dummyOTCathLab: OTCathLabRegister[] = [
  {
    No: 'OT001',
    UHID: 'UH001',
    BillNo: 'B001',
    AdmissionDate: '2024-01-15',
    DischargeDate: '2024-01-20',
    IPDNo: 'IPD2024001',
    ServiceDate: '2024-01-16',
    ServiceName: 'Cardiac Catheterization',
    DoctorID: 'DOC001',
    DoctorName: 'Dr. Smith',
    DeptCode: 'CARD',
    Department: 'Cardiology',
    Anesthetist: 'Dr. Anesthesia',
    AnesthesiaCode: 'GA001',
    AnesthesiaType: 'General',
    ProcedureType: 'Interventional',
    ProcedureNature: 'Elective',
    OTCode: 'OT01',
    OTName: 'Cath Lab 1',
    OnTable: '09:00',
    IncisionTime: '09:15',
    FinishTime: '11:30',
    ProcedureTime: 135,
    ChangeoverTime: 30,
    TotalTime: 165,
    Remarks: 'Successful procedure'
  },
  {
    No: 'OT002',
    UHID: 'UH002',
    BillNo: 'B002',
    AdmissionDate: '2024-01-18',
    DischargeDate: '2024-01-22',
    IPDNo: 'IPD2024002',
    ServiceDate: '2024-01-19',
    ServiceName: 'Angioplasty',
    DoctorID: 'DOC001',
    DoctorName: 'Dr. Smith',
    DeptCode: 'CARD',
    Department: 'Cardiology',
    Anesthetist: 'Dr. Anesthesia',
    AnesthesiaCode: 'LA001',
    AnesthesiaType: 'Local',
    ProcedureType: 'Interventional',
    ProcedureNature: 'Emergency',
    OTCode: 'OT01',
    OTName: 'Cath Lab 1',
    OnTable: '14:00',
    IncisionTime: '14:10',
    FinishTime: '16:45',
    ProcedureTime: 155,
    ChangeoverTime: 25,
    TotalTime: 180,
    Remarks: 'Emergency procedure completed'
  },
  {
    No: 'OT003',
    UHID: 'UH003',
    BillNo: 'B003',
    AdmissionDate: '2024-01-20',
    DischargeDate: '2024-01-25',
    IPDNo: 'IPD2024003',
    ServiceDate: '2024-01-21',
    ServiceName: 'Pacemaker Implantation',
    DoctorID: 'DOC002',
    DoctorName: 'Dr. Johnson',
    DeptCode: 'CARD',
    Department: 'Cardiology',
    Anesthetist: 'Dr. Anesthesia2',
    AnesthesiaCode: 'LA002',
    AnesthesiaType: 'Local',
    ProcedureType: 'Implantation',
    ProcedureNature: 'Elective',
    OTCode: 'OT02',
    OTName: 'Cath Lab 2',
    OnTable: '10:30',
    IncisionTime: '10:45',
    FinishTime: '12:15',
    ProcedureTime: 90,
    ChangeoverTime: 20,
    TotalTime: 110,
    Remarks: 'Pacemaker implanted successfully'
  },
  {
    No: 'OT004',
    UHID: 'UH004',
    BillNo: 'B004',
    AdmissionDate: '2024-01-22',
    DischargeDate: '2024-01-27',
    IPDNo: 'IPD2024004',
    ServiceDate: '2024-01-23',
    ServiceName: 'Coronary Bypass',
    DoctorID: 'DOC003',
    DoctorName: 'Dr. Brown',
    DeptCode: 'CARD',
    Department: 'Cardiology',
    Anesthetist: 'Dr. Anesthesia',
    AnesthesiaCode: 'GA002',
    AnesthesiaType: 'General',
    ProcedureType: 'Surgical',
    ProcedureNature: 'Elective',
    OTCode: 'OT03',
    OTName: 'Main OT 1',
    OnTable: '08:00',
    IncisionTime: '08:30',
    FinishTime: '14:00',
    ProcedureTime: 330,
    ChangeoverTime: 45,
    TotalTime: 375,
    Remarks: 'Complex bypass surgery completed'
  },
  {
    No: 'OT005',
    UHID: 'UH005',
    BillNo: 'B005',
    AdmissionDate: '2024-01-25',
    DischargeDate: '2024-01-30',
    IPDNo: 'IPD2024005',
    ServiceDate: '2024-01-26',
    ServiceName: 'Valve Replacement',
    DoctorID: 'DOC003',
    DoctorName: 'Dr. Brown',
    DeptCode: 'CARD',
    Department: 'Cardiology',
    Anesthetist: 'Dr. Anesthesia3',
    AnesthesiaCode: 'GA003',
    AnesthesiaType: 'General',
    ProcedureType: 'Surgical',
    ProcedureNature: 'Elective',
    OTCode: 'OT03',
    OTName: 'Main OT 1',
    OnTable: '09:00',
    IncisionTime: '09:45',
    FinishTime: '15:30',
    ProcedureTime: 345,
    ChangeoverTime: 40,
    TotalTime: 385,
    Remarks: 'Valve replacement successful'
  }
];

// Dummy data for Occupancy Register
const dummyOccupancy: OccupancyRegister[] = [
  {
    UHID: 'UH001',
    PatientBillNo: 'PB001',
    AdmissionDate: '2024-01-15',
    DischargeDate: '2024-01-20',
    IPDNo: 'IPD2024001',
    FinalBillDate: '2024-01-20',
    BillNo: 'B001',
    WardCode: 'ICU01',
    WardName: 'Cardiac ICU',
    BedNo: 'ICU-01',
    StayHours: 48,
    BedAssignTime: '2024-01-15 10:00',
    BedReleaseTime: '2024-01-17 10:00',
    WardCatCode: 'ICU',
    BedCatName: 'ICU Bed',
    Category: 'Critical Care'
  },
  {
    UHID: 'UH001',
    PatientBillNo: 'PB001',
    AdmissionDate: '2024-01-15',
    DischargeDate: '2024-01-20',
    IPDNo: 'IPD2024001',
    FinalBillDate: '2024-01-20',
    BillNo: 'B001',
    WardCode: 'GW01',
    WardName: 'General Ward',
    BedNo: 'GW-15',
    StayHours: 72,
    BedAssignTime: '2024-01-17 10:00',
    BedReleaseTime: '2024-01-20 10:00',
    WardCatCode: 'GEN',
    BedCatName: 'General Bed',
    Category: 'General'
  },
  {
    UHID: 'UH002',
    PatientBillNo: 'PB002',
    AdmissionDate: '2024-01-18',
    DischargeDate: '2024-01-22',
    IPDNo: 'IPD2024002',
    FinalBillDate: '2024-01-22',
    BillNo: 'B002',
    WardCode: 'ICU02',
    WardName: 'Medical ICU',
    BedNo: 'ICU-05',
    StayHours: 24,
    BedAssignTime: '2024-01-18 14:00',
    BedReleaseTime: '2024-01-19 14:00',
    WardCatCode: 'ICU',
    BedCatName: 'ICU Bed',
    Category: 'Critical Care'
  },
  {
    UHID: 'UH002',
    PatientBillNo: 'PB002',
    AdmissionDate: '2024-01-18',
    DischargeDate: '2024-01-22',
    IPDNo: 'IPD2024002',
    FinalBillDate: '2024-01-22',
    BillNo: 'B002',
    WardCode: 'PW01',
    WardName: 'Private Ward',
    BedNo: 'PW-08',
    StayHours: 72,
    BedAssignTime: '2024-01-19 14:00',
    BedReleaseTime: '2024-01-22 14:00',
    WardCatCode: 'PVT',
    BedCatName: 'Private Bed',
    Category: 'Private'
  },
  {
    UHID: 'UH003',
    PatientBillNo: 'PB003',
    AdmissionDate: '2024-01-20',
    DischargeDate: '2024-01-25',
    IPDNo: 'IPD2024003',
    FinalBillDate: '2024-01-25',
    BillNo: 'B003',
    WardCode: 'GW02',
    WardName: 'General Ward 2',
    BedNo: 'GW2-12',
    StayHours: 120,
    BedAssignTime: '2024-01-20 16:00',
    BedReleaseTime: '2024-01-25 16:00',
    WardCatCode: 'GEN',
    BedCatName: 'General Bed',
    Category: 'General'
  }
];

// Dummy data for Power Consumption
const dummyPowerConsumption: PowerConsumption[] = [
  {
    No: 'PC001',
    SubCCCode: 'SCC001',
    SubCC: 'Cath Lab',
    ConnLoad: 150,
    RunLoad: 120,
    StdbyLoad: 25,
    Days: 31,
    Hrs: 12,
    TotalLoadKg: 44640,
    Notes: 'High usage during procedures'
  },
  {
    No: 'PC002',
    SubCCCode: 'SCC002',
    SubCC: 'ICU',
    ConnLoad: 200,
    RunLoad: 180,
    StdbyLoad: 40,
    Days: 31,
    Hrs: 24,
    TotalLoadKg: 133920,
    Notes: '24/7 operation'
  },
  {
    No: 'PC003',
    SubCCCode: 'SCC003',
    SubCC: 'OT Complex',
    ConnLoad: 300,
    RunLoad: 250,
    StdbyLoad: 50,
    Days: 31,
    Hrs: 16,
    TotalLoadKg: 124000,
    Notes: 'Multiple OTs running'
  },
  {
    No: 'PC004',
    SubCCCode: 'SCC004',
    SubCC: 'Radiology',
    ConnLoad: 180,
    RunLoad: 150,
    StdbyLoad: 30,
    Days: 31,
    Hrs: 10,
    TotalLoadKg: 46500,
    Notes: 'CT and MRI operations'
  },
  {
    No: 'PC005',
    SubCCCode: 'SCC005',
    SubCC: 'General Wards',
    ConnLoad: 100,
    RunLoad: 80,
    StdbyLoad: 20,
    Days: 31,
    Hrs: 24,
    TotalLoadKg: 59520,
    Notes: 'Patient care areas'
  }
];

// Column definitions for each table
const otCathLabColumns: TableColumn[] = [
  { key: 'No', label: 'No.', width: '80px', sortable: true },
  { key: 'UHID', label: 'UHID', width: '100px', sortable: true },
  { key: 'BillNo', label: 'Bill No.', width: '100px', sortable: true },
  { key: 'ServiceDate', label: 'Service Date', width: '120px', type: 'date', sortable: true },
  { key: 'ServiceName', label: 'Service Name', width: '180px', sortable: true },
  { key: 'DoctorName', label: 'Doctor Name', width: '150px', sortable: true },
  { key: 'Department', label: 'Department', width: '120px', sortable: true },
  { key: 'OTName', label: 'OT Name', width: '120px', sortable: true },
  { key: 'ProcedureType', label: 'Procedure Type', width: '130px', sortable: true },
  { key: 'ProcedureNature', label: 'Nature', width: '100px', sortable: true },
  { key: 'OnTable', label: 'On Table', width: '100px', sortable: true },
  { key: 'IncisionTime', label: 'Incision Time', width: '120px', sortable: true },
  { key: 'FinishTime', label: 'Finish Time', width: '120px', sortable: true },
  { key: 'ProcedureTime', label: 'Procedure Time (min)', width: '150px', type: 'number', sortable: true },
  { key: 'TotalTime', label: 'Total Time (min)', width: '130px', type: 'number', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '150px', sortable: true }
];

const occupancyColumns: TableColumn[] = [
  { key: 'UHID', label: 'UHID', width: '100px', sortable: true },
  { key: 'PatientBillNo', label: 'Patient Bill No', width: '130px', sortable: true },
  { key: 'AdmissionDate', label: 'Admission Date', width: '130px', type: 'date', sortable: true },
  { key: 'DischargeDate', label: 'Discharge Date', width: '130px', type: 'date', sortable: true },
  { key: 'IPDNo', label: 'IPD No', width: '120px', sortable: true },
  { key: 'WardName', label: 'Ward Name', width: '150px', sortable: true },
  { key: 'BedNo', label: 'Bed No', width: '100px', sortable: true },
  { key: 'StayHours', label: 'Stay Hours', width: '100px', type: 'number', sortable: true },
  { key: 'BedAssignTime', label: 'Bed Assign Time', width: '150px', sortable: true },
  { key: 'BedReleaseTime', label: 'Bed Release Time', width: '150px', sortable: true },
  { key: 'BedCatName', label: 'Bed Category', width: '120px', sortable: true },
  { key: 'Category', label: 'Category', width: '100px', sortable: true }
];

const powerConsumptionColumns: TableColumn[] = [
  { key: 'No', label: 'No', width: '80px', sortable: true },
  { key: 'SubCCCode', label: 'Sub CC Code', width: '120px', sortable: true },
  { key: 'SubCC', label: 'Sub Cost Center', width: '150px', sortable: true },
  { key: 'ConnLoad', label: 'Connected Load (kW)', width: '150px', type: 'number', sortable: true },
  { key: 'RunLoad', label: 'Running Load (kW)', width: '140px', type: 'number', sortable: true },
  { key: 'StdbyLoad', label: 'Standby Load (kW)', width: '140px', type: 'number', sortable: true },
  { key: 'Days', label: 'Days', width: '80px', type: 'number', sortable: true },
  { key: 'Hrs', label: 'Hours', width: '80px', type: 'number', sortable: true },
  { key: 'TotalLoadKg', label: 'Total Load (kWh)', width: '130px', type: 'number', sortable: true },
  { key: 'Notes', label: 'Notes', width: '150px', sortable: true }
];

export function MetadataTable() {
  const [activeTable, setActiveTable] = useState<'ot-cath-lab' | 'occupancy' | 'power-consumption'>('ot-cath-lab');
  const [otCathLabData, setOTCathLabData] = useState<OTCathLabRegister[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyRegister[]>([]);
  const [powerConsumptionData, setPowerConsumptionData] = useState<PowerConsumption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOTCathLabData(dummyOTCathLab);
      setOccupancyData(dummyOccupancy);
      setPowerConsumptionData(dummyPowerConsumption);
      setIsLoading(false);
    }, 600);
  }, []);

  const handleRowClick = (row: any) => {
    console.log('Metadata row clicked:', row);
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case 'ot-cath-lab':
        return otCathLabData;
      case 'occupancy':
        return occupancyData;
      case 'power-consumption':
        return powerConsumptionData;
      default:
        return [];
    }
  };

  const getCurrentColumns = () => {
    switch (activeTable) {
      case 'ot-cath-lab':
        return otCathLabColumns;
      case 'occupancy':
        return occupancyColumns;
      case 'power-consumption':
        return powerConsumptionColumns;
      default:
        return [];
    }
  };

  const getTableTitle = () => {
    switch (activeTable) {
      case 'ot-cath-lab':
        return 'OT-Cath Lab Register';
      case 'occupancy':
        return 'Occupancy Register';
      case 'power-consumption':
        return 'Power Consumption';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-primary-900">Hospital Metadata</h2>
          <div className="flex bg-accent-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTable('ot-cath-lab')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'ot-cath-lab'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>OT-Cath Lab</span>
            </button>
            <button
              onClick={() => setActiveTable('occupancy')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'occupancy'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Bed className="h-4 w-4" />
              <span>Occupancy</span>
            </button>
            <button
              onClick={() => setActiveTable('power-consumption')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'power-consumption'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Power</span>
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
        {activeTable === 'ot-cath-lab' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Procedures</h3>
              <p className="text-2xl font-bold text-primary-900">{otCathLabData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Procedure Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {otCathLabData.length > 0 ? 
                  Math.round(otCathLabData.reduce((sum, item) => sum + item.ProcedureTime, 0) / otCathLabData.length) : 0} min
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Emergency Cases</h3>
              <p className="text-2xl font-bold text-red-600">
                {otCathLabData.filter(item => item.ProcedureNature === 'Emergency').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Elective Cases</h3>
              <p className="text-2xl font-bold text-green-600">
                {otCathLabData.filter(item => item.ProcedureNature === 'Elective').length}
              </p>
            </div>
          </>
        )}

        {activeTable === 'occupancy' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Admissions</h3>
              <p className="text-2xl font-bold text-primary-900">
                {new Set(occupancyData.map(item => item.UHID)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Stay Hours</h3>
              <p className="text-2xl font-bold text-blue-600">
                {occupancyData.length > 0 ? 
                  Math.round(occupancyData.reduce((sum, item) => sum + item.StayHours, 0) / occupancyData.length) : 0}h
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">ICU Stays</h3>
              <p className="text-2xl font-bold text-red-600">
                {occupancyData.filter(item => item.Category === 'Critical Care').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">General Stays</h3>
              <p className="text-2xl font-bold text-green-600">
                {occupancyData.filter(item => item.Category === 'General').length}
              </p>
            </div>
          </>
        )}

        {activeTable === 'power-consumption' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Load (kWh)</h3>
              <p className="text-2xl font-bold text-primary-900">
                {powerConsumptionData.reduce((sum, item) => sum + item.TotalLoadKg, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Connected Load</h3>
              <p className="text-2xl font-bold text-blue-600">
                {powerConsumptionData.length > 0 ? 
                  Math.round(powerConsumptionData.reduce((sum, item) => sum + item.ConnLoad, 0) / powerConsumptionData.length) : 0} kW
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Highest Consumer</h3>
              <p className="text-2xl font-bold text-orange-600">
                {powerConsumptionData.length > 0 ? 
                  powerConsumptionData.reduce((max, item) => item.TotalLoadKg > max.TotalLoadKg ? item : max, powerConsumptionData[0]).SubCC : 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Cost Centers</h3>
              <p className="text-2xl font-bold text-purple-600">{powerConsumptionData.length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
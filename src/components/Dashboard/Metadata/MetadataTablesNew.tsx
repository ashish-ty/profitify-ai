import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../../Common/DataTable';
import { 
  OccupancyRegisterNew, 
  OTRegister, 
  ConsumptionData, 
  ConnectedLoad, 
  FixedAssetRegister, 
  TATData, 
  CostCenter, 
  SecondaryCostDriver 
} from '../../../types/metadata';
import { Bed, Activity, Package, Zap, Building, Clock, Target, BarChart3 } from 'lucide-react';

// Dummy data for all tables
const dummyOccupancyRegister: OccupancyRegisterNew[] = [
  {
    NatureOfData: 'Patient Stay',
    UHID: 'UH001',
    PatientAdmissionDate: '15/01/24',
    PatientDischargeDate: '20/01/24',
    IPDNumber: 'IPD2024001',
    DateOfFinalBill: '20/01/24',
    BillNo: 'B001',
    WardCode: 'ICU01',
    WardName: 'Cardiac ICU',
    BedNumber: 'ICU-01',
    LengthOfStayInHours: 120,
    BedAssignDateTime: '15/01/24 10:00',
    BedReleaseDateTime: '20/01/24 10:00',
    WardCategoryCode: 'ICU',
    BedCategoryName: 'ICU Bed',
    PayorType: 'Insurance',
    ServiceName: 'Cardiac Monitoring'
  },
  {
    NatureOfData: 'Patient Stay',
    UHID: 'UH002',
    PatientAdmissionDate: '18/01/24',
    PatientDischargeDate: '22/01/24',
    IPDNumber: 'IPD2024002',
    DateOfFinalBill: '22/01/24',
    BillNo: 'B002',
    WardCode: 'GW01',
    WardName: 'General Ward',
    BedNumber: 'GW-15',
    LengthOfStayInHours: 96,
    BedAssignDateTime: '18/01/24 14:00',
    BedReleaseDateTime: '22/01/24 14:00',
    WardCategoryCode: 'GEN',
    BedCategoryName: 'General Bed',
    PayorType: 'Cash',
    ServiceName: 'General Care'
  },
  {
    NatureOfData: 'Patient Stay',
    UHID: 'UH003',
    PatientAdmissionDate: '20/01/24',
    PatientDischargeDate: '25/01/24',
    IPDNumber: 'IPD2024003',
    DateOfFinalBill: '25/01/24',
    BillNo: 'B003',
    WardCode: 'PW01',
    WardName: 'Private Ward',
    BedNumber: 'PW-08',
    LengthOfStayInHours: 120,
    BedAssignDateTime: '20/01/24 16:00',
    BedReleaseDateTime: '25/01/24 16:00',
    WardCategoryCode: 'PVT',
    BedCategoryName: 'Private Bed',
    PayorType: 'Insurance',
    ServiceName: 'Private Care'
  }
];

const dummyOTRegister: OTRegister[] = [
  {
    SerialNo: 'OT001',
    UHID: 'UH001',
    PatientBillNumber: 'B001',
    PatientAdmissionDate: '15/01/24',
    PatientDischargeDate: '20/01/24',
    IPDNumber: 'IPD2024001',
    ServiceDate: '16/01/24',
    ServiceName: 'Cardiac Catheterization',
    PerformingDoctorName: 'Dr. Smith',
    PerformingDoctorDepartment: 'Cardiology',
    AnaesthesistName: 'Dr. Anesthesia',
    AnesthesiaType: 'General',
    TypeOfProcedure: 'Interventional',
    NatureOfProcedure: 'Elective',
    OperationTheatreCode: 'OT01',
    OperationTheatreName: 'Cath Lab 1',
    OnTableTime: '09:00',
    IncisionTime: '09:15',
    FinishTime: '11:30',
    ProcedureTime: '135 min',
    ChangeOverTime: '30 min',
    TotalTime: '165 min',
    Remarks: 'Successful procedure',
    PayorType: 'Insurance',
    ServiceNameSecond: 'Cardiac Catheterization'
  },
  {
    SerialNo: 'OT002',
    UHID: 'UH002',
    PatientBillNumber: 'B002',
    PatientAdmissionDate: '18/01/24',
    PatientDischargeDate: '22/01/24',
    IPDNumber: 'IPD2024002',
    ServiceDate: '19/01/24',
    ServiceName: 'Angioplasty',
    PerformingDoctorName: 'Dr. Smith',
    PerformingDoctorDepartment: 'Cardiology',
    AnaesthesistName: 'Dr. Anesthesia',
    AnesthesiaType: 'Local',
    TypeOfProcedure: 'Interventional',
    NatureOfProcedure: 'Emergency',
    OperationTheatreCode: 'OT01',
    OperationTheatreName: 'Cath Lab 1',
    OnTableTime: '14:00',
    IncisionTime: '14:10',
    FinishTime: '16:45',
    ProcedureTime: '155 min',
    ChangeOverTime: '25 min',
    TotalTime: '180 min',
    Remarks: 'Emergency procedure completed',
    PayorType: 'Cash',
    ServiceNameSecond: 'Angioplasty'
  }
];

const dummyConsumptionData: ConsumptionData[] = [
  {
    SerialNo: 'C001',
    CostCentreCode: 'CC001',
    CostCentre: 'Cardiology',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Cath Lab',
    TransactionDate: '15/01/24',
    FromStore: 'Central Pharmacy',
    ToStore: 'Cath Lab Store',
    SKUName: 'Cardiac Stents',
    LedgerCode: 'LED001',
    LedgerName: 'Medical Implants',
    UnitOfMeasurement: 'Pieces',
    Quantity: 5,
    Rate: 25000,
    TransactionValue: 125000,
    Remarks: 'Cardiac stent consumption'
  },
  {
    SerialNo: 'C002',
    CostCentreCode: 'CC002',
    CostCentre: 'Laboratory',
    SubCostCentreCode: 'SCC002',
    SubCostCentre: 'Biochemistry',
    TransactionDate: '16/01/24',
    FromStore: 'Central Store',
    ToStore: 'Lab Store',
    SKUName: 'Lab Reagents',
    LedgerCode: 'LED002',
    LedgerName: 'Laboratory Supplies',
    UnitOfMeasurement: 'Bottles',
    Quantity: 20,
    Rate: 500,
    TransactionValue: 10000,
    Remarks: 'Monthly reagent supply'
  }
];

const dummyConnectedLoad: ConnectedLoad[] = [
  {
    SerialNo: 'CL001',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Cath Lab',
    ConnectedLoad: 150,
    RunningLoad: 120,
    StandbyLoad: 25,
    Days: 31,
    Hours: 12,
    TotalLoadKg: 44640,
    Remarks: 'High usage during procedures'
  },
  {
    SerialNo: 'CL002',
    SubCostCentreCode: 'SCC002',
    SubCostCentre: 'ICU',
    ConnectedLoad: 200,
    RunningLoad: 180,
    StandbyLoad: 40,
    Days: 31,
    Hours: 24,
    TotalLoadKg: 133920,
    Remarks: '24/7 operation'
  }
];

const dummyFixedAssetRegister: FixedAssetRegister[] = [
  {
    SerialNo: 'FA001',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Cath Lab',
    BioMedicalEquipments: 2500000,
    EngineeringEquipments: 500000,
    FurnitureFixture: 150000,
    Others: 100000,
    Remarks: 'Cath lab equipment valuation'
  },
  {
    SerialNo: 'FA002',
    SubCostCentreCode: 'SCC002',
    SubCostCentre: 'ICU',
    BioMedicalEquipments: 1800000,
    EngineeringEquipments: 300000,
    FurnitureFixture: 200000,
    Others: 80000,
    Remarks: 'ICU equipment and furniture'
  }
];

const dummyTATData: TATData[] = [
  {
    SerialNo: 'TAT001',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Laboratory',
    TAT: '2 hours',
    Remarks: 'Standard lab test turnaround time'
  },
  {
    SerialNo: 'TAT002',
    SubCostCentreCode: 'SCC002',
    SubCostCentre: 'Radiology',
    TAT: '4 hours',
    Remarks: 'CT scan report delivery time'
  }
];

const dummyCostCenter: CostCenter[] = [
  {
    CCType: 'Revenue',
    CostCentreCode: 'CC001',
    CostCentreCategory: 'Clinical',
    CostCentre: 'Cardiology',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Cath Lab',
    AliasCode: 'CATH01',
    AliasName: 'Cardiac Catheterization',
    CostDriver: 'Number of procedures',
    SourceOfDriver: 'OT Register',
    Remarks: 'Primary cardiac intervention center'
  },
  {
    CCType: 'Support',
    CostCentreCode: 'CC002',
    CostCentreCategory: 'Support',
    CostCentre: 'Laboratory',
    SubCostCentreCode: 'SCC002',
    SubCostCentre: 'Biochemistry',
    AliasCode: 'LAB01',
    AliasName: 'Bio Lab',
    CostDriver: 'Number of tests',
    SourceOfDriver: 'Lab Register',
    Remarks: 'Main biochemistry laboratory'
  }
];

const dummySecondaryCostDriver: SecondaryCostDriver[] = [
  {
    SerialNo: 'SCD001',
    SubCostCentreCode: 'SCC001',
    SubCostCentre: 'Cath Lab',
    NursingHostelOccupancy: 0,
    DoctorsHostelOccupancy: 0,
    StaffAccommodationOccupancy: 0,
    FrequencyOfAudit: 2,
    NoOfITUsers: 15,
    NoOfTransactionInFinanceBilling: 450,
    ListOfEquipmentForLoan: 'Cath Lab Equipment',
    NoOfTripsKm: 0,
    NoOfLaboratoryTest: 0,
    NoOfSampleCollectedReportDispatch: 0,
    NoOfHomeSampleCollection: 0,
    NoOfRadiologyTest: 25,
    NoOfNeuroTest: 0,
    NoOfCardiacTest: 85,
    NoOfNuclearMedicineTest: 0,
    NoOfIVFConsultation: 0,
    OTTimeHours: 180,
    CCUOccupancy: 0,
    MICUOccupancy: 0,
    PICUOccupancy: 0,
    NICUOccupancy: 0,
    HDUOccupancy: 0,
    IsolationRoomOccupancy: 0,
    GWOccupancy: 0,
    PWSROccupancy: 0,
    SWTSOccupancy: 0,
    DWOccupancy: 0,
    HeadOffice: 0,
    OtherUnit1AllocationRatio: 0,
    OtherUnit2AllocationRatio: 0,
    OtherUnit3AllocationRatio: 0,
    OtherUnit4AllocationRatio: 0,
    OtherUnit5AllocationRatio: 0,
    NoOfPatientOPIP: 450,
    NoOfCorporatePatientOPIP: 120,
    NoOfInstitutionalPatientOPIP: 80,
    NoOfInternationalPatientOPIP: 15,
    NoOfIPPatients: 180,
    NoOfCreditIPPatients: 120,
    SurgicalStoreIssueRatio: 0.8,
    CentralStoreIssueRatio: 0.6,
    NonSurgicalStoreIssueRatio: 0.4,
    StationeryHousekeepingIssueRatio: 0.2,
    NoOfDoctors: 8,
    DoctorFeeForServiceRatio: 0.15,
    ConsultantRetainerFeeMGBonusRatio: 0.25,
    NoOfNursingStaff: 25,
    NursingStation1ForCareUnits: 8,
    NursingStation2ForCareUnits: 8,
    NursingStation3ForCareUnits: 9,
    NursingStation4ForCareUnits: 0,
    NursingStation5ForCareUnits: 0,
    ServiceUnderOPBilling1: 150,
    ServiceUnderOPBilling2: 120,
    ServiceUnderOPBilling3: 80,
    ServiceUnderOPBilling4: 0,
    BrokerageCommission: 15000,
    NoOfCSSDSetIssued: 85,
    NoOfDietServed: 540,
    NoOfWardBoy: 12,
    NoOfHousekeepingStaff: 8,
    NoOfFumigationCyclePerformed: 4,
    VolumeOfClothLoad: 250,
    EffortsOfSupplyChainDepartment: 0.3,
    AreaInSqMeter: 1200,
    NoOfSecurityStaffDeployed: 6,
    ActualWaterUtilization: 15000,
    ActualGasUtilization: 8000,
    ActualVaccumeUtilization: 2000,
    Civil: 'Good condition'
  }
];


// Column definitions for each table
const occupancyColumns: TableColumn[] = [
  { key: 'NatureOfData', label: 'Nature of Data', width: '120px', sortable: true },
  { key: 'UHID', label: 'UHID', width: '100px', sortable: true },
  { key: 'PatientAdmissionDate', label: 'Admission Date', width: '130px', sortable: true },
  { key: 'PatientDischargeDate', label: 'Discharge Date', width: '130px', sortable: true },
  { key: 'IPDNumber', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'WardName', label: 'Ward Name', width: '150px', sortable: true },
  { key: 'BedNumber', label: 'Bed Number', width: '100px', sortable: true },
  { key: 'LengthOfStayInHours', label: 'Stay Hours', width: '100px', type: 'number', sortable: true },
  { key: 'BedCategoryName', label: 'Bed Category', width: '120px', sortable: true },
  { key: 'PayorType', label: 'Payor Type', width: '100px', sortable: true },
  { key: 'ServiceName', label: 'Service Name', width: '150px', sortable: true }
];

const otRegisterColumns: TableColumn[] = [
  { key: 'SerialNo', label: 'S.No.', width: '80px', sortable: true },
  { key: 'UHID', label: 'UHID', width: '100px', sortable: true },
  { key: 'ServiceDate', label: 'Service Date', width: '120px', sortable: true },
  { key: 'ServiceName', label: 'Service Name', width: '180px', sortable: true },
  { key: 'PerformingDoctorName', label: 'Doctor Name', width: '150px', sortable: true },
  { key: 'PerformingDoctorDepartment', label: 'Department', width: '120px', sortable: true },
  { key: 'AnesthesiaType', label: 'Anesthesia', width: '100px', sortable: true },
  { key: 'TypeOfProcedure', label: 'Procedure Type', width: '130px', sortable: true },
  { key: 'NatureOfProcedure', label: 'Nature', width: '100px', sortable: true },
  { key: 'OperationTheatreName', label: 'OT Name', width: '120px', sortable: true },
  { key: 'ProcedureTime', label: 'Procedure Time', width: '120px', sortable: true },
  { key: 'TotalTime', label: 'Total Time', width: '100px', sortable: true },
  { key: 'PayorType', label: 'Payor Type', width: '100px', sortable: true }
];

const consumptionColumns: TableColumn[] = [
  { key: 'SerialNo', label: 'S.No.', width: '80px', sortable: true },
  { key: 'CostCentre', label: 'Cost Centre', width: '150px', sortable: true },
  { key: 'SubCostCentre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'TransactionDate', label: 'Transaction Date', width: '130px', sortable: true },
  { key: 'SKUName', label: 'SKU Name', width: '180px', sortable: true },
  { key: 'LedgerName', label: 'Ledger Name', width: '150px', sortable: true },
  { key: 'Quantity', label: 'Quantity', width: '100px', type: 'number', sortable: true },
  { key: 'Rate', label: 'Rate', width: '100px', type: 'currency', sortable: true },
  { key: 'TransactionValue', label: 'Value', width: '120px', type: 'currency', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '200px', sortable: true }
];

const connectedLoadColumns: TableColumn[] = [
  { key: 'SerialNo', label: 'S.No.', width: '80px', sortable: true },
  { key: 'SubCostCentre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'ConnectedLoad', label: 'Connected Load', width: '130px', type: 'number', sortable: true },
  { key: 'RunningLoad', label: 'Running Load', width: '120px', type: 'number', sortable: true },
  { key: 'StandbyLoad', label: 'Standby Load', width: '120px', type: 'number', sortable: true },
  { key: 'Days', label: 'Days', width: '80px', type: 'number', sortable: true },
  { key: 'Hours', label: 'Hours', width: '80px', type: 'number', sortable: true },
  { key: 'TotalLoadKg', label: 'Total Load (kWh)', width: '130px', type: 'number', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '200px', sortable: true }
];

const fixedAssetColumns: TableColumn[] = [
  { key: 'SerialNo', label: 'S.No.', width: '80px', sortable: true },
  { key: 'SubCostCentre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'BioMedicalEquipments', label: 'Bio Medical', width: '130px', type: 'currency', sortable: true },
  { key: 'EngineeringEquipments', label: 'Engineering', width: '130px', type: 'currency', sortable: true },
  { key: 'FurnitureFixture', label: 'Furniture', width: '120px', type: 'currency', sortable: true },
  { key: 'Others', label: 'Others', width: '100px', type: 'currency', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '200px', sortable: true }
];

const tatColumns: TableColumn[] = [
  { key: 'SerialNo', label: 'S.No.', width: '80px', sortable: true },
  { key: 'SubCostCentre', label: 'Sub Cost Centre', width: '200px', sortable: true },
  { key: 'TAT', label: 'TAT', width: '150px', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '300px', sortable: true }
];

const costCenterColumns: TableColumn[] = [
  { key: 'CCType', label: 'CC Type', width: '100px', sortable: true },
  { key: 'CostCentreCode', label: 'Cost Centre Code', width: '130px', sortable: true },
  { key: 'CostCentre', label: 'Cost Centre', width: '150px', sortable: true },
  { key: 'SubCostCentre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'AliasName', label: 'Alias Name', width: '150px', sortable: true },
  { key: 'CostDriver', label: 'Cost Driver', width: '150px', sortable: true },
  { key: 'SourceOfDriver', label: 'Source of Driver', width: '130px', sortable: true },
  { key: 'Remarks', label: 'Remarks', width: '200px', sortable: true }
];

export function MetadataTablesNew() {
  const [activeTable, setActiveTable] = useState<'occupancy' | 'ot-register' | 'consumption' | 'connected-load' | 'fixed-asset' | 'tat' | 'cost-center' | 'secondary-cost'>('occupancy');
  const [occupancyData, setOccupancyData] = useState<OccupancyRegisterNew[]>([]);
  const [otData, setOTData] = useState<OTRegister[]>([]);
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
  const [connectedLoadData, setConnectedLoadData] = useState<ConnectedLoad[]>([]);
  const [fixedAssetData, setFixedAssetData] = useState<FixedAssetRegister[]>([]);
  const [tatData, setTATData] = useState<TATData[]>([]);
  const [costCenterData, setCostCenterData] = useState<CostCenter[]>([]);
  const [secondaryCostData, setSecondaryCostData] = useState<SecondaryCostDriver[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOccupancyData(dummyOccupancyRegister);
      setOTData(dummyOTRegister);
      setConsumptionData(dummyConsumptionData);
      setConnectedLoadData(dummyConnectedLoad);
      setFixedAssetData(dummyFixedAssetRegister);
      setTATData(dummyTATData);
      setCostCenterData(dummyCostCenter);
      setSecondaryCostData(dummySecondaryCostDriver);
      setIsLoading(false);
    }, 600);
  }, []);

  const handleRowClick = (row: any) => {
    console.log('Metadata row clicked:', row);
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case 'occupancy':
        return occupancyData;
      case 'ot-register':
        return otData;
      case 'consumption':
        return consumptionData;
      case 'connected-load':
        return connectedLoadData;
      case 'fixed-asset':
        return fixedAssetData;
      case 'tat':
        return tatData;
      case 'cost-center':
        return costCenterData;
      case 'secondary-cost':
        return secondaryCostData;
      default:
        return [];
    }
  };

  const getCurrentColumns = () => {
    switch (activeTable) {
      case 'occupancy':
        return occupancyColumns;
      case 'ot-register':
        return otRegisterColumns;
      case 'consumption':
        return consumptionColumns;
      case 'connected-load':
        return connectedLoadColumns;
      case 'fixed-asset':
        return fixedAssetColumns;
      case 'tat':
        return tatColumns;
      case 'cost-center':
        return costCenterColumns;
      case 'secondary-cost':
        return []; // Too many columns, will show message
      default:
        return [];
    }
  };

  const getTableTitle = () => {
    switch (activeTable) {
      case 'occupancy':
        return 'Occupancy Register';
      case 'ot-register':
        return 'OT Register';
      case 'consumption':
        return 'Consumption Data';
      case 'connected-load':
        return 'Connected Load';
      case 'fixed-asset':
        return 'Fixed Asset Register';
      case 'tat':
        return 'TAT Data';
      case 'cost-center':
        return 'Cost Center';
      case 'secondary-cost':
        return 'Secondary Cost Driver';
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
          <div className="flex bg-accent-100 rounded-lg p-1 overflow-x-auto">
            <button
              onClick={() => setActiveTable('occupancy')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'occupancy'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Bed className="h-4 w-4" />
              <span>Occupancy</span>
            </button>
            <button
              onClick={() => setActiveTable('ot-register')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'ot-register'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>OT Register</span>
            </button>
            <button
              onClick={() => setActiveTable('consumption')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'consumption'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Consumption</span>
            </button>
            <button
              onClick={() => setActiveTable('connected-load')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'connected-load'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Power</span>
            </button>
            <button
              onClick={() => setActiveTable('fixed-asset')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'fixed-asset'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Assets</span>
            </button>
            <button
              onClick={() => setActiveTable('tat')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'tat'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>TAT</span>
            </button>
            <button
              onClick={() => setActiveTable('cost-center')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'cost-center'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Cost Center</span>
            </button>
            <button
              onClick={() => setActiveTable('secondary-cost')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTable === 'secondary-cost'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Secondary Cost</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Table */}
      {activeTable === 'secondary-cost' ? (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Secondary Cost Driver Data</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              This table contains {Object.keys(dummySecondaryCostDriver[0] || {}).length} columns with extensive cost driver data. 
              Due to the large number of columns, please export the data to view all details.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2">Total Records</h4>
              <p className="text-2xl font-bold text-primary-900">{secondaryCostData.length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Cost Centres</h4>
              <p className="text-2xl font-bold text-blue-900">
                {new Set(secondaryCostData.map(item => item.SubCostCentre)).size}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Total Patients</h4>
              <p className="text-2xl font-bold text-green-900">
                {secondaryCostData.reduce((sum, item) => sum + item.NoOfPatientOPIP, 0)}
              </p>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  Math.round(occupancyData.reduce((sum, item) => sum + item.LengthOfStayInHours, 0) / occupancyData.length) : 0}h
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">ICU Stays</h3>
              <p className="text-2xl font-bold text-red-600">
                {occupancyData.filter(item => item.WardCategoryCode === 'ICU').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Insurance Patients</h3>
              <p className="text-2xl font-bold text-green-600">
                {occupancyData.filter(item => item.PayorType === 'Insurance').length}
              </p>
            </div>
          </>
        )}

        {activeTable === 'ot-register' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Procedures</h3>
              <p className="text-2xl font-bold text-primary-900">{otData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Emergency Cases</h3>
              <p className="text-2xl font-bold text-red-600">
                {otData.filter(item => item.NatureOfProcedure === 'Emergency').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Elective Cases</h3>
              <p className="text-2xl font-bold text-green-600">
                {otData.filter(item => item.NatureOfProcedure === 'Elective').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Procedure Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {otData.length > 0 ? 
                  Math.round(otData.reduce((sum, item) => sum + parseInt(item.ProcedureTime), 0) / otData.length) : 0} min
              </p>
            </div>
          </>
        )}

        {activeTable === 'consumption' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Transactions</h3>
              <p className="text-2xl font-bold text-primary-900">{consumptionData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Value</h3>
              <p className="text-2xl font-bold text-green-600">
                ${consumptionData.reduce((sum, item) => sum + item.TransactionValue, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Cost Centres</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(consumptionData.map(item => item.CostCentre)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Quantity</h3>
              <p className="text-2xl font-bold text-purple-600">
                {consumptionData.reduce((sum, item) => sum + item.Quantity, 0)}
              </p>
            </div>
          </>
        )}

        {(activeTable === 'connected-load' || activeTable === 'fixed-asset' || activeTable === 'tat' || activeTable === 'cost-center') && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Records</h3>
              <p className="text-2xl font-bold text-primary-900">{getCurrentData().length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Cost Centres</h3>
              <p className="text-2xl font-bold text-blue-600">
                {activeTable === 'connected-load' ? new Set(connectedLoadData.map(item => item.SubCostCentre)).size :
                 activeTable === 'fixed-asset' ? new Set(fixedAssetData.map(item => item.SubCostCentre)).size :
                 activeTable === 'tat' ? new Set(tatData.map(item => item.SubCostCentre)).size :
                 new Set(costCenterData.map(item => item.CostCentre)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">
                {activeTable === 'connected-load' ? 'Total Load (kWh)' :
                 activeTable === 'fixed-asset' ? 'Total Asset Value' :
                 activeTable === 'tat' ? 'Avg TAT' :
                 'Revenue Centres'}
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {activeTable === 'connected-load' ? connectedLoadData.reduce((sum, item) => sum + item.TotalLoadKg, 0).toLocaleString() :
                 activeTable === 'fixed-asset' ? `$${fixedAssetData.reduce((sum, item) => sum + item.BioMedicalEquipments + item.EngineeringEquipments + item.FurnitureFixture + item.Others, 0).toLocaleString()}` :
                 activeTable === 'tat' ? 'Variable' :
                 costCenterData.filter(item => item.CCType === 'Revenue').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">
                {activeTable === 'connected-load' ? 'Avg Load' :
                 activeTable === 'fixed-asset' ? 'Bio Medical' :
                 activeTable === 'tat' ? 'Service Points' :
                 'Support Centres'}
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {activeTable === 'connected-load' ? `${connectedLoadData.length > 0 ? Math.round(connectedLoadData.reduce((sum, item) => sum + item.ConnectedLoad, 0) / connectedLoadData.length) : 0} kW` :
                 activeTable === 'fixed-asset' ? `$${fixedAssetData.reduce((sum, item) => sum + item.BioMedicalEquipments, 0).toLocaleString()}` :
                 activeTable === 'tat' ? tatData.length :
                 costCenterData.filter(item => item.CCType === 'Support').length}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
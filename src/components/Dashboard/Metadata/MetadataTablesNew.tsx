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
import { 
  useOccupancyRegister, 
  useOTRegister, 
  useConsumptionData, 
  useConnectedLoad, 
  useFixedAssetRegister, 
  useTATData, 
  useCostCenter, 
  useSecondaryCostDriver 
} from '../../../hooks/useNewTables';
import { Bed, Activity, Package, Zap, Building, Clock, Target, BarChart3 } from 'lucide-react';

// Column definitions for each table
const occupancyColumns: TableColumn[] = [
  { key: 'nature_of_data', label: 'Nature of Data', width: '120px', sortable: true },
  { key: 'uhid', label: 'UHID', width: '100px', sortable: true },
  { key: 'patient_admission_date', label: 'Admission Date', width: '130px', type: 'date', sortable: true },
  { key: 'patient_discharge_date', label: 'Discharge Date', width: '130px', type: 'date', sortable: true },
  { key: 'ipd_number', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'ward_name', label: 'Ward Name', width: '150px', sortable: true },
  { key: 'bed_number', label: 'Bed Number', width: '100px', sortable: true },
  { key: 'length_of_stay_in_hours', label: 'Stay Hours', width: '100px', type: 'number', sortable: true },
  { key: 'bed_category_name', label: 'Bed Category', width: '120px', sortable: true },
  { key: 'payor_type', label: 'Payor Type', width: '100px', sortable: true },
  { key: 'service_name', label: 'Service Name', width: '150px', sortable: true }
];

const otRegisterColumns: TableColumn[] = [
  { key: 'serial_no', label: 'S.No.', width: '80px', sortable: true },
  { key: 'uhid', label: 'UHID', width: '100px', sortable: true },
  { key: 'service_date', label: 'Service Date', width: '120px', type: 'date', sortable: true },
  { key: 'service_name', label: 'Service Name', width: '180px', sortable: true },
  { key: 'performing_doctor_name', label: 'Doctor Name', width: '150px', sortable: true },
  { key: 'performing_doctor_department', label: 'Department', width: '120px', sortable: true },
  { key: 'anesthesia_type', label: 'Anesthesia', width: '100px', sortable: true },
  { key: 'type_of_procedure', label: 'Procedure Type', width: '130px', sortable: true },
  { key: 'nature_of_procedure', label: 'Nature', width: '100px', sortable: true },
  { key: 'operation_theatre_name', label: 'OT Name', width: '120px', sortable: true },
  { key: 'procedure_time', label: 'Procedure Time', width: '120px', sortable: true },
  { key: 'total_time', label: 'Total Time', width: '100px', sortable: true },
  { key: 'payor_type', label: 'Payor Type', width: '100px', sortable: true }
];

const consumptionColumns: TableColumn[] = [
  { key: 'serial_no', label: 'S.No.', width: '80px', sortable: true },
  { key: 'cost_centre', label: 'Cost Centre', width: '150px', sortable: true },
  { key: 'sub_cost_centre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'transaction_date', label: 'Transaction Date', width: '130px', type: 'date', sortable: true },
  { key: 'sku_name', label: 'SKU Name', width: '180px', sortable: true },
  { key: 'ledger_name', label: 'Ledger Name', width: '150px', sortable: true },
  { key: 'quantity', label: 'Quantity', width: '100px', type: 'number', sortable: true },
  { key: 'rate', label: 'Rate', width: '100px', type: 'currency', sortable: true },
  { key: 'transaction_value', label: 'Value', width: '120px', type: 'currency', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '200px', sortable: true }
];

const connectedLoadColumns: TableColumn[] = [
  { key: 'serial_no', label: 'S.No.', width: '80px', sortable: true },
  { key: 'sub_cost_centre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'connected_load', label: 'Connected Load', width: '130px', type: 'number', sortable: true },
  { key: 'running_load', label: 'Running Load', width: '120px', type: 'number', sortable: true },
  { key: 'standby_load', label: 'Standby Load', width: '120px', type: 'number', sortable: true },
  { key: 'days', label: 'Days', width: '80px', type: 'number', sortable: true },
  { key: 'hours', label: 'Hours', width: '80px', type: 'number', sortable: true },
  { key: 'total_load_kg', label: 'Total Load (kWh)', width: '130px', type: 'number', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '200px', sortable: true }
];

const fixedAssetColumns: TableColumn[] = [
  { key: 'serial_no', label: 'S.No.', width: '80px', sortable: true },
  { key: 'sub_cost_centre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'bio_medical_equipments', label: 'Bio Medical', width: '130px', type: 'currency', sortable: true },
  { key: 'engineering_equipments', label: 'Engineering', width: '130px', type: 'currency', sortable: true },
  { key: 'furniture_fixture', label: 'Furniture', width: '120px', type: 'currency', sortable: true },
  { key: 'others', label: 'Others', width: '100px', type: 'currency', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '200px', sortable: true }
];

const tatColumns: TableColumn[] = [
  { key: 'serial_no', label: 'S.No.', width: '80px', sortable: true },
  { key: 'sub_cost_centre', label: 'Sub Cost Centre', width: '200px', sortable: true },
  { key: 'tat', label: 'TAT', width: '150px', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '300px', sortable: true }
];

const costCenterColumns: TableColumn[] = [
  { key: 'cc_type', label: 'CC Type', width: '100px', sortable: true },
  { key: 'cost_centre_code', label: 'Cost Centre Code', width: '130px', sortable: true },
  { key: 'cost_centre', label: 'Cost Centre', width: '150px', sortable: true },
  { key: 'sub_cost_centre', label: 'Sub Cost Centre', width: '150px', sortable: true },
  { key: 'alias_name', label: 'Alias Name', width: '150px', sortable: true },
  { key: 'cost_driver', label: 'Cost Driver', width: '150px', sortable: true },
  { key: 'source_of_driver', label: 'Source of Driver', width: '130px', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '200px', sortable: true }
];

export function MetadataTablesNew() {
  const [activeTable, setActiveTable] = useState<'occupancy' | 'ot-register' | 'consumption' | 'connected-load' | 'fixed-asset' | 'tat' | 'cost-center' | 'secondary-cost'>('occupancy');
  
  // Use hooks for each table
  const { occupancyData, isLoading: occupancyLoading, error: occupancyError } = useOccupancyRegister();
  const { otRegisterData, isLoading: otLoading, error: otError } = useOTRegister();
  const { consumptionData, isLoading: consumptionLoading, error: consumptionError } = useConsumptionData();
  const { connectedLoadData, isLoading: connectedLoadLoading, error: connectedLoadError } = useConnectedLoad();
  const { fixedAssetData, isLoading: fixedAssetLoading, error: fixedAssetError } = useFixedAssetRegister();
  const { tatData, isLoading: tatLoading, error: tatError } = useTATData();
  const { costCenterData, isLoading: costCenterLoading, error: costCenterError } = useCostCenter();
  const { secondaryCostData, isLoading: secondaryCostLoading, error: secondaryCostError } = useSecondaryCostDriver();

  const isLoading = occupancyLoading || otLoading || consumptionLoading || connectedLoadLoading || 
                   fixedAssetLoading || tatLoading || costCenterLoading || secondaryCostLoading;
  const error = occupancyError || otError || consumptionError || connectedLoadError || 
                fixedAssetError || tatError || costCenterError || secondaryCostError;
  const handleRowClick = (row: any) => {
    console.log('Metadata row clicked:', row);
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case 'occupancy':
        return occupancyData;
      case 'ot-register':
        return otRegisterData;
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
              This table contains {Object.keys(secondaryCostData[0] || {}).length} columns with extensive cost driver data. 
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTable === 'occupancy' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Admissions</h3>
              <p className="text-2xl font-bold text-primary-900">
                {new Set(occupancyData.map(item => item.uhid)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Stay Hours</h3>
              <p className="text-2xl font-bold text-blue-600">
                {occupancyData.length > 0 ? 
                  Math.round(occupancyData.reduce((sum, item) => sum + (item.length_of_stay_in_hours || 0), 0) / occupancyData.length) : 0}h
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">ICU Stays</h3>
              <p className="text-2xl font-bold text-red-600">
                {occupancyData.filter(item => item.ward_category_code === 'ICU').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Insurance Patients</h3>
              <p className="text-2xl font-bold text-green-600">
                {occupancyData.filter(item => item.payor_type === 'Insurance').length}
              </p>
            </div>
          </>
        )}

        {activeTable === 'ot-register' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Procedures</h3>
              <p className="text-2xl font-bold text-primary-900">{otRegisterData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Emergency Cases</h3>
              <p className="text-2xl font-bold text-red-600">
                {otRegisterData.filter(item => item.nature_of_procedure === 'Emergency').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Elective Cases</h3>
              <p className="text-2xl font-bold text-green-600">
                {otRegisterData.filter(item => item.nature_of_procedure === 'Elective').length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Procedure Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {otRegisterData.length > 0 ? 
                  Math.round(otRegisterData.reduce((sum, item) => sum + (parseInt(item.procedure_time) || 0), 0) / otRegisterData.length) : 0} min
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
                ${consumptionData.reduce((sum, item) => sum + (item.transaction_value || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Cost Centres</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(consumptionData.map(item => item.cost_centre)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Quantity</h3>
              <p className="text-2xl font-bold text-purple-600">
                {consumptionData.reduce((sum, item) => sum + (item.quantity || 0), 0)}
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
                {activeTable === 'connected-load' ? new Set(connectedLoadData.map(item => item.sub_cost_centre)).size :
                 activeTable === 'fixed-asset' ? new Set(fixedAssetData.map(item => item.sub_cost_centre)).size :
                 activeTable === 'tat' ? new Set(tatData.map(item => item.sub_cost_centre)).size :
                 new Set(costCenterData.map(item => item.cost_centre)).size}
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
                {activeTable === 'connected-load' ? connectedLoadData.reduce((sum, item) => sum + (item.total_load_kg || 0), 0).toLocaleString() :
                 activeTable === 'fixed-asset' ? `$${fixedAssetData.reduce((sum, item) => sum + (item.bio_medical_equipments || 0) + (item.engineering_equipments || 0) + (item.furniture_fixture || 0) + (item.others || 0), 0).toLocaleString()}` :
                 activeTable === 'tat' ? 'Variable' :
                 costCenterData.filter(item => item.cc_type === 'Revenue').length}
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
                {activeTable === 'connected-load' ? `${connectedLoadData.length > 0 ? Math.round(connectedLoadData.reduce((sum, item) => sum + (item.connected_load || 0), 0) / connectedLoadData.length) : 0} kW` :
                 activeTable === 'fixed-asset' ? `$${fixedAssetData.reduce((sum, item) => sum + (item.bio_medical_equipments || 0), 0).toLocaleString()}` :
                 activeTable === 'tat' ? tatData.length :
                 costCenterData.filter(item => item.cc_type === 'Support').length}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
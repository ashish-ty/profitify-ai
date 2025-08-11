import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../Common/DataTable';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Download,
  Filter,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useCostAnalysis, ServiceCostRecord } from '../../hooks/useCostAnalysis';

const costAnalysisColumns: TableColumn[] = [
  { key: 'ipd_number', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'bill_no', label: 'Bill No', width: '100px', sortable: true },
  { key: 'service_name', label: 'Service Name', width: '200px', sortable: true },
  { key: 'doctor_name', label: 'Doctor', width: '150px', sortable: true },
  { key: 'cm', label: 'Materials (CM)', width: '120px', type: 'currency', sortable: true },
  { key: 'ew', label: 'Expense Wise (EW)', width: '130px', type: 'currency', sortable: true },
  { key: 'hr', label: 'HR Cost', width: '100px', type: 'currency', sortable: true },
  { key: 'cn', label: 'Utilities (CN)', width: '120px', type: 'currency', sortable: true },
  { key: 'pharmacy_charged_to_patient', label: 'Pharmacy', width: '120px', type: 'currency', sortable: true },
  { key: 'medical_surgical_consumables_charged_to_patient', label: 'Med Consumables', width: '130px', type: 'currency', sortable: true },
  { key: 'implants_and_prosthetics_charged_to_patient', label: 'Implants', width: '120px', type: 'currency', sortable: true },
  { key: 'fee_for_service', label: 'Service Fee', width: '120px', type: 'currency', sortable: true },
  { key: 'incentives_to_consultants_treating_doctors', label: 'Doctor Incentives', width: '130px', type: 'currency', sortable: true },
  { key: 'patient_food_beverages_outsource_service', label: 'Food & Beverages', width: '130px', type: 'currency', sortable: true },
  { key: 'laboratory_test_outsource_service', label: 'Lab Outsource', width: '120px', type: 'currency', sortable: true },
  { key: 'any_other_patient_related_outsourced_services_1', label: 'Other Outsource 1', width: '140px', type: 'currency', sortable: true },
  { key: 'any_other_patient_related_outsourced_services_2', label: 'Other Outsource 2', width: '140px', type: 'currency', sortable: true },
  { key: 'any_other_patient_related_outsourced_services_3', label: 'Other Outsource 3', width: '140px', type: 'currency', sortable: true },
  { key: 'brokerage_commission', label: 'Brokerage', width: '120px', type: 'currency', sortable: true },
  { key: 'provision_for_deduction_bad_debts', label: 'Bad Debts', width: '120px', type: 'currency', sortable: true }
];

export function ServiceWiseCostAnalysis() {
  const [filters, setFilters] = useState({
    month: '',
    year: new Date().getFullYear(),
    department: '',
    service_name: '',
    patient_type: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { costAnalysisData, isLoading, error, fetchCostAnalysis } = useCostAnalysis();

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== 0)
    );
    await fetchCostAnalysis(activeFilters);
  };

  const handleRefresh = async () => {
    await fetchCostAnalysis();
  };

  const handleRowClick = (row: ServiceCostRecord) => {
    console.log('Cost analysis row clicked:', row);
  };

  const exportToCSV = () => {
    if (!costAnalysisData.length) return;
    
    const headers = costAnalysisColumns.map(col => col.label).join(',');
    const rows = costAnalysisData.map(row => 
      costAnalysisColumns.map(col => row[col.key as keyof ServiceCostRecord]).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service_wise_cost_analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    if (!costAnalysisData.length) return null;

    const totalAllocatedCosts = costAnalysisData.reduce((sum, record) => 
      sum + record.cm + record.ew + record.hr + record.cn, 0
    );

    const totalVariableCosts = costAnalysisData.reduce((sum, record) => 
      sum + record.pharmacy_charged_to_patient + 
      record.medical_surgical_consumables_charged_to_patient +
      record.implants_and_prosthetics_charged_to_patient +
      record.non_medical_consumables_charged_to_patient +
      record.fee_for_service +
      record.incentives_to_consultants_treating_doctors +
      record.patient_food_beverages_outsource_service +
      record.laboratory_test_outsource_service +
      record.any_other_patient_related_outsourced_services_1 +
      record.any_other_patient_related_outsourced_services_2 +
      record.any_other_patient_related_outsourced_services_3 +
      record.brokerage_commission +
      record.provision_for_deduction_bad_debts, 0
    );

    const totalCosts = totalAllocatedCosts + totalVariableCosts;
    const totalPharmacy = costAnalysisData.reduce((sum, record) => sum + record.pharmacy_charged_to_patient, 0);
    const totalImplants = costAnalysisData.reduce((sum, record) => sum + record.implants_and_prosthetics_charged_to_patient, 0);

    return {
      totalServices: costAnalysisData.length,
      totalAllocatedCosts,
      totalVariableCosts,
      totalCosts,
      totalPharmacy,
      totalImplants,
      avgAllocatedCostPerService: totalAllocatedCosts / costAnalysisData.length,
      avgVariableCostPerService: totalVariableCosts / costAnalysisData.length
    };
  };

  const summaryMetrics = calculateSummaryMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Service-wise Cost Analysis</h1>
          <p className="text-accent-600">AI-powered activity-based costing with detailed service-level breakdown</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Service-wise Cost Analysis</h1>
          <p className="text-accent-600">AI-powered activity-based costing with detailed service-level breakdown</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Service-wise Cost Analysis</h1>
          <p className="text-accent-600">AI-powered activity-based costing with detailed service-level breakdown</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-accent-300 rounded-lg hover:bg-accent-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Analysis Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Months</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[2024, 2023, 2022].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Oncology">Oncology</option>
                <option value="Neurology">Neurology</option>
                <option value="Gynaecology">Gynaecology</option>
                <option value="Radiology">Radiology</option>
                <option value="Laboratory">Laboratory</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Patient Type</label>
              <select
                value={filters.patient_type}
                onChange={(e) => handleFilterChange('patient_type', e.target.value)}
                className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="IPD">IPD</option>
                <option value="OPD">OPD</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Cost Analysis Table */}
      <DataTable
        columns={costAnalysisColumns}
        data={costAnalysisData}
        title="Service-wise Cost Analysis"
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        filterable={false}
        exportable={true}
        pageSize={15}
      />

      {/* Summary Cards */}
      {summaryMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-sm font-medium text-accent-600 mb-2">Total Services</h3>
            <p className="text-2xl font-bold text-primary-900">{summaryMetrics.totalServices}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-sm font-medium text-accent-600 mb-2">Total Allocated Costs</h3>
            <p className="text-2xl font-bold text-blue-600">
              ₹{summaryMetrics.totalAllocatedCosts.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-sm font-medium text-accent-600 mb-2">Total Variable Costs</h3>
            <p className="text-2xl font-bold text-orange-600">
              ₹{summaryMetrics.totalVariableCosts.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-sm font-medium text-accent-600 mb-2">Total Costs</h3>
            <p className="text-2xl font-bold text-red-600">
              ₹{summaryMetrics.totalCosts.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Cost Breakdown Summary */}
      {summaryMetrics && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Cost Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Allocated Cost Structure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-600">Materials (CM):</span>
                  <span className="font-semibold text-primary-900">
                    ₹{costAnalysisData.reduce((sum, s) => sum + s.cm, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Expense Wise (EW):</span>
                  <span className="font-semibold text-primary-900">
                    ₹{costAnalysisData.reduce((sum, s) => sum + s.ew, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">HR Costs:</span>
                  <span className="font-semibold text-primary-900">
                    ₹{costAnalysisData.reduce((sum, s) => sum + s.hr, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Utilities (CN):</span>
                  <span className="font-semibold text-primary-900">
                    ₹{costAnalysisData.reduce((sum, s) => sum + s.cn, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Variable Cost Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Total Pharmacy:</span>
                  <span className="font-semibold text-green-600">
                    ₹{summaryMetrics.totalPharmacy.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Total Implants:</span>
                  <span className="font-semibold text-blue-600">
                    ₹{summaryMetrics.totalImplants.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Avg Variable Cost/Service:</span>
                  <span className="font-semibold text-primary-900">
                    ₹{summaryMetrics.avgVariableCostPerService.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Avg Allocated Cost/Service:</span>
                  <span className="font-semibold text-primary-900">
                    ₹{summaryMetrics.avgAllocatedCostPerService.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-primary-900 mb-3">Analysis Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-600">Unique Services:</span>
                  <span className="font-semibold text-primary-900">
                    {new Set(costAnalysisData.map(s => s.service_name)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Unique Doctors:</span>
                  <span className="font-semibold text-primary-900">
                    {new Set(costAnalysisData.map(s => s.doctor_name)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">IPD Services:</span>
                  <span className="font-semibold text-blue-600">
                    {costAnalysisData.filter(s => s.ipd_number && s.ipd_number !== '').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">OPD Services:</span>
                  <span className="font-semibold text-green-600">
                    {costAnalysisData.filter(s => !s.ipd_number || s.ipd_number === '').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Analysis Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Cost Analysis Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2 flex items-center">
              <Calculator className="h-4 w-4 mr-2 text-blue-600" />
              Activity-Based Costing
            </h4>
            <p className="text-sm text-accent-600 mb-2">
              This analysis shows the true cost of each service by allocating overhead costs based on actual resource consumption.
            </p>
            <div className="text-xs text-blue-600 font-medium">
              Allocated costs include: Materials (CM), Expenses (EW), HR, and Utilities (CN)
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2 text-green-600" />
              Cost Optimization
            </h4>
            <p className="text-sm text-accent-600 mb-2">
              Use this data to identify high-cost services and optimize resource allocation for better profitability.
            </p>
            <div className="text-xs text-green-600 font-medium">
              Focus on services with high allocated costs relative to their revenue potential
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
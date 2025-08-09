import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../Common/DataTable';
import { ChartTableToggle } from '../Common/ChartTableToggle';
import { MetricCard } from '../Tools/Charts/MetricCard';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { useCostAnalysis } from '../../hooks/useCostAnalysis';
import { ChartData, MetricCard as MetricCardType } from '../../types';

const costAnalysisColumns: TableColumn[] = [
  { key: 'service_name', label: 'Service Name', width: '200px', sortable: true },
  { key: 'department', label: 'Department', width: '120px', sortable: true },
  { key: 'total_revenue', label: 'Revenue', width: '120px', type: 'currency', sortable: true },
  { key: 'total_quantity', label: 'Quantity', width: '80px', type: 'number', sortable: true },
  { key: 'revenue_per_unit', label: 'Revenue/Unit', width: '120px', type: 'currency', sortable: true },
  { key: 'direct_pharmacy_cost', label: 'Pharmacy Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'direct_materials_cost', label: 'Materials Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'direct_labor_cost', label: 'Labor Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'allocated_overhead_cost', label: 'Overhead Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'allocated_utilities_cost', label: 'Utilities Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'allocated_admin_cost', label: 'Admin Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'total_allocated_cost', label: 'Total Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'cost_per_unit', label: 'Cost/Unit', width: '120px', type: 'currency', sortable: true },
  { key: 'profit', label: 'Profit', width: '120px', type: 'currency', sortable: true },
  { key: 'profit_margin_percent', label: 'Margin %', width: '100px', type: 'percentage', sortable: true },
  { key: 'cost_efficiency_score', label: 'Efficiency Score', width: '120px', type: 'number', sortable: true },
  { key: 'profitability_rank', label: 'Rank', width: '80px', type: 'number', sortable: true },
  { key: 'cost_optimization_potential', label: 'Optimization', width: '120px', sortable: true }
];

export function ServiceWiseCostAnalysis() {
  const [filters, setFilters] = useState({
    month: '',
    year: new Date().getFullYear(),
    department: '',
    service_name: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    costAnalysis, 
    summaryMetrics, 
    departmentBreakdown,
    optimizationRecommendations,
    isLoading, 
    error, 
    fetchCostAnalysis,
    fetchSummaryMetrics,
    fetchDepartmentBreakdown,
    fetchOptimizationRecommendations,
    exportCostAnalysis
  } = useCostAnalysis();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCostAnalysis(filters),
        fetchSummaryMetrics(filters),
        fetchDepartmentBreakdown(filters),
        fetchOptimizationRecommendations()
      ]);
    };
    loadData();
  }, []);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    await Promise.all([
      fetchCostAnalysis(filters),
      fetchSummaryMetrics(filters),
      fetchDepartmentBreakdown(filters)
    ]);
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await exportCostAnalysis(format, filters);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleRefresh = async () => {
    await handleApplyFilters();
  };

  // Create metrics cards
  const metricsCards: MetricCardType[] = summaryMetrics ? [
    {
      title: 'Total Services',
      value: summaryMetrics.total_services.toString(),
      change: '+5',
      trend: 'up',
      icon: Calculator
    },
    {
      title: 'Total Revenue',
      value: `$${(summaryMetrics.total_revenue / 1000).toFixed(0)}K`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Total Costs',
      value: `$${(summaryMetrics.total_allocated_costs / 1000).toFixed(0)}K`,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingDown
    },
    {
      title: 'Avg Margin',
      value: `${summaryMetrics.overall_profit_margin.toFixed(1)}%`,
      change: '+3.1%',
      trend: 'up',
      icon: Target
    }
  ] : [];

  // Create department chart data
  const departmentChartData: ChartData[] = departmentBreakdown?.departments?.map(dept => ({
    month: dept.department,
    value: dept.profit_margin
  })) || [];

  // Create cost breakdown chart data
  const costBreakdownData: ChartData[] = summaryMetrics?.cost_breakdown ? [
    { month: 'Pharmacy', value: summaryMetrics.cost_breakdown.pharmacy_percent },
    { month: 'Materials', value: summaryMetrics.cost_breakdown.materials_percent },
    { month: 'Labor', value: summaryMetrics.cost_breakdown.labor_percent },
    { month: 'Overhead', value: summaryMetrics.cost_breakdown.overhead_percent }
  ] : [];

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
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Analysis Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartTableToggle
          title="Department Profit Margins (%)"
          chartData={departmentChartData}
          tableColumns={[
            { key: 'department', label: 'Department', type: 'text' },
            { key: 'profit_margin', label: 'Profit Margin', type: 'percentage' },
            { key: 'total_revenue', label: 'Revenue', type: 'currency' },
            { key: 'service_count', label: 'Services', type: 'number' }
          ]}
          tableData={departmentBreakdown?.departments?.map(dept => ({
            department: dept.department,
            profit_margin: dept.profit_margin,
            total_revenue: dept.total_revenue,
            service_count: dept.service_count
          })) || []}
          chartColor="bg-primary-600"
        />
        
        <ChartTableToggle
          title="Cost Breakdown by Type (%)"
          chartData={costBreakdownData}
          tableColumns={[
            { key: 'cost_type', label: 'Cost Type', type: 'text' },
            { key: 'percentage', label: 'Percentage', type: 'percentage' },
            { key: 'amount', label: 'Amount', type: 'currency' }
          ]}
          tableData={costBreakdownData.map(item => ({
            cost_type: item.month,
            percentage: item.value,
            amount: summaryMetrics ? (summaryMetrics.total_allocated_costs * item.value / 100) : 0
          }))}
          chartColor="bg-purple-600"
        />
      </div>

      {/* Main Cost Analysis Table */}
      <DataTable
        columns={costAnalysisColumns}
        data={costAnalysis?.services || []}
        title="Service-wise Cost Analysis"
        isLoading={isLoading}
        searchable={true}
        filterable={false}
        exportable={true}
        pageSize={15}
      />

      {/* Optimization Recommendations */}
      {optimizationRecommendations && optimizationRecommendations.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Cost Optimization Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationRecommendations.recommendations.slice(0, 4).map((rec, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-primary-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-primary-900 flex items-center">
                    {rec.type === 'cost_reduction' ? (
                      <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    )}
                    {rec.service}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-accent-600 mb-2">{rec.recommendation}</p>
                <div className="text-xs text-primary-600 font-medium">{rec.potential_impact}</div>
                <div className="mt-2">
                  <div className="text-xs text-accent-500">Current Margin: {rec.current_margin.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {summaryMetrics && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Cost Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Performance Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-600">Most Profitable:</span>
                  <span className="font-semibold text-green-600">
                    {summaryMetrics.most_profitable_service.name} ({summaryMetrics.most_profitable_service.margin.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Least Profitable:</span>
                  <span className="font-semibold text-red-600">
                    {summaryMetrics.least_profitable_service.name} ({summaryMetrics.least_profitable_service.margin.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Overall Margin:</span>
                  <span className="font-semibold text-primary-900">{summaryMetrics.overall_profit_margin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Cost Structure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-600">Pharmacy Costs:</span>
                  <span className="font-semibold text-primary-900">{summaryMetrics.cost_breakdown.pharmacy_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Materials Costs:</span>
                  <span className="font-semibold text-primary-900">{summaryMetrics.cost_breakdown.materials_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Labor Costs:</span>
                  <span className="font-semibold text-primary-900">{summaryMetrics.cost_breakdown.labor_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Overhead Costs:</span>
                  <span className="font-semibold text-primary-900">{summaryMetrics.cost_breakdown.overhead_percent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Optimization Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">High Potential:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-orange-600">{summaryMetrics.optimization_opportunities.high_potential}</span>
                    <span className="text-orange-600">services</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Critical Services:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-red-600">{summaryMetrics.optimization_opportunities.critical_services}</span>
                    <span className="text-red-600">services</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Status:</span>
                  <div className="flex items-center space-x-1">
                    {summaryMetrics.optimization_opportunities.critical_services === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      summaryMetrics.optimization_opportunities.critical_services === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summaryMetrics.optimization_opportunities.critical_services === 0 ? 'Healthy' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { ChartTableToggle, TableColumn, TableRow } from '../Common/ChartTableToggle';
import { MetricCard } from './Charts/MetricCard';
import { Building2, Users, Activity, Bed, Clock, TrendingUp, Zap, Target } from 'lucide-react';
import { ChartData, MetricCard as MetricCardType } from '../../types';

// Dummy data for metadata analytics
const occupancyData: ChartData[] = [
  { month: 'ICU', value: 85 },
  { month: 'General', value: 72 },
  { month: 'Private', value: 68 },
  { month: 'Emergency', value: 95 },
  { month: 'OT', value: 78 },
  { month: 'Cath Lab', value: 82 },
];

const utilizationTrends: ChartData[] = [
  { month: 'Jan', value: 75 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 82 },
  { month: 'Apr', value: 79 },
  { month: 'May', value: 85 },
  { month: 'Jun', value: 88 },
];

const metrics: MetricCardType[] = [
  {
    title: 'Overall Occupancy',
    value: '78.5%',
    change: '+5.2%',
    trend: 'up',
    icon: Building2
  },
  {
    title: 'Staff Utilization',
    value: '82.3%',
    change: '+3.1%',
    trend: 'up',
    icon: Users
  },
  {
    title: 'Equipment Efficiency',
    value: '76.8%',
    change: '+2.8%',
    trend: 'up',
    icon: Activity
  },
  {
    title: 'Avg Length of Stay',
    value: '4.2 days',
    change: '-0.3 days',
    trend: 'down',
    icon: Clock
  }
];

export function MetadataAnalytics() {
  const [selectedView, setSelectedView] = useState('occupancy');

  const viewOptions = [
    { id: 'occupancy', name: 'Occupancy Analysis' },
    { id: 'utilization', name: 'Resource Utilization' },
    { id: 'efficiency', name: 'Operational Efficiency' }
  ];

  return (
    <ToolLayout
      title="Metadata Analytics"
      description="Hospital operational analytics including capacity utilization and efficiency metrics"
    >
      <div className="space-y-8">
        {/* View Selector */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">Analysis View</h3>
          <div className="flex space-x-2">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedView(option.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedView === option.id
                    ? 'bg-primary-900 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartTableToggle
            title="Department Occupancy Rates (%)"
            chartData={occupancyData}
            tableColumns={[
              { key: 'department', label: 'Department', type: 'text' },
              { key: 'occupancy', label: 'Occupancy', type: 'percentage' },
              { key: 'capacity', label: 'Capacity', type: 'number' },
              { key: 'status', label: 'Status', type: 'text' }
            ]}
            tableData={occupancyData.map(item => ({
              department: item.month,
              occupancy: item.value,
              capacity: Math.round(item.value * 1.2),
              status: item.value > 80 ? 'High' : item.value > 60 ? 'Medium' : 'Low'
            }))}
            chartColor="bg-blue-600"
            className="mb-8"
          />
          <ChartTableToggle
            title="Monthly Utilization Trend (%)"
            chartData={utilizationTrends}
            tableColumns={[
              { key: 'month', label: 'Month', type: 'text' },
              { key: 'utilization', label: 'Utilization', type: 'percentage' },
              { key: 'change', label: 'Change', type: 'percentage' }
            ]}
            tableData={utilizationTrends.map((item, index) => ({
              month: item.month,
              utilization: item.value,
              change: index > 0 ? item.value - utilizationTrends[index - 1].value : 0
            }))}
            chartColor="bg-green-600"
            chartType="line"
            className="mb-8"
          />
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Capacity Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Beds</span>
                <span className="font-semibold text-primary-900">250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">ICU Beds</span>
                <span className="font-semibold text-primary-900">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Operating Theaters</span>
                <span className="font-semibold text-primary-900">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Cath Labs</span>
                <span className="font-semibold text-primary-900">3</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Staff Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Staff</span>
                <span className="font-semibold text-primary-900">485</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Doctors</span>
                <span className="font-semibold text-primary-900">65</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Nurses</span>
                <span className="font-semibold text-primary-900">220</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Support Staff</span>
                <span className="font-semibold text-primary-900">200</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Performance Status</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Good</div>
              <div className="text-accent-600 mb-2">Above Average Performance</div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                Top 30% Performer
              </div>
              <div className="text-xs text-accent-500">
                Outperforming 70% of similar hospitals
              </div>
            </div>
          </div>
        </div>

        {/* Operational Insights */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Operational Efficiency Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Resource Utilization</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Bed Turnover Rate</span>
                  <span className="font-semibold text-green-600">2.8 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">OT Utilization</span>
                  <span className="font-semibold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Equipment Uptime</span>
                  <span className="font-semibold text-green-600">96.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Staff Productivity</span>
                  <span className="font-semibold text-blue-600">82.3%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Quality Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Patient Satisfaction</span>
                  <span className="font-semibold text-green-600">4.6/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Readmission Rate</span>
                  <span className="font-semibold text-green-600">8.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Infection Rate</span>
                  <span className="font-semibold text-green-600">1.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Mortality Rate</span>
                  <span className="font-semibold text-green-600">2.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Operational Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Bed className="h-4 w-4 mr-2 text-blue-600" />
                Capacity Optimization
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                ICU occupancy is at 85%. Consider adding 2-3 more ICU beds to meet demand.
              </p>
              <div className="text-xs text-green-600 font-medium">Potential revenue increase: $180K/year</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                Staff Efficiency
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Implement flexible scheduling to improve staff utilization by 8-10%.
              </p>
              <div className="text-xs text-green-600 font-medium">Cost savings: $25,000/month</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                Equipment Utilization
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                OT utilization can be improved by optimizing surgery scheduling and reducing changeover time.
              </p>
              <div className="text-xs text-green-600 font-medium">Additional procedures: 15-20/month</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-purple-600" />
                Quality Improvement
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Focus on reducing average length of stay by 0.5 days through better discharge planning.
              </p>
              <div className="text-xs text-green-600 font-medium">Bed availability: +12%</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
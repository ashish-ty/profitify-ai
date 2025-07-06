import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { ChartTableToggle, TableColumn, TableRow } from '../Common/ChartTableToggle';
import { MetricCard } from './Charts/MetricCard';
import { 
  DollarSign, 
  Activity, 
  Stethoscope, 
  Users, 
  Bed, 
  Scissors, 
  Building2,
  TrendingUp,
  PieChart,
  Target
} from 'lucide-react';
import { ChartData, MetricCard as MetricCardType } from '../../types';

const profitabilityLevels = [
  {
    id: 'net-figures',
    title: 'Net Figures',
    description: 'Overall hospital profitability analysis',
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: 'service-level',
    title: 'Service Level',
    description: 'Profitability by individual services',
    icon: Activity,
    color: 'text-blue-600'
  },
  {
    id: 'specialty-level',
    title: 'Specialty Level',
    description: 'Department and specialty profitability',
    icon: Stethoscope,
    color: 'text-purple-600'
  },
  {
    id: 'doctor-level',
    title: 'Doctor Level',
    description: 'Individual doctor performance analysis',
    icon: Users,
    color: 'text-orange-600'
  },
  {
    id: 'bed-level',
    title: 'Bed Level',
    description: 'Bed utilization and profitability',
    icon: Bed,
    color: 'text-cyan-600'
  },
  {
    id: 'ot-level',
    title: 'OT Level',
    description: 'Operating theater efficiency analysis',
    icon: Scissors,
    color: 'text-red-600'
  },
  {
    id: 'cath-lab-level',
    title: 'Cath Lab Level',
    description: 'Catheterization lab performance',
    icon: Building2,
    color: 'text-indigo-600'
  }
];

// Dummy data for different levels
const getLevelData = (level: string) => {
  switch (level) {
    case 'net-figures':
      return {
        chartData: [
          { month: 'Revenue', value: 3285000 },
          { month: 'Expenses', value: 2770000 },
          { month: 'Net Profit', value: 515000 }
        ],
        tableColumns: [
          { key: 'category', label: 'Category', type: 'text' as const },
          { key: 'amount', label: 'Amount', type: 'currency' as const },
          { key: 'percentage', label: 'Percentage', type: 'percentage' as const },
          { key: 'change', label: 'Change', type: 'percentage' as const }
        ],
        tableData: [
          { category: 'Total Revenue', amount: 3285000, percentage: 100, change: 12.5 },
          { category: 'Total Expenses', amount: 2770000, percentage: 84.3, change: 8.2 },
          { category: 'Net Profit', amount: 515000, percentage: 15.7, change: 18.7 }
        ],
        metrics: [
          { title: 'Total Revenue', value: '$3.29M', change: '+12.5%', trend: 'up' as const, icon: DollarSign },
          { title: 'Total Expenses', value: '$2.77M', change: '+8.2%', trend: 'up' as const, icon: TrendingUp },
          { title: 'Net Profit', value: '$515K', change: '+18.7%', trend: 'up' as const, icon: Target },
          { title: 'Profit Margin', value: '15.7%', change: '+2.3%', trend: 'up' as const, icon: PieChart }
        ]
      };
    case 'specialty-level':
      return {
        chartData: [
          { month: 'Cardiology', value: 850000 },
          { month: 'Oncology', value: 720000 },
          { month: 'Neurology', value: 650000 },
          { month: 'Gynaecology', value: 580000 }
        ],
        tableColumns: [
          { key: 'specialty', label: 'Specialty', type: 'text' as const },
          { key: 'revenue', label: 'Revenue', type: 'currency' as const },
          { key: 'costs', label: 'Costs', type: 'currency' as const },
          { key: 'profit', label: 'Profit', type: 'currency' as const },
          { key: 'margin', label: 'Margin', type: 'percentage' as const },
          { key: 'patients', label: 'Patients', type: 'number' as const }
        ],
        tableData: [
          { specialty: 'Cardiology', revenue: 850000, costs: 637500, profit: 212500, margin: 25.0, patients: 3500 },
          { specialty: 'Oncology', revenue: 720000, costs: 576000, profit: 144000, margin: 20.0, patients: 2800 },
          { specialty: 'Neurology', revenue: 650000, costs: 520000, profit: 130000, margin: 20.0, patients: 3200 },
          { specialty: 'Gynaecology', revenue: 580000, costs: 406000, profit: 174000, margin: 30.0, patients: 2900 }
        ],
        metrics: [
          { title: 'Top Specialty', value: 'Cardiology', change: '$850K', trend: 'up' as const, icon: Stethoscope },
          { title: 'Avg Margin', value: '23.8%', change: '+3.1%', trend: 'up' as const, icon: PieChart },
          { title: 'Best Performer', value: 'Gynaecology', change: '30%', trend: 'up' as const, icon: Target },
          { title: 'Total Specialties', value: '4', change: 'Active', trend: 'up' as const, icon: Activity }
        ]
      };
    case 'doctor-level':
      return {
        chartData: [
          { month: 'Dr. Smith', value: 285000 },
          { month: 'Dr. Johnson', value: 245000 },
          { month: 'Dr. Brown', value: 220000 },
          { month: 'Dr. Wilson', value: 195000 }
        ],
        tableColumns: [
          { key: 'doctor', label: 'Doctor', type: 'text' as const },
          { key: 'specialty', label: 'Specialty', type: 'text' as const },
          { key: 'revenue', label: 'Revenue', type: 'currency' as const },
          { key: 'patients', label: 'Patients', type: 'number' as const },
          { key: 'revenuePerPatient', label: 'Revenue/Patient', type: 'currency' as const },
          { key: 'satisfaction', label: 'Satisfaction', type: 'text' as const }
        ],
        tableData: [
          { doctor: 'Dr. Smith', specialty: 'Cardiology', revenue: 285000, patients: 875, revenuePerPatient: 326, satisfaction: '4.8/5' },
          { doctor: 'Dr. Johnson', specialty: 'Oncology', revenue: 245000, patients: 700, revenuePerPatient: 350, satisfaction: '4.7/5' },
          { doctor: 'Dr. Brown', specialty: 'Neurology', revenue: 220000, patients: 800, revenuePerPatient: 275, satisfaction: '4.6/5' },
          { doctor: 'Dr. Wilson', specialty: 'Gynaecology', revenue: 195000, patients: 725, revenuePerPatient: 269, satisfaction: '4.9/5' }
        ],
        metrics: [
          { title: 'Top Performer', value: 'Dr. Smith', change: '$285K', trend: 'up' as const, icon: Users },
          { title: 'Avg Revenue/Doctor', value: '$236K', change: '+8.5%', trend: 'up' as const, icon: DollarSign },
          { title: 'Patient Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' as const, icon: Target },
          { title: 'Active Doctors', value: '12', change: '+2', trend: 'up' as const, icon: Activity }
        ]
      };
    case 'service-level':
      return {
        chartData: [
          { month: 'Surgery', value: 450000 },
          { month: 'Diagnostics', value: 320000 },
          { month: 'Consultation', value: 180000 },
          { month: 'Emergency', value: 150000 }
        ],
        tableColumns: [
          { key: 'service', label: 'Service', type: 'text' as const },
          { key: 'revenue', label: 'Revenue', type: 'currency' as const },
          { key: 'volume', label: 'Volume', type: 'number' as const },
          { key: 'avgPrice', label: 'Avg Price', type: 'currency' as const },
          { key: 'margin', label: 'Margin', type: 'percentage' as const }
        ],
        tableData: [
          { service: 'Surgery', revenue: 450000, volume: 180, avgPrice: 2500, margin: 35.0 },
          { service: 'Diagnostics', revenue: 320000, volume: 1600, avgPrice: 200, margin: 45.0 },
          { service: 'Consultation', revenue: 180000, volume: 3600, avgPrice: 50, margin: 60.0 },
          { service: 'Emergency', revenue: 150000, volume: 300, avgPrice: 500, margin: 15.0 }
        ],
        metrics: [
          { title: 'Top Service', value: 'Surgery', change: '$450K', trend: 'up' as const, icon: Activity },
          { title: 'Highest Margin', value: 'Consultation', change: '60%', trend: 'up' as const, icon: PieChart },
          { title: 'Total Services', value: '25', change: 'Active', trend: 'up' as const, icon: Target },
          { title: 'Avg Margin', value: '38.8%', change: '+5%', trend: 'up' as const, icon: TrendingUp }
        ]
      };
    case 'bed-level':
      return {
        chartData: [
          { month: 'ICU', value: 85 },
          { month: 'General', value: 72 },
          { month: 'Private', value: 68 },
          { month: 'Emergency', value: 95 }
        ],
        tableColumns: [
          { key: 'bedType', label: 'Bed Type', type: 'text' as const },
          { key: 'occupancy', label: 'Occupancy', type: 'percentage' as const },
          { key: 'revenue', label: 'Revenue', type: 'currency' as const },
          { key: 'revenuePerBed', label: 'Revenue/Bed', type: 'currency' as const },
          { key: 'totalBeds', label: 'Total Beds', type: 'number' as const }
        ],
        tableData: [
          { bedType: 'ICU', occupancy: 85, revenue: 425000, revenuePerBed: 9444, totalBeds: 45 },
          { bedType: 'General', occupancy: 72, revenue: 288000, revenuePerBed: 1920, totalBeds: 150 },
          { bedType: 'Private', occupancy: 68, revenue: 204000, revenuePerBed: 4080, totalBeds: 50 },
          { bedType: 'Emergency', occupancy: 95, revenue: 95000, revenuePerBed: 9500, totalBeds: 10 }
        ],
        metrics: [
          { title: 'Avg Occupancy', value: '80%', change: '+5%', trend: 'up' as const, icon: Bed },
          { title: 'Revenue/Bed', value: '$4,986', change: '+12%', trend: 'up' as const, icon: DollarSign },
          { title: 'Total Beds', value: '255', change: '+10', trend: 'up' as const, icon: Building2 },
          { title: 'Utilization', value: '78.5%', change: '+3%', trend: 'up' as const, icon: Target }
        ]
      };
    case 'ot-level':
      return {
        chartData: [
          { month: 'OT 1', value: 82 },
          { month: 'OT 2', value: 75 },
          { month: 'OT 3', value: 88 },
          { month: 'Cath Lab', value: 90 }
        ],
        tableColumns: [
          { key: 'otName', label: 'OT Name', type: 'text' as const },
          { key: 'utilization', label: 'Utilization', type: 'percentage' as const },
          { key: 'procedures', label: 'Procedures', type: 'number' as const },
          { key: 'revenue', label: 'Revenue', type: 'currency' as const },
          { key: 'avgTime', label: 'Avg Time (hrs)', type: 'number' as const }
        ],
        tableData: [
          { otName: 'OT 1', utilization: 82, procedures: 156, revenue: 780000, avgTime: 2.5 },
          { otName: 'OT 2', utilization: 75, procedures: 142, revenue: 710000, avgTime: 2.8 },
          { otName: 'OT 3', utilization: 88, procedures: 168, revenue: 840000, avgTime: 2.3 },
          { otName: 'Cath Lab', utilization: 90, procedures: 95, revenue: 950000, avgTime: 1.8 }
        ],
        metrics: [
          { title: 'Avg Utilization', value: '83.8%', change: '+8%', trend: 'up' as const, icon: Scissors },
          { title: 'Total Procedures', value: '561', change: '+45', trend: 'up' as const, icon: Activity },
          { title: 'Revenue/Procedure', value: '$5,347', change: '+12%', trend: 'up' as const, icon: DollarSign },
          { title: 'Efficiency Score', value: '87%', change: '+5%', trend: 'up' as const, icon: Target }
        ]
      };
    case 'cath-lab-level':
      return {
        chartData: [
          { month: 'Cath Lab 1', value: 90 },
          { month: 'Cath Lab 2', value: 85 },
          { month: 'Cath Lab 3', value: 78 }
        ],
        tableColumns: [
          { key: 'labName', label: 'Lab Name', type: 'text' as const },
          { key: 'utilization', label: 'Utilization', type: 'percentage' as const },
          { key: 'procedures', label: 'Procedures', type: 'number' as const },
          { key: 'revenue', label: 'Revenue', type: 'currency' as const },
          { key: 'avgDuration', label: 'Avg Duration (hrs)', type: 'number' as const }
        ],
        tableData: [
          { labName: 'Cath Lab 1', utilization: 90, procedures: 85, revenue: 850000, avgDuration: 1.8 },
          { labName: 'Cath Lab 2', utilization: 85, procedures: 78, revenue: 780000, avgDuration: 2.0 },
          { labName: 'Cath Lab 3', utilization: 78, procedures: 65, revenue: 650000, avgDuration: 1.9 }
        ],
        metrics: [
          { title: 'Avg Utilization', value: '84.3%', change: '+6%', trend: 'up' as const, icon: Building2 },
          { title: 'Total Procedures', value: '228', change: '+28', trend: 'up' as const, icon: Activity },
          { title: 'Revenue/Procedure', value: '$10,088', change: '+15%', trend: 'up' as const, icon: DollarSign },
          { title: 'Success Rate', value: '98.5%', change: '+1%', trend: 'up' as const, icon: Target }
        ]
      };
    default:
      return {
        chartData: [],
        tableColumns: [],
        tableData: [],
        metrics: []
      };
  }
};

export function ProfitabilityAnalysis() {
  const [selectedLevel, setSelectedLevel] = useState('net-figures');
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');

  const currentLevelConfig = profitabilityLevels.find(level => level.id === selectedLevel);
  const levelData = getLevelData(selectedLevel);

  return (
    <ToolLayout
      title="Profitability Analysis"
      description="Multi-level profitability analysis with drill-down capabilities across different dimensions"
    >
      <div className="space-y-8">
        {/* Level Selector */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Select Analysis Level</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profitabilityLevels.map((level) => (
              <div
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  selectedLevel === level.id
                    ? 'border-primary-600 bg-white shadow-lg'
                    : 'border-primary-200 bg-white hover:border-primary-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <level.icon className={`h-5 w-5 ${level.color}`} />
                  <h4 className="font-semibold text-primary-900">{level.title}</h4>
                </div>
                <p className="text-accent-600 text-sm">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">
            {currentLevelConfig?.title} Analysis
          </h3>
          <div className="flex space-x-2">
            {['current-month', 'current-quarter', 'current-year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-900 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {period.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {levelData.metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Main Analysis with Chart/Table Toggle */}
        <ChartTableToggle
          title={`${currentLevelConfig?.title} Performance`}
          chartData={levelData.chartData}
          tableColumns={levelData.tableColumns}
          tableData={levelData.tableData}
          chartColor="bg-primary-600"
          chartType="bar"
        />

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              {selectedLevel === 'net-figures' && (
                <>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Strong Performance</h4>
                    <p className="text-green-700 text-sm">Overall profitability is above industry average with healthy margins.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Growth Opportunity</h4>
                    <p className="text-blue-700 text-sm">Revenue growth is outpacing expense growth, indicating good cost control.</p>
                  </div>
                </>
              )}
              {selectedLevel === 'specialty-level' && (
                <>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Top Performer</h4>
                    <p className="text-green-700 text-sm">Cardiology generates highest revenue with strong patient volume.</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Optimization Needed</h4>
                    <p className="text-yellow-700 text-sm">Neurology has potential for margin improvement through cost optimization.</p>
                  </div>
                </>
              )}
              {selectedLevel === 'doctor-level' && (
                <>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Excellence Recognition</h4>
                    <p className="text-green-700 text-sm">Dr. Smith leads in both revenue generation and patient satisfaction.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Development Opportunity</h4>
                    <p className="text-blue-700 text-sm">Junior doctors show strong growth potential with proper mentoring.</p>
                  </div>
                </>
              )}
              {(selectedLevel === 'service-level' || selectedLevel === 'bed-level' || selectedLevel === 'ot-level' || selectedLevel === 'cath-lab-level') && (
                <>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">High Utilization</h4>
                    <p className="text-green-700 text-sm">Current utilization rates are above industry benchmarks.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Efficiency Focus</h4>
                    <p className="text-blue-700 text-sm">Optimizing scheduling can further improve resource utilization.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Recommendations</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-primary-200">
                <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Growth Opportunity
                </h4>
                <p className="text-sm text-accent-600">
                  {selectedLevel === 'specialty-level' ? 'Expand Cardiology services to capture more market share.' :
                   selectedLevel === 'doctor-level' ? 'Implement best practices from top performers across the team.' :
                   selectedLevel === 'service-level' ? 'Focus on high-margin consultation services.' :
                   selectedLevel === 'bed-level' ? 'Consider adding ICU beds to meet high demand.' :
                   selectedLevel === 'ot-level' ? 'Optimize OT scheduling to increase procedure volume.' :
                   selectedLevel === 'cath-lab-level' ? 'Expand cath lab capacity during peak hours.' :
                   'Focus on high-margin services to improve overall profitability.'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-primary-200">
                <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Optimization Focus
                </h4>
                <p className="text-sm text-accent-600">
                  {selectedLevel === 'specialty-level' ? 'Optimize costs in Neurology to improve margins.' :
                   selectedLevel === 'doctor-level' ? 'Provide additional training for performance improvement.' :
                   selectedLevel === 'service-level' ? 'Improve emergency service efficiency to boost margins.' :
                   selectedLevel === 'bed-level' ? 'Increase general ward occupancy through better patient flow.' :
                   selectedLevel === 'ot-level' ? 'Reduce changeover time between procedures.' :
                   selectedLevel === 'cath-lab-level' ? 'Standardize procedures to reduce average duration.' :
                   'Streamline operations to reduce overhead costs.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
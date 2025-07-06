import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Target,
  ArrowLeft
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

// Historical data for trend analysis
const getHistoricalData = (level: string): ChartData[] => {
  switch (level) {
    case 'net-figures':
      return [
        { month: 'Jan', value: 480000 },
        { month: 'Feb', value: 520000 },
        { month: 'Mar', value: 495000 },
        { month: 'Apr', value: 580000 },
        { month: 'May', value: 615000 },
        { month: 'Jun', value: 650000 },
        { month: 'Jul', value: 625000 },
        { month: 'Aug', value: 680000 },
        { month: 'Sep', value: 720000 },
        { month: 'Oct', value: 695000 },
        { month: 'Nov', value: 750000 },
        { month: 'Dec', value: 780000 }
      ];
    case 'specialty-level':
      return [
        { month: 'Jan', value: 22.5 },
        { month: 'Feb', value: 23.1 },
        { month: 'Mar', value: 22.8 },
        { month: 'Apr', value: 24.2 },
        { month: 'May', value: 23.9 },
        { month: 'Jun', value: 25.1 },
        { month: 'Jul', value: 24.8 },
        { month: 'Aug', value: 25.5 },
        { month: 'Sep', value: 26.2 },
        { month: 'Oct', value: 25.8 },
        { month: 'Nov', value: 26.8 },
        { month: 'Dec', value: 27.2 }
      ];
    default:
      return [
        { month: 'Jan', value: 75 },
        { month: 'Feb', value: 78 },
        { month: 'Mar', value: 82 },
        { month: 'Apr', value: 79 },
        { month: 'May', value: 85 },
        { month: 'Jun', value: 88 },
        { month: 'Jul', value: 86 },
        { month: 'Aug', value: 91 },
        { month: 'Sep', value: 89 },
        { month: 'Oct', value: 93 },
        { month: 'Nov', value: 95 },
        { month: 'Dec', value: 92 }
      ];
  }
};

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
  const { level } = useParams();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');

  // If no level is specified, show level selection
  if (!level) {
    return (
      <ToolLayout
        title="Profitability Analysis"
        description="Select the analysis level to dive deep into profitability insights"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Choose Your Analysis Level</h2>
            <p className="text-accent-600 max-w-2xl mx-auto">
              Select the level of detail you want to analyze. Each level provides unique insights 
              into different aspects of your hospital's profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profitabilityLevels.map((levelOption) => (
              <div
                key={levelOption.id}
                onClick={() => navigate(`/dashboard/tools/profitability/${levelOption.id}`)}
                className="bg-white rounded-xl p-6 shadow-sm border border-primary-100 hover:shadow-lg hover:-translate-y-2 cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg bg-primary-50 ${levelOption.color} group-hover:scale-110 transition-transform`}>
                    <levelOption.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900">{levelOption.title}</h3>
                  </div>
                </div>
                <p className="text-accent-600 leading-relaxed">{levelOption.description}</p>
                
                <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  <span>Analyze {levelOption.title}</span>
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary-900 mb-2">Multi-Level Analysis Benefits</h3>
              <p className="text-accent-600">Get comprehensive insights across all operational levels</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-900 mb-2">7</div>
                <div className="text-accent-600">Analysis Levels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">15%</div>
                <div className="text-accent-600">Avg Profit Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-accent-600">Real-time Insights</div>
              </div>
            </div>
          </div>
        </div>
      </ToolLayout>
    );
  }

  const currentLevelConfig = profitabilityLevels.find(l => l.id === level);
  const levelData = getLevelData(level);
  const historicalData = getHistoricalData(level);

  if (!currentLevelConfig) {
    return (
      <ToolLayout
        title="Profitability Analysis"
        description="Analysis level not found"
      >
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Analysis Level Not Found</h2>
          <button
            onClick={() => navigate('/dashboard/tools/profitability')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Level Selection
          </button>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={`${currentLevelConfig.title} Analysis`}
      description={currentLevelConfig.description}
    >
      <div className="space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/tools/profitability')}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Level Selection</span>
          </button>
          
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
          title={`${currentLevelConfig.title} Performance`}
          chartData={levelData.chartData}
          tableColumns={levelData.tableColumns}
          tableData={levelData.tableData}
          chartColor="bg-primary-600"
          chartType="bar"
        />

        {/* Historical Trend Analysis - Fixed sizing */}
        <div className="space-y-6">
          <ChartTableToggle
            title={`${currentLevelConfig.title} - 12 Month Trend`}
            chartData={historicalData}
            tableColumns={[
              { key: 'month', label: 'Month', type: 'text' },
              { key: 'value', label: level === 'net-figures' ? 'Profit ($)' : level === 'specialty-level' ? 'Margin (%)' : 'Performance (%)', type: level === 'net-figures' ? 'currency' : 'percentage' },
              { key: 'change', label: 'Change', type: 'percentage' }
            ]}
            tableData={historicalData.map((item, index) => ({
              month: item.month,
              value: item.value,
              change: index > 0 ? ((item.value - historicalData[index - 1].value) / historicalData[index - 1].value) * 100 : 0
            }))}
            chartColor="bg-blue-600"
            chartType="line"
            className="mb-8"
          />
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              {level === 'net-figures' && (
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
              {level === 'specialty-level' && (
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
              {level === 'doctor-level' && (
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
              {(level === 'service-level' || level === 'bed-level' || level === 'ot-level' || level === 'cath-lab-level') && (
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
                  {level === 'specialty-level' ? 'Expand Cardiology services to capture more market share.' :
                   level === 'doctor-level' ? 'Implement best practices from top performers across the team.' :
                   level === 'service-level' ? 'Focus on high-margin consultation services.' :
                   level === 'bed-level' ? 'Consider adding ICU beds to meet high demand.' :
                   level === 'ot-level' ? 'Optimize OT scheduling to increase procedure volume.' :
                   level === 'cath-lab-level' ? 'Expand cath lab capacity during peak hours.' :
                   'Focus on high-margin services to improve overall profitability.'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-primary-200">
                <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Optimization Focus
                </h4>
                <p className="text-sm text-accent-600">
                  {level === 'specialty-level' ? 'Optimize costs in Neurology to improve margins.' :
                   level === 'doctor-level' ? 'Provide additional training for performance improvement.' :
                   level === 'service-level' ? 'Improve emergency service efficiency to boost margins.' :
                   level === 'bed-level' ? 'Increase general ward occupancy through better patient flow.' :
                   level === 'ot-level' ? 'Reduce changeover time between procedures.' :
                   level === 'cath-lab-level' ? 'Standardize procedures to reduce average duration.' :
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
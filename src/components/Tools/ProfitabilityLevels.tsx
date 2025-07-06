import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToolLayout } from './ToolLayout';
import { SimpleChart } from './Charts/SimpleChart';
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

const levelConfigs = {
  'net-figures': {
    title: 'Net Figures Analysis',
    description: 'Overall hospital profitability analysis',
    icon: DollarSign,
    color: 'text-green-600'
  },
  'service-level': {
    title: 'Service Level Analysis',
    description: 'Profitability by individual services',
    icon: Activity,
    color: 'text-blue-600'
  },
  'specialty-level': {
    title: 'Specialty Level Analysis',
    description: 'Department and specialty profitability',
    icon: Stethoscope,
    color: 'text-purple-600'
  },
  'doctor-level': {
    title: 'Doctor Level Analysis',
    description: 'Individual doctor performance analysis',
    icon: Users,
    color: 'text-orange-600'
  },
  'bed-level': {
    title: 'Bed Level Analysis',
    description: 'Bed utilization and profitability',
    icon: Bed,
    color: 'text-cyan-600'
  },
  'ot-level': {
    title: 'OT Level Analysis',
    description: 'Operating theater efficiency analysis',
    icon: Scissors,
    color: 'text-red-600'
  },
  'cath-lab-level': {
    title: 'Cath Lab Level Analysis',
    description: 'Catheterization lab performance',
    icon: Building2,
    color: 'text-indigo-600'
  }
};

// Dummy data for different levels
const getDummyData = (level: string) => {
  switch (level) {
    case 'net-figures':
      return {
        chartData: [
          { month: 'Revenue', value: 3285000 },
          { month: 'Expenses', value: 2770000 },
          { month: 'Net Profit', value: 515000 }
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
        metrics: [
          { title: 'Top Specialty', value: 'Cardiology', change: '$850K', trend: 'up' as const, icon: Stethoscope },
          { title: 'Avg Margin', value: '22.5%', change: '+3.1%', trend: 'up' as const, icon: PieChart },
          { title: 'Best Performer', value: 'Gynaecology', change: '28.8%', trend: 'up' as const, icon: Target },
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
        metrics: [
          { title: 'Top Performer', value: 'Dr. Smith', change: '$285K', trend: 'up' as const, icon: Users },
          { title: 'Avg Revenue/Doctor', value: '$236K', change: '+8.5%', trend: 'up' as const, icon: DollarSign },
          { title: 'Patient Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' as const, icon: Target },
          { title: 'Active Doctors', value: '12', change: '+2', trend: 'up' as const, icon: Activity }
        ]
      };
    default:
      return {
        chartData: [
          { month: 'Q1', value: 75 },
          { month: 'Q2', value: 82 },
          { month: 'Q3', value: 78 },
          { month: 'Q4', value: 85 }
        ],
        metrics: [
          { title: 'Utilization', value: '80%', change: '+5%', trend: 'up' as const, icon: Activity },
          { title: 'Efficiency', value: '85%', change: '+3%', trend: 'up' as const, icon: Target },
          { title: 'Revenue/Unit', value: '$125K', change: '+12%', trend: 'up' as const, icon: DollarSign },
          { title: 'Capacity', value: '95%', change: '+2%', trend: 'up' as const, icon: TrendingUp }
        ]
      };
  }
};

export function ProfitabilityLevels() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');

  if (!level || !levelConfigs[level as keyof typeof levelConfigs]) {
    return (
      <ToolLayout
        title="Profitability Analysis"
        description="Multi-level profitability analysis"
      >
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">Invalid Analysis Level</h3>
          <p className="text-accent-600 mb-4">The requested analysis level was not found.</p>
          <button
            onClick={() => navigate('/dashboard/tools')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Tools
          </button>
        </div>
      </ToolLayout>
    );
  }

  const config = levelConfigs[level as keyof typeof levelConfigs];
  const data = getDummyData(level);

  return (
    <ToolLayout
      title={config.title}
      description={config.description}
    >
      <div className="space-y-8">
        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">Analysis Period</h3>
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
          {data.metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Main Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimpleChart
            data={data.chartData}
            title={`${config.title} - Performance`}
            color="bg-primary-600"
          />
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
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Detailed {config.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider">
                    {level === 'net-figures' ? 'Category' : 
                     level === 'specialty-level' ? 'Specialty' :
                     level === 'doctor-level' ? 'Doctor' : 'Unit'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider">Costs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider">Profit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider">Margin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-accent-200">
                {data.chartData.map((item, index) => (
                  <tr key={index} className="hover:bg-accent-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary-900">{item.month}</td>
                    <td className="px-4 py-3 text-sm text-green-600">${item.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-red-600">${(item.value * 0.75).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-primary-900">${(item.value * 0.25).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-primary-900">25.0%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                Growth Opportunity
              </h4>
              <p className="text-sm text-accent-600">
                {level === 'specialty-level' ? 'Expand Cardiology services to capture more market share.' :
                 level === 'doctor-level' ? 'Implement best practices from top performers across the team.' :
                 'Focus on high-margin services to improve overall profitability.'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                Optimization Focus
              </h4>
              <p className="text-sm text-accent-600">
                {level === 'specialty-level' ? 'Optimize costs in Neurology to improve margins.' :
                 level === 'doctor-level' ? 'Provide additional training for performance improvement.' :
                 'Streamline operations to reduce overhead costs.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
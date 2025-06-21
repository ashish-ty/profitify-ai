import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { SimpleChart } from './Charts/SimpleChart';
import { MetricCard } from './Charts/MetricCard';
import { DollarSign, Percent, TrendingUp, Target, PieChart, BarChart3 } from 'lucide-react';
import { ChartData, MetricCard as MetricCardType } from '../../types';

// Dummy data for profitability analysis
const profitData: ChartData[] = [
  { month: 'Jan', value: 30000 },
  { month: 'Feb', value: 70000 },
  { month: 'Mar', value: 45000 },
  { month: 'Apr', value: 130000 },
  { month: 'May', value: 115000 },
  { month: 'Jun', value: 130000 },
];

const marginData: ChartData[] = [
  { month: 'Cardiology', value: 25 },
  { month: 'Oncology', value: 18 },
  { month: 'Neurology', value: 22 },
  { month: 'Gynaecology', value: 28 },
];

const metrics: MetricCardType[] = [
  {
    title: 'Net Profit',
    value: '$520K',
    change: '+18.7%',
    trend: 'up',
    icon: DollarSign
  },
  {
    title: 'Profit Margin',
    value: '15.8%',
    change: '+2.3%',
    trend: 'up',
    icon: Percent
  },
  {
    title: 'ROI',
    value: '22.4%',
    change: '+4.1%',
    trend: 'up',
    icon: TrendingUp
  },
  {
    title: 'Target Achievement',
    value: '87%',
    change: '+12%',
    trend: 'up',
    icon: Target
  }
];

export function ProfitabilityAnalysis() {
  const [selectedView, setSelectedView] = useState('monthly');

  const viewOptions = [
    { id: 'monthly', name: 'Monthly View' },
    { id: 'specialty', name: 'By Specialty' },
    { id: 'comparison', name: 'Comparison' }
  ];

  return (
    <ToolLayout
      title="Profitability Analysis"
      description="Profit insights based on revenue and expense data with comprehensive margin analysis"
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

        {/* Profitability Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimpleChart
            data={profitData}
            title="Monthly Profit Trend"
            color="bg-green-600"
          />
          <SimpleChart
            data={marginData}
            title="Profit Margin by Specialty (%)"
            color="bg-blue-600"
          />
        </div>

        {/* Profitability Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Profitability Drivers</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Revenue Growth</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Cost Control</span>
                <span className="font-semibold text-green-600">+8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Efficiency Gains</span>
                <span className="font-semibold text-green-600">+5.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Mix Optimization</span>
                <span className="font-semibold text-green-600">+3.1%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Margin Comparison</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Current Margin</span>
                <span className="font-semibold text-primary-900">15.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Industry Average</span>
                <span className="font-semibold text-accent-600">12.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Target Margin</span>
                <span className="font-semibold text-blue-600">18.0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Best in Class</span>
                <span className="font-semibold text-green-600">22.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Performance Status</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Excellent</div>
              <div className="text-accent-600 mb-2">Above Industry Average</div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                Top 25% Performer
              </div>
              <div className="text-xs text-accent-500">
                Outperforming 75% of similar hospitals
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Profitability Breakdown by Revenue vs Expenses</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Revenue Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Total Revenue</span>
                  <span className="font-semibold text-green-600">$3,290,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">High-Margin Services</span>
                  <span className="font-semibold text-green-600">$1,180,000 (36%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Standard Services</span>
                  <span className="font-semibold text-blue-600">$1,640,000 (50%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Low-Margin Services</span>
                  <span className="font-semibold text-orange-600">$470,000 (14%)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-primary-900 mb-3">Expense Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Total Expenses</span>
                  <span className="font-semibold text-red-600">$2,770,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Variable Costs</span>
                  <span className="font-semibold text-red-600">$1,662,000 (60%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Fixed Costs</span>
                  <span className="font-semibold text-orange-600">$831,000 (30%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-600">Semi-Variable</span>
                  <span className="font-semibold text-yellow-600">$277,000 (10%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Profitability Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-green-600" />
                Service Mix Optimization
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Increase focus on Gynaecology (28% margin) and reduce low-margin emergency services.
              </p>
              <div className="text-xs text-green-600 font-medium">Potential impact: +3.2% margin</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                Cost Structure Improvement
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Optimize variable costs through better supplier negotiations and process efficiency.
              </p>
              <div className="text-xs text-green-600 font-medium">Potential savings: $180,000/year</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Revenue Enhancement
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Implement dynamic pricing for elective procedures during peak demand periods.
              </p>
              <div className="text-xs text-green-600 font-medium">Revenue increase: $120,000/year</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-orange-600" />
                Margin Target Strategy
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Achieve 18% target margin through balanced revenue growth and cost optimization.
              </p>
              <div className="text-xs text-green-600 font-medium">Timeline: 8-12 months</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
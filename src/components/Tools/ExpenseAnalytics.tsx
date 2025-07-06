import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { ChartTableToggle, TableColumn, TableRow } from '../Common/ChartTableToggle';
import { MetricCard } from './Charts/MetricCard';
import { TrendingDown, AlertTriangle, Target, Calculator, Zap, DollarSign } from 'lucide-react';
import { ChartData, MetricCard as MetricCardType } from '../../types';

// Dummy data for expense analytics
const expenseData: ChartData[] = [
  { month: 'Pharmacy', value: 180000 },
  { month: 'Salaries', value: 220000 },
  { month: 'Power/Fuel', value: 45000 },
  { month: 'Admin', value: 35000 },
  { month: 'Maintenance', value: 25000 },
  { month: 'Marketing', value: 15000 },
];

const monthlyExpenses: ChartData[] = [
  { month: 'Jan', value: 420000 },
  { month: 'Feb', value: 450000 },
  { month: 'Mar', value: 435000 },
  { month: 'Apr', value: 480000 },
  { month: 'May', value: 465000 },
  { month: 'Jun', value: 520000 },
];

const metrics: MetricCardType[] = [
  {
    title: 'Total Expenses',
    value: '$2.77M',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingDown
  },
  {
    title: 'Cost Reduction Target',
    value: '12%',
    change: '-3.1%',
    trend: 'down',
    icon: Target
  },
  {
    title: 'High-Cost Areas',
    value: '3',
    change: '+1',
    trend: 'up',
    icon: AlertTriangle
  },
  {
    title: 'Avg. Daily Expense',
    value: '$15,389',
    change: '+2.8%',
    trend: 'up',
    icon: Calculator
  }
];

export function ExpenseAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const expenseCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'pharmacy', name: 'Pharmacy & Medical' },
    { id: 'staff', name: 'Staff Costs' },
    { id: 'operations', name: 'Operations' },
    { id: 'admin', name: 'Administrative' }
  ];

  return (
    <ToolLayout
      title="Expense Analytics"
      description="Detailed expense breakdown with cost optimization recommendations"
    >
      <div className="space-y-8">
        {/* Category Filter */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">Expense Categories</h3>
          <div className="flex space-x-2">
            {expenseCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-900 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {category.name}
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

        {/* Expense Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartTableToggle
            title="Expense Categories"
            chartData={expenseData}
            tableColumns={[
              { key: 'category', label: 'Category', type: 'text' },
              { key: 'amount', label: 'Amount', type: 'currency' },
              { key: 'percentage', label: 'Percentage', type: 'percentage' }
            ]}
            tableData={expenseData.map((item, index) => ({
              category: item.month,
              amount: item.value,
              percentage: (item.value / expenseData.reduce((sum, exp) => sum + exp.value, 0)) * 100
            }))}
            chartColor="bg-red-600"
            className="mb-8"
          />
          <ChartTableToggle
            title="Monthly Expense Trend"
            chartData={monthlyExpenses}
            tableColumns={[
              { key: 'month', label: 'Month', type: 'text' },
              { key: 'expenses', label: 'Expenses', type: 'currency' },
              { key: 'change', label: 'Change', type: 'percentage' }
            ]}
            tableData={monthlyExpenses.map((item, index) => ({
              month: item.month,
              expenses: item.value,
              change: index > 0 ? ((item.value - monthlyExpenses[index - 1].value) / monthlyExpenses[index - 1].value) * 100 : 0
            }))}
            chartColor="bg-orange-600"
            chartType="line"
            className="mb-8"
          />
        </div>

        {/* Cost Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Cost Optimization Opportunities</h3>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-900">Power & Fuel</span>
                  <span className="text-red-600 font-semibold">High Priority</span>
                </div>
                <p className="text-sm text-red-700 mb-2">15% above industry average. Consider energy-efficient equipment.</p>
                <div className="text-xs text-red-600">Potential savings: $8,000/month</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-900">Administrative Costs</span>
                  <span className="text-yellow-600 font-semibold">Medium Priority</span>
                </div>
                <p className="text-sm text-yellow-700 mb-2">Potential for process automation and digitization.</p>
                <div className="text-xs text-yellow-600">Potential savings: $5,000/month</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">Maintenance</span>
                  <span className="text-green-600 font-semibold">Optimized</span>
                </div>
                <p className="text-sm text-green-700">Well-managed preventive maintenance program.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Expense Ratios vs Industry</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-accent-600">Staff Costs</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary-900">42%</span>
                    <span className="text-xs text-red-600">(Industry: 38%)</span>
                  </div>
                </div>
                <div className="bg-primary-100 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-accent-600">Medical Supplies</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary-900">35%</span>
                    <span className="text-xs text-green-600">(Industry: 37%)</span>
                  </div>
                </div>
                <div className="bg-primary-100 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-accent-600">Utilities</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary-900">12%</span>
                    <span className="text-xs text-red-600">(Industry: 9%)</span>
                  </div>
                </div>
                <div className="bg-primary-100 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Cost Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                Energy Efficiency
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Install LED lighting and smart HVAC systems to reduce power costs by 20-25%.
              </p>
              <div className="text-xs text-green-600 font-medium">ROI: 18 months</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                Staff Optimization
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Optimize shift patterns and cross-train staff to reduce overtime costs by 15%.
              </p>
              <div className="text-xs text-green-600 font-medium">Savings: $12,000/month</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                Supply Chain
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Negotiate bulk purchasing agreements to reduce medical supply costs by 8-12%.
              </p>
              <div className="text-xs text-green-600 font-medium">Savings: $18,000/month</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                Process Automation
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Implement digital workflows to reduce administrative overhead by 25%.
              </p>
              <div className="text-xs text-green-600 font-medium">Savings: $8,500/month</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
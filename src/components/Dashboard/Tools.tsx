import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calculator,
  Target,
  DollarSign,
  Activity,
  Zap
} from 'lucide-react';
import { ToolCategory } from '../../types';

const toolCategories: ToolCategory[] = [
  {
    id: 'basic-analysis',
    title: 'Basic Financial Analysis',
    description: 'Core financial insights and performance metrics',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-600',
    tools: [
      {
        id: 'revenue-analysis',
        title: 'Revenue Analysis',
        description: 'Comprehensive insights based on revenue data including trends, patterns, and growth opportunities',
        route: '/dashboard/tools/revenue-analysis',
        category: 'basic-analysis'
      },
      {
        id: 'expense-analysis',
        title: 'Expense Analysis',
        description: 'Detailed breakdown of expense categories with cost optimization recommendations',
        route: '/dashboard/tools/expense-analysis',
        category: 'basic-analysis'
      },
      {
        id: 'profitability-analysis',
        title: 'Profitability Analysis',
        description: 'Profit insights based on revenue and expense data with margin analysis',
        route: '/dashboard/tools/profitability-analysis',
        category: 'basic-analysis'
      }
    ]
  },
  {
    id: 'advanced-planning',
    title: 'Advanced Planning & Optimization',
    description: 'Strategic tools for budget planning and cost optimization',
    icon: Target,
    color: 'bg-green-100 text-green-600',
    tools: [
      {
        id: 'budget-planning',
        title: 'Budget Planning',
        description: 'Interactive budget planning with percentage-based projections and scenario analysis',
        route: '/dashboard/tools/budget-planning',
        category: 'advanced-planning'
      },
      {
        id: 'cost-analysis',
        title: 'Specialty-wise Cost Analysis',
        description: 'Detailed cost breakdown by specialty with profitability mapping and per-patient costs',
        route: '/dashboard/tools/cost-analysis',
        category: 'advanced-planning'
      }
    ]
  }
];

export function Tools() {
  const navigate = useNavigate();

  const handleToolLaunch = (route: string) => {
    if (route !== '#') {
      navigate(route);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">AI-Powered Financial Tools</h1>
        <p className="text-accent-600">Advanced analytics and insights to maximize your hospital's financial performance</p>
      </div>

      {toolCategories.map((category) => (
        <div key={category.id} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${category.color}`}>
              <category.icon className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-primary-900">{category.title}</h2>
              <p className="text-accent-600">{category.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => handleToolLaunch(tool.route)}
                className="bg-white rounded-xl p-6 shadow-sm border border-primary-100 hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                    {tool.id === 'revenue-analysis' && <DollarSign className="h-6 w-6" />}
                    {tool.id === 'expense-analysis' && <TrendingUp className="h-6 w-6" />}
                    {tool.id === 'profitability-analysis' && <PieChart className="h-6 w-6" />}
                    {tool.id === 'budget-planning' && <Calculator className="h-6 w-6" />}
                    {tool.id === 'cost-analysis' && <Activity className="h-6 w-6" />}
                  </div>
                  <div className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                    {category.id === 'basic-analysis' ? 'Basic' : 'Advanced'}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-primary-900 mb-3">{tool.title}</h3>
                <p className="text-accent-600 text-sm leading-relaxed mb-4">{tool.description}</p>
                
                <button className="w-full bg-primary-900 text-white py-3 rounded-lg hover:bg-primary-800 transition-colors font-medium flex items-center justify-center space-x-2 group-hover:bg-primary-800">
                  <Zap className="h-4 w-4" />
                  <span>Launch Analysis</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Value Proposition Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Unlock Advanced Financial Intelligence</h3>
            <p className="text-primary-100 mb-6 leading-relaxed">
              Our AI-powered tools provide deep insights into your hospital's financial performance, 
              helping you make data-driven decisions that improve profitability and operational efficiency.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-primary-100">Real-time financial analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-primary-100">Specialty-wise profitability mapping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-primary-100">Interactive budget planning</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-green-400">15%</div>
              <div className="text-primary-200 text-sm">Avg. Cost Reduction</div>
            </div>
            <div className="bg-primary-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-green-400">98%</div>
              <div className="text-primary-200 text-sm">Accuracy Rate</div>
            </div>
            <div className="bg-primary-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-green-400">24/7</div>
              <div className="text-primary-200 text-sm">Real-time Insights</div>
            </div>
            <div className="bg-primary-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-green-400">500+</div>
              <div className="text-primary-200 text-sm">Hospitals Trust Us</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
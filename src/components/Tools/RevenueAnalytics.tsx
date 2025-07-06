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
  Zap,
  Building2,
  Users,
  Stethoscope,
  Bed,
  Scissors
} from 'lucide-react';
import { ToolCategory } from '../../types';

const toolCategories: ToolCategory[] = [
  {
    id: 'analytics-tools',
    title: 'Analytics Tools',
    description: 'Essential analytics based on your input data for quick insights',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-600',
    tools: [
      {
        id: 'revenue-analytics',
        title: 'Revenue Analytics',
        description: 'Comprehensive revenue analysis with trends, patterns, and growth opportunities',
        route: '/dashboard/tools/revenue-analytics',
        category: 'analytics-tools'
      },
      {
        id: 'expense-analytics',
        title: 'Expense Analytics',
        description: 'Detailed expense breakdown with cost optimization recommendations',
        route: '/dashboard/tools/expense-analytics',
        category: 'analytics-tools'
      },
      {
        id: 'metadata-analytics',
        title: 'Metadata Analytics',
        description: 'Hospital operational analytics including capacity utilization and efficiency metrics',
        route: '/dashboard/tools/metadata-analytics',
        category: 'analytics-tools'
      }
    ]
  },
  {
    id: 'advanced-tools',
    title: 'Advanced Tools',
    description: 'Sophisticated profitability analysis and strategic planning tools',
    icon: Target,
    color: 'bg-green-100 text-green-600',
    tools: [
      {
        id: 'profitability-analysis',
        title: 'Profitability Analysis',
        description: 'Multi-level profitability analysis with drill-down capabilities across different dimensions',
        route: '/dashboard/tools/profitability',
        category: 'advanced-tools'
      },
      {
        id: 'budget-planner',
        title: 'Budget Planner',
        description: 'Interactive budget planning with scenario analysis and forecasting capabilities',
        route: '/dashboard/tools/budget-planner',
        category: 'advanced-tools'
      }
    ]
  }
];

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

export function Tools() {
  const navigate = useNavigate();

  const handleToolLaunch = (route: string) => {
    if (route !== '#') {
      navigate(route);
    }
  };

  const handleProfitabilityLevel = (level: string) => {
    navigate(`/dashboard/tools/profitability/${level}`);
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
                    {tool.id === 'revenue-analytics' && <DollarSign className="h-6 w-6" />}
                    {tool.id === 'expense-analytics' && <TrendingUp className="h-6 w-6" />}
                    {tool.id === 'metadata-analytics' && <Building2 className="h-6 w-6" />}
                    {tool.id === 'profitability-analysis' && <PieChart className="h-6 w-6" />}
                    {tool.id === 'budget-planner' && <Calculator className="h-6 w-6" />}
                  </div>
                  <div className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                    {category.id === 'analytics-tools' ? 'Analytics' : 'Advanced'}
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

          <Route path="/dashboard/tools/profitability" element={<ProfitabilityAnalysis />} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartTableToggle
              title="Monthly Revenue Trend"
              chartData={monthlyRevenueData}
              tableColumns={[
                { key: 'month', label: 'Month', type: 'text' },
                { key: 'value', label: 'Revenue', type: 'currency' }
              ]}
              tableData={monthlyRevenueData.map(item => ({ month: item.month, value: item.value }))}
              chartColor="bg-green-600"
            />
            <ChartTableToggle
              title="Revenue by Specialty"
              chartData={specialtyRevenueData}
              tableColumns={[
                { key: 'specialty', label: 'Specialty', type: 'text' },
                { key: 'revenue', label: 'Revenue', type: 'currency' },
                { key: 'patients', label: 'Patients', type: 'number' },
                { key: 'revenuePerPatient', label: 'Revenue/Patient', type: 'currency' }
              ]}
              tableData={Object.entries(specialty_analysis).map(([specialty, data]) => ({
                specialty,
                revenue: data.total_revenue,
                patients: data.total_patients,
                revenuePerPatient: data.revenue_per_patient
              }))}
              chartColor="bg-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profitabilityLevels.map((level) => (
              <div
                key={level.id}
                onClick={() => handleProfitabilityLevel(level.id)}
                className="bg-white rounded-lg p-4 shadow-sm border border-primary-100 hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-300 group"
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
                <span className="text-primary-100">Multi-level profitability analysis</span>
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
              <div className="text-2xl font-bold mb-1 text-green-400">7</div>
              <div className="text-primary-200 text-sm">Analysis Levels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
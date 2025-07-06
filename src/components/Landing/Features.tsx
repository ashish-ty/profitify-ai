import React from 'react';
import { 
  Brain, 
  BarChart3, 
  Target, 
  TrendingUp,
  PieChart,
  Zap,
  Calculator,
  Activity
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your cost structures and identify optimization opportunities automatically.',
    color: 'text-primary-500'
  },
  {
    icon: BarChart3,
    title: 'Activity-Based Costing',
    description: 'Precise cost allocation across activities and products to reveal true profitability at granular levels.',
    color: 'text-blue-500'
  },
  {
    icon: Target,
    title: 'Profit Optimization',
    description: 'Identify high and low margin areas with actionable recommendations to maximize your profitability.',
    color: 'text-green-500'
  },
  {
    icon: TrendingUp,
    title: 'Performance Insights',
    description: 'Real-time dashboards and reports that highlight top performing assets and underperforming liabilities.',
    color: 'text-purple-500'
  },
  {
    icon: PieChart,
    title: 'Cost Allocation',
    description: 'Intelligent cost distribution across departments, products, and services for accurate profitability mapping.',
    color: 'text-orange-500'
  },
  {
    icon: Calculator,
    title: 'Margin Analysis',
    description: 'Detailed margin analysis with drill-down capabilities to understand profit drivers at every level.',
    color: 'text-cyan-500'
  },
  {
    icon: Zap,
    title: 'Automated Reports',
    description: 'Generate comprehensive profitability reports automatically with customizable templates and insights.',
    color: 'text-yellow-500'
  },
  {
    icon: Activity,
    title: 'Action Points',
    description: 'AI-generated action points and recommendations to improve profitability based on your specific data.',
    color: 'text-red-500'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Maximum Profitability
          </h2>
          <p className="text-xl text-accent-300 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps businesses across industries 
            optimize their cost structures and maximize profitability through intelligent analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-dark-900 rounded-xl p-6 hover:bg-dark-700 transition-all duration-300 hover:-translate-y-1 group border border-dark-700"
            >
              <div className={`inline-flex p-3 rounded-lg bg-dark-800 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-accent-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
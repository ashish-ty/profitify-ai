import React from 'react';
import { 
  BarChart3, 
  Brain, 
  DollarSign, 
  FileText, 
  PieChart, 
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Advanced machine learning algorithms analyze your financial data to provide actionable insights and predictions.',
    color: 'text-purple-600'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Monitor your hospital\'s financial performance with live dashboards and instant reporting.',
    color: 'text-blue-600'
  },
  {
    icon: DollarSign,
    title: 'Cost Optimization',
    description: 'Identify areas of overspending and optimize resource allocation to maximize profitability.',
    color: 'text-green-600'
  },
  {
    icon: PieChart,
    title: 'Revenue Analysis',
    description: 'Deep dive into revenue streams across departments, specialties, and patient categories.',
    color: 'text-orange-600'
  },
  {
    icon: FileText,
    title: 'Automated Reporting',
    description: 'Generate comprehensive financial reports automatically with customizable templates.',
    color: 'text-indigo-600'
  },
  {
    icon: TrendingUp,
    title: 'Predictive Modeling',
    description: 'Forecast future financial trends and make proactive decisions based on AI predictions.',
    color: 'text-red-600'
  },
  {
    icon: Users,
    title: 'Department Tracking',
    description: 'Track performance across all hospital departments with detailed cost center analysis.',
    color: 'text-teal-600'
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Get started in minutes with our intuitive interface and guided setup process.',
    color: 'text-yellow-600'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">
            Powerful Features for Modern Healthcare Finance
          </h2>
          <p className="text-xl text-accent-600 max-w-3xl mx-auto">
            Our comprehensive suite of tools helps healthcare professionals make informed financial decisions 
            with the power of artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-primary-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`inline-flex p-3 rounded-lg bg-white shadow-sm ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">{feature.title}</h3>
              <p className="text-accent-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { ArrowRight, Building2, Factory, ShoppingCart, Briefcase } from 'lucide-react';

interface SolutionsProps {
  onGetStarted: () => void;
}

const solutions = [
  {
    id: 'healthcare',
    title: 'Healthcare & Medical',
    description: 'Optimize hospital operations, track department profitability, and improve patient care efficiency.',
    icon: Building2,
    features: ['Department-wise cost analysis', 'Patient profitability tracking', 'Resource optimization'],
    available: true,
    color: 'from-primary-600 to-primary-700'
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    description: 'Analyze production costs, optimize supply chains, and maximize manufacturing efficiency.',
    icon: Factory,
    features: ['Production line analysis', 'Supply chain optimization', 'Quality cost tracking'],
    available: false,
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'retail',
    title: 'Retail & E-commerce',
    description: 'Track product profitability, optimize inventory, and improve customer acquisition costs.',
    icon: ShoppingCart,
    features: ['Product margin analysis', 'Customer lifetime value', 'Inventory optimization'],
    available: false,
    color: 'from-purple-600 to-purple-700'
  },
  {
    id: 'services',
    title: 'Professional Services',
    description: 'Optimize project profitability, track billable hours, and improve service delivery efficiency.',
    icon: Briefcase,
    features: ['Project profitability', 'Resource allocation', 'Client profitability analysis'],
    available: false,
    color: 'from-orange-600 to-orange-700'
  }
];

export function Solutions({ onGetStarted }: SolutionsProps) {
  return (
    <section id="solutions" className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Industry-Specific Solutions
          </h2>
          <p className="text-xl text-accent-300 max-w-3xl mx-auto">
            Tailored Activity-Based Costing solutions for different industries. 
            Start with our healthcare module or contact us for custom solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className={`relative bg-dark-800 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                solution.available 
                  ? 'border-primary-600 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/20' 
                  : 'border-dark-700 hover:border-dark-600'
              }`}
            >
              {solution.available && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Available Now
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${solution.color}`}>
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                {!solution.available && (
                  <span className="bg-dark-700 text-accent-400 px-3 py-1 rounded-full text-sm">
                    Coming Soon
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{solution.title}</h3>
              <p className="text-accent-300 mb-6 leading-relaxed">{solution.description}</p>
              
              <div className="space-y-2 mb-8">
                {solution.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-accent-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={solution.available ? onGetStarted : undefined}
                disabled={!solution.available}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  solution.available
                    ? 'bg-primary-600 text-white hover:bg-primary-700 group'
                    : 'bg-dark-700 text-accent-500 cursor-not-allowed'
                }`}
              >
                {solution.available ? (
                  <>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  'Notify Me'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Contact for Custom Solutions */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-900/50 to-dark-800/50 rounded-2xl p-8 border border-primary-700/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-accent-300 mb-6 max-w-2xl mx-auto">
              Looking for Activity-Based Costing and AI analysis for a different industry? 
              We'd love to help you build a custom solution tailored to your specific needs.
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold">
              Contact Us for Custom Solutions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
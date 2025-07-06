import React from 'react';
import { ArrowRight, Brain, BarChart3, Target } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-primary-900/20 border border-primary-700/30 rounded-full text-primary-400 text-sm font-medium mb-8">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Activity-Based Costing
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Maximize Your
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                {' '}Profitability
              </span>
              <br />
              <span className="text-accent-200">with AI Insights</span>
            </h1>
            
            <p className="text-xl text-accent-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Transform your business with intelligent Activity-Based Costing analysis. 
              Identify high and low margin areas, optimize resource allocation, and make 
              data-driven decisions that boost your bottom line.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center group"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-primary-600 text-primary-400 px-8 py-4 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300 font-semibold text-lg">
                Schedule Demo
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-accent-400">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary-500" />
                <span className="font-medium">AI-Driven</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary-500" />
                <span className="font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-primary-500" />
                <span className="font-medium">Profit Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
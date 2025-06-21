import React from 'react';
import { ArrowRight, Brain, TrendingUp, Shield } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold text-primary-900 leading-tight mb-6">
                Maximize Your Hospital's
                <span className="bg-gradient-to-r from-primary-900 to-secondary-600 bg-clip-text text-transparent">
                  {' '}Financial Health
                </span>
                <span className="text-lemon"> with AI!</span>
              </h1>
              
              <p className="text-xl text-accent-600 mb-8 leading-relaxed">
                Effortlessly track profits and losses, optimize revenue, and make data-driven decisions 
                with our intelligent AI solution. Stay ahead in healthcare finance—because every number matters!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={onGetStarted}
                  className="bg-primary-900 text-white px-8 py-4 rounded-xl hover:bg-primary-800 transition-all duration-300 font-semibold text-lg flex items-center justify-center group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-primary-900 text-primary-900 px-8 py-4 rounded-xl hover:bg-primary-900 hover:text-white transition-all duration-300 font-semibold text-lg">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-primary-600" />
                  <span className="text-accent-700 font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                  <span className="text-accent-700 font-medium">Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-primary-600" />
                  <span className="text-accent-700 font-medium">Secure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 mt-12 lg:mt-0">
            <div className="relative animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary-900">Monthly Revenue</h3>
                    <span className="bg-highlight-500 text-white px-3 py-1 rounded-full text-sm font-medium">+15.3%</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-accent-600">OPD Revenue</span>
                      <span className="font-semibold text-primary-900">$125,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-accent-600">IPD Revenue</span>
                      <span className="font-semibold text-primary-900">$380,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-accent-600">Total Expenses</span>
                      <span className="font-semibold text-red-600">$295,000</span>
                    </div>
                    <hr className="border-primary-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-primary-900">Net Profit</span>
                      <span className="text-xl font-bold text-primary-900">$210,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
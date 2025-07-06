import React from 'react';
import { TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark-900 text-white py-16 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold">Profitify.ai</span>
            </div>
            <p className="text-accent-300 mb-6 leading-relaxed">
              Empowering businesses with AI-driven Activity-Based Costing for maximum profitability and intelligent decision-making.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-accent-300 hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#solutions" className="text-accent-300 hover:text-primary-400 transition-colors">Solutions</a></li>
              <li><a href="#" className="text-accent-300 hover:text-primary-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-accent-300 hover:text-primary-400 transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-accent-300 hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="#" className="text-accent-300 hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-accent-300 hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-accent-300 hover:text-primary-400 transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-500" />
                <span className="text-accent-300">hello@profitify.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-500" />
                <span className="text-accent-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span className="text-accent-300">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8 text-center">
          <p className="text-accent-400">
            © 2024 Profitify.ai. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
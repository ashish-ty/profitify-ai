import React from 'react';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-8 w-8 text-secondary-200" />
              <span className="text-2xl font-bold">Medicost.ai</span>
            </div>
            <p className="text-primary-200 mb-6 leading-relaxed">
              Empowering hospitals with AI-driven financial intelligence for better healthcare outcomes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Demo</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary-200" />
                <span className="text-primary-200">hello@medicost.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary-200" />
                <span className="text-primary-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-secondary-200" />
                <span className="text-primary-200">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-12 pt-8 text-center">
          <p className="text-primary-200">
            © 2024 Medicost.ai. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
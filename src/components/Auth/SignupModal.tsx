import React, { useState } from 'react';
import { X, Mail, Lock, User, Building } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (name: string, email: string, password: string, hospitalName: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ isOpen, onClose, onSignup, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hospitalName: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(formData.name, formData.email, formData.password, formData.hospitalName);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-900">Get Started</h2>
          <button
            onClick={onClose}
            className="text-accent-400 hover:text-accent-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              Hospital Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-400" />
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter hospital name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-900 text-white py-3 rounded-lg hover:bg-primary-800 transition-colors font-semibold"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-accent-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-900 font-semibold hover:text-primary-700 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
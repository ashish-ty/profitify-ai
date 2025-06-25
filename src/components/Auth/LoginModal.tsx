import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<any>;
  onSwitchToSignup: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin, onSwitchToSignup }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onLogin(email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@hospital.com');
    setPassword('demo123');
    setIsLoading(true);
    setError(null);

    try {
      await onLogin('demo@hospital.com', 'demo123');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-900">Welcome Back</h2>
          <button
            onClick={onClose}
            className="text-accent-400 hover:text-accent-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Demo Mode</h3>
          <p className="text-blue-700 text-sm mb-3">
            This is a demo version. You can use any email and password to login, or click the demo button below.
          </p>
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Try Demo Login'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={isLoading}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-900 text-white py-3 rounded-lg hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-accent-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-primary-900 font-semibold hover:text-primary-700 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
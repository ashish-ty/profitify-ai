import React from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-dark-900/95 backdrop-blur-sm border-b border-dark-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-white">Profitify.ai</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-accent-300 hover:text-primary-400 transition-colors">Features</a>
            <a href="#solutions" className="text-accent-300 hover:text-primary-400 transition-colors">Solutions</a>
            <a href="#contact" className="text-accent-300 hover:text-primary-400 transition-colors">Contact</a>
            <button
              onClick={onLoginClick}
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-800">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-accent-300 hover:text-primary-400 transition-colors">Features</a>
              <a href="#solutions" className="text-accent-300 hover:text-primary-400 transition-colors">Solutions</a>
              <a href="#contact" className="text-accent-300 hover:text-primary-400 transition-colors">Contact</a>
              <button
                onClick={onLoginClick}
                className="text-left text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-left"
              >
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
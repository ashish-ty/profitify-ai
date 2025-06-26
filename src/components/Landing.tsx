import React, { useState } from 'react';
import { Header } from './Landing/Header';
import { Hero } from './Landing/Hero';
import { Features } from './Landing/Features';
import { Testimonials } from './Landing/Testimonials';
import { Footer } from './Landing/Footer';
import { LoginModal } from './Auth/LoginModal';
import { SignupModal } from './Auth/SignupModal';

interface LandingProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string, hospitalName: string) => void;
}

export function Landing({ onLogin, onSignup }: LandingProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogin = (email: string, password: string) => {
    onLogin(email, password);
    handleCloseModals();
  };

  const handleSignup = (name: string, email: string, password: string, hospitalName: string) => {
    onSignup(name, email, password, hospitalName);
    handleCloseModals();
  };

  // Quick access button for demo purposes
  const handleQuickDemo = () => {
    onLogin('demo@hospital.com', 'demo123');
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Header onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      
      {/* Demo Access Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">🚀 Demo Mode Active</span>
              <span className="text-sm opacity-90">Experience the full platform instantly</span>
            </div>
            <button
              onClick={handleQuickDemo}
              className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Quick Demo Access
            </button>
          </div>
        </div>
      </div>

      <Hero onGetStarted={handleSignupClick} />
      <Features />
      <Testimonials />
      <Footer />
      
      <LoginModal
        isOpen={showLogin}
        onClose={handleCloseModals}
        onLogin={handleLogin}
        onSwitchToSignup={handleSignupClick}
      />
      
      <SignupModal
        isOpen={showSignup}
        onClose={handleCloseModals}
        onSignup={handleSignup}
        onSwitchToLogin={handleLoginClick}
      />
    </div>
  );
}
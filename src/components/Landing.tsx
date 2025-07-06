import React, { useState } from 'react';
import { Header } from './Landing/Header';
import { Hero } from './Landing/Hero';
import { Features } from './Landing/Features';
import { Solutions } from './Landing/Solutions';
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

  return (
    <div className="min-h-screen bg-dark-900">
      <Header onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      <Hero onGetStarted={handleSignupClick} />
      <Features />
      <Solutions onGetStarted={handleSignupClick} />
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
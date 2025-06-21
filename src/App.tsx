import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, isLoading, login, signup, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-accent-600">Loading Medicost.ai...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={login} onSignup={signup} />;
  }

  return (
    <Router>
      <Dashboard user={user} onLogout={logout} />
    </Router>
  );
}

export default App;
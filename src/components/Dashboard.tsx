import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Sidebar } from './Dashboard/Sidebar';
import { Overview } from './Dashboard/Overview';
import { HospitalData } from './Dashboard/HospitalData';
import { Tools } from './Dashboard/Tools';
import { RevenueAnalysis } from './Tools/RevenueAnalysis';
import { RevenueAnalytics } from './Tools/RevenueAnalytics';
import { ExpenseAnalytics } from './Tools/ExpenseAnalytics';
import { MetadataAnalytics } from './Tools/MetadataAnalytics';
import { ProfitabilityAnalysis } from './Tools/ProfitabilityAnalysis';
import { BudgetPlanning } from './Tools/BudgetPlanning';
import { CostAnalysis } from './Tools/CostAnalysis';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard' || path.startsWith('/dashboard/overview')) {
      setActiveSection('dashboard');
    } else if (path.startsWith('/dashboard/hospital-data')) {
      setActiveSection('hospital-data');
    } else if (path.startsWith('/dashboard/tools')) {
      setActiveSection('tools');
    } else if (path.startsWith('/dashboard/settings')) {
      setActiveSection('settings');
    } else if (path.startsWith('/dashboard/help')) {
      setActiveSection('help');
    }
  }, [location.pathname]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    switch (section) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'hospital-data':
        navigate('/dashboard/hospital-data');
        break;
      case 'tools':
        navigate('/dashboard/tools');
        break;
      case 'settings':
        navigate('/dashboard/settings');
        break;
      case 'help':
        navigate('/dashboard/help');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-primary-50">
      <Sidebar
        user={user}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/hospital-data" element={<HospitalData />} />
            <Route path="/dashboard/tools" element={<Tools />} />
            <Route path="/dashboard/tools/revenue-analytics" element={<RevenueAnalytics />} />
            <Route path="/dashboard/tools/expense-analytics" element={<ExpenseAnalytics />} />
            <Route path="/dashboard/tools/metadata-analytics" element={<MetadataAnalytics />} />
            <Route path="/dashboard/tools/profitability" element={<ProfitabilityAnalysis />} />
            <Route path="/dashboard/tools/profitability/:level" element={<ProfitabilityAnalysis />} />
            <Route path="/dashboard/tools/budget-planning" element={<BudgetPlanning />} />
            <Route path="/dashboard/tools/budget-planner" element={<BudgetPlanning />} />
            <Route path="/dashboard/tools/cost-analysis" element={<CostAnalysis />} />
            <Route path="/dashboard/settings" element={<div className="p-8">Settings content coming soon...</div>} />
            <Route path="/dashboard/help" element={<div className="p-8">Help & Support content coming soon...</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
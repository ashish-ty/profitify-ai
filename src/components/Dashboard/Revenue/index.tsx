import React, { useState } from 'react';
import { RevenueNavigation } from './RevenueNavigation';
import { RevenueTableView } from './RevenueTableView';

interface RevenueProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Revenue({ onToggleSidebar, sidebarCollapsed }: RevenueProps) {
  const [activeTable, setActiveTable] = useState('bill-register');

  const renderTableContent = () => {
    switch (activeTable) {
      case 'bill-register':
        return (
          <RevenueTableView 
            onToggleSidebar={onToggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
        );
      case 'revenue-summary':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Summary Table</h3>
              <p className="text-gray-600">Coming soon - Aggregated revenue data by department</p>
            </div>
          </div>
        );
      case 'payment-analysis':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Analysis Table</h3>
              <p className="text-gray-600">Coming soon - Payment method and payor analysis</p>
            </div>
          </div>
        );
      case 'revenue-trends':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Trends Table</h3>
              <p className="text-gray-600">Coming soon - Historical trends and forecasting</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <RevenueNavigation 
        activeTable={activeTable}
        onTableChange={setActiveTable}
      />
      {renderTableContent()}
    </div>
  );
}
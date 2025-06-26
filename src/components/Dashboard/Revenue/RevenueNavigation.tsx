import React from 'react';
import { FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react';

interface RevenueTable {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  recordCount: number;
}

const REVENUE_TABLES: RevenueTable[] = [
  {
    id: 'bill-register',
    name: 'Bill Register',
    description: 'Complete billing records with patient and payment details',
    icon: FileText,
    recordCount: 150
  },
  {
    id: 'revenue-summary',
    name: 'Revenue Summary',
    description: 'Aggregated revenue data by department and time period',
    icon: BarChart3,
    recordCount: 48
  },
  {
    id: 'payment-analysis',
    name: 'Payment Analysis',
    description: 'Payment method and payor analysis',
    icon: PieChart,
    recordCount: 75
  },
  {
    id: 'revenue-trends',
    name: 'Revenue Trends',
    description: 'Historical revenue trends and forecasting',
    icon: TrendingUp,
    recordCount: 24
  }
];

interface RevenueNavigationProps {
  activeTable: string;
  onTableChange: (tableId: string) => void;
}

export function RevenueNavigation({ activeTable, onTableChange }: RevenueNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {REVENUE_TABLES.map((table) => {
            const Icon = table.icon;
            const isActive = activeTable === table.id;
            
            return (
              <button
                key={table.id}
                onClick={() => onTableChange(table.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{table.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-primary-200 text-primary-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {table.recordCount}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Table Description */}
        <div className="mt-2 text-sm text-gray-600">
          {REVENUE_TABLES.find(table => table.id === activeTable)?.description}
        </div>
      </div>
    </div>
  );
}
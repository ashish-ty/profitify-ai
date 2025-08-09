import React, { useState } from 'react';
import { DollarSign, TrendingDown, Building2, Calculator } from 'lucide-react';
import { DataCard } from './DataCard';
import { ServiceRegisterTable } from './Revenue/ServiceRegisterTable';
import { ExpenseTablesNew } from './Expense/ExpenseTablesNew';
import { MetadataTablesNew } from './Metadata/MetadataTablesNew';
import { ServiceWiseCostAnalysis } from './ServiceWiseCostAnalysis';
import { DataType } from '../../types';

const dataCards = [
  {
    id: 'revenue' as DataType,
    title: 'Revenue Data',
    description: 'Manage Service Register with detailed patient service tracking',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    fields: ['Service Register', 'Patient Services', 'Payment Tracking', 'Service Analysis']
  },
  {
    id: 'expenses' as DataType,
    title: 'Expense Tables',
    description: 'Monitor costs with Trial Balance, Expense Wise, Variable Cost, and HR data',
    icon: TrendingDown,
    color: 'bg-red-100 text-red-600',
    fields: ['Trial Balance', 'Expense Wise', 'Variable Cost', 'HR Data']
  },
  {
    id: 'metadata' as DataType,
    title: 'Metadata Tables',
    description: 'Comprehensive hospital operational data across 8 different tables',
    icon: Building2,
    color: 'bg-blue-100 text-blue-600',
    fields: ['Occupancy', 'OT Register', 'Consumption', 'Power Load', 'Assets', 'TAT', 'Cost Centers', 'Drivers']
  },
  {
    id: 'cost-analysis' as DataType,
    title: 'Service-wise Cost Analysis',
    description: 'AI-powered activity-based costing with service-level cost breakdown',
    icon: Calculator,
    color: 'bg-purple-100 text-purple-600',
    fields: ['Cost Allocation', 'Service Profitability', 'Activity-Based Costing', 'Optimization']
  }
];

export function HospitalData() {
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(null);

  const handleCardClick = (dataType: DataType) => {
    setSelectedDataType(dataType);
  };

  const handleBack = () => {
    setSelectedDataType(null);
  };

  if (selectedDataType === 'revenue') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <span>← Back to Hospital Data</span>
          </button>
        </div>
        <ServiceRegisterTable />
      </div>
    );
  }

  if (selectedDataType === 'expenses') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <span>← Back to Hospital Data</span>
          </button>
        </div>
        <ExpenseTablesNew />
      </div>
    );
  }

  if (selectedDataType === 'metadata') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <span>← Back to Hospital Data</span>
          </button>
        </div>
        <MetadataTablesNew />
      </div>
    );
  }

  if (selectedDataType === 'cost-analysis') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <span>← Back to Hospital Data</span>
          </button>
        </div>
        <ServiceWiseCostAnalysis />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Hospital Data</h1>
        <p className="text-accent-600">Manage your hospital's financial and operational data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataCards.map((card) => (
          <DataCard
            key={card.id}
            {...card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Revenue Tracking</h4>
            <p className="text-sm text-accent-600">Track detailed service-level revenue with comprehensive patient data</p>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Expense Management</h4>
            <p className="text-sm text-accent-600">Monitor expenses across multiple categories with detailed cost allocation</p>
          </div>
          <div className="bg-accent-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Operational Data</h4>
            <p className="text-sm text-accent-600">Comprehensive metadata tracking for optimal resource utilization</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Cost Analysis</h4>
            <p className="text-sm text-accent-600">AI-powered activity-based costing for service-level profitability insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { DollarSign, TrendingDown, Building2, Table } from 'lucide-react';
import { DataCard } from './DataCard';
import { DataForm } from './DataForm';
import { ServiceRegisterTable } from './Revenue/ServiceRegisterTable';
import { ExpenseTablesNew } from './Expense/ExpenseTablesNew';
import { MetadataTablesNew } from './Metadata/MetadataTablesNew';
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Hospital Data</h1>
        <p className="text-accent-600">Manage your hospital's financial and operational data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Revenue Tracking</h4>
            <p className="text-sm text-accent-600">Update revenue data monthly for accurate financial insights</p>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Expense Management</h4>
            <p className="text-sm text-accent-600">Monitor expenses regularly to identify cost-saving opportunities</p>
          </div>
          <div className="bg-accent-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Data Accuracy</h4>
            <p className="text-sm text-accent-600">Ensure all data is accurate for reliable AI-powered insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
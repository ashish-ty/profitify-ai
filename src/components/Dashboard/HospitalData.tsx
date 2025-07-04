import React, { useState } from 'react';
import { DollarSign, TrendingDown, Building2 } from 'lucide-react';
import { DataCard } from './DataCard';
import { DataForm } from './DataForm';
import { Revenue } from './Revenue';
import { DataType } from '../../types';

const dataCards = [
  {
    id: 'revenue' as DataType,
    title: 'Revenue Data',
    description: 'Track income from OPD, IPD, and different specialties',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    fields: ['Patient Type', 'Specialty', 'Billing Category', 'Gross Amount']
  },
  {
    id: 'expenses' as DataType,
    title: 'Expense Data',
    description: 'Monitor costs across all hospital departments',
    icon: TrendingDown,
    color: 'bg-red-100 text-red-600',
    fields: ['Pharmacy', 'Salaries', 'Power & Fuel', 'Admin Expenses']
  },
  {
    id: 'metadata' as DataType,
    title: 'Hospital Metadata',
    description: 'Maintain hospital capacity and staff information',
    icon: Building2,
    color: 'bg-blue-100 text-blue-600',
    fields: ['Bed Capacity', 'Staff Count', 'Equipment', 'Facilities']
  }
];

interface HospitalDataProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function HospitalData({ onToggleSidebar, sidebarCollapsed }: HospitalDataProps) {
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(null);

  const handleCardClick = (dataType: DataType) => {
    if (dataType === 'revenue') {
      // For revenue, show the new table interface
      setSelectedDataType('revenue');
    } else {
      // For other types, show the form interface
      setSelectedDataType(dataType);
    }
  };

  const handleBack = () => {
    setSelectedDataType(null);
  };

  if (selectedDataType === 'revenue') {
    return (
      <Revenue 
        onToggleSidebar={onToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />
    );
  }

  if (selectedDataType) {
    return <DataForm dataType={selectedDataType} onBack={handleBack} />;
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
            <p className="text-sm text-accent-600">Use Excel-like tables for detailed revenue analysis and bill management</p>
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
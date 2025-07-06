import React, { useState } from 'react';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { DataType } from '../../types';
import { ExpenseForm } from './Forms/ExpenseForm';
import { MetadataForm } from './Forms/MetadataForm';
import { ExpenseTable } from '../Common/ExpenseTable';
import { MetadataTable } from '../Common/MetadataTable';

interface DataFormProps {
  dataType: DataType;
  onBack: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const titles = {
  expenses: 'Expense Data Entry',
  metadata: 'Hospital Metadata Entry'
};

export function DataForm({ dataType, onBack }: DataFormProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const renderForm = () => {
    switch (dataType) {
      case 'expenses':
        return <ExpenseTable />;
      case 'metadata':
        return <MetadataTable />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Hospital Data</span>
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-primary-900 mb-2">{titles[dataType]}</h1>
        <p className="text-accent-600 mb-6">Manage your {dataType} data with detailed table views</p>
        {renderForm()}
      </div>
    </div>
  );
}
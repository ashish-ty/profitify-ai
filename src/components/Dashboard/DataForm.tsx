import React, { useState } from 'react';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { DataType } from '../../types';
import { RevenueForm } from './Forms/RevenueForm';
import { ExpenseForm } from './Forms/ExpenseForm';
import { MetadataForm } from './Forms/MetadataForm';

interface DataFormProps {
  dataType: DataType;
  onBack: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const titles = {
  revenue: 'Revenue Data Entry',
  expenses: 'Expense Data Entry',
  metadata: 'Hospital Metadata Entry'
};

export function DataForm({ dataType, onBack }: DataFormProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const renderForm = () => {
    switch (dataType) {
      case 'revenue':
        return <RevenueForm month={months[selectedMonth]} />;
      case 'expenses':
        return <ExpenseForm month={months[selectedMonth]} />;
      case 'metadata':
        return <MetadataForm month={months[selectedMonth]} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-xl shadow-sm border border-primary-100">
        <div className="p-6 border-b border-primary-100">
          <h1 className="text-2xl font-bold text-primary-900 mb-2">{titles[dataType]}</h1>
          <p className="text-accent-600">Update your monthly data to track financial performance</p>
        </div>

        <div className="flex">
          {/* Month Selector */}
          <div className="w-64 border-r border-primary-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-primary-900">Select Month</span>
            </div>
            <div className="space-y-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedMonth === index
                      ? 'bg-primary-900 text-white'
                      : 'text-accent-700 hover:bg-primary-50'
                  }`}
                >
                  {month} 2024
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-2">
                {months[selectedMonth]} 2024 Data
              </h2>
              <p className="text-accent-600 text-sm">
                Fill in the required fields for {months[selectedMonth]} data entry
              </p>
            </div>

            {renderForm()}

            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-accent-300 text-accent-700 rounded-lg hover:bg-accent-50 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
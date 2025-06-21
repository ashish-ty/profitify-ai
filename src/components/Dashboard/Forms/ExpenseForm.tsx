import React, { useState, useEffect } from 'react';
import { useExpenseData } from '../../../hooks/useExpenseData';
import { apiService } from '../../../services/api';

interface ExpenseFormProps {
  month: string;
  onMonthChange: (month: string) => void;
}

export function ExpenseForm({ month, onMonthChange }: ExpenseFormProps) {
  const { createExpenseData, fetchExpenseData, fetchExpenseSummary, expenseData, isLoading } = useExpenseData();
  const [isSaving, setIsSaving] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const defaultFormData = {
    pharmacy: 0,
    material_non_medical: 0,
    doctor_share: 0,
    salary_wages: 0,
    power_fuel: 0,
    admin_financial: 0,
    repair_maintenance: 0,
    sales_marketing: 0,
    depreciation: 0
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Fetch data when month changes
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchExpenseData({ year: currentYear, month }),
        fetchExpenseSummary({ year: currentYear, month })
      ]);
    };
    fetchData();
  }, [month, currentYear]);

  // Update form data when expenseData changes
  useEffect(() => {
    if (expenseData) {
      const currentMonthData = expenseData.find(
        expense => expense.month === month && expense.year === currentYear
      );

      if (currentMonthData) {
        setCurrentExpenseId(currentMonthData.id); // Store the ID for updates
        setFormData({
          pharmacy: currentMonthData.pharmacy,
          material_non_medical: currentMonthData.material_non_medical,
          doctor_share: currentMonthData.doctor_share,
          salary_wages: currentMonthData.salary_wages,
          power_fuel: currentMonthData.power_fuel,
          admin_financial: currentMonthData.admin_financial,
          repair_maintenance: currentMonthData.repair_maintenance,
          sales_marketing: currentMonthData.sales_marketing,
          depreciation: currentMonthData.depreciation
        });
      } else {
        setCurrentExpenseId(null); // Reset ID when no data exists
        setFormData(defaultFormData);
      }
    }
  }, [expenseData, month, currentYear]);

  const handleChange = (field: string, value: string) => {
    // Allow empty string for better UX when clearing the input
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const expensePayload = {
        month,
        year: currentYear,
        ...formData
      };

      if (currentExpenseId) {
        // Update existing record
        await apiService.updateExpenseData(currentExpenseId, expensePayload);
      } else {
        // Create new record
        await createExpenseData(expensePayload);
      }

      alert('Expense data saved successfully!');
      // Fetch updated data and summary
      await Promise.all([
        fetchExpenseData({ year: currentYear, month }),
        fetchExpenseSummary({ year: currentYear, month })
      ]);
    } catch (error) {
      console.error('Failed to save expense data:', error);
      alert('Failed to save expense data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const expenseFields = [
    { key: 'pharmacy', label: 'Pharmacy, Medical & Surgical' },
    { key: 'material_non_medical', label: 'Material - Non Medical' },
    { key: 'doctor_share', label: 'Doctor Share & Outsource Services' },
    { key: 'salary_wages', label: 'Salary & Wages' },
    { key: 'power_fuel', label: 'Power & Fuel' },
    { key: 'admin_financial', label: 'Admin & Financial Expenses' },
    { key: 'repair_maintenance', label: 'Repair and Maintenance' },
    { key: 'sales_marketing', label: 'Sales & Marketing' },
    { key: 'depreciation', label: 'Depreciation & Amortization' }
  ];

  const totalExpenses = Object.values(formData).reduce((sum, value) => {
    // Convert to number and handle any potential NaN values
    const numValue = Number(value) || 0;
    return sum + numValue;
  }, 0);

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenseFields.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              {label} ($)
            </label>
            <input
              type="number"
              value={formData[key as keyof typeof formData] === 0 ? '' : formData[key as keyof typeof formData]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Enter ${label.toLowerCase()} amount`}
              disabled={isLoading || isSaving}
              min="0"
              step="0.01"
            />
          </div>
        ))}
      </div>

      <div className="bg-red-50 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-4">Expense Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {expenseFields.slice(0, 6).map(({ key, label }) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-accent-600">{label.split(' ')[0]}:</span>
              <span className="font-semibold text-red-900">
                ${(formData[key as keyof typeof formData] || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-red-200 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-red-900">Total Expenses:</span>
            <span className="text-xl font-bold text-red-900">
              ${totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Expense Data'}
        </button>
      </div>
    </form>
  );
}
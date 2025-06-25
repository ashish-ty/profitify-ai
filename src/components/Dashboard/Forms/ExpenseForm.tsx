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

  const specialties = ['cardiology', 'oncology', 'neurology', 'gynaecology'];

  const defaultFormData = {
    medical_surgical: 0,
    material_non_medical: 0,
    sales_marketing: 0,
    admin_expenses: 0,
    financial_expenses: 0,
    salary: { medical: 0, non_medical: 0, support: 0 },
    power_fuel: { electricity: 0, oxygen: 0, others: 0 },
    repair_maintenance: { biomedical: 0, it_electrical: 0, others: 0 },
    pharmacy: { cardiology: 0, oncology: 0, neurology: 0, gynaecology: 0 },
    doctor_share: { cardiology: 0, oncology: 0, neurology: 0, gynaecology: 0 },
    outsource_services: { cardiology: 0, oncology: 0, neurology: 0, gynaecology: 0 },
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
          medical_surgical: currentMonthData.medical_surgical,
          material_non_medical: currentMonthData.material_non_medical,
          sales_marketing: currentMonthData.sales_marketing,
          admin_expenses: currentMonthData.admin_expenses,
          financial_expenses: currentMonthData.financial_expenses,
          salary: { ...currentMonthData.salary },
          power_fuel: { ...currentMonthData.power_fuel },
          repair_maintenance: { ...currentMonthData.repair_maintenance },
          pharmacy: { ...currentMonthData.pharmacy },
          doctor_share: { ...currentMonthData.doctor_share },
          outsource_services: { ...currentMonthData.outsource_services },
        });
      } else {
        setCurrentExpenseId(null); // Reset ID when no data exists
        setFormData(defaultFormData);
      }
    }
  }, [expenseData, month, currentYear]);

  const handleChange = (field: string, value: string | number, group?: string) => {
    if (group) {
      setFormData(prev => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: value === '' ? 0 : Number(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value === '' ? 0 : Number(value),
      }));
    }
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
    { key: 'medical_surgical', label: 'Medical & Surgical' },
    { key: 'material_non_medical', label: 'Material - Non Medical' },
    { key: 'sales_marketing', label: 'Sales & Marketing' },
    { key: 'admin_expenses', label: 'Administrative Expenses' },
    { key: 'financial_expenses', label: 'Financial Expenses' },
  ];

  const totalExpenses = Object.values(formData).reduce((sum, value) => {
    // Convert to number and handle any potential NaN values
    const numValue = Number(value) || 0;
    return sum + numValue;
  }, 0);

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single value fields */}
        {expenseFields.map(({ key, label }) => (
          <div key={key}>
            <label
              htmlFor={`expense-${key}`}
              className="block text-sm font-medium text-accent-700 mb-2"
            >
              {label} ($)
            </label>
            <input
              id={`expense-${key}`}
              type="number"
              value={formData[key] === 0 ? '' : formData[key]}
              onChange={e => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Enter ${label.toLowerCase()} amount`}
              disabled={isLoading || isSaving}
              min="0"
              step="0.01"
            />
          </div>
        ))}

        {/* Grouped fields */}
        {[
          {
            group: 'salary',
            label: 'Salary',
            fields: [
              { key: 'medical', label: 'Medical' },
              { key: 'non_medical', label: 'Non-Medical' },
              { key: 'support', label: 'Support' },
            ],
          },
          {
            group: 'power_fuel',
            label: 'Power & Fuel',
            fields: [
              { key: 'electricity', label: 'Electricity' },
              { key: 'oxygen', label: 'Oxygen' },
              { key: 'others', label: 'Others' },
            ],
          },
          {
            group: 'repair_maintenance',
            label: 'Repair & Maintenance',
            fields: [
              { key: 'biomedical', label: 'Biomedical' },
              { key: 'it_electrical', label: 'IT & Electrical' },
              { key: 'others', label: 'Others' },
            ],
          },
        ].map(({ group, label, fields }) => (
          <div key={group} className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-accent-700 mb-2">
              {label}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {fields.map(({ key, label: subLabel }) => (
                <div key={key}>
                  <label
                    htmlFor={`${group}-${key}`}
                    className="block text-xs font-medium text-accent-600 mb-1"
                  >
                    {subLabel}
                  </label>
                  <input
                    id={`${group}-${key}`}
                    type="number"
                    value={formData[group][key] === 0 ? '' : formData[group][key]}
                    onChange={e => handleChange(key, e.target.value, group)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={subLabel}
                    disabled={isLoading || isSaving}
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Per-specialty fields */}
        {[
          { group: 'pharmacy', label: 'Pharmacy' },
          { group: 'doctor_share', label: 'Doctor Share' },
          { group: 'outsource_services', label: 'Outsource Services' },
        ].map(({ group, label }) => (
          <div key={group} className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-accent-700 mb-2">
              {label} (per specialty)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {specialties.map(specialty => (
                <div key={specialty}>
                  <label
                    htmlFor={`${group}-${specialty}`}
                    className="block text-xs font-medium text-accent-600 mb-1"
                  >
                    {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                  </label>
                  <input
                    id={`${group}-${specialty}`}
                    type="number"
                    value={formData[group][specialty] === 0 ? '' : formData[group][specialty]}
                    onChange={e => handleChange(specialty, e.target.value, group)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                    disabled={isLoading || isSaving}
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
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
                ${(formData[key] || 0).toLocaleString()}
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
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface ExpenseData {
  id: string;
  month: string;
  year: number;
  pharmacy: number;
  material_non_medical: number;
  doctor_share: number;
  salary_wages: number;
  power_fuel: number;
  admin_financial: number;
  repair_maintenance: number;
  sales_marketing: number;
  depreciation: number;
  total_expenses: number;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseSummary {
  total_expenses: number;
  category_breakdown: Record<string, { amount: number; percentage: number }>;
}

export function useExpenseData() {
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenseData = async (filters?: { year?: number; month?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getExpenseData(filters);
      setExpenseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenseSummary = async (filters?: { year?: number; month?: string }) => {
    try {
      const summaryData = await apiService.getExpenseSummary(filters);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense summary');
    }
  };

  const createExpenseData = async (data: Omit<ExpenseData, 'id' | 'total_expenses' | 'created_at' | 'updated_at'>) => {
    try {
      const newExpense = await apiService.createExpenseData(data);
      setExpenseData(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense data');
      throw err;
    }
  };

  useEffect(() => {
    fetchExpenseData();
    fetchExpenseSummary();
  }, []);

  return {
    expenseData,
    summary,
    isLoading,
    error,
    fetchExpenseData,
    fetchExpenseSummary,
    createExpenseData,
  };
}
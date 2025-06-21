import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface DashboardMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  total_patients: number;
  revenue_per_patient: number;
}

export interface RevenueTrends {
  [month: string]: {
    revenue: number;
    patients: number;
    opd_revenue: number;
    ipd_revenue: number;
  };
}

export interface ExpenseAnalysis {
  monthly_expenses: {
    [month: string]: { total: number };
  };
  category_analysis: {
    [category: string]: { amount: number; percentage: number };
  };
}

export interface ProfitabilityAnalysis {
  specialty_analysis: {
    [specialty: string]: {
      revenue: number;
      patients: number;
      revenue_per_patient: number;
      estimated_profit: number;
      profit_margin: number;
    };
  };
  overall_profit_margin: number;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
}

export interface PatientVolumeAnalysis {
  monthly_data: {
    [month: string]: { patients: number; revenue: number };
  };
  correlation_coefficient: number;
  total_patients: number;
  total_revenue: number;
  average_revenue_per_patient: number;
}

export function useAnalytics() {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrends | null>(null);
  const [expenseAnalysis, setExpenseAnalysis] = useState<ExpenseAnalysis | null>(null);
  const [profitabilityAnalysis, setProfitabilityAnalysis] = useState<ProfitabilityAnalysis | null>(null);
  const [patientVolumeAnalysis, setPatientVolumeAnalysis] = useState<PatientVolumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardMetrics = async (year?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getDashboardMetrics(year);
      setDashboardMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevenueTrends = async (year?: number) => {
    try {
      const data = await apiService.getRevenueTrends(year);
      setRevenueTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue trends');
    }
  };

  const fetchExpenseAnalysis = async (year?: number) => {
    try {
      const data = await apiService.getExpenseAnalysis(year);
      setExpenseAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense analysis');
    }
  };

  const fetchProfitabilityAnalysis = async (year?: number) => {
    try {
      const data = await apiService.getProfitabilityAnalysis(year);
      setProfitabilityAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profitability analysis');
    }
  };

  const fetchPatientVolumeAnalysis = async (year?: number) => {
    try {
      const data = await apiService.getPatientVolumeAnalysis(year);
      setPatientVolumeAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient volume analysis');
    }
  };

  const fetchAllAnalytics = async (year?: number) => {
    await Promise.all([
      fetchDashboardMetrics(year),
      fetchRevenueTrends(year),
      fetchExpenseAnalysis(year),
      fetchProfitabilityAnalysis(year),
      fetchPatientVolumeAnalysis(year),
    ]);
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  return {
    dashboardMetrics,
    revenueTrends,
    expenseAnalysis,
    profitabilityAnalysis,
    patientVolumeAnalysis,
    isLoading,
    error,
    fetchDashboardMetrics,
    fetchRevenueTrends,
    fetchExpenseAnalysis,
    fetchProfitabilityAnalysis,
    fetchPatientVolumeAnalysis,
    fetchAllAnalytics,
  };
}
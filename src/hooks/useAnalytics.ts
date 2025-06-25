import { useState, useEffect } from 'react';

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

// Dummy data
const DUMMY_DASHBOARD_METRICS: DashboardMetrics = {
  total_revenue: 3285000,
  total_expenses: 2770000,
  net_profit: 515000,
  profit_margin: 15.7,
  total_patients: 14600,
  revenue_per_patient: 225
};

const DUMMY_REVENUE_TRENDS: RevenueTrends = {
  'January': { revenue: 280000, patients: 1200, opd_revenue: 120000, ipd_revenue: 160000 },
  'February': { revenue: 295000, patients: 1250, opd_revenue: 125000, ipd_revenue: 170000 },
  'March': { revenue: 310000, patients: 1300, opd_revenue: 130000, ipd_revenue: 180000 },
  'April': { revenue: 325000, patients: 1350, opd_revenue: 135000, ipd_revenue: 190000 },
  'May': { revenue: 340000, patients: 1400, opd_revenue: 140000, ipd_revenue: 200000 },
  'June': { revenue: 355000, patients: 1450, opd_revenue: 145000, ipd_revenue: 210000 }
};

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setDashboardMetrics(DUMMY_DASHBOARD_METRICS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevenueTrends = async (year?: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setRevenueTrends(DUMMY_REVENUE_TRENDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue trends');
    }
  };

  const fetchExpenseAnalysis = async (year?: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setExpenseAnalysis({
        monthly_expenses: {
          'January': { total: 450000 },
          'February': { total: 465000 },
          'March': { total: 470000 },
          'April': { total: 485000 },
          'May': { total: 490000 },
          'June': { total: 505000 }
        },
        category_analysis: {
          'pharmacy': { amount: 180000, percentage: 35 },
          'salaries': { amount: 220000, percentage: 42 },
          'utilities': { amount: 65000, percentage: 12 },
          'maintenance': { amount: 35000, percentage: 7 },
          'admin': { amount: 25000, percentage: 4 }
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense analysis');
    }
  };

  const fetchProfitabilityAnalysis = async (year?: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProfitabilityAnalysis({
        specialty_analysis: {
          'Cardiology': { revenue: 850000, patients: 3500, revenue_per_patient: 243, estimated_profit: 170000, profit_margin: 20 },
          'Oncology': { revenue: 720000, patients: 2800, revenue_per_patient: 257, estimated_profit: 144000, profit_margin: 20 },
          'Neurology': { revenue: 650000, patients: 3200, revenue_per_patient: 203, estimated_profit: 130000, profit_margin: 20 },
          'Gynaecology': { revenue: 580000, patients: 2900, revenue_per_patient: 200, estimated_profit: 116000, profit_margin: 20 }
        },
        overall_profit_margin: 15.7,
        total_revenue: 3285000,
        total_expenses: 2770000,
        net_profit: 515000
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profitability analysis');
    }
  };

  const fetchPatientVolumeAnalysis = async (year?: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setPatientVolumeAnalysis({
        monthly_data: {
          'January': { patients: 1200, revenue: 280000 },
          'February': { patients: 1250, revenue: 295000 },
          'March': { patients: 1300, revenue: 310000 },
          'April': { patients: 1350, revenue: 325000 },
          'May': { patients: 1400, revenue: 340000 },
          'June': { patients: 1450, revenue: 355000 }
        },
        correlation_coefficient: 0.95,
        total_patients: 14600,
        total_revenue: 3285000,
        average_revenue_per_patient: 225
      });
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
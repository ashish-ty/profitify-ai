import { useState, useEffect } from 'react';

export interface RevenueMetrics {
  total_revenue: number;
  total_gross_amount: number;
  total_discount: number;
  total_patients: number;
  monthly_growth_rate: number;
  avg_revenue_per_patient: number;
  discount_rate: number;
  daily_avg_revenue: number;
}

export interface RevenueTrend {
  month: string;
  year: number;
  revenue: number;
  patients: number;
  gross_amount: number;
  discount: number;
  revenue_change: number;
  patient_change: number;
}

export interface SpecialtyAnalysis {
  [specialty: string]: {
    total_revenue: number;
    avg_revenue: number;
    total_patients: number;
    revenue_per_patient: number;
    discount_rate: number;
    revenue_percentage: number;
  };
}

export interface PatientTypeAnalysis {
  [patientType: string]: {
    total_revenue: number;
    total_patients: number;
    revenue_percentage: number;
    revenue_per_patient: number;
    bed_days_icu: number;
    bed_days_non_icu: number;
  };
}

export interface PaymentAnalysis {
  [billingCategory: string]: {
    total_revenue: number;
    total_patients: number;
    revenue_percentage: number;
    discount_rate: number;
    avg_discount: number;
  };
}

export interface RevenueInsight {
  type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface RevenueAnalysisData {
  metrics: RevenueMetrics;
  trends: {
    monthly_trends: RevenueTrend[];
    trend_direction: string;
  };
  insights: RevenueInsight[];
  specialty_analysis: SpecialtyAnalysis;
  patient_type_analysis: PatientTypeAnalysis;
  payment_analysis: PaymentAnalysis;
  data_period: {
    start_date: string | null;
    end_date: string | null;
    total_records: number;
  };
}

export interface SpecialtyComparison {
  [specialty: string]: {
    total_revenue: number;
    avg_revenue: number;
    total_patients: number;
    revenue_per_patient: number;
    discount_rate: number;
    revenue_consistency: number;
    revenue_rank: number;
    efficiency_rank: number;
  };
}

// Dummy data
const DUMMY_REVENUE_ANALYSIS: RevenueAnalysisData = {
  metrics: {
    total_revenue: 3285000,
    total_gross_amount: 3450000,
    total_discount: 165000,
    total_patients: 14600,
    monthly_growth_rate: 8.5,
    avg_revenue_per_patient: 225,
    discount_rate: 4.8,
    daily_avg_revenue: 10950
  },
  trends: {
    monthly_trends: [
      { month: 'January', year: 2024, revenue: 280000, patients: 1200, gross_amount: 295000, discount: 15000, revenue_change: 0, patient_change: 0 },
      { month: 'February', year: 2024, revenue: 295000, patients: 1250, gross_amount: 310000, discount: 15000, revenue_change: 5.4, patient_change: 4.2 },
      { month: 'March', year: 2024, revenue: 310000, patients: 1300, gross_amount: 325000, discount: 15000, revenue_change: 5.1, patient_change: 4.0 },
      { month: 'April', year: 2024, revenue: 325000, patients: 1350, gross_amount: 342000, discount: 17000, revenue_change: 4.8, patient_change: 3.8 },
      { month: 'May', year: 2024, revenue: 340000, patients: 1400, gross_amount: 358000, discount: 18000, revenue_change: 4.6, patient_change: 3.7 },
      { month: 'June', year: 2024, revenue: 355000, patients: 1450, gross_amount: 375000, discount: 20000, revenue_change: 4.4, patient_change: 3.6 }
    ],
    trend_direction: 'increasing'
  },
  insights: [
    {
      type: 'growth_opportunity',
      title: 'Top Performing Specialty',
      description: 'Cardiology generates the highest revenue ($850,000). Consider expanding this department\'s capacity.',
      impact: 'high',
      category: 'specialty'
    },
    {
      type: 'patient_volume_insight',
      title: 'IPD Revenue Opportunity',
      description: 'IPD patients generate 2.1x more revenue per patient than OPD. Focus on converting appropriate OPD cases to IPD.',
      impact: 'medium',
      category: 'patient_type'
    },
    {
      type: 'seasonal_pattern',
      title: 'Peak Revenue Period',
      description: 'June shows highest revenue ($355,000). Plan capacity and staffing for peak periods.',
      impact: 'medium',
      category: 'seasonal'
    },
    {
      type: 'revenue_optimization',
      title: 'Discount Optimization',
      description: 'Current discount rate is 4.8%. Reducing by 20% could increase revenue by $33,000.',
      impact: 'high',
      category: 'pricing'
    }
  ],
  specialty_analysis: {
    'Cardiology': {
      total_revenue: 850000,
      avg_revenue: 243,
      total_patients: 3500,
      revenue_per_patient: 243,
      discount_rate: 4.2,
      revenue_percentage: 25.9
    },
    'Oncology': {
      total_revenue: 720000,
      avg_revenue: 257,
      total_patients: 2800,
      revenue_per_patient: 257,
      discount_rate: 5.8,
      revenue_percentage: 21.9
    },
    'Neurology': {
      total_revenue: 650000,
      avg_revenue: 203,
      total_patients: 3200,
      revenue_per_patient: 203,
      discount_rate: 4.1,
      revenue_percentage: 19.8
    },
    'Gynaecology': {
      total_revenue: 580000,
      avg_revenue: 200,
      total_patients: 2900,
      revenue_per_patient: 200,
      discount_rate: 4.5,
      revenue_percentage: 17.7
    }
  },
  patient_type_analysis: {
    'OPD': {
      total_revenue: 1314000,
      total_patients: 8760,
      revenue_percentage: 40.0,
      revenue_per_patient: 150,
      bed_days_icu: 0,
      bed_days_non_icu: 0
    },
    'IPD': {
      total_revenue: 1971000,
      total_patients: 5840,
      revenue_percentage: 60.0,
      revenue_per_patient: 337,
      bed_days_icu: 2800,
      bed_days_non_icu: 8400
    }
  },
  payment_analysis: {
    'Cash': {
      total_revenue: 1971000,
      total_patients: 8760,
      revenue_percentage: 60.0,
      discount_rate: 3.2,
      avg_discount: 72
    },
    'Credit': {
      total_revenue: 1314000,
      total_patients: 5840,
      revenue_percentage: 40.0,
      discount_rate: 7.1,
      avg_discount: 160
    }
  },
  data_period: {
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-06-30T23:59:59Z',
    total_records: 48
  }
};

export function useRevenueAnalytics() {
  const [revenueAnalysis, setRevenueAnalysis] = useState<RevenueAnalysisData | null>(null);
  const [specialtyComparison, setSpecialtyComparison] = useState<SpecialtyComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueAnalysis = async (filters?: { year?: number; months?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      setRevenueAnalysis(DUMMY_REVENUE_ANALYSIS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecialtyComparison = async (year?: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSpecialtyComparison({
        'Cardiology': {
          total_revenue: 850000,
          avg_revenue: 243,
          total_patients: 3500,
          revenue_per_patient: 243,
          discount_rate: 4.2,
          revenue_consistency: 0.85,
          revenue_rank: 1,
          efficiency_rank: 2
        },
        'Oncology': {
          total_revenue: 720000,
          avg_revenue: 257,
          total_patients: 2800,
          revenue_per_patient: 257,
          discount_rate: 5.8,
          revenue_consistency: 0.78,
          revenue_rank: 2,
          efficiency_rank: 1
        },
        'Neurology': {
          total_revenue: 650000,
          avg_revenue: 203,
          total_patients: 3200,
          revenue_per_patient: 203,
          discount_rate: 4.1,
          revenue_consistency: 0.82,
          revenue_rank: 3,
          efficiency_rank: 4
        },
        'Gynaecology': {
          total_revenue: 580000,
          avg_revenue: 200,
          total_patients: 2900,
          revenue_per_patient: 200,
          discount_rate: 4.5,
          revenue_consistency: 0.80,
          revenue_rank: 4,
          efficiency_rank: 3
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch specialty comparison');
    }
  };

  const fetchAllAnalytics = async (filters?: { year?: number; months?: number }) => {
    await Promise.all([
      fetchRevenueAnalysis(filters),
      fetchSpecialtyComparison(filters?.year),
    ]);
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  return {
    revenueAnalysis,
    specialtyComparison,
    isLoading,
    error,
    fetchRevenueAnalysis,
    fetchSpecialtyComparison,
    fetchAllAnalytics,
  };
}
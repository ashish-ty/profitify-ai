import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

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

export function useRevenueAnalytics() {
  const [revenueAnalysis, setRevenueAnalysis] = useState<RevenueAnalysisData | null>(null);
  const [specialtyComparison, setSpecialtyComparison] = useState<SpecialtyComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueAnalysis = async (filters?: { year?: number; months?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getRevenueAnalysis(filters);
      setRevenueAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecialtyComparison = async (year?: number) => {
    try {
      const data = await apiService.getSpecialtyComparison(year);
      setSpecialtyComparison(data.specialty_comparison);
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
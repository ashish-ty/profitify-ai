import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface RevenueData {
  id: string;
  month: string;
  year: number;
  patient_type: 'OPD' | 'IPD';
  specialty: 'Cardiology' | 'Oncology' | 'Neurology' | 'Gynaecology';
  billing_category: 'Cash' | 'Credit';
  number_of_patients: number;
  bed_days_icu?: number;
  bed_days_non_icu?: number;
  gross_amount: number;
  discount: number;
  net_amount: number;
  created_at: string;
  updated_at?: string;
  ot_time_hrs?: number;
  day_care_procedures?: number;
}

export interface RevenueSummary {
  total_patients: number;
  total_gross_amount: number;
  total_discount: number;
  total_net_amount: number;
  patient_type_breakdown: Record<string, any>;
  specialty_breakdown: Record<string, any>;
  billing_category_breakdown: Record<string, any>;
}

export function useRevenueData() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueData = async (filters?: {
    year?: number;
    month?: string;
    patient_type?: string;
    specialty?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getRevenueData(filters);
      setRevenueData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevenueSummary = async (filters?: { year?: number; month?: string }) => {
    try {
      const summaryData = await apiService.getRevenueSummary(filters);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue summary');
    }
  };

  const createRevenueData = async (data: Omit<RevenueData, 'id' | 'net_amount' | 'created_at' | 'updated_at'>) => {
    try {
      const newRevenue = await apiService.createRevenueData(data);
      setRevenueData(prev => [newRevenue, ...prev]);
      return newRevenue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create revenue data');
      throw err;
    }
  };

  const createBulkRevenueData = async (dataArray: Array<Omit<RevenueData, 'id' | 'net_amount' | 'created_at' | 'updated_at'>>) => {
    try {
      const promises = dataArray.map(data => apiService.createRevenueData(data));
      const results = await Promise.all(promises);
      setRevenueData(prev => [...results, ...prev]);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create revenue data');
      throw err;
    }
  };

  useEffect(() => {
    fetchRevenueData();
    fetchRevenueSummary();
  }, []);

  return {
    revenueData,
    summary,
    isLoading,
    error,
    fetchRevenueData,
    fetchRevenueSummary,
    createRevenueData,
    createBulkRevenueData,
  };
}
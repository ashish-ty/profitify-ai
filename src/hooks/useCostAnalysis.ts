import { useState } from 'react';

export interface ServiceCostBreakdown {
  service_id: string;
  department: string;
  service_name: string;
  total_revenue: number;
  total_quantity: number;
  revenue_per_unit: number;
  direct_pharmacy_cost: number;
  direct_materials_cost: number;
  direct_labor_cost: number;
  allocated_overhead_cost: number;
  allocated_utilities_cost: number;
  allocated_admin_cost: number;
  allocated_facilities_cost: number;
  total_allocated_cost: number;
  cost_per_unit: number;
  profit: number;
  profit_margin_percent: number;
  pharmacy_cost_percent: number;
  materials_cost_percent: number;
  labor_cost_percent: number;
  overhead_cost_percent: number;
  cost_efficiency_score: number;
  profitability_rank: number;
  cost_optimization_potential: string;
}

export interface CostAnalysisData {
  services: ServiceCostBreakdown[];
  summary: any;
  filters_applied: any;
  generated_at: string;
  total_records: number;
}

export interface CostSummaryMetrics {
  total_services: number;
  total_revenue: number;
  total_allocated_costs: number;
  overall_profit_margin: number;
  most_profitable_service: {
    name: string;
    margin: number;
  };
  least_profitable_service: {
    name: string;
    margin: number;
  };
  cost_breakdown: {
    pharmacy_percent: number;
    materials_percent: number;
    labor_percent: number;
    overhead_percent: number;
  };
  optimization_opportunities: {
    high_potential: number;
    critical_services: number;
  };
}

export interface DepartmentBreakdown {
  departments: Array<{
    department: string;
    total_revenue: number;
    total_costs: number;
    profit: number;
    profit_margin: number;
    service_count: number;
    total_quantity: number;
    avg_cost_per_service: number;
  }>;
  total_departments: number;
  filters_applied: any;
}

export interface OptimizationRecommendation {
  type: string;
  priority: string;
  service: string;
  department: string;
  current_margin: number;
  recommendation: string;
  potential_impact: string;
  action_items: string[];
}

export interface OptimizationRecommendations {
  recommendations: OptimizationRecommendation[];
  total_recommendations: number;
  analysis_date: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useCostAnalysis() {
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysisData | null>(null);
  const [summaryMetrics, setSummaryMetrics] = useState<CostSummaryMetrics | null>(null);
  const [departmentBreakdown, setDepartmentBreakdown] = useState<DepartmentBreakdown | null>(null);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<OptimizationRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('medicost-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const fetchCostAnalysis = async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/cost-analysis/service-wise-analysis`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(filters || {})
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch cost analysis' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setCostAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cost analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummaryMetrics = async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters?.month) params.append('month', filters.month);
      if (filters?.year) params.append('year', filters.year.toString());
      if (filters?.department) params.append('department', filters.department);

      const response = await fetch(`${API_BASE_URL}/api/cost-analysis/summary-metrics?${params}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch summary metrics' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setSummaryMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary metrics');
    }
  };

  const fetchDepartmentBreakdown = async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters?.month) params.append('month', filters.month);
      if (filters?.year) params.append('year', filters.year.toString());

      const response = await fetch(`${API_BASE_URL}/api/cost-analysis/department-breakdown?${params}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch department breakdown' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setDepartmentBreakdown(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch department breakdown');
    }
  };

  const fetchOptimizationRecommendations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cost-analysis/cost-optimization-recommendations`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch recommendations' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setOptimizationRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch optimization recommendations');
    }
  };

  const exportCostAnalysis = async (format: 'json' | 'csv', filters?: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cost-analysis/export`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          format,
          filters,
          include_summary: true
        })
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'service_wise_cost_analysis.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'service_wise_cost_analysis.json';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Export failed');
    }
  };

  return {
    costAnalysis,
    summaryMetrics,
    departmentBreakdown,
    optimizationRecommendations,
    isLoading,
    error,
    fetchCostAnalysis,
    fetchSummaryMetrics,
    fetchDepartmentBreakdown,
    fetchOptimizationRecommendations,
    exportCostAnalysis
  };
}
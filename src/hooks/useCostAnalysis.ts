import { useState, useEffect } from 'react';

export interface ServiceCostRecord {
  ipd_number: string;
  service_name: string;
  cm: number;
  ew: number;
  hr: number;
  cn: number;
  bill_no: string;
  pharmacy_charged_to_patient: number;
  medical_surgical_consumables_charged_to_patient: number;
  implants_and_prosthetics_charged_to_patient: number;
  non_medical_consumables_charged_to_patient: number;
  fee_for_service: number;
  incentives_to_consultants_treating_doctors: number;
  patient_food_beverages_outsource_service: number;
  laboratory_test_outsource_service: number;
  any_other_patient_related_outsourced_services_1: number;
  any_other_patient_related_outsourced_services_2: number;
  any_other_patient_related_outsourced_services_3: number;
  brokerage_commission: number;
  provision_for_deduction_bad_debts: number;
  doctor_name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useCostAnalysis() {
  const [costAnalysisData, setCostAnalysisData] = useState<ServiceCostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('medicost-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const fetchCostAnalysis = async (filters?: {
    month?: string;
    year?: number;
    department?: string;
    service_name?: string;
    patient_type?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.month) params.append('month', filters.month);
      if (filters?.year) params.append('year', filters.year.toString());
      if (filters?.department) params.append('department', filters.department);
      if (filters?.service_name) params.append('service_name', filters.service_name);
      if (filters?.patient_type) params.append('patient_type', filters.patient_type);

      const response = await fetch(`${API_BASE_URL}/api/cost-analysis/?${params}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch cost analysis' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setCostAnalysisData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cost analysis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCostAnalysis();
  }, []);

  return {
    costAnalysisData,
    isLoading,
    error,
    fetchCostAnalysis
  };
}
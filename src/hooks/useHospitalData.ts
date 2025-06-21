import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface HospitalMetadata {
  id: string;
  month: string;
  year: number;
  beds_icu: number;
  beds_non_icu: number;
  number_of_nurses: number;
  resident_doctors: number;
  technician_staff: number;
  created_at: string;
  updated_at?: string;
}

export function useHospitalData() {
  const [metadata, setMetadata] = useState<HospitalMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (filters?: { year?: number; month?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getHospitalMetadata(filters);
      setMetadata(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospital data');
    } finally {
      setIsLoading(false);
    }
  };

  const createMetadata = async (data: Omit<HospitalMetadata, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMetadata = await apiService.createHospitalMetadata(data);
      setMetadata(prev => [newMetadata, ...prev]);
      return newMetadata;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hospital data');
      throw err;
    }
  };

  const updateMetadata = async (id: string, updates: Partial<HospitalMetadata>) => {
    try {
      const updatedMetadata = await apiService.updateHospitalMetadata(id, updates);
      setMetadata(prev => prev.map(item => item.id === id ? updatedMetadata : item));
      return updatedMetadata;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hospital data');
      throw err;
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  return {
    metadata,
    isLoading,
    error,
    fetchMetadata,
    createMetadata,
    updateMetadata,
  };
}
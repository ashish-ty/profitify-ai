import { useState, useEffect } from 'react';
import { newTablesApiService } from '../services/newTablesApi';

// Service Register Hook
export function useServiceRegister() {
  const [serviceRegisterData, setServiceRegisterData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceRegister = async (filters?: {
    month?: string;
    patient_type?: string;
    service_department?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getServiceRegister(filters);
      setServiceRegisterData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service register data');
    } finally {
      setIsLoading(false);
    }
  };

  const createServiceRegister = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createServiceRegister(data);
      setServiceRegisterData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service register entry');
      throw err;
    }
  };

  const updateServiceRegister = async (id: string, data: any) => {
    try {
      const updatedRecord = await newTablesApiService.updateServiceRegister(id, data);
      setServiceRegisterData(prev => prev.map(item => item.id === id ? updatedRecord : item));
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service register entry');
      throw err;
    }
  };

  const deleteServiceRegister = async (id: string) => {
    try {
      await newTablesApiService.deleteServiceRegister(id);
      setServiceRegisterData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service register entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchServiceRegister();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    serviceRegisterData,
    isLoading,
    error,
    fetchServiceRegister,
    createServiceRegister,
    updateServiceRegister,
    deleteServiceRegister,
  };
}

// Trial Balance Hook
export function useTrialBalance() {
  const [trialBalanceData, setTrialBalanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrialBalance = async (filters?: { category?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getTrialBalance(filters);
      setTrialBalanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trial balance data');
    } finally {
      setIsLoading(false);
    }
  };

  const createTrialBalance = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createTrialBalance(data);
      setTrialBalanceData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trial balance entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    trialBalanceData,
    isLoading,
    error,
    fetchTrialBalance,
    createTrialBalance,
  };
}

// Expense Wise Hook
export function useExpenseWise() {
  const [expenseWiseData, setExpenseWiseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenseWise = async (filters?: { nature_of_data?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getExpenseWise(filters);
      setExpenseWiseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense wise data');
    } finally {
      setIsLoading(false);
    }
  };

  const createExpenseWise = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createExpenseWise(data);
      setExpenseWiseData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense wise entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchExpenseWise();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    expenseWiseData,
    isLoading,
    error,
    fetchExpenseWise,
    createExpenseWise,
  };
}

// Variable Cost Bill Wise Hook
export function useVariableCostBillWise() {
  const [variableCostData, setVariableCostData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariableCostBillWise = async (filters?: {
    patient_type?: string;
    bill_no?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getVariableCostBillWise(filters);
      setVariableCostData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch variable cost data');
    } finally {
      setIsLoading(false);
    }
  };

  const createVariableCostBillWise = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createVariableCostBillWise(data);
      setVariableCostData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create variable cost entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchVariableCostBillWise();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    variableCostData,
    isLoading,
    error,
    fetchVariableCostBillWise,
    createVariableCostBillWise,
  };
}

// HR Data Hook
export function useHRData() {
  const [hrData, setHRData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHRData = async (filters?: {
    department?: string;
    period?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getHRData(filters);
      setHRData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch HR data');
    } finally {
      setIsLoading(false);
    }
  };

  const createHRData = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createHRData(data);
      setHRData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create HR data entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    hrData,
    isLoading,
    error,
    fetchHRData,
    createHRData,
  };
}

// Occupancy Register Hook
export function useOccupancyRegister() {
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOccupancyRegister = async (filters?: {
    ward_code?: string;
    uhid?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getOccupancyRegister(filters);
      setOccupancyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch occupancy register data');
    } finally {
      setIsLoading(false);
    }
  };

  const createOccupancyRegister = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createOccupancyRegister(data);
      setOccupancyData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create occupancy register entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchOccupancyRegister();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    occupancyData,
    isLoading,
    error,
    fetchOccupancyRegister,
    createOccupancyRegister,
  };
}

// OT Register Hook
export function useOTRegister() {
  const [otRegisterData, setOTRegisterData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOTRegister = async (filters?: {
    performing_doctor_department?: string;
    nature_of_procedure?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getOTRegister(filters);
      setOTRegisterData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch OT register data');
    } finally {
      setIsLoading(false);
    }
  };

  const createOTRegister = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createOTRegister(data);
      setOTRegisterData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create OT register entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchOTRegister();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    otRegisterData,
    isLoading,
    error,
    fetchOTRegister,
    createOTRegister,
  };
}

// Consumption Data Hook
export function useConsumptionData() {
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsumptionData = async (filters?: { cost_centre?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getConsumptionData(filters);
      setConsumptionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consumption data');
    } finally {
      setIsLoading(false);
    }
  };

  const createConsumptionData = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createConsumptionData(data);
      setConsumptionData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create consumption data entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    consumptionData,
    isLoading,
    error,
    fetchConsumptionData,
    createConsumptionData,
  };
}

// Connected Load Hook
export function useConnectedLoad() {
  const [connectedLoadData, setConnectedLoadData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectedLoad = async (filters?: { sub_cost_centre?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getConnectedLoad(filters);
      setConnectedLoadData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch connected load data');
    } finally {
      setIsLoading(false);
    }
  };

  const createConnectedLoad = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createConnectedLoad(data);
      setConnectedLoadData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connected load entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchConnectedLoad();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    connectedLoadData,
    isLoading,
    error,
    fetchConnectedLoad,
    createConnectedLoad,
  };
}

// Fixed Asset Register Hook
export function useFixedAssetRegister() {
  const [fixedAssetData, setFixedAssetData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFixedAssetRegister = async (filters?: { sub_cost_centre?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getFixedAssetRegister(filters);
      setFixedAssetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fixed asset register data');
    } finally {
      setIsLoading(false);
    }
  };

  const createFixedAssetRegister = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createFixedAssetRegister(data);
      setFixedAssetData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create fixed asset register entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchFixedAssetRegister();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    fixedAssetData,
    isLoading,
    error,
    fetchFixedAssetRegister,
    createFixedAssetRegister,
  };
}

// TAT Data Hook
export function useTATData() {
  const [tatData, setTATData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTATData = async (filters?: { sub_cost_centre?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getTATData(filters);
      setTATData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TAT data');
    } finally {
      setIsLoading(false);
    }
  };

  const createTATData = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createTATData(data);
      setTATData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create TAT data entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchTATData();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    tatData,
    isLoading,
    error,
    fetchTATData,
    createTATData,
  };
}

// Cost Center Hook
export function useCostCenter() {
  const [costCenterData, setCostCenterData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCostCenter = async (filters?: {
    cc_type?: string;
    cost_centre?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getCostCenter(filters);
      setCostCenterData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cost center data');
    } finally {
      setIsLoading(false);
    }
  };

  const createCostCenter = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createCostCenter(data);
      setCostCenterData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cost center entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchCostCenter();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    costCenterData,
    isLoading,
    error,
    fetchCostCenter,
    createCostCenter,
  };
}

// Secondary Cost Driver Hook
export function useSecondaryCostDriver() {
  const [secondaryCostData, setSecondaryCostData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecondaryCostDriver = async (filters?: { sub_cost_centre?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newTablesApiService.getSecondaryCostDriver(filters);
      setSecondaryCostData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch secondary cost driver data');
    } finally {
      setIsLoading(false);
    }
  };

  const createSecondaryCostDriver = async (data: any) => {
    try {
      const newRecord = await newTablesApiService.createSecondaryCostDriver(data);
      setSecondaryCostData(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create secondary cost driver entry');
      throw err;
    }
  };

  useEffect(() => {
    fetchSecondaryCostDriver();
  }, []);

  // Refresh token on mount
  useEffect(() => {
    const token = localStorage.getItem('medicost-token');
    if (token) {
      newTablesApiService.setToken(token);
    }
  }, []);
  return {
    secondaryCostData,
    isLoading,
    error,
    fetchSecondaryCostDriver,
    createSecondaryCostDriver,
  };
}
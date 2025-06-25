const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('medicost-token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('medicost-token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('medicost-token');
  }

  // Authentication endpoints
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    hospital_name: string;
  }) {
    const response = await fetch(`${this.baseURL}/api/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/api/auth/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Hospital metadata endpoints
  async createHospitalMetadata(metadata: {
    month: string;
    year: number;
    beds_icu: number;
    beds_non_icu: number;
    number_of_nurses: number;
    resident_doctors: number;
    technician_staff: number;
  }) {
    const response = await fetch(`${this.baseURL}/api/hospitals/metadata`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(metadata),
    });
    return this.handleResponse(response);
  }

  async getHospitalMetadata(filters?: { year?: number; month?: string }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.month) params.append('month', filters.month);

    const response = await fetch(
      `${this.baseURL}/api/hospitals/metadata?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateHospitalMetadata(id: string, updates: any) {
    const response = await fetch(`${this.baseURL}/api/hospitals/metadata/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    return this.handleResponse(response);
  }

  // Revenue data endpoints
  async createRevenueData(revenueData: {
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
    ot_time_hrs?: number;
    day_care_procedures?: number;
  }) {
    const response = await fetch(`${this.baseURL}/api/revenue/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(revenueData),
    });
    return this.handleResponse(response);
  }

  async getRevenueData(filters?: {
    year?: number;
    month?: string;
    patient_type?: string;
    specialty?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.month) params.append('month', filters.month);
    if (filters?.patient_type) params.append('patient_type', filters.patient_type);
    if (filters?.specialty) params.append('specialty', filters.specialty);

    const response = await fetch(
      `${this.baseURL}/api/revenue/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getRevenueSummary(filters?: { year?: number; month?: string }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.month) params.append('month', filters.month);

    const response = await fetch(
      `${this.baseURL}/api/revenue/summary?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Expense data endpoints
  async createExpenseData(expenseData: {
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
  }) {
    const response = await fetch(`${this.baseURL}/api/expenses/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(expenseData),
    });
    return this.handleResponse(response);
  }

  async getExpenseData(filters?: { year?: number; month?: string }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.month) params.append('month', filters.month);

    const response = await fetch(
      `${this.baseURL}/api/expenses/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getExpenseSummary(filters?: { year?: number; month?: string }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.month) params.append('month', filters.month);

    const response = await fetch(
      `${this.baseURL}/api/expenses/summary?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateExpenseData(id: string, expenseData: {
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
  }) {
    const response = await fetch(`${this.baseURL}/api/expenses/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(expenseData),
    });
    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getDashboardMetrics(year?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${this.baseURL}/api/analytics/dashboard-metrics?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getRevenueTrends(year?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${this.baseURL}/api/analytics/revenue-trends?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getExpenseAnalysis(year?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${this.baseURL}/api/analytics/expense-analysis?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getProfitabilityAnalysis(year?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${this.baseURL}/api/analytics/profitability-analysis?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getPatientVolumeAnalysis(year?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${this.baseURL}/api/analytics/patient-volume-analysis?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateMetadata(id: string, metadataData: any){
    const response = await fetch(`${API_BASE_URL}/api/hospitals/metadata/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadataData),
    });
    if (!response.ok) {
      throw new Error('Failed to update metadata');
    }

    return response.json();
  }

  async updateRevenueData(id: string, revenueData: any) {
    console.log(revenueData)
    const response = await fetch(`${this.baseURL}/api/revenue/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(revenueData),
    });

    if (!response.ok) {
      throw new Error('Failed to update revenue data');
    }

    return response.json();
  }

  async getRevenueAnalysis(filters?: { year?: number; months?: number }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.months) params.append('months', filters.months.toString());

    const response = await fetch(
      `${this.baseURL}/api/revenue-analytics/analysis?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async getSpecialtyComparison(year?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${this.baseURL}/api/revenue-analytics/specialty-comparison?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class NewTablesApiService {
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
      // Handle 401 specifically
      if (response.status === 401) {
        // Clear token and redirect to login
        this.clearToken();
        window.location.reload();
        throw new Error('Authentication failed. Please log in again.');
      }
      
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
    localStorage.removeItem('medicost-user');
  }

  // Service Register endpoints (Revenue Tab)
  async createServiceRegister(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/service-register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getServiceRegister(filters?: {
    month?: string;
    patient_type?: string;
    service_department?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.month) params.append('month', filters.month);
    if (filters?.patient_type) params.append('patient_type', filters.patient_type);
    if (filters?.service_department) params.append('service_department', filters.service_department);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/service-register/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateServiceRegister(id: string, data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/service-register/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteServiceRegister(id: string) {
    const response = await fetch(`${this.baseURL}/api/new-tables/service-register/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Trial Balance endpoints (Expense Tab)
  async createTrialBalance(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/trial-balance/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getTrialBalance(filters?: { category?: string }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/trial-balance/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateTrialBalance(id: string, data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/trial-balance/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteTrialBalance(id: string) {
    const response = await fetch(`${this.baseURL}/api/new-tables/trial-balance/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Expense Wise endpoints (Expense Tab)
  async createExpenseWise(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/expense-wise/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getExpenseWise(filters?: { nature_of_data?: string }) {
    const params = new URLSearchParams();
    if (filters?.nature_of_data) params.append('nature_of_data', filters.nature_of_data);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/expense-wise/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Variable Cost Bill Wise endpoints (Expense Tab)
  async createVariableCostBillWise(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/variable-cost-bill-wise/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getVariableCostBillWise(filters?: {
    patient_type?: string;
    bill_no?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.patient_type) params.append('patient_type', filters.patient_type);
    if (filters?.bill_no) params.append('bill_no', filters.bill_no);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/variable-cost-bill-wise/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // HR Data endpoints (Expense Tab)
  async createHRData(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/hr-data/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getHRData(filters?: {
    department?: string;
    period?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.department) params.append('department', filters.department);
    if (filters?.period) params.append('period', filters.period);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/hr-data/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Occupancy Register endpoints (Metadata Tab)
  async createOccupancyRegister(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/occupancy-register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getOccupancyRegister(filters?: {
    ward_code?: string;
    uhid?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.ward_code) params.append('ward_code', filters.ward_code);
    if (filters?.uhid) params.append('uhid', filters.uhid);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/occupancy-register/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // OT Register endpoints (Metadata Tab)
  async createOTRegister(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/ot-register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getOTRegister(filters?: {
    performing_doctor_department?: string;
    nature_of_procedure?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.performing_doctor_department) params.append('performing_doctor_department', filters.performing_doctor_department);
    if (filters?.nature_of_procedure) params.append('nature_of_procedure', filters.nature_of_procedure);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/ot-register/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Consumption Data endpoints (Metadata Tab)
  async createConsumptionData(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/consumption-data/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getConsumptionData(filters?: { cost_centre?: string }) {
    const params = new URLSearchParams();
    if (filters?.cost_centre) params.append('cost_centre', filters.cost_centre);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/consumption-data/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Connected Load endpoints (Metadata Tab)
  async createConnectedLoad(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/connected-load/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getConnectedLoad(filters?: { sub_cost_centre?: string }) {
    const params = new URLSearchParams();
    if (filters?.sub_cost_centre) params.append('sub_cost_centre', filters.sub_cost_centre);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/connected-load/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Fixed Asset Register endpoints (Metadata Tab)
  async createFixedAssetRegister(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/fixed-asset-register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getFixedAssetRegister(filters?: { sub_cost_centre?: string }) {
    const params = new URLSearchParams();
    if (filters?.sub_cost_centre) params.append('sub_cost_centre', filters.sub_cost_centre);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/fixed-asset-register/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // TAT Data endpoints (Metadata Tab)
  async createTATData(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/tat-data/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getTATData(filters?: { sub_cost_centre?: string }) {
    const params = new URLSearchParams();
    if (filters?.sub_cost_centre) params.append('sub_cost_centre', filters.sub_cost_centre);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/tat-data/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Cost Center endpoints (Metadata Tab)
  async createCostCenter(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/cost-center/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getCostCenter(filters?: {
    cc_type?: string;
    cost_centre?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.cc_type) params.append('cc_type', filters.cc_type);
    if (filters?.cost_centre) params.append('cost_centre', filters.cost_centre);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/cost-center/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Secondary Cost Driver endpoints (Metadata Tab)
  async createSecondaryCostDriver(data: any) {
    const response = await fetch(`${this.baseURL}/api/new-tables/secondary-cost-driver/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getSecondaryCostDriver(filters?: { sub_cost_centre?: string }) {
    const params = new URLSearchParams();
    if (filters?.sub_cost_centre) params.append('sub_cost_centre', filters.sub_cost_centre);

    const response = await fetch(
      `${this.baseURL}/api/new-tables/secondary-cost-driver/?${params}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }
}

export const newTablesApiService = new NewTablesApiService();
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
}

export const apiService = new ApiService();
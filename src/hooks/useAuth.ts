import { useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('medicost-user');
      const savedToken = localStorage.getItem('medicost-token');
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          apiService.setToken(savedToken);
          // Also set token for new tables API
          const { newTablesApiService } = require('../services/newTablesApi');
          newTablesApiService.setToken(savedToken);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('medicost-user');
          localStorage.removeItem('medicost-token');
          apiService.clearToken();
        }
      }
      setIsLoading(false);
    };

    // Simulate network delay
    setTimeout(checkAuth, 500);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.access_token && response.user) {
        // Set token in API service
        apiService.setToken(response.access_token);
        
        // Also set token for new tables API
        const { newTablesApiService } = require('../services/newTablesApi');
        newTablesApiService.setToken(response.access_token);
        
        // Transform backend user format to frontend format
        const user: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          hospitalName: response.user.hospital_name
        };
        
        setUser(user);
        localStorage.setItem('medicost-user', JSON.stringify(user));
        localStorage.setItem('medicost-token', response.access_token);
        
        return user;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, hospitalName: string) => {
    try {
      const response = await apiService.signup({
        name,
        email,
        password,
        hospital_name: hospitalName
      });
      
      if (response.access_token && response.user) {
        // Set token in API service
        apiService.setToken(response.access_token);
        
        // Also set token for new tables API
        const { newTablesApiService } = require('../services/newTablesApi');
        newTablesApiService.setToken(response.access_token);
        
        // Transform backend user format to frontend format
        const user: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          hospitalName: response.user.hospital_name
        };
        
        setUser(user);
        localStorage.setItem('medicost-user', JSON.stringify(user));
        localStorage.setItem('medicost-token', response.access_token);
        
        return user;
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicost-user');
    localStorage.removeItem('medicost-token');
    apiService.clearToken();
    
    // Also clear token for new tables API
    const { newTablesApiService } = require('../services/newTablesApi');
    newTablesApiService.clearToken();
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
}
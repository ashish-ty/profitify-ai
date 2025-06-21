import { useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('medicost-token');
      if (token) {
        try {
          apiService.setToken(token);
          const userData = await apiService.getCurrentUser();
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            hospitalName: userData.hospital_name,
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid token
          localStorage.removeItem('medicost-token');
          apiService.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      // Set token
      apiService.setToken(response.access_token);
      
      // Set user data
      const userData = response.user;
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        hospitalName: userData.hospital_name,
      };
      
      setUser(user);
      return Promise.resolve(user);
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
        hospital_name: hospitalName,
      });
      
      // Set token
      apiService.setToken(response.access_token);
      
      // Set user data
      const userData = response.user;
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        hospitalName: userData.hospital_name,
      };
      
      setUser(user);
      return Promise.resolve(user);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
}
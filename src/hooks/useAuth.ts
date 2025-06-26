import { useState, useEffect } from 'react';
import { User } from '../types';

// Dummy user data
const DUMMY_USER: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@cityhospital.com',
  hospitalName: 'City General Hospital'
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check and automatically log in with dummy user
    const autoLogin = () => {
      // Check if user wants to stay logged out (for testing login flow)
      const skipAutoLogin = localStorage.getItem('medicost-skip-auto-login');
      
      if (!skipAutoLogin) {
        // Automatically set dummy user
        setUser(DUMMY_USER);
        localStorage.setItem('medicost-dummy-user', JSON.stringify(DUMMY_USER));
      } else {
        // Check for existing session if auto-login is disabled
        const savedUser = localStorage.getItem('medicost-dummy-user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('medicost-dummy-user');
          }
        }
      }
      setIsLoading(false);
    };

    // Simulate minimal network delay
    setTimeout(autoLogin, 300);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Accept any email/password combination for demo
      if (email && password) {
        const user: User = {
          ...DUMMY_USER,
          email: email
        };
        
        setUser(user);
        localStorage.setItem('medicost-dummy-user', JSON.stringify(user));
        // Remove skip auto-login flag when user manually logs in
        localStorage.removeItem('medicost-skip-auto-login');
        return Promise.resolve(user);
      } else {
        throw new Error('Please enter both email and password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, hospitalName: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Accept any valid input for demo
      if (name && email && password && hospitalName) {
        const user: User = {
          id: '1',
          name: name,
          email: email,
          hospitalName: hospitalName
        };
        
        setUser(user);
        localStorage.setItem('medicost-dummy-user', JSON.stringify(user));
        // Remove skip auto-login flag when user manually signs up
        localStorage.removeItem('medicost-skip-auto-login');
        return Promise.resolve(user);
      } else {
        throw new Error('Please fill in all required fields');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicost-dummy-user');
    // Set flag to prevent auto-login after logout
    localStorage.setItem('medicost-skip-auto-login', 'true');
  };

  // Helper function to enable/disable auto-login (for testing)
  const toggleAutoLogin = (enabled: boolean) => {
    if (enabled) {
      localStorage.removeItem('medicost-skip-auto-login');
      setUser(DUMMY_USER);
      localStorage.setItem('medicost-dummy-user', JSON.stringify(DUMMY_USER));
    } else {
      localStorage.setItem('medicost-skip-auto-login', 'true');
      setUser(null);
      localStorage.removeItem('medicost-dummy-user');
    }
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    toggleAutoLogin, // Exposed for testing purposes
  };
}
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
    // Simulate checking for existing session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('medicost-dummy-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('medicost-dummy-user');
        }
      }
      setIsLoading(false);
    };

    // Simulate network delay
    setTimeout(checkAuth, 500);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      if (email && password) {
        const user: User = {
          ...DUMMY_USER,
          email: email
        };
        
        setUser(user);
        localStorage.setItem('medicost-dummy-user', JSON.stringify(user));
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid input
      if (name && email && password && hospitalName) {
        const user: User = {
          id: '1',
          name: name,
          email: email,
          hospitalName: hospitalName
        };
        
        setUser(user);
        localStorage.setItem('medicost-dummy-user', JSON.stringify(user));
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
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
}
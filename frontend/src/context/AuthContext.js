'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setError(null);
    try {
      const endpoint = role === 'admin' ? '/auth/admin-login' : '/auth/login';
      const response = await api.post(endpoint, { email, password });
      
      const { token, ...userData } = response.data;
      setUser(userData);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      return { success: true, user: userData };
    } catch (err) {
      console.warn('API authentication failed, checking local mock fallback credentials:', err.message);
      
      // Fallback details for mock showcase if API is disconnected
      if (role === 'admin' && email === 'admin@technestprojects.com' && password === 'Admin@123') {
        const mockAdmin = {
          _id: 'mockadminid',
          name: 'TechNest Admin (Mock)',
          email: 'admin@technestprojects.com',
          role: 'admin'
        };
        setUser(mockAdmin);
        setToken('mockadmintoken');
        localStorage.setItem('user', JSON.stringify(mockAdmin));
        localStorage.setItem('token', 'mockadmintoken');
        return { success: true, user: mockAdmin, mock: true };
      }

      if (role === 'student' && email === 'student@technest.com' && password === 'Student@123') {
        const mockStudent = {
          _id: 'mockstudentid',
          name: 'Siddharth Rao (Mock)',
          email: 'student@technest.com',
          role: 'student',
          status: 'Approved'
        };
        setUser(mockStudent);
        setToken('mockstudenttoken');
        localStorage.setItem('user', JSON.stringify(mockStudent));
        localStorage.setItem('token', 'mockstudenttoken');
        return { success: true, user: mockStudent, mock: true };
      }

      const errMsg = err.response?.data?.message || 'Invalid credentials or Server is unreachable.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { token, ...userData } = response.data;
      setUser(userData);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      return { success: true, user: userData };
    } catch (err) {
      console.error('Registration API Error:', err);
      // Mock signup fallback
      if (err.message.includes('Network Error') || err.code === 'ECONNABORTED') {
        const mockStudent = {
          _id: 'mocknewstudent',
          name: formData.get('name') || 'New Student',
          email: formData.get('email') || 'newstudent@example.com',
          role: 'student',
          status: 'Pending'
        };
        setUser(mockStudent);
        setToken('mockstudenttoken');
        localStorage.setItem('user', JSON.stringify(mockStudent));
        localStorage.setItem('token', 'mockstudenttoken');
        return { success: true, user: mockStudent, mock: true };
      }

      const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

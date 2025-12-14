import { useState, useEffect } from 'react';
import api from '../services/api';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      api.get('/auth/verify')
        .then(response => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userRole', user.role);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};

export default useAuth;
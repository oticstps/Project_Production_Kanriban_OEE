import { useState, useEffect } from 'react';
import { register, login, logout, getCurrentUser, isAuthenticated } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleRegister = async (userData) => {
    try {
      setError(null);
      const response = await register(userData);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const handleLogin = async (userData) => {
    try {
      setError(null);
      const response = await login(userData);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Fungsi logout TIDAK mengandung navigasi
  const handleLogout = () => {
    logout(); // Asumsikan fungsi ini membersihkan localStorage
    setUser(null);
    // Tidak ada navigasi di sini
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: isAuthenticated(),
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout, // Fungsi logout yang baru
  };
  
};
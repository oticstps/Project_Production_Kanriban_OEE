import React, { useState, useEffect } from 'react';
import DataManagement from '../admin/DataManagement';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || (userRole !== 'admin' && userRole !== 'superadmin')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Manage production data and users</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <DataManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import UserManagement from '../admin/UserManagement';
import DataManagement from '../admin/DataManagement';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Superadmin Dashboard</h1>
        <p className="text-gray-600">Manage users and production data</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex space-x-4 mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'data'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('data')}
          >
            Data Management
          </button>
        </div>

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'data' && <DataManagement />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
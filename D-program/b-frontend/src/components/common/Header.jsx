import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';
  const userRole = localStorage.getItem('userRole') || 'user';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {userRole} Dashboard
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 button-3d"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
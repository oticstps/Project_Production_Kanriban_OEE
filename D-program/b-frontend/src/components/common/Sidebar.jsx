import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') || 'user';

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Dashboard', roles: ['superadmin'] },
    { path: '/admin', label: 'Admin Dashboard', roles: ['admin', 'superadmin'] },
    { path: '/user', label: 'User Dashboard', roles: ['user', 'admin', 'superadmin'] },
  ];

  return (
    // w-64
    <div className="w-45 bg-white shadow-lg border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">TPS Dashboard</h1>
      </div>
      <nav className="mt-4">
        {menuItems
          .filter(item => item.roles.includes(userRole))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;
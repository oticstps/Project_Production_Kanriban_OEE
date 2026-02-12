import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Clock,
  Wrench,
  Users,
  BarChart3,
  Zap,
  Grid3x3,
  FileText,
  Home,
  X,
  ChevronRight,
  ChevronLeft,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isCollapsed, onToggle, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Manhour', path: '/manhour', icon: Clock },
    { name: 'Breakdown Manhour', path: '/breakdown', icon: Wrench },
    { name: 'Manhour User', path: '/ManhourGuest', icon: Wrench },
    { name: 'Manhour Monthly', path: '/ManhourBawah', icon: Wrench },
    { name: 'Asakai', path: '/cr7', icon: Wrench },
    { name: 'Production', path: '/montiv', icon: BarChart3 },
    { name: 'Listrik Otics 1', path: '/kwh', icon: Zap },
    // { name: 'Listrik Otics 2', path: '/plant2', icon: Zap },
    // { name: 'Kubikal Otics 1', path: '/kubikal1', icon: Grid3x3 },
    { name: 'Listrik Report', path: '/listrik', icon: FileText },
    { name: 'Home Listrik Otics 1', path: '/smile', icon: Home },

  ];

  const renderToggleButton = () => {
    if (window.innerWidth < 1024) {
      return (
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      );
    }
    return (
      <button
        onClick={onToggle}
        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    );
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col border-r border-gray-200 shadow-xl">

      {/* Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-sm font-semibold text-gray-800">Menu</h1>
          )}
          {renderToggleButton()}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-3">
        {isCollapsed ? (
          <ul className="space-y-1 px-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    title={item.name}
                    className={({ isActive }) =>
                      `flex items-center justify-center w-10 h-10 rounded-lg transition ${
                        isActive
                          ? 'bg-blue-500 text-white shadow'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <Icon className="w-4 h-4" />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-0.5 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center py-2 px-3 rounded-lg transition ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <Icon className="w-4 h-4 mr-2.5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user?.name || user?.username || 'Guest'}
              </p>
              <p className="text-[0.65rem] text-gray-500 truncate">
                {user?.username || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

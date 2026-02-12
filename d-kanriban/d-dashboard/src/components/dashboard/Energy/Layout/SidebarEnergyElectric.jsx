// Project_Dashboard_TPS\D-Kanriban\D-dashboard\src\components\dashboard\Energy\Layout\SidebarEnergyElectric.jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Home, Settings, Activity } from 'lucide-react';

const SidebarEnergyElectric = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '#' },
    { icon: Activity, label: 'Real-time Monitoring', href: '#' },
    { icon: BarChart3, label: 'Reports', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-700">Otics Indonesia</h1>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center w-full p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <IconComponent className="h-4 w-4 mr-3 text-blue-600" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Energy Monitoring System
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:shadow-lg lg:w-64`}
        >
          {renderSidebarContent()}
        </aside>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
      {renderSidebarContent()}
    </aside>
  );
};

export default SidebarEnergyElectric;
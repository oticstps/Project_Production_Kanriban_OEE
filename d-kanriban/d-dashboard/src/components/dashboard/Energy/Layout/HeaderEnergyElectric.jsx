// Project_Dashboard_TPS\D-Kanriban\D-dashboard\src\components\dashboard\Energy\Layout\HeaderEnergyElectric.jsx
import React, { useState, useEffect } from 'react';
import { Menu, User, Bell, Search } from 'lucide-react';
import SidebarEnergyElectric from './SidebarEnergyElectric';

const HeaderEnergyElectric = ({ sidebarOpen, toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Panggil toggleSidebar dari luar jika diperlukan untuk desktop
  // Jika toggleSidebar adalah fungsi global, Anda bisa menggunakannya di sini
  // atau mengelolanya di komponen induk EnergyElectric.

  return (
    <>


      {/* Header Utama */}
      <header
        className={`sticky top-0 z-40 w-full bg-white border-b transition-shadow duration-200 ${
          isScrolled ? 'border-gray-200 shadow-sm' : 'border-transparent'
        }`}
      >

        
        <div className="flex items-center justify-between px-4 py-3">
                  {/* Sidebar untuk Mobile (dilewatkan ke Header karena digunakan di sini) */}
      <SidebarEnergyElectric isOpen={mobileSidebarOpen} toggleSidebar={toggleMobileSidebar} />
          {/* Tombol Menu untuk Mobile */}
          <div className="flex items-center">
            <button
              onClick={toggleMobileSidebar} // Gunakan fungsi lokal untuk mobile
              className="mr-4 p-1 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base font-semibold text-blue-700">Monitoring Energy Listrik</h2>
          </div>

          {/* Bagian Kanan Header */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Cari..."
                className="w-40 md:w-56 px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderEnergyElectric;
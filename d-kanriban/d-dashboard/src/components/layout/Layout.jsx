import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, loginPage = false }) => {
  // Jika halaman login, tampilkan tanpa header dan sidebar
  if (loginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        {children}
      </div>
    );
  }

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMobileSidebarToggle = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed di atas */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <Header onSidebarToggle={handleMobileSidebarToggle} />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'translate-x-0 w-52'
            : '-translate-x-full lg:translate-x-0 lg:w-14'
        } bg-white text-gray-800`}
      >
        <Sidebar 
          isCollapsed={!sidebarOpen} 
          onToggle={toggleSidebar}
          onClose={handleSidebarClose}
        />
      </aside>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main 
        className={`pt-16 flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-52' : 'lg:ml-14'
        }`}
      >
        <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8"> 
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
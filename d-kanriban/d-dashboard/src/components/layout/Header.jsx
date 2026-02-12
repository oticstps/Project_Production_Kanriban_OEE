import { Bell, Search, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import oiImage from '../../assets/oi.jpg'; // Impor gambar

const Header = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onSidebarToggle}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Logo/Brand Name */}
          <div className="flex items-center space-x-3 flex-1 lg:flex-none">
            {/* Ganti div kotak dengan img */}
            <img
              src={oiImage}
              alt="TPS Logo"
              className="w-8 h-8 rounded-lg object-cover" // Sesuaikan kelas CSS jika perlu
            />
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              Otics Indonesia Monitoring System <span className='text-red-300'>(Page Develop)</span>
            </h1>
          </div>

          {/* Search Bar */}
          {/* <div className="hidden lg:flex-1 lg:flex lg:justify-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div> */}

          {/* User controls */}
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
            </button> */}

            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>

                  {/* Stack name dan username ke bawah */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name || user.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.username}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-sm" // Tambahkan space-x-1 untuk jarak antar ikon dan teks
                >
                  <LogOut className="w-4 h-4" />
                  {/* Opsional: tambahkan teks "Logout" jika diinginkan */}
                  {/* <span>Logout</span> */}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
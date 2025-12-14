


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';



function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-4 bg-blue-600 text-white text-xl font-semibold">
        My Sidebar
      </div>

      <nav className="flex-1 p-4 space-y-2 text-gray-800">
        
        <NavLink
          to="/#"
          className={({ isActive }) =>
            `block p-2 rounded ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/#"
          className={({ isActive }) =>
            `block p-2 rounded ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/#"
          className={({ isActive }) =>
            `block p-2 rounded ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"
            }`
          }
        >
          Settings
        </NavLink>

      </nav>

      <div className="p-4 border-t text-sm text-gray-500">
        © 2025 My App
      </div>
    </div>
  );
}




const UserDashboard = () => {
  const navigate = useNavigate();
  const [productionData, setProductionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || !['user', 'admin', 'superadmin'].includes(userRole)) {
      navigate('/login');
    }

    fetchProductionData();
  }, [navigate]);

  const fetchProductionData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductionData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredData = productionData.filter(item =>
    item.name_product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold">Production Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Shift 1</th>
                <th className="px-4 py-2 text-left">Shift 2</th>
                <th className="px-4 py-2 text-left">Duration (Menit)</th>
                <th className="px-4 py-2 text-left">LT (Menit)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.name_product}</td>
                  <td className="px-4 py-2">{item.shift_1}</td>
                  <td className="px-4 py-2">{item.shift_2}</td>
                  <td className="px-4 py-2">{Math.round(item.duration_menit)}</td>
                  <td className="px-4 py-2">{Math.round(item.lt_menit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;

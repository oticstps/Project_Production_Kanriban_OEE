import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataManagement = () => {
  const [productionData, setProductionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    name_product: '',
    shift_1: '',
    shift_2: '',
    duration_menit: '',
    lt_menit: ''
  });

  useEffect(() => {
    fetchProductionData();
  }, []);

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

  const handleEdit = (data) => {
    setEditingData(data);
    setFormData({
      date: data.date,
      name_product: data.name_product,
      shift_1: data.shift_1,
      shift_2: data.shift_2,
      duration_menit: data.duration_menit,
      lt_menit: data.lt_menit
    });
    setShowModal(true);
  };

  const handleDelete = async (dataId) => {
    if (window.confirm('Are you sure you want to delete this data?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/data/${dataId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProductionData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (editingData) {
        await axios.put(`/api/data/${editingData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/data', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingData(null);
      setFormData({
        date: '',
        name_product: '',
        shift_1: '',
        shift_2: '',
        duration_menit: '',
        lt_menit: ''
      });
      fetchProductionData();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Production Data Management</h2>
        <button
          onClick={() => {
            setEditingData(null);
            setFormData({
              date: '',
              name_product: '',
              shift_1: '',
              shift_2: '',
              duration_menit: '',
              lt_menit: ''
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 button-3d"
        >
          Add Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-compact">
          <thead className="bg-header">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Shift 1</th>
              <th className="px-4 py-2 text-left">Shift 2</th>
              <th className="px-4 py-2 text-left">Duration (Menit)</th>
              <th className="px-4 py-2 text-left">LT (Menit)</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productionData.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.name_product}</td>
                <td className="px-4 py-2">{item.shift_1}</td>
                <td className="px-4 py-2">{item.shift_2}</td>
                <td className="px-4 py-2">{Math.round(item.duration_menit)}</td>
                <td className="px-4 py-2">{Math.round(item.lt_menit)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2 button-3d"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 button-3d"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingData ? 'Edit Production Data' : 'Add Production Data'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name_product}
                  onChange={(e) => setFormData({...formData, name_product: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Shift 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.shift_1}
                  onChange={(e) => setFormData({...formData, shift_1: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Shift 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.shift_2}
                  onChange={(e) => setFormData({...formData, shift_2: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Duration (Menit)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.duration_menit}
                  onChange={(e) => setFormData({...formData, duration_menit: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="LT (Menit)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lt_menit}
                  onChange={(e) => setFormData({...formData, lt_menit: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 button-3d"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 button-3d"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
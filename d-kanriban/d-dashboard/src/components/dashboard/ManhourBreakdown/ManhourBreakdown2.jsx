import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';


const ManhourBreakdown = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const API_BASE_URL = 'http://172.27.6.191:4000/api/common-rail';

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/data`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getYears = () => {
    const years = [...new Set(data.map(item => 
      new Date(item.created_at).getFullYear()
    ))];
    return years.sort((a, b) => b - a);
  };

  const getMonths = () => {
    if (!selectedYear) return [];
    const filtered = data.filter(item => 
      new Date(item.created_at).getFullYear().toString() === selectedYear
    );
    const months = [...new Set(filtered.map(item => 
      new Date(item.created_at).getMonth() + 1
    ))];
    return months.sort((a, b) => a);
  };

  const getDays = () => {
    if (!selectedYear || !selectedMonth) return [];
    const filtered = data.filter(item => {
      const date = new Date(item.created_at);
      return date.getFullYear().toString() === selectedYear &&
        (date.getMonth() + 1).toString() === selectedMonth;
    });
    const days = [...new Set(filtered.map(item => 
      new Date(item.created_at).getDate()
    ))];
    return days.sort((a, b) => a);
  };

  const getDayData = () => {
    if (!selectedYear || !selectedMonth || !selectedDay) return [];
    return data.filter(item => {
      const date = new Date(item.created_at);
      return date.getFullYear().toString() === selectedYear &&
        (date.getMonth() + 1).toString() === selectedMonth &&
        date.getDate().toString() === selectedDay;
    });
  };

  const groupByShift = (dayData) => {
    const grouped = { 1: [], 2: [] };
    dayData.forEach(item => {
      if (item.shift === 1) grouped[1].push(item);
      if (item.shift === 2) grouped[2].push(item);
    });
    return grouped;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthNumber - 1];
  };

  const monthsList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = getYears();
  const months = getMonths();
  const days = getDays();
  const dayData = getDayData();
  const groupedData = groupByShift(dayData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-lg text-gray-700">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md w-full text-center">
          <p className="font-medium">Error: {error}</p>
          <button
            onClick={fetchData}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout >
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Manhour Breakdown</h1>
            <p className="text-gray-600 mt-1">Monitor efisiensi produksi berdasarkan shift dan tanggal</p>
          </div>

          {/* Filter Controls */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth('');
                    setSelectedDay('');
                  }}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedDay('');
                  }}
                  disabled={!selectedYear}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Pilih</option>
                  {months.map(month => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  disabled={!selectedYear || !selectedMonth}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Pilih</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchData}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Info Summary */}
            {selectedYear && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-gray-700">
                  Menampilkan data untuk: 
                  <span className="font-semibold"> {selectedYear}</span>
                  {selectedMonth && ` - ${getMonthName(parseInt(selectedMonth))}`}
                  {selectedDay && ` - ${selectedDay}`}
                </p>
                <p className="text-gray-600">Total data: <span className="font-medium">{dayData.length} records</span></p>
              </div>
            )}

            {/* Year Selection */}
            {!selectedYear && (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Pilih Tahun</h3>
                <p className="text-gray-600 mb-6">Total data tersedia: {data.length} records</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year.toString())}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Month Selection */}
            {selectedYear && !selectedMonth && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Pilih Bulan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {monthsList.map((month, index) => {
                    const monthNum = index + 1;
                    const isActive = months.includes(monthNum);
                    return (
                      <button
                        key={month}
                        onClick={() => isActive && setSelectedMonth(monthNum.toString())}
                        disabled={!isActive}
                        className={`p-4 rounded-lg border transition ${
                          isActive
                            ? 'bg-white border-indigo-300 hover:bg-indigo-50 text-gray-800 hover:shadow'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-medium">{month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Day Selection */}
            {selectedYear && selectedMonth && !selectedDay && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Pilih Tanggal - {getMonthName(parseInt(selectedMonth))} {selectedYear}
                  </h3>
                  <button
                    onClick={() => setSelectedMonth('')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    ← Ganti Bulan
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const dayExists = days.includes(day);
                    const dayRecords = data.filter(item => {
                      const date = new Date(item.created_at);
                      return date.getFullYear().toString() === selectedYear &&
                        (date.getMonth() + 1).toString() === selectedMonth &&
                        date.getDate().toString() === day.toString();
                    });
                    const shift1Count = dayRecords.filter(item => item.shift === 1).length;
                    const shift2Count = dayRecords.filter(item => item.shift === 2).length;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => dayExists && setSelectedDay(day.toString())}
                        disabled={!dayExists}
                        className={`p-4 rounded-lg border transition ${
                          dayExists
                            ? 'bg-white border-green-300 hover:bg-green-50 text-gray-800 hover:shadow'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-medium">{day}</span>
                        {dayExists && (
                          <div className="text-xs mt-1 text-gray-500">
                            <div className="text-green-600">S1: {shift1Count}</div>
                            <div className="text-purple-600">S2: {shift2Count}</div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Day Details */}
            {selectedYear && selectedMonth && selectedDay && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedDay} {getMonthName(parseInt(selectedMonth))} {selectedYear}
                  </h2>
                  <button
                    onClick={() => setSelectedDay('')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    ← Kembali
                  </button>
                </div>

                {/* Shift 1 */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white bg-orange-500 py-3 px-4 rounded-lg mb-3">
                    Shift 1 (07:10 - 20:10) - {groupedData[1].length} records
                  </h3>
                  {groupedData[1].length === 0 ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-gray-600">Tidak ada data untuk shift 1</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Waktu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Produk</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Target</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actual</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Efisiensi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {groupedData[1].map(record => (
                            <tr key={record.idPrimary}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatTime(record.created_at)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.name_product}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.target}</td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                parseInt(record.actual) >= parseInt(record.target) ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {record.actual}
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                parseInt(record.efficiency) > 80 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {record.efficiency}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  record.status === 'NORMAL' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Shift 2 */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white bg-purple-600 py-3 px-4 rounded-lg mb-3">
                    Shift 2 (20:10 - 07:10) - {groupedData[2].length} records
                  </h3>
                  {groupedData[2].length === 0 ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-gray-600">Tidak ada data untuk shift 2</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Waktu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Produk</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Target</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actual</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Efisiensi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {groupedData[2].map(record => (
                            <tr key={record.idPrimary}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatTime(record.created_at)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.name_product}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{record.target}</td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                parseInt(record.actual) >= parseInt(record.target) ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {record.actual}
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                parseInt(record.efficiency) > 80 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {record.efficiency}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  record.status === 'NORMAL' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Ringkasan Harian</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Total Data</p>
                      <p className="text-lg font-semibold text-gray-800">{dayData.length}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Shift 1</p>
                      <p className="text-lg font-semibold text-orange-600">{groupedData[1].length}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Shift 2</p>
                      <p className="text-lg font-semibold text-purple-600">{groupedData[2].length}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Normal</p>
                      <p className="text-lg font-semibold text-green-600">
                        {dayData.filter(item => item.status === 'NORMAL').length}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Abnormal</p>
                      <p className="text-lg font-semibold text-red-600">
                        {dayData.filter(item => item.status === 'ABNORMAL').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default ManhourBreakdown;
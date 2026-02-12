import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Area
} from 'recharts';

const MultiLineCommonRailDashboard = () => {
  // State Management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filter States
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState('shift1');
  const [selectedLine, setSelectedLine] = useState(9);
  
  // Table States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Chart Data
  const [chartData, setChartData] = useState([]);
  const [actualStats, setActualStats] = useState({ min: 0, max: 0, avg: 0 });

  // Konfigurasi semua line Common Rail
  const commonRailLines = [
    { id: 1, name: 'Common Rail 1', endpoint: '/api/common-rail-1-filtered', color: 'bg-red-500' },
    { id: 2, name: 'Common Rail 2', endpoint: '/api/common-rail-2-filtered', color: 'bg-orange-500' },
    { id: 3, name: 'Common Rail 3', endpoint: '/api/common-rail-3-filtered', color: 'bg-yellow-500' },
    { id: 4, name: 'Common Rail 4', endpoint: '/api/common-rail-4-filtered', color: 'bg-lime-500' },
    { id: 5, name: 'Common Rail 5', endpoint: '/api/common-rail-5-filtered', color: 'bg-green-500' },
    { id: 6, name: 'Common Rail 6', endpoint: '/api/common-rail-6-filtered', color: 'bg-emerald-500' },
    { id: 7, name: 'Common Rail 7', endpoint: '/api/common-rail-7-filtered', color: 'bg-teal-500' },
    { id: 8, name: 'Common Rail 8', endpoint: '/api/common-rail-8-filtered', color: 'bg-cyan-500' },
    { id: 9, name: 'Common Rail 9', endpoint: '/api/common-rail-9-filtered', color: 'bg-blue-500' },
    { id: 10, name: 'Common Rail 10', endpoint: '/api/common-rail-10-filtered', color: 'bg-indigo-500' },
    { id: 11, name: 'Common Rail 11', endpoint: '/api/common-rail-11-filtered', color: 'bg-purple-500' },
    { id: 12, name: 'Common Rail 12', endpoint: '/api/common-rail-12-filtered', color: 'bg-pink-500' }
  ];

  const API_BASE_URL = 'http://172.27.6.191:4000';

  const getCurrentLine = () => {
    return commonRailLines.find(line => line.id === selectedLine) || commonRailLines[8];
  };

  const getShiftTimeRange = (date, shift) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    switch(shift) {
      case 'shift1':
        return {
          startDateTime: `${dateStr} 07:10:00`,
          endDateTime: `${dateStr} 19:50:00`,
          label: 'Shift 1 (07:10-19:50)'
        };
      case 'shift2':
        const nextDay = addDays(date, 1);
        const nextDayStr = format(nextDay, 'yyyy-MM-dd');
        return {
          startDateTime: `${dateStr} 19:50:00`,
          endDateTime: `${nextDayStr} 07:10:00`,
          label: 'Shift 2 (19:50-07:10)'
        };
      case 'daily':
        return {
          startDateTime: `${dateStr} 00:00:00`,
          endDateTime: `${dateStr} 23:59:59`,
          label: 'Harian (00:00-23:59)'
        };
      default:
        return {
          startDateTime: `${dateStr} 00:00:00`,
          endDateTime: `${dateStr} 23:59:59`,
          label: 'Harian'
        };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentLine = getCurrentLine();
      const timeRange = getShiftTimeRange(selectedDate, selectedShift);
      
      const params = new URLSearchParams({
        startDateTime: timeRange.startDateTime,
        endDateTime: timeRange.endDateTime,
        limit: 1000
      });
      
      const response = await axios.get(
        `${API_BASE_URL}${currentLine.endpoint}/datetime-range?${params}`
      );
      
      if (response.data.status === 'success') {
        const fetchedData = response.data.data;
        setData(fetchedData);
        calculateStats(fetchedData);
        prepareChartData(fetchedData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
      setData([]);
      setStats(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data) => {
    if (!data || data.length === 0) {
      setChartData([]);
      setActualStats({ min: 0, max: 0, avg: 0 });
      return;
    }

    // Ambil 50 data terbaru untuk chart (atau kurang jika data tidak cukup)
    const recentData = [...data]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50)
      .reverse(); // Reverse untuk urutan waktu dari lama ke baru

    // Format data untuk chart
    const formattedChartData = recentData.map(item => {
      const actualValue = parseFloat(item.actual) || 0;
      const targetValue = parseFloat(item.target) || 0;
      const time = format(new Date(item.created_at), 'HH:mm');
      
      return {
        time,
        actual: actualValue,
        target: targetValue,
        status: item.status?.toUpperCase() || 'UNKNOWN',
        efficiency: parseFloat(item.efficiency) || 0,
        product: item.name_product || '-',
        timestamp: item.created_at
      };
    });

    // Hitung statistik actual
    const actualValues = data.map(item => parseFloat(item.actual) || 0).filter(val => !isNaN(val));
    const minActual = actualValues.length > 0 ? Math.min(...actualValues) : 0;
    const maxActual = actualValues.length > 0 ? Math.max(...actualValues) : 0;
    const avgActual = actualValues.length > 0 
      ? (actualValues.reduce((a, b) => a + b, 0) / actualValues.length).toFixed(1)
      : 0;

    setChartData(formattedChartData);
    setActualStats({
      min: minActual,
      max: maxActual,
      avg: avgActual
    });
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats(null);
      return;
    }

    const total = data.length;
    const running = data.filter(item => 
      item.status?.toUpperCase() === 'RUN' || 
      item.status?.toUpperCase() === 'START'
    ).length;
    const stopped = data.filter(item => item.status?.toUpperCase() === 'STOP').length;
    const idle = data.filter(item => item.status?.toUpperCase() === 'IDLE' || item.status?.toUpperCase() === 'IDEL').length;
    
    const efficiencySum = data.reduce((sum, item) => sum + (parseFloat(item.efficiency) || 0), 0);
    const avgEfficiency = total > 0 ? (efficiencySum / total).toFixed(2) / 10 : 0;
    
    const actualSum = data.reduce((sum, item) => sum + (parseFloat(item.actual) || 0), 0);
    const avgActual = total > 0 ? (actualSum / total).toFixed(2) : 0;
    
    const targetSum = data.reduce((sum, item) => sum + (parseFloat(item.target) || 0), 0);
    const avgTarget = total > 0 ? (targetSum / total).toFixed(2) : 0;

    const andonOn = data.filter(item => item.andon?.toLowerCase().includes('on')).length;

    setStats({
      total,
      running,
      stopped,
      idle,
      avgEfficiency,
      avgActual,
      avgTarget,
      achievementRate: avgTarget > 0 ? ((avgActual / avgTarget) * 100).toFixed(2) : 0,
      andonOn
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = () => {
    let filtered = [...data];
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => 
        item.status?.toUpperCase() === selectedStatus.toUpperCase()
      );
    }
    
    // Sort data
    filtered.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      return format(date, 'HH:mm:ss');
    } catch {
      return dateTime;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm">
            <span className="text-blue-600">Actual: </span>
            <span className="font-bold">{payload[0].value} pcs</span>
          </p>
          <p className="text-sm">
            <span className="text-purple-600">Target: </span>
            <span>{payload[1]?.value || 0} pcs</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Status: </span>
            <span className={`font-medium ${
              payload[2]?.value === 'START' || payload[2]?.value === 'RUN' ? 'text-green-600' :
              payload[2]?.value === 'STOP' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {payload[2]?.value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const timeRange = getShiftTimeRange(selectedDate, selectedShift);

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedShift, selectedLine]);

  const sortedData = filteredAndSortedData();
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          {/* <div>
            <h1 className="text-2xl font-bold text-gray-900">Production Dashboard</h1>
            <p className="text-gray-600">Multi-Line Common Rail Monitoring System</p>
          </div> */}
          <div className="mt-2 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Live</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Line Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Line:</span>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {commonRailLines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Date:</span>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="yyyy-MM-dd"
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Shift Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Shift:</span>
              <div className="flex space-x-1">
                {['shift1', 'shift2'].map((shift) => (
                  <button
                    key={shift}
                    onClick={() => setSelectedShift(shift)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedShift === shift
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {shift === 'shift1' ? 'Shift 1' : 'Shift 2'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="START">START</option>
                <option value="RUN">RUN</option>
                <option value="STOP">STOP</option>
                <option value="IDLE">Idle</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </>
              ) : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Time Range Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${getCurrentLine().color} mr-3`} />
              <div>
                <h3 className="font-semibold text-blue-900">{getCurrentLine().name}</h3>
                <p className="text-sm text-blue-700">
                  {format(selectedDate, 'yyyy-MM-dd')} • {timeRange.label}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Showing {data.length} records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      {/* {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Running</p>
                <p className="text-xl font-bold text-green-600">{stats.running}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Stopped</p>
                <p className="text-xl font-bold text-red-600">{stats.stopped}</p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Efficiency</p>
                <p className="text-xl font-bold text-blue-600">{stats.avgEfficiency}%</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Avg
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Achievement</p>
                <p className="text-xl font-bold text-purple-600">{stats.achievementRate}%</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                Rate
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">ANDON ON</p>
                <p className="text-xl font-bold text-orange-600">{stats.andonOn}</p>
              </div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )} */}

      {/* Actual Production Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Actual Production Trend</h3>
              <p className="text-sm text-gray-600">Real-time actual production count (pcs)</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
              <div className="text-center">
                <p className="text-xs text-gray-500">Min Actual</p>
                <p className="text-lg font-bold text-red-600">{actualStats.min} pcs</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Max Actual</p>
                <p className="text-lg font-bold text-green-600">{actualStats.max} pcs</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Avg Actual</p>
                <p className="text-lg font-bold text-blue-600">{actualStats.avg} pcs</p>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  label={{ value: 'PCS', angle: -90, position: 'insideLeft', offset: -10 }}
                  tick={{ fontSize: 12 }}
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Actual Production Line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual (pcs)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                
                {/* Target Reference Line */}
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target (pcs)"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Status Indicators */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Actual Production</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Target</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">START/RUN Status</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">STOP Status</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Production Data</h2>
              <p className="text-sm text-gray-600">
                {getCurrentLine().name} • {format(selectedDate, 'yyyy-MM-dd')} • {selectedShift}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Rows per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              
              {/* Export button */}
              <button
                onClick={() => {
                  // Export functionality
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + "Time,Product,Target,Actual,Efficiency,Status,Andon,Cycle Time\n"
                    + currentData.map(row => 
                        `${row.created_at},${row.name_product},${row.target},${row.actual},${row.efficiency},${row.status},${row.andon},${row.cycle_time}`
                      ).join("\n");
                  
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `production_data_${selectedLine}_${format(selectedDate, 'yyyy-MM-dd')}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Time
                    {sortColumn === 'created_at' && (
                      <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('target')}
                >
                  <div className="flex items-center">
                    Target
                    {sortColumn === 'target' && (
                      <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('actual')}
                >
                  <div className="flex items-center">
                    Actual
                    {sortColumn === 'actual' && (
                      <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('efficiency')}
                >
                  <div className="flex items-center">
                    Efficiency
                    {sortColumn === 'efficiency' && (
                      <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortColumn === 'status' && (
                      <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Andon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cycle Time
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-gray-600">Loading production data...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => {
                  const actualValue = parseFloat(item.actual) || 0;
                  const targetValue = parseFloat(item.target) || 0;
                  const status = item.status?.toUpperCase();
                  
                  return (
                    <tr 
                      key={item.idPrimary || index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDateTime(item.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name_product || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          PG: {item.pg || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.target || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            actualValue >= targetValue
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            actualValue >= targetValue
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {item.actual || '0'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full ${
                                (parseFloat(item.efficiency) || 0) >= 90 ? 'bg-green-500' :
                                (parseFloat(item.efficiency) || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(parseFloat(item.efficiency) || 0, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[45px]">
                            {item.efficiency || '0'}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          status === 'START' || status === 'RUN'
                            ? 'bg-green-100 text-green-800'
                            : status === 'STOP'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status === 'START' ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                              START
                            </>
                          ) : status === 'STOP' ? (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                              STOP
                            </>
                          ) : (
                            status || 'UNKNOWN'
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.andon?.toLowerCase().includes('on')
                            ? 'bg-red-100 text-red-800 animate-pulse'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            item.andon?.toLowerCase().includes('on') ? 'bg-red-500' : 'bg-gray-400'
                          }`} />
                          {item.andon?.toLowerCase().includes('on') ? 'ACTIVE' : 'OFF'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.cycle_time || '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No production data found</h3>
                      <p className="text-gray-500 max-w-md">
                        No data available for the selected filters. Try adjusting the date, shift, or line.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && sortedData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="text-sm text-gray-700 mb-4 md:mb-0">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, sortedData.length)}</span> of{' '}
                <span className="font-medium">{sortedData.length}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Production Monitoring System v1.0 • Data updates every 60 seconds</p>
        <p className="mt-1">© {new Date().getFullYear()} Common Rail Production Dashboard</p>
      </div>
    </div>
  );
};

export default MultiLineCommonRailDashboard;
// Project_Dashboard_TPS\D-Kanriban\D-dashboard\src\components\dashboard\Energy\EnergyElectric.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import HeaderEnergyElectric from './Layout/HeaderEnergyElectric'; // Impor Header baru
import PGPieChart from './PGPieChart'; // Impor komponen PGPieChart
import SidebarEnergyElectric from './Layout/SidebarEnergyElectric';
// import { Layout } from 'lucide-react';

// Mapping nama tabel
const tableNameMapping = {
  // PG1.1
  'tb_pm200_bs1': ['BALANCE SHAFT 1', 'PG1.1'],
  'tb_pm200_bs2': ['BALANCE SHAFT 2', 'PG1.1'],
  'tb_pm200_ret': ['RETAINER', 'PG1.1'],
  'tb_pm200_conn': ['CONNECTOR', 'PG1.1'],
  'tb_pm200_ra': ['ROLLER ARM', 'PG1.1'],
  'tb_pm200_hla': ['HLA', 'PG1.1'],
  // PG2.1
  'tb_pm200_cr4': ['COMMON RAIL 4', 'PG2.1'],
  'tb_pm200_cr6': ['COMMON RAIL 6', 'PG2.1'],
  'tb_pm200_cr9': ['COMMON RAIL 9', 'PG2.1'],
  'tb_pm200_cr10': ['COMMON RAIL 10', 'PG2.1'],
  'tb_pm200_cr11': ['COMMON RAIL 11', 'PG2.1'],
  'tb_pm200_cr12': ['COMMON RAIL 12', 'PG2.1'],
  // PG2.2
  'tb_pm200_cr1': ['COMMON RAIL 1', 'PG2.2'],
  'tb_pm200_cr2': ['COMMON RAIL 2', 'PG2.2'],
  'tb_pm200_cr3': ['COMMON RAIL 3', 'PG2.2'],
  'tb_pm200_cr5': ['COMMON RAIL 5', 'PG2.2'],
  'tb_pm200_cr7': ['COMMON RAIL 7', 'PG2.2'],
  'tb_pm200_cr8': ['COMMON RAIL 8', 'PG2.2'],
  // PG2.3
  'tb_pm200_cc1': ['CAM CAP 1', 'PG2.3'],
  'tb_pm200_cc234': ['CAM CAP 234', 'PG2.3'],
  'tb_pm200_chab': ['CAM HOUSING AB', 'PG2.3'],
  'tb_pm200_chcd': ['CAM HOUSING CD', 'PG2.3'],
  'tb_pm200_chef': ['CAM HOUSING EF', 'PG2.3'],
  'tb_pm200_chsaa': ['CAM HOUSING ASSY A', 'PG2.3'],
  'tb_pm200_chsab': ['CAM HOUSING ASSY B', 'PG2.3'],
  'tb_pm200_chsac': ['CAM HOUSING ASSY C', 'PG2.3'],
  // PM220
  'tb_pm220_bs1': ['BALANCE SHAFT 1', 'PG1.1'],
  'tb_pm220_bs2': ['BALANCE SHAFT 2', 'PG1.1'],
  'tb_pm220_ret': ['RETAINER', 'PG1.1'],
  'tb_pm220_ra': ['ROLLER ARM', 'PG1.1'],
  'tb_pm220_hla': ['HLA', 'PG1.1'],
  'tb_pm220_cr1': ['COMMON RAIL 1', 'PG2.2'],
  'tb_pm220_cr2': ['COMMON RAIL 2', 'PG2.2'],
  'tb_pm220_cr3': ['COMMON RAIL 3', 'PG2.2'],
  'tb_pm220_cr4': ['COMMON RAIL 4', 'PG2.1'],
  'tb_pm220_cr5': ['COMMON RAIL 5', 'PG2.2'],
  'tb_pm220_cr6': ['COMMON RAIL 6', 'PG2.1'],
  'tb_pm220_cr7': ['COMMON RAIL 7', 'PG2.2'],
  'tb_pm220_cr8': ['COMMON RAIL 8', 'PG2.2'],
  'tb_pm220_cr9': ['COMMON RAIL 9', 'PG2.1'],
  'tb_pm220_cr10': ['COMMON RAIL 10', 'PG2.1'],
  'tb_pm220_cr11': ['COMMON RAIL 11', 'PG2.1'],
  'tb_pm220_cr12': ['COMMON RAIL 12', 'PG2.1'],
  'tb_pm220_cc1': ['CAM CAP 1', 'PG2.3'],
  'tb_pm220_chab': ['CAM HOUSING AB', 'PG2.3'],
  'tb_pm220_chcd': ['CAM HOUSING CD', 'PG2.3'],
  'tb_pm220_chef': ['CAM HOUSING EF', 'PG2.3'],
  'tb_pm220_chsaa': ['CAM HOUSING ASSY A', 'PG2.3'],
  'tb_pm220_chsab': ['CAM HOUSING ASSY B', 'PG2.3'],
  'tb_pm220_chsac': ['CAM HOUSING ASSY C', 'PG2.3'],
  'tb_kub1_total_kwh': ['Kubikal 1', 'OTICS'],
};

// Fungsi untuk menormalisasi tipe PM
const normalizePmType = (type) => {
  if (!type) return 'Unknown';
  const lowerType = type.toLowerCase();
  if (lowerType.includes('220') || lowerType.includes('1f') || lowerType.includes('3f')) {
    return 'PM 220 VOLT';
  }
  if (lowerType.includes('200')) {
    return 'PM 200 VOLT';
  }
  return type;
};

const EnergyElectric = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State untuk filter
  const [filters, setFilters] = useState({
    month: 'June',
    year: '2025',
    line: '',
    pmType: '',
    searchTerm: ''
  });
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // State untuk sorting
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  // State untuk menampilkan detail baris
  const [expandedRow, setExpandedRow] = useState(null);
  // State untuk tipe chart dan jumlah top N
  const [totalChartType, setTotalChartType] = useState('line');
  const [avgChartType, setAvgChartType] = useState('line');
  const [topChartType, setTopChartType] = useState('bar');
  const [topNCount, setTopNCount] = useState(20); // Default ke 20
  // State untuk sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/energy/pm-monthly-report');
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }
        const result = await response.json();
        // Filter data: hanya ambil data dari Juni 2025 ke atas
        const filteredResultData = result.data.filter(item => {
            const date = new Date(item.start_datetime);
            return date.getFullYear() >= 2025 && date.getMonth() >= 5; // Juni adalah bulan 5 (0-indexed)
        });
        setData(filteredResultData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ekstrak filter options dari data (dengan normalisasi)
  const filterOptions = useMemo(() => {
    if (!data.length) return { months: [], years: [], lines: [], pmTypes: [] };
    const months = [...new Set(data.map(item => item.month))].sort();
    const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
    const lines = [...new Set(data.map(item => item.line_name))].sort();
    const pmTypes = [...new Set(data.map(item => normalizePmType(item.pm_type)))].sort();
    return { months, years, lines, pmTypes };
  }, [data]);

  // Fungsi untuk memformat angka (tanpa koma, dibulatkan)
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Math.round(Number(num)).toString();
  };

  // Fungsi untuk memformat kWh
  const formatKWh = (whValue) => {
    const kWh = Number(whValue) / 1000;
    return formatNumber(kWh);
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk memformat durasi
  const formatDuration = (start, end) => {
    if (!start || !end) return '-';
    const start_time = new Date(start);
    const end_time = new Date(end);
    const diff_ms = end_time - start_time;
    const diff_hours = Math.floor(diff_ms / (1000 * 60 * 60));
    const diff_minutes = Math.floor((diff_ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${diff_hours}h ${diff_minutes}m`;
  };

  // Sorting data
  const sortedData = useMemo(() => {
    if (!data.length) return [];
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Fungsi untuk menerapkan filter dan pencarian
  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      const matchesFilter =
        (filters.month ? item.month === filters.month : true) &&
        (filters.year ? item.year === filters.year : true) &&
        (filters.line ? item.line_name === filters.line : true) &&
        (filters.pmType ? normalizePmType(item.pm_type) === filters.pmType : true);
      if (!filters.searchTerm) {
        return matchesFilter;
      }
      const searchLower = filters.searchTerm.toLowerCase();
      const normalizedType = normalizePmType(item.pm_type).toLowerCase();
      return (
        matchesFilter &&
        (normalizedType.includes(searchLower) ||
         item.line_name.toLowerCase().includes(searchLower) ||
         item.month.toLowerCase().includes(searchLower) ||
         item.year.toLowerCase().includes(searchLower))
      );
    });
  }, [sortedData, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // --- Analisis Listrik Lainnya ---
  // Data untuk chart - agregasi per bulan
  const chartData = useMemo(() => {
    const grouped = filteredData.reduce((acc, item) => {
      const key = `${item.month} ${item.year}`;
      if (!acc[key]) {
        acc[key] = { monthYear: key, totalKWh: 0, count: 0, maxKWh: 0, avgKWh: 0 };
      }
      const itemKWh = Number(item.total_wh) / 1000;
      acc[key].totalKWh += itemKWh;
      acc[key].count += 1;
      if (itemKWh > acc[key].maxKWh) {
          acc[key].maxKWh = itemKWh;
      }
      return acc;
    }, {});
    return Object.values(grouped).map(item => ({
      ...item,
      totalKWh: parseFloat(formatNumber(item.totalKWh)),
      maxKWh: parseFloat(formatNumber(item.maxKWh)),
      avgKWh: parseFloat(formatNumber(item.totalKWh / item.count))
    })).sort((a, b) => new Date(`${a.monthYear.split(' ')[0]} 1, ${a.monthYear.split(' ')[1]}`) - new Date(`${b.monthYear.split(' ')[0]} 1, ${b.monthYear.split(' ')[1]}`));
  }, [filteredData]);

  // Data untuk chart tren konsumsi total per bulan
  const lineChartData = useMemo(() => {
    return chartData.map(item => ({
        name: item.monthYear,
        'Total kWh': item.totalKWh
    }));
  }, [chartData]);

  // Data untuk chart rata-rata konsumsi kWh per line
  const avgKWhPerLineData = useMemo(() => {
    const lineData = {};
    filteredData.forEach(item => {
        const line = item.line_name;
        const kWh = Number(item.total_wh) / 1000;
        if (typeof kWh === 'number' && !isNaN(kWh)) {
            if (!lineData[line]) {
                lineData[line] = { line, totalKWh: 0, count: 0 };
            }
            lineData[line].totalKWh += kWh;
            lineData[line].count += 1;
        }
    });
    return Object.values(lineData).map(item => ({
        ...item,
        avgKWh: parseFloat(formatNumber(item.totalKWh / item.count))
    }));
  }, [filteredData]);

  // Data untuk chart horizontal konsumsi tertinggi per line
  const topKwhPerLineData = useMemo(() => {
    const lineKwhMap = {};
    filteredData.forEach(item => {
      const line = item.line_name;
      const kWh = Number(item.total_wh) / 1000;
      if (typeof kWh === 'number' && !isNaN(kWh)) {
          if (!lineKwhMap[line] || kWh > lineKwhMap[line].kWh) {
            lineKwhMap[line] = { line, kWh, period: `${item.month} ${item.year}`, table: item.line_table };
          }
      }
    });
    return Object.values(lineKwhMap).map(item => ({
        ...item,
        kWh: parseFloat(formatNumber(item.kWh))
    })).sort((a, b) => b.kWh - a.kWh).slice(0, topNCount);
  }, [filteredData, topNCount]);

  // --- Statistik Tambahan ---
  const totalKWh = useMemo(() => filteredData.reduce((sum, item) => sum + (Number(item.total_wh) / 1000), 0), [filteredData]);
  const avgKWh = useMemo(() => filteredData.length ? totalKWh / filteredData.length : 0, [filteredData, totalKWh]);
  const maxKWhItem = useMemo(() => filteredData.reduce((max, item) => Number(item.total_wh) > Number(max.total_wh) ? item : max, filteredData[0] || {}), [filteredData]);
  const minKWhItem = useMemo(() => filteredData.reduce((min, item) => Number(item.total_wh) < Number(min.total_wh) ? item : min, filteredData[0] || {}), [filteredData]);
  const avgDuration = useMemo(() => {
      if (filteredData.length === 0) return '0h 0m';
      const totalMs = filteredData.reduce((sum, item) => {
          const start = new Date(item.start_datetime);
          const end = new Date(item.end_datetime);
          return sum + (end - start);
      }, 0);
      const avgMs = totalMs / filteredData.length;
      const avgHours = Math.floor(avgMs / (1000 * 60 * 60));
      const avgMinutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${avgHours}h ${avgMinutes}m`;
  }, [filteredData]);

  // --- Ekspor ke CSV ---
  const exportToCSV = () => {
    const headers = ['ID', 'Tipe PM', 'Line', 'Bulan', 'Tahun', 'Start DateTime', 'End DateTime', 'Start kWh', 'Last kWh', 'Total kWh', 'Durasi', 'Production Group'];
    const rows = paginatedData.map(item => [
      item.idPrimary,
      normalizePmType(item.pm_type),
      item.line_name,
      item.month,
      item.year,
      formatDate(item.start_datetime),
      formatDate(item.end_datetime),
      formatKWh(item.start_wh),
      formatKWh(item.last_wh),
      formatKWh(item.total_wh),
      formatDuration(item.start_datetime, item.end_datetime),
      tableNameMapping[item.line_table]?.[1] || 'Unknown' // Tambahkan PG ke CSV
    ]);
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pm_monthly_report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle sort request
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
    setCurrentPage(1);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({ month: '', year: '', line: '', pmType: '', searchTerm: '' });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle detail row
  const toggleRowDetail = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Render data
  return (
    <div className="min-h-screen bg-gray-50 pb-12 flex flex-col lg:flex-row">
      {/* Header & Mobile Sidebar (diurus oleh HeaderEnergyElectric) */}
      <HeaderEnergyElectric sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-0 lg:ml-64"> {/* Margin kiri untuk sidebar desktop */}
        {/* Filter & Search Section */}
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-blue-700">Filter & Pencarian</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
              >
                Ekspor CSV
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Aksi Lain
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <input
              type="text"
              placeholder="Cari Tipe, Line, Bulan..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full sm:w-auto">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Bulan</label>
                <select
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua</option>
                  {filterOptions.months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua</option>
                  {filterOptions.years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Line</label>
                <select
                  value={filters.line}
                  onChange={(e) => handleFilterChange('line', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua</option>
                  {filterOptions.lines.map((line) => (
                    <option key={line} value={line}>{line}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipe PM</label>
                <select
                  value={filters.pmType}
                  onChange={(e) => handleFilterChange('pmType', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua</option>
                  {filterOptions.pmTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors shadow-sm w-full sm:w-auto"
            >
              Reset Semua
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Laporan (Jun 2025+)</h3>
            <p className="text-xl font-bold text-gray-900">{filteredData.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total kWh</h3>
            <p className="text-xl font-bold text-blue-600">{formatNumber(totalKWh)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata kWh</h3>
            <p className="text-xl font-bold text-green-600">{formatNumber(avgKWh)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">KWh Tertinggi</h3>
            <p className="text-xl font-bold text-amber-600">{maxKWhItem ? formatKWh(maxKWhItem.total_wh) : '0'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">KWh Terendah</h3>
            <p className="text-xl font-bold text-purple-600">{minKWhItem && Number(minKWhItem.total_wh) > 0 ? formatKWh(minKWhItem.total_wh) : '0'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi Rata-rata</h3>
            <p className="text-xl font-bold text-cyan-600">{avgDuration}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Combined Top N & PG Pie Chart */}
          <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
              {/* PG Pie Chart - kirimkan tableNameMapping sebagai prop */}
              <div className="lg:col-span-1">
                <PGPieChart data={filteredData} tableNameMapping={tableNameMapping} />
              </div>
              <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-800">Top {topNCount} Konsumsi Tertinggi per Line</h3>
                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                        <span className="text-xs text-gray-600">Tampilkan:</span>
                        <select
                            value={topNCount}
                            onChange={(e) => setTopNCount(Number(e.target.value))}
                            className="px-2 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                        </select>
                        <div className="flex space-x-1 ml-2">
                            <button
                                onClick={() => setTopChartType('bar')}
                                className={`px-2 py-1 text-xs rounded ${
                                    topChartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Bar
                            </button>
                            <button
                                onClick={() => setTopChartType('line')}
                                className={`px-2 py-1 text-xs rounded ${
                                    topChartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Line
                            </button>
                            <button
                                onClick={() => setTopChartType('area')}
                                className={`px-2 py-1 text-xs rounded ${
                                    topChartType === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Area
                            </button>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  {topChartType === 'bar' ? (
                      <BarChart
                        layout="vertical"
                        data={topKwhPerLineData}
                        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="line" width={140} />
                        <Tooltip formatter={(value) => [value, 'kWh']} />
                        <Bar dataKey="kWh" name="KWh Tertinggi" fill="#f59e0b" />
                      </BarChart>
                  ) : topChartType === 'line' ? (
                      <LineChart
                        layout="vertical"
                        data={topKwhPerLineData}
                        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                        reverseLayout={true}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="line" width={140} />
                        <Tooltip formatter={(value) => [value, 'kWh']} />
                        <Line type="monotone" dataKey="kWh" name="KWh Tertinggi" stroke="#f59e0b" activeDot={{ r: 6 }} strokeWidth={2} />
                      </LineChart>
                  ) : topChartType === 'area' ? (
                      <AreaChart
                        layout="vertical"
                        data={topKwhPerLineData}
                        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                        reverseLayout={true}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="line" width={140} />
                        <Tooltip formatter={(value) => [value, 'kWh']} />
                        <Area type="monotone" dataKey="kWh" name="KWh Tertinggi" stroke="#f59e0b" fill="#fde68a" fillOpacity={0.6} strokeWidth={2} />
                      </AreaChart>
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          Tipe Grafik Tidak Dikenal
                      </div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'pm_type', label: 'Tipe (Terkelompok)' },
                    { key: 'line_name', label: 'Line' },
                    { key: 'pg', label: 'Production Group' }, // Kolom baru
                    { key: 'month', label: 'Periode' },
                    { key: 'duration', label: 'Durasi' },
                    { key: 'kwh', label: 'Konsumsi (kWh)' },
                    { key: 'action', label: 'Detail' }
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <React.Fragment key={item.idPrimary}>
                      <tr className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-700">{normalizePmType(item.pm_type)}</div>
                          <div className="text-xs text-gray-500">{item.pm_type}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.line_name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tableNameMapping[item.line_table]?.[1] || 'Unknown'}</div> {/* Kolom baru */}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.month}</div>
                          <div className="text-xs text-gray-500">{item.year}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDuration(item.start_datetime, item.end_datetime)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700">{formatKWh(item.total_wh)}</div>
                          <div className="text-xs text-gray-500">({formatKWh(item.start_wh)} → {formatKWh(item.last_wh)})</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            onClick={() => toggleRowDetail(item.idPrimary)}
                            className="text-blue-600 hover:text-blue-900 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            {expandedRow === item.idPrimary ? 'Sembunyikan' : 'Detail'}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === item.idPrimary && (
                        <tr className="bg-blue-50">
                          <td colSpan="7" className="px-4 py-3"> {/* Kolom span disesuaikan */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div>
                                <p><span className="font-medium">ID:</span> {item.idPrimary}</p>
                                <p><span className="font-medium">Tabel:</span> {item.line_table}</p>
                                <p><span className="font-medium">Start DateTime:</span> {formatDate(item.start_datetime)}</p>
                                <p><span className="font-medium">End DateTime:</span> {formatDate(item.end_datetime)}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">Dibuat:</span> {formatDate(item.created_at)}</p>
                                <p><span className="font-medium">Production Group:</span> {tableNameMapping[item.line_table]?.[1] || 'Unknown'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500"> {/* Kolom span disesuaikan */}
                      <div className="flex flex-col items-center">
                        <div className="text-3xl mb-1">🔍</div>
                        <p>Tidak ada data yang ditemukan.</p>
                        <p className="text-xs mt-1">Coba ubah filter atau pencarian Anda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                  className={`ml-2 relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  Berikutnya
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> hingga{' '}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari{' '}
                    <span className="font-medium">{filteredData.length}</span> entri
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300'}`}
                    >
                      &larr;
                    </button>
                    {[...Array(Math.min(5, Math.ceil(filteredData.length / itemsPerPage))).keys()].map(num => {
                        const pageNum = Math.max(1, Math.min(currentPage - 2, Math.ceil(filteredData.length / itemsPerPage) - 4)) + num;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                                    currentPage === pageNum
                                    ? 'z-10 bg-blue-50 border border-blue-500 text-blue-600'
                                    : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium ${currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300' : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EnergyElectric;
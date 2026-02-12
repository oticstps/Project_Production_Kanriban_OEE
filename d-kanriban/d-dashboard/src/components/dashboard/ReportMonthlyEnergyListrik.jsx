// ReportMonthlyEnergyListrik.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts'; // TAMBAHKAN Cell DI SINI
import HeaderEnergyListrik from './HeaderEnergyListrik';
import PGPieChart from './PGPieChart';
import SidebarEnergyListrik from './SidebarEnergyListrik';
import Layout from '../layout/Layout';

// Mapping warna untuk setiap Production Group
const PG_COLOR_MAP = {
  'PG1.1': '#0088FE',    // Biru
  'PG2.1': '#00C49F',    // Hijau
  'PG2.2': '#FFBB28',    // Kuning/Oranye
  'PG2.3': '#FF8042',    // Merah Oranye
  'Facility': '#8884d8', // Ungu
  // 'OTICS': '#82ca9d',    // Hijau Muda
  'Unknown': '#aaaaaa'   // Abu-abu
};

// Extended mapping nama tabel untuk semua variasi
const tableNameMapping = {
  // PG1.1 - BIRU
  'tb_pm200_bs1': ['BALANCE SHAFT 1', 'PG1.1'],
  'tb_pm200_bs2': ['BALANCE SHAFT 2', 'PG1.1'],
  'tb_pm200_ret': ['RETAINER', 'PG1.1'],
  'tb_pm200_conn': ['CONNECTOR', 'PG1.1'],
  'tb_pm200_ra': ['ROLLER ARM', 'PG1.1'],
  'tb_pm200_hla': ['HLA', 'PG1.1'],
  
  // PG2.1 - HIJAU
  'tb_pm200_cr4': ['COMMON RAIL 4', 'PG2.1'],
  'tb_pm200_cr6': ['COMMON RAIL 6', 'PG2.1'],
  'tb_pm200_cr9': ['COMMON RAIL 9', 'PG2.1'],
  'tb_pm200_cr10': ['COMMON RAIL 10', 'PG2.1'],
  'tb_pm200_cr11': ['COMMON RAIL 11', 'PG2.1'],
  'tb_pm200_cr12': ['COMMON RAIL 12', 'PG2.1'],
  
  // PG2.2 - KUNING/ORANYE
  'tb_pm200_cr1': ['COMMON RAIL 1', 'PG2.2'],
  'tb_pm200_cr2': ['COMMON RAIL 2', 'PG2.2'],
  'tb_pm200_cr3': ['COMMON RAIL 3', 'PG2.2'],
  'tb_pm200_cr5': ['COMMON RAIL 5', 'PG2.2'],
  'tb_pm200_cr7': ['COMMON RAIL 7', 'PG2.2'],
  'tb_pm200_cr8': ['COMMON RAIL 8', 'PG2.2'],
  
  // PG2.3 - MERAH ORANYE
  'tb_pm200_cc1': ['CAM CAP 1', 'PG2.3'],
  'tb_pm200_cc234': ['CAM CAP 234', 'PG2.3'],
  'tb_pm200_chab': ['CAM HOUSING AB', 'PG2.3'],
  'tb_pm200_chcd': ['CAM HOUSING CD', 'PG2.3'],
  'tb_pm200_chef': ['CAM HOUSING EF', 'PG2.3'],
  'tb_pm200_chsaa': ['CAM HOUSING ASSY A', 'PG2.3'],
  'tb_pm200_chsab': ['CAM HOUSING ASSY B', 'PG2.3'],
  'tb_pm200_chsac': ['CAM HOUSING ASSY C', 'PG2.3'],
  'tb_pm200_ct': ['CT', 'PG2.3'],
  
  // PM220 - PG1.1 (BIRU)
  'tb_pm220_bs1': ['BALANCE SHAFT 1', 'PG1.1'],
  'tb_pm220_bs2': ['BALANCE SHAFT 2', 'PG1.1'],
  'tb_pm220_ret': ['RETAINER', 'PG1.1'],
  'tb_pm220_ra': ['ROLLER ARM', 'PG1.1'],
  'tb_pm220_hla': ['HLA', 'PG1.1'],
  'tb_pm220_conn': ['CONNECTOR', 'PG1.1'],
  
  // PM220 - PG2.2 (KUNING/ORANYE)
  'tb_pm220_cr1': ['COMMON RAIL 1', 'PG2.2'],
  'tb_pm220_cr2': ['COMMON RAIL 2', 'PG2.2'],
  'tb_pm220_cr3': ['COMMON RAIL 3', 'PG2.2'],
  'tb_pm220_cr5': ['COMMON RAIL 5', 'PG2.2'],
  'tb_pm220_cr7': ['COMMON RAIL 7', 'PG2.2'],
  'tb_pm220_cr8': ['COMMON RAIL 8', 'PG2.2'],
  
  // PM220 - PG2.1 (HIJAU)
  'tb_pm220_cr4': ['COMMON RAIL 4', 'PG2.1'],
  'tb_pm220_cr6': ['COMMON RAIL 6', 'PG2.1'],
  'tb_pm220_cr9': ['COMMON RAIL 9', 'PG2.1'],
  'tb_pm220_cr10': ['COMMON RAIL 10', 'PG2.1'],
  'tb_pm220_cr11': ['COMMON RAIL 11', 'PG2.1'],
  'tb_pm220_cr12': ['COMMON RAIL 12', 'PG2.1'],
  
  // PM220 - PG2.3 (MERAH ORANYE)
  'tb_pm220_cc1': ['CAM CAP 1', 'PG2.3'],
  'tb_pm220_cc234': ['CAM CAP 234', 'PG2.3'],
  'tb_pm220_chab': ['CAM HOUSING AB', 'PG2.3'],
  'tb_pm220_chcd': ['CAM HOUSING CD', 'PG2.3'],
  'tb_pm220_chef': ['CAM HOUSING EF', 'PG2.3'],
  'tb_pm220_chsaa': ['CAM HOUSING ASSY A', 'PG2.3'],
  'tb_pm220_chsab': ['CAM HOUSING ASSY B', 'PG2.3'],
  'tb_pm220_chsac': ['CAM HOUSING ASSY C', 'PG2.3'],
  // 'tb_pm220_ct': ['CT', 'PG2.3'],
  
  // OTICS
  // 'tb_kub1_total_kwh': ['Kubikal 1', 'OTICS'],
};

// Fungsi untuk menormalisasi tipe PM dengan lebih akurat
const normalizePmType = (type) => {
  if (!type || type === '') return 'Unknown';
  
  const lowerType = type.toLowerCase().replace(/[\s\-_]/g, '');
  
  // Deteksi PM 220/1F
  if (lowerType.includes('220') || lowerType.includes('1f')) {
    return 'PM 220 VOLT';
  }
  
  // Deteksi PM 200/3F
  if (lowerType.includes('200') || lowerType.includes('3f')) {
    return 'PM 200 VOLT';
  }
  
  // Fallback ke format asli
  return type;
};

const ReportMonthlyEnergyListrik = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk filter
  const [filters, setFilters] = useState({
    month: '',
    year: '',
    line: '',
    pmType: '',
    searchTerm: ''
  });
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State untuk sorting
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  
  // State untuk menampilkan detail baris
  const [expandedRow, setExpandedRow] = useState(null);
  
  // State untuk tipe chart
  const [totalChartType, setTotalChartType] = useState('line');
  const [avgChartType, setAvgChartType] = useState('line');
  const [topChartType, setTopChartType] = useState('bar');
  const [topNCount, setTopNCount] = useState(20);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.27.6.191:4000/api/energy/pm-monthly-report');
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }
        const result = await response.json();
        
        // Filter data: hanya ambil data dari Juni 2025 ke atas
        const filteredResultData = result.data.filter(item => {
          if (!item.start_datetime) return false;
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
    
    // Normalisasi semua tipe PM untuk filter
    const pmTypesSet = new Set();
    data.forEach(item => {
      pmTypesSet.add(normalizePmType(item.pm_type));
    });
    const pmTypes = Array.from(pmTypesSet).sort();
    
    return { months, years, lines, pmTypes };
  }, [data]);

  // Fungsi untuk mendapatkan warna berdasarkan PG
  const getColorByPG = (pg) => {
    return PG_COLOR_MAP[pg] || '#aaaaaa';
  };

  // Fungsi untuk mendapatkan PG berdasarkan line_table
  const getPGByLineTable = (lineTable) => {
    return tableNameMapping[lineTable]?.[1] || 'Unknown';
  };

  // Fungsi untuk memformat angka (tanpa koma, dibulatkan)
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Math.round(Number(num)).toString();
  };

  // Fungsi untuk memformat kWh
  const formatKWh = (whValue) => {
    if (whValue === null || whValue === undefined) return '0';
    const kWh = Number(whValue) / 1000;
    return formatNumber(kWh);
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  // Fungsi untuk memformat durasi
  const formatDuration = (start, end) => {
    if (!start || !end) return '-';
    try {
      const start_time = new Date(start);
      const end_time = new Date(end);
      const diff_ms = end_time - start_time;
      const diff_hours = Math.floor(diff_ms / (1000 * 60 * 60));
      const diff_minutes = Math.floor((diff_ms % (1000 * 60 * 60)) / (1000 * 60));
      return `${diff_hours}h ${diff_minutes}m`;
    } catch (e) {
      return '-';
    }
  };

  // Sorting data
  const sortedData = useMemo(() => {
    if (!data.length) return [];
    const sortableData = [...data];
    
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
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
      const pg = getPGByLineTable(item.line_table).toLowerCase();
      const lineName = item.line_name ? item.line_name.toLowerCase() : '';
      
      return (
        matchesFilter &&
        (normalizedType.includes(searchLower) ||
         lineName.includes(searchLower) ||
         (item.month && item.month.toLowerCase().includes(searchLower)) ||
         (item.year && item.year.toString().includes(searchLower)) ||
         pg.includes(searchLower) ||
         (item.line_table && item.line_table.toLowerCase().includes(searchLower)))
      );
    });
  }, [sortedData, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Data untuk chart konsumsi tertinggi per line (Top N) - dengan warna berdasarkan PG
  const topKwhPerLineData = useMemo(() => {
    const lineKwhMap = {};
    filteredData.forEach(item => {
      const line = item.line_name;
      const kWh = Number(item.total_wh) / 1000;
      if (typeof kWh === 'number' && !isNaN(kWh)) {
        if (!lineKwhMap[line] || kWh > lineKwhMap[line].kWh) {
          const pg = getPGByLineTable(item.line_table);
          lineKwhMap[line] = { 
            line, 
            kWh, 
            period: `${item.month} ${item.year}`, 
            table: item.line_table,
            pg: pg,
            color: getColorByPG(pg)
          };
        }
      }
    });
    
    return Object.values(lineKwhMap)
      .map(item => ({
        ...item,
        kWh: parseFloat(formatNumber(item.kWh))
      }))
      .sort((a, b) => b.kWh - a.kWh)
      .slice(0, topNCount);
  }, [filteredData, topNCount]);

  // Data untuk chart Total kWh per Line (Jika semua filter = '') - dengan warna berdasarkan PG
  const totalKWhPerLineAllData = useMemo(() => {
    const lineSumMap = {};
    
    // Hitung total kWh per line
    filteredData.forEach(item => {
      const line = item.line_name;
      const kWh = Number(item.total_wh) / 1000;
      if (typeof kWh === 'number' && !isNaN(kWh)) {
        if (!lineSumMap[line]) {
          const pg = getPGByLineTable(item.line_table);
          lineSumMap[line] = { 
            line, 
            totalKWh: 0,
            pg: pg,
            color: getColorByPG(pg)
          };
        }
        lineSumMap[line].totalKWh += kWh;
      }
    });
    
    // Urutkan berdasarkan totalKWh descending
    return Object.values(lineSumMap)
      .map(item => ({
        ...item,
        totalKWh: parseFloat(formatNumber(item.totalKWh))
      }))
      .sort((a, b) => b.totalKWh - a.totalKWh);
  }, [filteredData]);

  // --- Statistik Tambahan ---
  const totalKWh = useMemo(() => {
    return filteredData.reduce((sum, item) => {
      const kWh = Number(item.total_wh) / 1000;
      return sum + (isNaN(kWh) ? 0 : kWh);
    }, 0);
  }, [filteredData]);
  
  const avgKWh = useMemo(() => {
    return filteredData.length > 0 ? totalKWh / filteredData.length : 0;
  }, [filteredData, totalKWh]);

  // Menentukan apakah mode "Semua" aktif
  const isAllFilterMode = filters.month === '' && filters.year === '' && filters.line === '' && filters.pmType === '';

  // Temukan item dengan kWh tertinggi/terendah berdasarkan mode filter
  const maxKWhItem = useMemo(() => {
    if (isAllFilterMode) {
      if (totalKWhPerLineAllData.length === 0) return null;
      return totalKWhPerLineAllData.reduce((max, item) => item.totalKWh > max.totalKWh ? item : max, totalKWhPerLineAllData[0]);
    } else {
      if (filteredData.length === 0) return null;
      return filteredData.reduce((max, item) => {
        const currentKWh = Number(item.total_wh) / 1000;
        const maxKWh = Number(max.total_wh) / 1000;
        return (isNaN(currentKWh) ? 0 : currentKWh) > (isNaN(maxKWh) ? 0 : maxKWh) ? item : max;
      }, filteredData[0]);
    }
  }, [isAllFilterMode, totalKWhPerLineAllData, filteredData]);

  const minKWhItem = useMemo(() => {
    if (isAllFilterMode) {
      if (totalKWhPerLineAllData.length === 0) return null;
      const nonZeroData = totalKWhPerLineAllData.filter(item => item.totalKWh > 0);
      if (nonZeroData.length === 0) {
        return totalKWhPerLineAllData[0];
      }
      return nonZeroData.reduce((min, item) => item.totalKWh < min.totalKWh ? item : min, nonZeroData[0]);
    } else {
      if (filteredData.length === 0) return null;
      const nonZeroData = filteredData.filter(item => {
        const kWh = Number(item.total_wh) / 1000;
        return !isNaN(kWh) && kWh > 0;
      });
      if (nonZeroData.length === 0) {
        return filteredData[0];
      }
      return nonZeroData.reduce((min, item) => {
        const currentKWh = Number(item.total_wh) / 1000;
        const minKWh = Number(min.total_wh) / 1000;
        return (isNaN(currentKWh) ? Infinity : currentKWh) < (isNaN(minKWh) ? Infinity : minKWh) ? item : min;
      }, nonZeroData[0]);
    }
  }, [isAllFilterMode, totalKWhPerLineAllData, filteredData]);

  // --- Ekspor ke CSV ---
  const exportToCSV = () => {
    const headers = ['ID', 'Tipe PM', 'Line', 'Bulan', 'Tahun', 'Start DateTime', 'End DateTime', 'Start kWh', 'Last kWh', 'Total kWh', 'Durasi', 'Production Group'];
    const rows = paginatedData.map(item => [
      item.idPrimary || '',
      normalizePmType(item.pm_type),
      item.line_name || '',
      item.month || '',
      item.year || '',
      formatDate(item.start_datetime),
      formatDate(item.end_datetime),
      formatKWh(item.start_wh),
      formatKWh(item.last_wh),
      formatKWh(item.total_wh),
      formatDuration(item.start_datetime, item.end_datetime),
      getPGByLineTable(item.line_table)
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

  // Data dan judul untuk chart di kanan berdasarkan mode
  const rightChartTitle = isAllFilterMode ? 'Total Konsumsi per Line (Semua Data)' : `Top ${topNCount} Konsumsi Tertinggi per Line`;
  const rightChartData = isAllFilterMode ? totalKWhPerLineAllData : topKwhPerLineData;
  const rightChartValueKey = isAllFilterMode ? 'totalKWh' : 'kWh';

  // Custom Tooltip untuk BarChart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">PG: {data.pg || 'Unknown'}</p>
          <p className="text-sm text-gray-600">kWh: {payload[0].value.toLocaleString()}</p>
          {data.period && <p className="text-sm text-gray-500">Periode: {data.period}</p>}
        </div>
      );
    }
    return null;
  };

  // Render data
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Layout>
        <main className="min-w-full mx-auto px-0 sm:px-0 lg:px-0 mt-0">
          {/* Filter & Search Section */}
          <div className="bg-white p-3 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <h2 className="text-base font-semibold text-blue-700">Filter & Pencarian</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                >
                  Ekspor CSV
                </button>
                <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                  Aksi Lain
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <input
                type="text"
                placeholder="Cari Tipe, Line, Bulan, PG..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="flex-grow px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full sm:w-auto">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bulan</label>
                  <select
                    value={filters.month}
                    onChange={(e) => handleFilterChange('month', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors shadow-sm w-full sm:w-auto"
              >
                Reset Semua
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
              <p className="text-xl font-bold text-amber-600">
                {maxKWhItem ? (isAllFilterMode ? formatNumber(maxKWhItem.totalKWh) : formatKWh(maxKWhItem.total_wh)) : '0'}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">KWh Terendah</h3>
              <p className="text-xl font-bold text-purple-600">
                {minKWhItem ? (isAllFilterMode ? formatNumber(minKWhItem.totalKWh) : formatKWh(minKWhItem.total_wh)) : '0'}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                {/* Pie Chart - Distribusi kWh per PG */}
                <div className="lg:col-span-1 flex flex-col h-full">
                  <PGPieChart 
                    data={filteredData} 
                    tableNameMapping={tableNameMapping} 
                    pgColorMap={PG_COLOR_MAP} 
                  />
                </div>
                
                {/* Bar/Line/Area Chart - Top N atau Total per Line */}
                <div className="lg:col-span-2 flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-800">{rightChartTitle}</h3>
                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                      {!isAllFilterMode && (
                        <>
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
                        </>
                      )}
                      
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

                  <div className="bg-white rounded-lg shadow border border-gray-200 p-3 flex-grow">
                    <ResponsiveContainer width="100%" height={300}>
                      {topChartType === 'bar' ? (
                        <BarChart
                          layout="horizontal"
                          data={rightChartData}
                          margin={{ top: 5, right: 30, left: 50, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="line"
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={90}
                          />
                          <YAxis />
                          <Tooltip content={<CustomBarTooltip />} />
                          <Bar
                            dataKey={rightChartValueKey}
                            name={isAllFilterMode ? "Total kWh" : "KWh Tertinggi"}
                            radius={[2, 2, 0, 0]}
                          >
                            {/* Render setiap bar dengan warna yang sesuai berdasarkan PG */}
                            {rightChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || getColorByPG(entry.pg)} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : topChartType === 'line' ? (
                        <LineChart
                          data={rightChartData}
                          margin={{ top: 5, right: 30, left: 50, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="line"
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={90}
                          />
                          <YAxis />
                          <Tooltip content={<CustomBarTooltip />} />
                          <Line
                            type="monotone"
                            dataKey={rightChartValueKey}
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      ) : (
                        <AreaChart
                          data={rightChartData}
                          margin={{ top: 5, right: 30, left: 50, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="line"
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={90}
                          />
                          <YAxis />
                          <Tooltip content={<CustomBarTooltip />} />
                          <Area
                            type="monotone"
                            dataKey={rightChartValueKey}
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                    
                    {/* Legend untuk PG Colors */}
                    <div className="flex flex-wrap justify-center mt-2 gap-2">
                      {Object.entries(PG_COLOR_MAP).map(([pg, color]) => (
                        <div key={pg} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-1" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-xs text-gray-600">{pg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      { key: 'pg', label: 'Production Group' },
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
                    paginatedData.map((item, index) => {
                      const pg = getPGByLineTable(item.line_table);
                      const pgColor = getColorByPG(pg);
                      const normalizedPmType = normalizePmType(item.pm_type);
                      
                      return (
                        <React.Fragment key={item.idPrimary || index}>
                          <tr className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-blue-700">{normalizedPmType}</div>
                              <div className="text-xs text-gray-500">{item.pm_type}</div>
                            </td>
                            
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.line_name}</div>
                              <div className="text-xs text-gray-500">{item.line_table}</div>
                            </td>
                            
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: pgColor }}
                                ></div>
                                <span className="text-sm font-medium text-gray-900">{pg}</span>
                              </div>
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
                              <td colSpan="7" className="px-4 py-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <p><span className="font-medium">ID:</span> {item.idPrimary}</p>
                                    <p><span className="font-medium">Tabel:</span> {item.line_table}</p>
                                    <p><span className="font-medium">Start DateTime:</span> {formatDate(item.start_datetime)}</p>
                                    <p><span className="font-medium">End DateTime:</span> {formatDate(item.end_datetime)}</p>
                                  </div>
                                  <div>
                                    <p><span className="font-medium">Dibuat:</span> {formatDate(item.created_at)}</p>
                                    <p>
                                      <span className="font-medium">Production Group:</span>{' '}
                                      <span className="font-medium" style={{ color: pgColor }}>
                                        {pg}
                                      </span>
                                    </p>
                                    <p><span className="font-medium">Tipe Normalized:</span> {normalizedPmType}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
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
      </Layout>
    </div>
  );
};

export default ReportMonthlyEnergyListrik;
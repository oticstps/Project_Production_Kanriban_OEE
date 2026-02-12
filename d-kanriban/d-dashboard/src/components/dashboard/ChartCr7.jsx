import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';

const KanribanGrafikBawahPG21 = () => {
  const [data, setData] = useState({
    productCode: '902F-F',
    line: 'LINE COMMON RAIL 12',
    mct: '88.4',
    target100: 41,
    target89: 36,
    dailyData: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('902F-F');
  const [weekendDates, setWeekendDates] = useState([]);
  
  // State untuk flash alert
  const [flashAlert, setFlashAlert] = useState({
    show: false,
    message: '',
    type: 'error' // 'error', 'warning', atau 'success'
  });
  
  // State untuk filter
  const [filters, setFilters] = useState({
    line: 'LINE COMMON RAIL 12',
    part: '',
    year: 2026,
    month: 2
  });
  
// State untuk opsi filter (urut dari terbesar)
const [availableLines, setAvailableLines] = useState([
  { value: 'LINE COMMON RAIL 12', label: 'LINE COMMON RAIL 12' },
  { value: 'LINE COMMON RAIL 11', label: 'LINE COMMON RAIL 11' },
  { value: 'LINE COMMON RAIL 10', label: 'LINE COMMON RAIL 10' },
  { value: 'LINE COMMON RAIL 9', label: 'LINE COMMON RAIL 9' },
  { value: 'LINE COMMON RAIL 8', label: 'LINE COMMON RAIL 8' },
  { value: 'LINE COMMON RAIL 7', label: 'LINE COMMON RAIL 7' },
  { value: 'LINE COMMON RAIL 6', label: 'LINE COMMON RAIL 6' },
  { value: 'LINE COMMON RAIL 5', label: 'LINE COMMON RAIL 5' },
  { value: 'LINE COMMON RAIL 4', label: 'LINE COMMON RAIL 4' },
  { value: 'LINE COMMON RAIL 3', label: 'LINE COMMON RAIL 3' },
  { value: 'LINE COMMON RAIL 2', label: 'LINE COMMON RAIL 2' },
  { value: 'LINE COMMON RAIL 1', label: 'LINE COMMON RAIL 1' }
]);

  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths] = useState([
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ]);

  // Mapping antara line dan endpoint API
  const lineEndpoints = {
    'LINE COMMON RAIL 1': 'http://172.27.6.191:4000/apiCr1/cr1Stop',
    'LINE COMMON RAIL 2': 'http://172.27.6.191:4000/apiCr2/cr2Stop',
    'LINE COMMON RAIL 3': 'http://172.27.6.191:4000/apiCr3/cr3Stop',
    'LINE COMMON RAIL 4': 'http://172.27.6.191:4000/apiCr4/cr4Stop',
    'LINE COMMON RAIL 5': 'http://172.27.6.191:4000/apiCr5/cr5Stop',
    'LINE COMMON RAIL 6': 'http://172.27.6.191:4000/apiCr6/cr6Stop',
    'LINE COMMON RAIL 7': 'http://172.27.6.191:4000/apiCr7/cr7Stop',
    'LINE COMMON RAIL 8': 'http://172.27.6.191:4000/apiCr8/cr8Stop',
    'LINE COMMON RAIL 9': 'http://172.27.6.191:4000/apiCr9/cr9Stop',
    'LINE COMMON RAIL 10': 'http://172.27.6.191:4000/apiCr10/cr10Stop',
    'LINE COMMON RAIL 11': 'http://172.27.6.191:4000/apiCr11/cr11Stop',
    'LINE COMMON RAIL 12': 'http://172.27.6.191:4000/apiCr12/cr12Stop'
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (filters.line && filters.year && filters.month) {
      fetchDataWithFilters();
    }
  }, [filters]);

  // Fungsi untuk menampilkan flash alert
  const showFlashAlert = (message, type = 'error', duration = 5000) => {
    // Hilangkan alert sebelumnya jika ada
    setFlashAlert({
      show: false,
      message: '',
      type: 'error'
    });
    
    // Tampilkan alert baru setelah delay kecil
    setTimeout(() => {
      setFlashAlert({
        show: true,
        message,
        type
      });
      
      // Auto hide setelah durasi tertentu
      setTimeout(() => {
        setFlashAlert(prev => ({
          ...prev,
          show: false
        }));
      }, duration);
    }, 50);
  };

  // Fungsi untuk mengambil data awal
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Mengambil data dari Common Rail 12 sebagai default
      const response = await fetch('http://172.27.6.191:4000/apiCr12/cr12Stop');
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        // Ekstrak informasi unik untuk filter
        extractFilterOptions(result.data);
        
        // Set filter default berdasarkan data yang ada
        const defaultFilters = getDefaultFilters(result.data);
        setFilters(defaultFilters);
        
        // Proses data dengan filter default
        processFilteredData(result.data, defaultFilters, true);
      } else {
        const message = 'No data available for LINE COMMON RAIL 12';
        setError(message);
        showFlashAlert(message, 'warning');
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      const message = 'Failed to fetch initial data';
      setError(message);
      showFlashAlert(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data dengan filter
  const fetchDataWithFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dapatkan endpoint berdasarkan line yang dipilih
      const endpoint = lineEndpoints[filters.line];
      if (!endpoint) {
        const message = `Endpoint not found for ${filters.line}`;
        setError(message);
        showFlashAlert(message, 'error');
        return;
      }
      
      // console.log(`Fetching data from: ${endpoint}`);
      
      const response = await fetch(endpoint);
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        // Ekstrak informasi unik untuk filter dari data baru
        extractFilterOptions(result.data);
        
        // Proses data dengan filter yang dipilih
        processFilteredData(result.data, filters, false);
      } else {
        const message = `No data available for ${filters.line} with selected filters`;
        setError(message);
        showFlashAlert(message, 'warning');
        
        // Tetap tampilkan data kosong agar filter tidak berubah
        const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
        const weekendDates = calculateWeekendDates(filters.year, filters.month);
        setWeekendDates(weekendDates);
        
        setData(prev => ({
          ...prev,
          productCode: filters.part || '',
          line: filters.line,
          dailyData: Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            shift1Production: '',
            shift1LoadingTime: '',
            shift1PcsJam: '',
            shift2Production: '',
            shift2LoadingTime: '',
            shift2PcsJam: '',
            dangae: '',
            isWeekend: weekendDates.includes(i + 1)
          }))
        }));
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      const message = `Failed to fetch data from ${filters.line}`;
      setError(message);
      showFlashAlert(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk ekstrak opsi filter dari data
  const extractFilterOptions = (apiData) => {
    if (!apiData || apiData.length === 0) return;
    
    // Ekstrak produk unik
    const products = [...new Set(apiData
      .map(item => item.name_product)
      .filter(product => product && product.trim() !== '')
    )].sort();
    
    setAvailableProducts(products);
    
    // Ekstrak tahun unik
    const years = [...new Set(apiData
      .map(item => {
        // Coba ambil dari field year jika ada
        if (item.year) return parseInt(item.year);
        
        // Jika tidak ada, coba parse dari created_at
        if (item.created_at) {
          const date = new Date(item.created_at);
          return date.getFullYear();
        }
        
        return null;
      })
      .filter(year => !isNaN(year) && year > 0)
    )].sort((a, b) => b - a);
    
    // Tambahkan tahun 2026 sebagai default jika tidak ada tahun
    if (years.length === 0) years.push(2026);
    
    setAvailableYears(years);
  };

  // Fungsi untuk mendapatkan filter default
  const getDefaultFilters = (apiData) => {
    if (!apiData || apiData.length === 0) {
      return {
        line: 'LINE COMMON RAIL 12',
        part: '',
        year: 2026,
        month: 2
      };
    }
    
    // Cari data terbaru untuk menentukan default
    const latestData = apiData.reduce((latest, current) => {
      const currentDate = new Date(current.created_at);
      const latestDate = latest ? new Date(latest.created_at) : null;
      
      if (!latest || currentDate > latestDate) {
        return current;
      }
      return latest;
    }, null);
    
    if (latestData) {
      const productCounts = {};
      apiData.forEach(item => {
        if (item.name_product) {
          productCounts[item.name_product] = (productCounts[item.name_product] || 0) + 1;
        }
      });
      
      // Pilih produk dengan data terbanyak
      let dominantProduct = '';
      let maxCount = 0;
      Object.entries(productCounts).forEach(([product, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantProduct = product;
        }
      });
      
      // Dapatkan tahun dari data
      let year = 2026;
      if (latestData.year) {
        year = parseInt(latestData.year);
      } else if (latestData.created_at) {
        const date = new Date(latestData.created_at);
        year = date.getFullYear();
      }
      
      // Dapatkan bulan dari data
      let month = 2;
      if (latestData.month) {
        month = parseInt(latestData.month);
      } else if (latestData.created_at) {
        const date = new Date(latestData.created_at);
        month = date.getMonth() + 1;
      }
      
      return {
        line: latestData.line_name || 'LINE COMMON RAIL 12',
        part: dominantProduct || '',
        year: year,
        month: month
      };
    }
    
    return {
      line: 'LINE COMMON RAIL 12',
      part: '',
      year: 2026,
      month: 2
    };
  };

  // Fungsi untuk menentukan weekend/hari libur
  const calculateWeekendDates = (year, month) => {
    // Default untuk Februari 2026
    if (year === 2026 && month === 2) {
      return [1, 7, 8, 14, 15, 21, 22, 28];
    }
    
    // Untuk bulan lain, hitung weekend (Sabtu & Minggu)
    const weekends = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      // 0 = Minggu, 6 = Sabtu
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends.push(day);
      }
    }
    
    return weekends;
  };

  // Proses data dengan filter
  const processFilteredData = (apiData, currentFilters, isInitial = false) => {
    const { part, year, month } = currentFilters;
    
    // 1. Filter data berdasarkan kriteria
    const filteredData = apiData.filter(item => {
      // Filter produk
      if (part && item.name_product !== part) return false;
      
      // Filter tahun - coba dari beberapa sumber
      let itemYear;
      if (item.year) {
        itemYear = parseInt(item.year);
      } else if (item.created_at) {
        const date = new Date(item.created_at);
        itemYear = date.getFullYear();
      }
      
      if (year && itemYear !== year) return false;
      
      // Filter bulan - coba dari beberapa sumber
      let itemMonth;
      if (item.month) {
        itemMonth = parseInt(item.month);
      } else if (item.created_at) {
        const date = new Date(item.created_at);
        itemMonth = date.getMonth() + 1;
      }
      
      if (month && itemMonth !== month) return false;
      
      return true;
    });
    
    if (filteredData.length === 0) {
      const message = `No data available for ${part || 'selected product'} in ${getMonthName(month)} ${year}`;
      setError(message);
      showFlashAlert(message, 'warning');
      
      // Tetap tampilkan data kosong agar filter tidak berubah
      const daysInMonth = new Date(year, month, 0).getDate();
      const weekendDates = calculateWeekendDates(year, month);
      setWeekendDates(weekendDates);
      
      setData(prev => ({
        ...prev,
        productCode: part || '',
        line: currentFilters.line,
        dailyData: Array.from({ length: daysInMonth }, (_, i) => ({
          day: i + 1,
          shift1Production: '',
          shift1LoadingTime: '',
          shift1PcsJam: '',
          shift2Production: '',
          shift2LoadingTime: '',
          shift2PcsJam: '',
          dangae: '',
          isWeekend: weekendDates.includes(i + 1)
        }))
      }));
      return;
    }
    
    // Reset error jika data ditemukan
    setError(null);
    
    // Tampilkan alert sukses (kecuali untuk initial load)
    if (!isInitial) {
      const productName = part || filteredData[0].name_product || 'All Products';
      showFlashAlert(`Data berhasil ditampilkan: ${productName} - ${getMonthName(month)} ${year}`, 'success', 3000);
    }
    
    // 2. Hitung weekend dates untuk bulan dan tahun yang dipilih
    const weekendDates = calculateWeekendDates(year, month);
    setWeekendDates(weekendDates);
    
    // 3. Hitung target berdasarkan cycle_time
    const calculateTarget100 = (cycleTime) => {
      const cycleTimeValue = parseFloat(cycleTime) || 880;
      const target = 3600 / (cycleTimeValue / 10);
      return Math.round(target * 10) / 10;
    };
    
    const calculateTarget89 = (target100) => {
      return Math.round((target100 * 0.89) * 10) / 10;
    };
    
    const firstItem = filteredData[0];
    const target100 = calculateTarget100(firstItem.cycle_time);
    const target89 = calculateTarget89(target100);
    
    // 4. Group by day dengan koreksi shift (logika yang sudah diperbaiki sebelumnya)
    const dailyStats = {};
    const daysInMonth = new Date(year, month, 0).getDate();
    
    filteredData.forEach(item => {
      let day;
      const createdAt = item.created_at;
      
      if (!createdAt) return;
      
      const datePart = createdAt.split(' ')[0];
      const timePart = createdAt.split(' ')[1] || '00:00:00';
      const [itemYear, itemMonth, dayOfMonth] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      
      const shift = item.shift || 'Shift 1';
      const totalMinutes = (hours || 0) * 60 + (minutes || 0);
      const shift1Start = 7 * 60 + 10;
      const shift1End = 19 * 60 + 50;
      const shift2Start = 19 * 60 + 50;
      const shift2End = 7 * 60 + 10;
      
      if (shift === 'Shift 1') {
        if (totalMinutes >= shift1Start && totalMinutes <= shift1End) {
          day = dayOfMonth;
        } else if (totalMinutes < shift1Start) {
          day = dayOfMonth;
        } else {
          day = dayOfMonth;
        }
      } else if (shift === 'Shift 2') {
        if (totalMinutes >= shift2Start) {
          day = dayOfMonth;
        } else if (totalMinutes <= shift2End) {
          day = dayOfMonth - 1;
        } else {
          day = dayOfMonth;
        }
      } else {
        day = dayOfMonth;
      }
      
      if (day < 1) day = daysInMonth;
      if (day > daysInMonth) day = daysInMonth;
      
      if (!dailyStats[day]) {
        dailyStats[day] = {
          shift1: { 
            production: 0, 
            loadingTime: 0, 
            pcsJam: 0, 
            hasData: false,
            items: []
          },
          shift2: { 
            production: 0, 
            loadingTime: 0, 
            pcsJam: 0, 
            hasData: false,
            items: []
          }
        };
      }
      
      const shiftKey = shift === 'Shift 1' ? 'shift1' : 'shift2';
      const production = parseInt(item.actual) || 0;
      
      let loadingTime = 0;
      if (item.loading_time_server) {
        const loadingTimeStr = item.loading_time_server.replace(' menit', '').trim();
        loadingTime = parseFloat(loadingTimeStr) || 0;
      } else if (item.loading_time) {
        loadingTime = parseFloat(item.loading_time) || 0;
      }
      
      dailyStats[day][shiftKey].items.push({
        production,
        loadingTime,
        createdAt,
        hours,
        minutes,
        originalDay: dayOfMonth,
        shift: shift
      });
      
      dailyStats[day][shiftKey].hasData = true;
    });
    
    // 5. Hitung total per shift
    Object.keys(dailyStats).forEach(day => {
      ['shift1', 'shift2'].forEach(shiftKey => {
        const shiftData = dailyStats[day][shiftKey];
        
        if (shiftData.items.length > 0) {
          shiftData.production = shiftData.items.reduce((sum, item) => sum + item.production, 0);
          const totalLoadingTime = shiftData.items.reduce((sum, item) => sum + item.loadingTime, 0);
          shiftData.loadingTime = shiftData.items.length > 0 ? totalLoadingTime / shiftData.items.length : 0;
          shiftData.pcsJam = shiftData.loadingTime > 0 ? 
            (shiftData.production / (shiftData.loadingTime / 60)) : 0;
        }
      });
    });
    
    // 6. Convert ke array format
    const dailyDataArray = Object.keys(dailyStats).map(day => {
      const dayInt = parseInt(day);
      return {
        day: dayInt,
        shift1Production: dailyStats[day].shift1.production,
        shift1LoadingTime: dailyStats[day].shift1.loadingTime,
        shift1PcsJam: Math.round(dailyStats[day].shift1.pcsJam * 10) / 10,
        shift2Production: dailyStats[day].shift2.production,
        shift2LoadingTime: dailyStats[day].shift2.loadingTime,
        shift2PcsJam: Math.round(dailyStats[day].shift2.pcsJam * 10) / 10,
        dangae: '',
        isWeekend: weekendDates.includes(dayInt)
      };
    }).sort((a, b) => a.day - b.day);
    
    // 7. Hitung min dan max untuk y-axis
    const allPcsJamValues = dailyDataArray.flatMap(d => [d.shift1PcsJam, d.shift2PcsJam]).filter(v => v > 0);
    const minPcsJam = allPcsJamValues.length > 0 ? Math.min(...allPcsJamValues) : 30;
    const maxPcsJam = allPcsJamValues.length > 0 ? Math.max(...allPcsJamValues) : 50;
    
    const yMin = Math.max(0, Math.floor(minPcsJam / 5) * 5 - 5);
    const yMax = Math.ceil(Math.max(maxPcsJam, target100) / 5) * 5 + 5;
    
    // 8. Update state
    setSelectedProduct(part);
    setData(prev => ({
      ...prev,
      productCode: part || firstItem.name_product || prev.productCode,
      line: firstItem.line_name || filters.line || prev.line,
      mct: firstItem.setup_ct || prev.mct,
      target100: target100,
      target89: target89,
      yMin: yMin,
      yMax: yMax,
      dailyData: dailyDataArray
    }));
  };

  // Handler untuk perubahan filter
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Fungsi untuk reset filter
  const handleResetFilters = () => {
    setFilters({
      line: 'LINE COMMON RAIL 12',
      part: '',
      year: 2026,
      month: 2
    });
  };

  // Fungsi untuk mendapatkan nama bulan
  const getMonthName = (month) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || '';
  };

  // Fungsi untuk mendapatkan nama hari
  const getDayName = (day) => {
    const date = new Date(filters.year, filters.month - 1, day);
    const dayIndex = date.getDay();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex];
  };

  // Chart dimensions
  const totalDays = new Date(filters.year, filters.month, 0).getDate();
  const chartWidth = 1200;
  const chartHeight = 200;
  const dayWidth = chartWidth / totalDays;

  const getXPosition = (dayIndex) => {
    return dayIndex * dayWidth + dayWidth / 2;
  };

  const getYPosition = (value) => {
    const minY = data.yMin || 30;
    const maxY = data.yMax || 50;
    const range = maxY - minY;
    return chartHeight - ((value - minY) / range) * chartHeight;
  };

  const generateYAxisValues = () => {
    const minY = data.yMin || 30;
    const maxY = data.yMax || 50;
    const step = Math.ceil((maxY - minY) / 4);
    
    const values = [];
    for (let i = minY; i <= maxY; i += step) {
      values.push(Math.round(i));
    }
    
    if (!values.includes(Math.round(data.target100))) {
      values.push(Math.round(data.target100));
    }
    if (!values.includes(Math.round(data.target89))) {
      values.push(Math.round(data.target89));
    }
    
    return values.sort((a, b) => a - b);
  };

  if (loading) {
    return (
      <Layout>
        <div style={{padding: '20px', textAlign: 'center', fontSize: '18px'}}>
          Loading data from {filters.line}...
        </div>
      </Layout>
    );
  }

  const yAxisValues = generateYAxisValues();

  return (
    <Layout>
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white',
        border: '4px solid black',
        borderRadius: '15px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Flash Alert Section */}
        {flashAlert.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '20px 30px',
            backgroundColor: flashAlert.type === 'error' ? '#f8d7da' : 
                           flashAlert.type === 'warning' ? '#fff3cd' : '#d4edda',
            color: flashAlert.type === 'error' ? '#721c24' : 
                   flashAlert.type === 'warning' ? '#856404' : '#155724',
            border: `3px solid ${flashAlert.type === 'error' ? '#f5c6cb' : 
                              flashAlert.type === 'warning' ? '#ffeaa7' : '#c3e6cb'}`,
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            fontWeight: 'bold',
            fontSize: '20px',
            animation: flashAlert.type === 'error' ? 'blink 1s infinite' : 'fadeIn 0.5s',
            minWidth: '400px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            {flashAlert.type === 'error' ? '❌' : 
             flashAlert.type === 'warning' ? '⚠️' : '✅'}
            <span>{flashAlert.message}</span>
          </div>
        )}

        {/* Filter Section */}
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
            Filter Data
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '15px'
          }}>
            {/* Line Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Line
              </label>
              <select
                value={filters.line}
                onChange={(e) => handleFilterChange('line', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {availableLines.map(line => (
                  <option key={line.value} value={line.value}>
                    {line.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Product/Part Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Product / Part
              </label>
              <select
                value={filters.part}
                onChange={(e) => handleFilterChange('part', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Products</option>
                {availableProducts.map(product => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Year Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Tahun
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Month Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Bulan
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {availableMonths.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Menampilkan data untuk: <strong>{filters.line}</strong> -{' '}
              <strong>{filters.part || 'Semua Produk'}</strong> -{' '}
              <strong>{getMonthName(filters.month)} {filters.year}</strong>
            </div>
            
            <button
              onClick={handleResetFilters}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <div>Target (100%) :</div>
            <div>{data.target100} Pcs/Jam</div>
            <div style={{ marginTop: '5px' }}>Target (89%) :</div>
            <div>{data.target89} Pcs/Jam</div>
          </div>
          <div style={{ 
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <div>{data.line}</div>
            <div style={{ fontSize: '24px', marginTop: '5px' }}>
              GRAFIK Pcs/Jam {data.productCode}
            </div>
            <div style={{ fontSize: '14px', marginTop: '5px', color: 'blue' }}>
              Product: {data.productCode} | Cycle Time: {parseFloat(data.mct || 88.4)}s
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px', color: 'green' }}>
              Periode: {getMonthName(filters.month)} {filters.year}
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <div>{parseFloat(data.manpower) || 4}MP Cycle Time = {data.mct}s/Pcs</div>
            <div style={{ marginTop: '5px' }}>Y-Axis Range:</div>
            <div>{data.yMin || 30} - {data.yMax || 50} Pcs/Jam</div>
          </div>
        </div>

        {/* Chart Area */}
        <div style={{ 
          position: 'relative', 
          height: '240px', 
          marginBottom: '10px',
          marginLeft: '50px',
          marginRight: '20px'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
            {/* Background grid - horizontal lines */}
            {yAxisValues.map((val, idx) => (
              <line 
                key={`h-${idx}`}
                x1="0" 
                y1={getYPosition(val)} 
                x2="1200" 
                y2={getYPosition(val)}
                stroke="#B8E6F5" 
                strokeWidth="0.5"
              />
            ))}
            
            {/* Vertical lines for each day */}
            {Array.from({ length: totalDays + 1 }).map((_, idx) => (
              <line 
                key={`v-${idx}`}
                x1={idx * dayWidth} 
                y1="0" 
                x2={idx * dayWidth} 
                y2="200"
                stroke={weekendDates.includes(idx) ? 'red' : '#B8E6F5'} 
                strokeWidth={weekendDates.includes(idx) ? '2' : '0.5'}
              />
            ))}

            {/* Target line (100%) */}
            <line 
              x1="0" 
              y1={getYPosition(data.target100)} 
              x2="1200" 
              y2={getYPosition(data.target100)}
              stroke="red" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <g>
              <rect 
                x="1180" 
                y={getYPosition(data.target100) - 8} 
                width="50" 
                height="16" 
                fill="white" 
                stroke="red" 
                strokeWidth="0.5"
                rx="2"
              />
              <text 
                x="1205" 
                y={getYPosition(data.target100) + 3} 
                fontSize="10" 
                fill="red"
                fontWeight="bold"
                textAnchor="middle"
              >
                100% ({data.target100})
              </text>
            </g>

            {/* Target line (89%) */}
            <line 
              x1="0" 
              y1={getYPosition(data.target89)} 
              x2="1200" 
              y2={getYPosition(data.target89)}
              stroke="red" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <g>
              <rect 
                x="1180" 
                y={getYPosition(data.target89) - 8} 
                width="50" 
                height="16" 
                fill="white" 
                stroke="red" 
                strokeWidth="0.5"
                rx="2"
              />
              <text 
                x="1205" 
                y={getYPosition(data.target89) + 3} 
                fontSize="10" 
                fill="red"
                fontWeight="bold"
                textAnchor="middle"
              >
                89% ({data.target89})
              </text>
            </g>

            {/* Plot data points and lines for Shift 1 (Blue) */}
            {data.dailyData.length > 0 && data.dailyData.some(d => d.shift1PcsJam > 0) && (
              <>
                <polyline
                  points={data.dailyData
                    .filter(d => d.shift1PcsJam > 0)
                    .map(d => `${getXPosition(d.day - 1)},${getYPosition(d.shift1PcsJam)}`)
                    .join(' ')}
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                />
                {data.dailyData.map((d, idx) => 
                  d.shift1PcsJam > 0 && (
                    <g key={`s1-${idx}`}>
                      <circle 
                        cx={getXPosition(d.day - 1)} 
                        cy={getYPosition(d.shift1PcsJam)} 
                        r="4" 
                        fill="blue" 
                      />
                      <text 
                        x={getXPosition(d.day - 1)} 
                        y={getYPosition(d.shift1PcsJam) - 8} 
                        fontSize="8" 
                        textAnchor="middle"
                        fill="blue"
                        fontWeight="bold"
                      >
                        {d.shift1PcsJam}
                      </text>
                    </g>
                  )
                )}
              </>
            )}

            {/* Plot data points and lines for Shift 2 (Black) */}
            {data.dailyData.length > 0 && data.dailyData.some(d => d.shift2PcsJam > 0) && (
              <>
                <polyline
                  points={data.dailyData
                    .filter(d => d.shift2PcsJam > 0)
                    .map(d => `${getXPosition(d.day - 1)},${getYPosition(d.shift2PcsJam)}`)
                    .join(' ')}
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                />
                {data.dailyData.map((d, idx) => 
                  d.shift2PcsJam > 0 && (
                    <g key={`s2-${idx}`}>
                      <circle 
                        cx={getXPosition(d.day - 1)} 
                        cy={getYPosition(d.shift2PcsJam)} 
                        r="4" 
                        fill="black" 
                      />
                      <text 
                        x={getXPosition(d.day - 1)} 
                        y={getYPosition(d.shift2PcsJam) - 8} 
                        fontSize="8" 
                        textAnchor="middle"
                        fill="black"
                        fontWeight="bold"
                      >
                        {d.shift2PcsJam}
                      </text>
                    </g>
                  )
                )}
              </>
            )}
          </svg>

          {/* Y-axis labels */}
          <div style={{ 
            position: 'absolute', 
            left: '-50px', 
            top: '0', 
            height: '100%',
            width: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {yAxisValues.reverse().map((val) => (
              <div 
                key={val}
                style={{ 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  paddingRight: '5px',
                  backgroundColor: 'white',
                  padding: '2px'
                }}
              >
                {val}
              </div>
            ))}
          </div>

          {/* X-axis labels - tanggal di bawah chart */}
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {Array.from({ length: totalDays }, (_, i) => {
              const day = i + 1;
              const isWeekend = weekendDates.includes(day);
              const dayName = getDayName(day).substring(0, 3);
              
              return (
                <div
                  key={i}
                  style={{
                    width: `${dayWidth}px`,
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: isWeekend ? 'bold' : 'normal',
                    color: isWeekend ? 'red' : 'black',
                    transform: 'translateX(-50%)',
                    marginLeft: `${dayWidth/2}px`
                  }}
                >
                  <div style={{ fontSize: '8px' }}>{dayName}</div>
                  <div style={{ fontWeight: 'bold' }}>{day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend dan Info */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '10px', 
          marginLeft: '20px',
          marginTop: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '15px', backgroundColor: 'blue' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Shift 1</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '15px', backgroundColor: 'black' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Shift 2</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: 'red', border: '1px dashed red' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'red' }}>Target (100% & 89%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#ffcccc' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Tanggal Merah</span>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '11px',
            minWidth: '1200px'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  border: '1px solid black', 
                  padding: '4px', 
                  minWidth: '100px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white',
                  zIndex: 10
                }}>
                  <div>Hari/Tgl</div>
                  <div>{getMonthName(filters.month)} {filters.year}</div>
                </th>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const isWeekend = weekendDates.includes(day);
                  const dayName = getDayName(day);
                  
                  return (
                    <th 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        backgroundColor: isWeekend ? '#ffcccc' : 'white',
                        fontSize: '10px',
                        minWidth: '35px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ 
                        fontSize: '8px', 
                        color: isWeekend ? 'red' : 'black',
                        fontWeight: isWeekend ? 'bold' : 'normal'
                      }}>
                        {dayName.substring(0, 3)}
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '12px',
                        color: isWeekend ? 'red' : 'black'
                      }}>
                        {day}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Shift 1 (Blue) */}
              <tr>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '4px', 
                  fontWeight: 'bold', 
                  backgroundColor: 'blue', 
                  color: 'white',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  zIndex: 9
                }}>
                  Shift 1
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const pcsJam = dayData?.shift1PcsJam || 0;
                  const isAboveTarget100 = pcsJam >= data.target100;
                  const isAboveTarget89 = pcsJam >= data.target89;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                       isAboveTarget89 ? '#FFD700' : 
                                       pcsJam > 0 ? '#FFB6C1' : 
                                       isWeekend ? '#ffcccc' : 'white'
                      }}
                    >
                      {dayData?.shift1Production || ''}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '4px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white',
                  zIndex: 9
                }}>
                  Loading Time
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        textAlign: 'center',
                        backgroundColor: isWeekend ? '#ffcccc' : 'white'
                      }}
                    >
                      {dayData?.shift1LoadingTime ? Math.round(dayData.shift1LoadingTime) : ''}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '4px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white',
                  zIndex: 9
                }}>
                  Pcs/jam
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const pcsJam = dayData?.shift1PcsJam || 0;
                  const isAboveTarget100 = pcsJam >= data.target100;
                  const isAboveTarget89 = pcsJam >= data.target89;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                       isAboveTarget89 ? '#FFD700' : 
                                       pcsJam > 0 ? '#FFB6C1' : 
                                       isWeekend ? '#ffcccc' : 'white'
                      }}
                    >
                      {dayData?.shift1PcsJam || ''}
                    </td>
                  );
                })}
              </tr>

              {/* Shift 2 (Black) */}
              <tr>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '4px', 
                  fontWeight: 'bold', 
                  backgroundColor: 'black', 
                  color: 'white',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  zIndex: 9
                }}>
                  Shift 2
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const pcsJam = dayData?.shift2PcsJam || 0;
                  const isAboveTarget100 = pcsJam >= data.target100;
                  const isAboveTarget89 = pcsJam >= data.target89;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                       isAboveTarget89 ? '#FFD700' : 
                                       pcsJam > 0 ? '#FFB6C1' : 
                                       isWeekend ? '#ffcccc' : 'white'
                      }}
                    >
                      {dayData?.shift2Production || ''}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '4px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white',
                  zIndex: 9
                }}>
                  Loading Time
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        textAlign: 'center',
                        backgroundColor: isWeekend ? '#ffcccc' : 'white'
                      }}
                    >
                      {dayData?.shift2LoadingTime ? Math.round(dayData.shift2LoadingTime) : ''}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '4px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white',
                  zIndex: 9
                }}>
                  Pcs/jam
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const pcsJam = dayData?.shift2PcsJam || 0;
                  const isAboveTarget100 = pcsJam >= data.target100;
                  const isAboveTarget89 = pcsJam >= data.target89;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid black',
                        padding: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: isAboveTarget100 ? '#90EE90' : 
                                       isAboveTarget89 ? '#FFD700' : 
                                       pcsJam > 0 ? '#FFB6C1' : 
                                       isWeekend ? '#ffcccc' : 'white'
                      }}
                    >
                      {dayData?.shift2PcsJam || ''}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Color Legend dan Info */}
        <div style={{ 
          marginTop: '15px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
              Legend Warna Tabel:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#90EE90' }}></div>
                <span style={{ fontSize: '10px' }}>≥ Target 100% ({data.target100} Pcs/Jam)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#FFD700' }}></div>
                <span style={{ fontSize: '10px' }}>≥ Target 89% ({data.target89} Pcs/Jam)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#FFB6C1' }}></div>
                <span style={{ fontSize: '10px' }}>&lt; Target 89%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#ffcccc' }}></div>
                <span style={{ fontSize: '10px' }}>Tanggal Merah (Weekend/Hari Libur)</span>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '8px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '11px',
            flex: 1
          }}>
            <div><strong>Info Filter & Perhitungan:</strong></div>
            <div>• Line: {filters.line}</div>
            <div>• Product: {filters.part || 'All Products'}</div>
            <div>• Periode: {getMonthName(filters.month)} {filters.year}</div>
            <div>• Target 100% = 3600 / (Cycle Time / 10) = 3600 / ({parseFloat(data.mct || 88.4)} / 10) = {data.target100} Pcs/Jam</div>
            <div>• Target 89% = Target 100% × 0.89 = {data.target100} × 0.89 = {data.target89} Pcs/Jam</div>
            <div>• Cycle Time: {parseFloat(data.mct || 88.4)} detik per pcs</div>
            <div>• Data Source: {lineEndpoints[filters.line] || 'Unknown'}</div>
          </div>
        </div>
      </div>

      {/* CSS untuk animasi */}
      <style jsx="true">{`
        @keyframes blink {
          0% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </Layout>
  );
};

export default KanribanGrafikBawahPG21;

















import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../layout/Layout';

const KanribanGrafikBawahPG21 = () => {
  // State untuk data utama
  const [data, setData] = useState({
    productCode: '902F-F',
    line: 'LINE COMMON RAIL 12',
    mct: '88.4',
    target100: 41,
    target89: 36,
    dailyData: [],
    yMin: 30,
    yMax: 50,
    manpower: 4
  });

  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  
  // State untuk filter dan selection
  const [selectedProduct, setSelectedProduct] = useState('902F-F');
  const [weekendDates, setWeekendDates] = useState([]);
  
  // State untuk flash alert
  const [flashAlert, setFlashAlert] = useState({
    show: false,
    message: '',
    type: 'error' // 'error', 'warning', 'success', 'info'
  });
  
  // State untuk filter
  const [filters, setFilters] = useState({
    line: 'LINE COMMON RAIL 12',
    part: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  
  // State untuk opsi filter
  const [availableLines] = useState([
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

  // Ref untuk kontrol fetch
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Mapping endpoint API dengan fallback
  const getEndpointForLine = (line) => {
    const endpoints = {
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
    
    return endpoints[line] || endpoints['LINE COMMON RAIL 12'];
  };

  // ===================== UTILITY FUNCTIONS =====================

  // Fungsi untuk menampilkan flash alert
  const showFlashAlert = useCallback((message, type = 'error', duration = 5000) => {
    if (!isMountedRef.current) return;
    
    // Clear any existing timeout
    if (flashAlert.timeoutId) {
      clearTimeout(flashAlert.timeoutId);
    }
    
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        setFlashAlert(prev => ({ ...prev, show: false }));
      }
    }, duration);
    
    setFlashAlert({
      show: true,
      message,
      type,
      timeoutId
    });
  }, []);

  // Fungsi untuk mendapatkan nama bulan
  const getMonthName = useCallback((month) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || '';
  }, []);

  // Fungsi untuk mendapatkan nama hari
  const getDayName = useCallback((day, year, month) => {
    const date = new Date(year, month - 1, day);
    const dayIndex = date.getDay();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex];
  }, []);

  // Fungsi untuk menghitung tanggal weekend
  const calculateWeekendDates = useCallback((year, month) => {
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
  }, []);

  // Fungsi untuk menangani ketika tidak ada data
  const handleNoData = useCallback((currentFilters) => {
    const { year, month } = currentFilters;
    const daysInMonth = new Date(year, month, 0).getDate();
    const weekendDates = calculateWeekendDates(year, month);
    setWeekendDates(weekendDates);
    
    setData(prev => ({
      ...prev,
      productCode: currentFilters.part || prev.productCode,
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
  }, [calculateWeekendDates]);

  // Fungsi untuk setup data default ketika gagal load
  const setupDefaultData = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Set default years
    setAvailableYears([currentYear - 1, currentYear, currentYear + 1]);
    
    // Set default products
    setAvailableProducts(['902F-F', '902F-G', '902F-H']);
    
    // Calculate weekend dates
    const weekendDates = calculateWeekendDates(currentYear, currentMonth);
    setWeekendDates(weekendDates);
    
    // Create empty data structure
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const defaultData = {
      productCode: '902F-F',
      line: 'LINE COMMON RAIL 12',
      mct: '88.4',
      target100: 41,
      target89: 36,
      yMin: 30,
      yMax: 50,
      manpower: 4,
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
    };
    
    setData(defaultData);
    
    setFilters({
      line: 'LINE COMMON RAIL 12',
      part: '',
      year: currentYear,
      month: currentMonth
    });
    
    return defaultData;
  }, [calculateWeekendDates]);

  // ===================== DATA PROCESSING FUNCTIONS =====================

  // Fungsi untuk ekstrak opsi filter dari data
  const extractFilterOptions = useCallback((apiData) => {
    if (!apiData || apiData.length === 0) {
      setupDefaultData();
      return;
    }
    
    try {
      // Ekstrak produk unik
      const products = [...new Set(apiData
        .map(item => item.name_product || item.product_name || '')
        .filter(product => product && product.trim() !== '')
      )].sort();
      
      if (products.length > 0) {
        setAvailableProducts(products);
      }
      
      // Ekstrak tahun unik
      const yearsSet = new Set();
      apiData.forEach(item => {
        if (item.year) {
          yearsSet.add(parseInt(item.year));
        }
        if (item.created_at) {
          try {
            const date = new Date(item.created_at);
            if (!isNaN(date.getTime())) {
              yearsSet.add(date.getFullYear());
            }
          } catch (e) {
            console.warn('Invalid date format:', item.created_at);
          }
        }
      });
      
      const years = Array.from(yearsSet)
        .filter(year => !isNaN(year) && year > 2000 && year < 2100)
        .sort((a, b) => b - a);
      
      // Tambahkan tahun saat ini jika tidak ada tahun
      if (years.length === 0) {
        const currentYear = new Date().getFullYear();
        years.push(currentYear - 1, currentYear, currentYear + 1);
      }
      
      setAvailableYears(years);
      
    } catch (error) {
      console.error('Error extracting filter options:', error);
      setupDefaultData();
    }
  }, [setupDefaultData]);

  // Fungsi untuk memproses data yang difilter
  const processFilteredData = useCallback((apiData, currentFilters, isInitial = false) => {
    try {
      const { part, year, month, line } = currentFilters;
      
      // Filter data berdasarkan kriteria
      const filteredData = apiData.filter(item => {
        // Filter produk
        if (part && item.name_product !== part) return false;
        
        // Filter tahun
        let itemYear;
        if (item.year) {
          itemYear = parseInt(item.year);
        } else if (item.created_at) {
          try {
            const date = new Date(item.created_at);
            itemYear = date.getFullYear();
          } catch (e) {
            return false;
          }
        }
        
        if (year && itemYear !== year) return false;
        
        // Filter bulan
        let itemMonth;
        if (item.month) {
          itemMonth = parseInt(item.month);
        } else if (item.created_at) {
          try {
            const date = new Date(item.created_at);
            itemMonth = date.getMonth() + 1;
          } catch (e) {
            return false;
          }
        }
        
        if (month && itemMonth !== month) return false;
        
        return true;
      });
      
      if (filteredData.length === 0) {
        const message = `Tidak ada data untuk ${part || 'produk terpilih'} pada ${getMonthName(month)} ${year}`;
        setError(message);
        if (!isInitial) {
          showFlashAlert(message, 'warning');
        }
        handleNoData(currentFilters);
        return;
      }
      
      // Reset error jika data ditemukan
      setError(null);
      
      // Tampilkan alert sukses (kecuali untuk initial load)
      if (!isInitial) {
        const productName = part || filteredData[0].name_product || 'Semua Produk';
        showFlashAlert(`Data berhasil ditampilkan: ${productName} - ${getMonthName(month)} ${year}`, 'success', 3000);
      }
      
      // Hitung weekend dates
      const weekendDates = calculateWeekendDates(year, month);
      setWeekendDates(weekendDates);
      
      // Hitung target berdasarkan cycle_time
      const calculateTarget100 = (cycleTime) => {
        const cycleTimeValue = parseFloat(cycleTime) || 88.4;
        const target = 3600 / (cycleTimeValue / 10);
        return Math.round(target * 10) / 10;
      };
      
      const calculateTarget89 = (target100) => {
        return Math.round((target100 * 0.89) * 10) / 10;
      };
      
      const firstItem = filteredData[0];
      const target100 = calculateTarget100(firstItem.cycle_time || firstItem.setup_ct || 88.4);
      const target89 = calculateTarget89(target100);
      
      // Group by day dengan logika shift yang benar
      const dailyStats = {};
      const daysInMonth = new Date(year, month, 0).getDate();
      
      filteredData.forEach(item => {
        let day;
        const createdAt = item.created_at;
        
        if (!createdAt) return;
        
        try {
          const datePart = createdAt.split(' ')[0];
          const timePart = createdAt.split(' ')[1] || '00:00:00';
          const [itemYear, itemMonth, dayOfMonth] = datePart.split('-').map(Number);
          const [hours, minutes] = timePart.split(':').map(Number);
          
          const shift = item.shift || 'Shift 1';
          
          // Logika penentuan shift berdasarkan waktu
          const totalMinutes = (hours || 0) * 60 + (minutes || 0);
          const shift1Start = 7 * 60 + 10; // 07:10
          const shift1End = 19 * 60 + 50;  // 19:50
          const shift2Start = 19 * 60 + 50; // 19:50
          const shift2End = 7 * 60 + 10;   // 07:10 next day
          
          if (shift === 'Shift 1') {
            if (totalMinutes >= shift1Start && totalMinutes <= shift1End) {
              day = dayOfMonth;
            } else if (totalMinutes < shift1Start) {
              day = dayOfMonth;
            } else {
              day = dayOfMonth;
            }
          } else if (shift === 'Shift 2') {
            if (totalMinutes >= shift2Start || totalMinutes <= shift2End) {
              // Jika waktu setelah 19:50 atau sebelum 07:10, tetap hari yang sama
              // kecuali jika sebelum 07:10, maka sebenarnya shift malam dari hari sebelumnya
              if (totalMinutes <= shift2End) {
                day = dayOfMonth - 1;
                if (day < 1) day = daysInMonth;
              } else {
                day = dayOfMonth;
              }
            } else {
              day = dayOfMonth;
            }
          } else {
            day = dayOfMonth;
          }
          
          if (day < 1) day = 1;
          if (day > daysInMonth) day = daysInMonth;
          
          if (!dailyStats[day]) {
            dailyStats[day] = {
              shift1: { 
                production: 0, 
                loadingTime: 0, 
                pcsJam: 0, 
                hasData: false,
                items: [],
                count: 0
              },
              shift2: { 
                production: 0, 
                loadingTime: 0, 
                pcsJam: 0, 
                hasData: false,
                items: [],
                count: 0
              }
            };
          }
          
          const shiftKey = shift === 'Shift 1' ? 'shift1' : 'shift2';
          const production = parseInt(item.actual) || 0;
          
          let loadingTime = 0;
          if (item.loading_time_server) {
            const loadingTimeStr = item.loading_time_server.toString().replace(' menit', '').trim();
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
          dailyStats[day][shiftKey].count++;
          
        } catch (error) {
          console.warn('Error processing item:', item, error);
        }
      });
      
      // Hitung total per shift
      Object.keys(dailyStats).forEach(day => {
        ['shift1', 'shift2'].forEach(shiftKey => {
          const shiftData = dailyStats[day][shiftKey];
          
          if (shiftData.items.length > 0) {
            // Hitung total production
            shiftData.production = shiftData.items.reduce((sum, item) => sum + item.production, 0);
            
            // Hitung average loading time
            const totalLoadingTime = shiftData.items.reduce((sum, item) => sum + item.loadingTime, 0);
            shiftData.loadingTime = shiftData.items.length > 0 ? totalLoadingTime / shiftData.items.length : 0;
            
            // Hitung Pcs/Jam: Production / (Loading Time dalam jam)
            if (shiftData.loadingTime > 0) {
              shiftData.pcsJam = shiftData.production / (shiftData.loadingTime / 60);
            } else if (shiftData.production > 0) {
              // Jika loading time 0 atau tidak ada, estimasi berdasarkan 12 jam shift
              shiftData.pcsJam = shiftData.production / 12;
            } else {
              shiftData.pcsJam = 0;
            }
          }
        });
      });
      
      // Convert ke array format
      const dailyDataArray = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dayData = dailyStats[day];
        if (dayData) {
          dailyDataArray.push({
            day: day,
            shift1Production: dayData.shift1.production || 0,
            shift1LoadingTime: Math.round(dayData.shift1.loadingTime * 10) / 10,
            shift1PcsJam: Math.round(dayData.shift1.pcsJam * 10) / 10,
            shift2Production: dayData.shift2.production || 0,
            shift2LoadingTime: Math.round(dayData.shift2.loadingTime * 10) / 10,
            shift2PcsJam: Math.round(dayData.shift2.pcsJam * 10) / 10,
            dangae: '',
            isWeekend: weekendDates.includes(day),
            hasData: dayData.shift1.hasData || dayData.shift2.hasData
          });
        } else {
          dailyDataArray.push({
            day: day,
            shift1Production: '',
            shift1LoadingTime: '',
            shift1PcsJam: '',
            shift2Production: '',
            shift2LoadingTime: '',
            shift2PcsJam: '',
            dangae: '',
            isWeekend: weekendDates.includes(day),
            hasData: false
          });
        }
      }
      
      // Hitung min dan max untuk y-axis
      const allPcsJamValues = dailyDataArray
        .flatMap(d => [d.shift1PcsJam, d.shift2PcsJam])
        .filter(v => v > 0);
      
      let minPcsJam = 30;
      let maxPcsJam = 50;
      
      if (allPcsJamValues.length > 0) {
        minPcsJam = Math.min(...allPcsJamValues);
        maxPcsJam = Math.max(...allPcsJamValues);
      }
      
      // Pastikan target masuk dalam range
      const minValue = Math.min(minPcsJam, target89, target100);
      const maxValue = Math.max(maxPcsJam, target89, target100);
      
      const yMin = Math.max(0, Math.floor(minValue / 5) * 5 - 5);
      const yMax = Math.ceil(maxValue / 5) * 5 + 5;
      
      // Update state
      setSelectedProduct(part);
      setData(prev => ({
        ...prev,
        productCode: part || firstItem.name_product || prev.productCode,
        line: firstItem.line_name || line || prev.line,
        mct: firstItem.setup_ct || firstItem.cycle_time || prev.mct,
        target100: target100,
        target89: target89,
        yMin: yMin,
        yMax: yMax,
        dailyData: dailyDataArray
      }));
      
    } catch (error) {
      console.error('Error processing filtered data:', error);
      const message = 'Terjadi kesalahan saat memproses data';
      setError(message);
      showFlashAlert(message, 'error');
      handleNoData(currentFilters);
    }
  }, [calculateWeekendDates, getMonthName, handleNoData, showFlashAlert]);

  // ===================== DATA FETCHING FUNCTIONS =====================

  // Fungsi untuk fetch data dengan error handling
  const fetchData = useCallback(async (line, filtersToUse = filters) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check network status
      if (!navigator.onLine) {
        setIsOnline(false);
        throw new Error('Tidak ada koneksi internet. Periksa jaringan Anda.');
      }
      setIsOnline(true);
      
      const endpoint = getEndpointForLine(line);
      console.log(`Fetching data from: ${endpoint}`);
      
      // Tambahkan timestamp untuk menghindari cache
      const urlWithCacheBuster = `${endpoint}?_=${Date.now()}`;
      
      // Set timeout untuk fetch
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout. Server tidak merespons.')), 15000)
      );
      
      const fetchPromise = fetch(urlWithCacheBuster, {
        signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        // Ekstrak informasi unik untuk filter
        extractFilterOptions(result.data);
        
        // Proses data dengan filter
        processFilteredData(result.data, filtersToUse, initialLoading);
        
        if (initialLoading) {
          setInitialLoading(false);
        }
        
        setRetryCount(0); // Reset retry count on success
      } else {
        const message = `Tidak ada data yang tersedia untuk ${line}`;
        setError(message);
        showFlashAlert(message, 'warning');
        handleNoData(filtersToUse);
        
        if (initialLoading) {
          setupDefaultData();
          setInitialLoading(false);
        }
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      
      console.error('Error fetching data:', error);
      
      // Determine error message
      let errorMessage = 'Gagal mengambil data dari server';
      if (error.message.includes('timeout')) {
        errorMessage = 'Server tidak merespons. Coba lagi nanti.';
      } else if (error.message.includes('network') || error.message.includes('internet')) {
        errorMessage = 'Koneksi jaringan bermasalah. Periksa koneksi internet Anda.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server. Server mungkin sedang offline.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      showFlashAlert(errorMessage, 'error');
      
      // Jika ini initial loading dan gagal, setup data default
      if (initialLoading) {
        setupDefaultData();
        setInitialLoading(false);
        
        // Coba retry setelah 5 detik (maksimal 3 kali)
        if (retryCount < 3) {
          setTimeout(() => {
            if (isMountedRef.current) {
              setRetryCount(prev => prev + 1);
              fetchData(line, filtersToUse);
            }
          }, 5000);
        }
      } else {
        handleNoData(filtersToUse);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [filters, initialLoading, retryCount, extractFilterOptions, processFilteredData, handleNoData, setupDefaultData, showFlashAlert]);

  // ===================== EVENT HANDLERS =====================

  // Handler untuk perubahan filter
  const handleFilterChange = useCallback(async (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Jika mengubah line, perlu fetch data baru dari endpoint yang berbeda
    if (filterType === 'line') {
      await fetchData(value, newFilters);
    } else {
      // Untuk filter lain, coba ambil data dari endpoint yang sama dan filter client-side
      // atau bisa juga fetch ulang dengan filter baru
      try {
        const endpoint = getEndpointForLine(newFilters.line);
        const response = await fetch(endpoint);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          processFilteredData(result.data, newFilters, false);
        }
      } catch (error) {
        console.error('Error applying filter:', error);
        showFlashAlert('Gagal menerapkan filter', 'error');
      }
    }
  }, [filters, fetchData, processFilteredData, showFlashAlert]);

  // Fungsi untuk reset filter
  const handleResetFilters = useCallback(() => {
    const newFilters = {
      line: 'LINE COMMON RAIL 12',
      part: '',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    };
    
    setFilters(newFilters);
    fetchData('LINE COMMON RAIL 12', newFilters);
    showFlashAlert('Filter telah direset ke default', 'info', 3000);
  }, [fetchData, showFlashAlert]);

  // Fungsi untuk refresh data
  const handleRefreshData = useCallback(() => {
    showFlashAlert('Memperbarui data...', 'info', 2000);
    fetchData(filters.line, filters);
  }, [filters, fetchData, showFlashAlert]);

  // ===================== CHART RENDERING FUNCTIONS =====================

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
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((value - minY) / range) * chartHeight;
  };

  const generateYAxisValues = () => {
    const minY = data.yMin || 30;
    const maxY = data.yMax || 50;
    const range = maxY - minY;
    
    if (range <= 0) return [minY, maxY];
    
    const step = Math.ceil(range / 4);
    const values = [];
    
    for (let i = minY; i <= maxY; i += step) {
      values.push(Math.round(i));
    }
    
    // Pastikan target lines ada dalam values
    if (!values.includes(Math.round(data.target100))) {
      values.push(Math.round(data.target100));
    }
    if (!values.includes(Math.round(data.target89))) {
      values.push(Math.round(data.target89));
    }
    
    // Hapus duplikat dan sort
    return [...new Set(values)].sort((a, b) => a - b);
  };

  // ===================== USE EFFECT HOOKS =====================

  // Initialize data on component mount
  useEffect(() => {
    isMountedRef.current = true;
    
    const initializeData = async () => {
      try {
        await fetchData('LINE COMMON RAIL 12');
      } catch (error) {
        console.error('Initialization error:', error);
        setupDefaultData();
        setInitialLoading(false);
      }
    };
    
    initializeData();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clear flash alert timeout
      if (flashAlert.timeoutId) {
        clearTimeout(flashAlert.timeoutId);
      }
    };
  }, []);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isMountedRef.current) return;
      showFlashAlert('Koneksi internet telah pulih', 'success', 3000);
      
      // Auto refresh data when coming back online
      if (error && error.includes('internet') || error.includes('jaringan')) {
        setTimeout(() => {
          if (isMountedRef.current) {
            handleRefreshData();
          }
        }, 2000);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (!isMountedRef.current) return;
      showFlashAlert('Anda sedang offline. Beberapa fitur mungkin tidak tersedia.', 'warning', 5000);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, handleRefreshData, showFlashAlert]);

  // ===================== RENDER COMPONENT =====================

  // Loading state
  if (loading && initialLoading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#2c3e50'
          }}>
            Memuat Data Produksi...
          </div>
          
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          
          <div style={{
            fontSize: '16px',
            color: '#7f8c8d',
            marginBottom: '10px'
          }}>
            Menghubungkan ke server...
          </div>
          
          {retryCount > 0 && (
            <div style={{
              fontSize: '14px',
              color: '#e74c3c',
              marginTop: '10px'
            }}>
              Percobaan ke-{retryCount + 1} dari 3...
            </div>
          )}
          
          <style jsx="true">{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
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
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Flash Alert Section */}
        {flashAlert.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '15px 25px',
            backgroundColor: 
              flashAlert.type === 'error' ? '#f8d7da' : 
              flashAlert.type === 'warning' ? '#fff3cd' : 
              flashAlert.type === 'success' ? '#d4edda' : 
              '#d1ecf1',
            color: 
              flashAlert.type === 'error' ? '#721c24' : 
              flashAlert.type === 'warning' ? '#856404' : 
              flashAlert.type === 'success' ? '#155724' : 
              '#0c5460',
            border: `2px solid ${
              flashAlert.type === 'error' ? '#f5c6cb' : 
              flashAlert.type === 'warning' ? '#ffeaa7' : 
              flashAlert.type === 'success' ? '#c3e6cb' : 
              '#bee5eb'
            }`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 'bold',
            fontSize: '16px',
            animation: 'fadeIn 0.5s, slideDown 0.5s',
            minWidth: '300px',
            maxWidth: '600px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backdropFilter: 'blur(5px)'
          }}>
            {flashAlert.type === 'error' ? '❌' : 
             flashAlert.type === 'warning' ? '⚠️' : 
             flashAlert.type === 'success' ? '✅' : 'ℹ️'}
            <span>{flashAlert.message}</span>
          </div>
        )}

        {/* Network Status Indicator */}
        {!isOnline && (
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9998,
            padding: '8px 15px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#ffc107',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite'
            }}></div>
            OFFLINE
          </div>
        )}

        {/* Error Message */}
        {error && !flashAlert.show && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>⚠️</div>
              <div>
                <strong>Error:</strong> {error}
                {retryCount > 0 && (
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    Percobaan koneksi: {retryCount}/3
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleRefreshData}
              style={{
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Filter Section */}
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
              📊 Filter Data Produksi
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleRefreshData}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: loading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Loading...
                  </>
                ) : (
                  <>
                    🔄 Refresh
                  </>
                )}
              </button>
              
              <button
                onClick={handleResetFilters}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🔁 Reset
              </button>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '15px'
          }}>
            {/* Line Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                🏭 Line Produksi
              </label>
              <select
                value={filters.line}
                onChange={(e) => handleFilterChange('line', e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: loading ? '#e9ecef' : 'white',
                  cursor: loading ? 'not-allowed' : 'pointer'
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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                📦 Produk / Part
              </label>
              <select
                value={filters.part}
                onChange={(e) => handleFilterChange('part', e.target.value)}
                disabled={loading || availableProducts.length === 0}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: (loading || availableProducts.length === 0) ? '#e9ecef' : 'white',
                  cursor: (loading || availableProducts.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">Semua Produk</option>
                {availableProducts.map(product => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
              {availableProducts.length === 0 && (
                <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '3px' }}>
                  Tidak ada produk tersedia
                </div>
              )}
            </div>
            
            {/* Year Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                📅 Tahun
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: loading ? '#e9ecef' : 'white',
                  cursor: loading ? 'not-allowed' : 'pointer'
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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                🗓️ Bulan
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: loading ? '#e9ecef' : 'white',
                  cursor: loading ? 'not-allowed' : 'pointer'
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
            alignItems: 'center',
            paddingTop: '10px',
            borderTop: '1px solid #dee2e6'
          }}>
            <div style={{ fontSize: '14px', color: '#495057' }}>
              <strong>Filter Aktif:</strong> {filters.line} • {filters.part || 'Semua Produk'} • {getMonthName(filters.month)} {filters.year}
            </div>
            
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Total Data: {data.dailyData.filter(d => d.hasData).length} hari
            </div>
          </div>
        </div>

        {/* Header Info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #bbdefb',
          borderRadius: '8px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1565c0' }}>
              Target Produksi:
            </div>
            <div style={{ fontSize: '16px', marginTop: '5px' }}>
              <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>100%:</span> {data.target100} Pcs/Jam
            </div>
            <div style={{ fontSize: '16px', marginTop: '3px' }}>
              <span style={{ color: '#f57c00', fontWeight: 'bold' }}>89%:</span> {data.target89} Pcs/Jam
            </div>
          </div>
          
          <div style={{ flex: 2, textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
              {data.line}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '5px', color: '#1a237e' }}>
              📈 GRAFIK PRODUKSI Pcs/Jam
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px', color: '#0d47a1' }}>
              {data.productCode}
            </div>
            <div style={{ fontSize: '14px', marginTop: '5px', color: '#546e7a' }}>
              Periode: {getMonthName(filters.month)} {filters.year} • Cycle Time: {parseFloat(data.mct || 88.4)}s
            </div>
          </div>
          
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1565c0' }}>
              Informasi Chart:
            </div>
            <div style={{ fontSize: '16px', marginTop: '5px' }}>
              Range Y-Axis: {data.yMin || 30} - {data.yMax || 50} Pcs/Jam
            </div>
            <div style={{ fontSize: '14px', marginTop: '3px', color: '#546e7a' }}>
              Manpower: {data.manpower} orang
            </div>
          </div>
        </div>

        {/* Loading indicator for data refresh */}
        {loading && !initialLoading && (
          <div style={{
            padding: '10px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d7ff',
            borderRadius: '5px',
            marginBottom: '10px',
            fontSize: '14px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #007bff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Memuat data dari {filters.line}...
          </div>
        )}

        {/* Chart Area */}
        <div style={{ 
          position: 'relative', 
          height: '240px', 
          marginBottom: '10px',
          marginLeft: '50px',
          marginRight: '20px',
          backgroundColor: '#fafafa',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
          padding: '10px 0'
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
                stroke="#E3F2FD" 
                strokeWidth="1"
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
                stroke={weekendDates.includes(idx) ? '#ffcdd2' : '#F5F5F5'} 
                strokeWidth={weekendDates.includes(idx) ? '3' : '1'}
              />
            ))}

            {/* Target line (100%) */}
            <line 
              x1="0" 
              y1={getYPosition(data.target100)} 
              x2="1200" 
              y2={getYPosition(data.target100)}
              stroke="#d32f2f" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <g>
              <rect 
                x="1180" 
                y={getYPosition(data.target100) - 10} 
                width="60" 
                height="20" 
                fill="white" 
                stroke="#d32f2f" 
                strokeWidth="1"
                rx="3"
              />
              <text 
                x="1210" 
                y={getYPosition(data.target100) + 4} 
                fontSize="11" 
                fill="#d32f2f"
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
              stroke="#f57c00" 
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <g>
              <rect 
                x="1180" 
                y={getYPosition(data.target89) - 10} 
                width="60" 
                height="20" 
                fill="white" 
                stroke="#f57c00" 
                strokeWidth="1"
                rx="3"
              />
              <text 
                x="1210" 
                y={getYPosition(data.target89) + 4} 
                fontSize="11" 
                fill="#f57c00"
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
                  stroke="#1976d2"
                  strokeWidth="3"
                />
                {data.dailyData.map((d, idx) => 
                  d.shift1PcsJam > 0 && (
                    <g key={`s1-${idx}`}>
                      <circle 
                        cx={getXPosition(d.day - 1)} 
                        cy={getYPosition(d.shift1PcsJam)} 
                        r="5" 
                        fill="#1976d2" 
                        stroke="white"
                        strokeWidth="1"
                      />
                      <text 
                        x={getXPosition(d.day - 1)} 
                        y={getYPosition(d.shift1PcsJam) - 10} 
                        fontSize="9" 
                        textAnchor="middle"
                        fill="#1976d2"
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
                  stroke="#333333"
                  strokeWidth="3"
                />
                {data.dailyData.map((d, idx) => 
                  d.shift2PcsJam > 0 && (
                    <g key={`s2-${idx}`}>
                      <circle 
                        cx={getXPosition(d.day - 1)} 
                        cy={getYPosition(d.shift2PcsJam)} 
                        r="5" 
                        fill="#333333" 
                        stroke="white"
                        strokeWidth="1"
                      />
                      <text 
                        x={getXPosition(d.day - 1)} 
                        y={getYPosition(d.shift2PcsJam) - 10} 
                        fontSize="9" 
                        textAnchor="middle"
                        fill="#333333"
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
                  padding: '2px 5px',
                  borderRight: '2px solid #1976d2',
                  color: '#1976d2'
                }}
              >
                {val}
              </div>
            ))}
          </div>

          {/* X-axis labels - tanggal di bawah chart */}
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {Array.from({ length: totalDays }, (_, i) => {
              const day = i + 1;
              const isWeekend = weekendDates.includes(day);
              const dayName = getDayName(day, filters.year, filters.month).substring(0, 3);
              
              return (
                <div
                  key={i}
                  style={{
                    width: `${dayWidth}px`,
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: isWeekend ? 'bold' : 'normal',
                    color: isWeekend ? '#d32f2f' : '#424242',
                    transform: 'translateX(-50%)',
                    marginLeft: `${dayWidth/2}px`
                  }}
                >
                  <div style={{ 
                    fontSize: '9px', 
                    color: isWeekend ? '#d32f2f' : '#757575',
                    marginBottom: '2px'
                  }}>
                    {dayName}
                  </div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '12px',
                    width: '24px',
                    height: '24px',
                    lineHeight: '24px',
                    borderRadius: '50%',
                    backgroundColor: isWeekend ? '#ffebee' : '#f5f5f5',
                    margin: '0 auto'
                  }}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '30px', 
          margin: '20px 0',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#1976d2', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1976d2' }}>Shift 1 (Pagi)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#333333', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333333' }}>Shift 2 (Malam)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: '#d32f2f', borderBottom: '2px dashed #d32f2f' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>Target 100%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: '#f57c00', borderBottom: '2px dashed #f57c00' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f57c00' }}>Target 89%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>Weekend/Libur</span>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ 
          marginTop: '30px',
          overflowX: 'auto',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '12px',
            minWidth: `${Math.max(1200, totalDays * 35 + 120)}px`
          }}>
            <thead>
              <tr>
                <th style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '8px', 
                  minWidth: '120px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#1976d2',
                  color: 'white',
                  zIndex: 20
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Hari/Tanggal</div>
                  <div style={{ fontSize: '12px', marginTop: '3px' }}>{getMonthName(filters.month)} {filters.year}</div>
                </th>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const isWeekend = weekendDates.includes(day);
                  const dayName = getDayName(day, filters.year, filters.month);
                  const dayData = data.dailyData.find(d => d.day === day);
                  const hasData = dayData?.hasData;
                  
                  return (
                    <th 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '4px',
                        backgroundColor: isWeekend ? '#ffebee' : hasData ? '#e8f5e9' : '#f5f5f5',
                        fontSize: '10px',
                        minWidth: '40px',
                        maxWidth: '40px',
                        textAlign: 'center',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        fontSize: '9px', 
                        color: isWeekend ? '#d32f2f' : hasData ? '#2e7d32' : '#757575',
                        fontWeight: isWeekend ? 'bold' : 'normal',
                        marginBottom: '2px'
                      }}>
                        {dayName.substring(0, 3)}
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '12px',
                        color: isWeekend ? '#d32f2f' : hasData ? '#1b5e20' : '#424242'
                      }}>
                        {day}
                      </div>
                      {hasData && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#4caf50',
                          borderRadius: '50%'
                        }}></div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Shift 1 Header */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '8px', 
                  fontWeight: 'bold', 
                  backgroundColor: '#1976d2', 
                  color: 'white',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  zIndex: 19,
                  fontSize: '13px'
                }}>
                  <div>SHIFT 1</div>
                  <div style={{ fontSize: '11px', marginTop: '2px' }}>(06:00 - 18:00)</div>
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const production = dayData?.shift1Production || 0;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '6px 2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: isWeekend ? '#ffebee' : '#f5f5f5',
                        color: production > 0 ? '#1976d2' : '#9e9e9e'
                      }}
                    >
                      {production > 0 ? production : '-'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Shift 1 Loading Time */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '6px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#e3f2fd',
                  fontWeight: 'bold',
                  zIndex: 19,
                  fontSize: '12px'
                }}>
                  Loading Time (menit)
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const loadingTime = dayData?.shift1LoadingTime;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '4px 2px',
                        textAlign: 'center',
                        backgroundColor: isWeekend ? '#ffebee' : '#fafafa',
                        color: loadingTime > 0 ? '#0d47a1' : '#9e9e9e',
                        fontWeight: loadingTime > 0 ? 'bold' : 'normal'
                      }}
                    >
                      {loadingTime > 0 ? Math.round(loadingTime) : '-'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Shift 1 Pcs/Jam */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '6px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#e3f2fd',
                  fontWeight: 'bold',
                  zIndex: 19,
                  fontSize: '12px'
                }}>
                  Pcs/Jam
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const pcsJam = dayData?.shift1PcsJam || 0;
                  const isAboveTarget100 = pcsJam >= data.target100;
                  const isAboveTarget89 = pcsJam >= data.target89;
                  const isWeekend = weekendDates.includes(day);
                  
                  let backgroundColor = '#ffffff';
                  let textColor = '#000000';
                  
                  if (pcsJam > 0) {
                    if (isAboveTarget100) {
                      backgroundColor = '#c8e6c9'; // Green light
                      textColor = '#1b5e20';
                    } else if (isAboveTarget89) {
                      backgroundColor = '#fff9c4'; // Yellow light
                      textColor = '#f57f17';
                    } else {
                      backgroundColor = '#ffcdd2'; // Red light
                      textColor = '#c62828';
                    }
                  } else {
                    backgroundColor = isWeekend ? '#ffebee' : '#f5f5f5';
                    textColor = '#9e9e9e';
                  }
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '6px 2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor,
                        color: textColor
                      }}
                    >
                      {pcsJam > 0 ? pcsJam : '-'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Separator Row */}
              <tr>
                <td colSpan={totalDays + 1} style={{ 
                  padding: '3px',
                  backgroundColor: '#f5f5f5'
                }}></td>
              </tr>
              
              {/* Shift 2 Header */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '8px', 
                  fontWeight: 'bold', 
                  backgroundColor: '#333333', 
                  color: 'white',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  zIndex: 19,
                  fontSize: '13px'
                }}>
                  <div>SHIFT 2</div>
                  <div style={{ fontSize: '11px', marginTop: '2px' }}>(18:00 - 06:00)</div>
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const production = dayData?.shift2Production || 0;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '6px 2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: isWeekend ? '#ffebee' : '#f5f5f5',
                        color: production > 0 ? '#333333' : '#9e9e9e'
                      }}
                    >
                      {production > 0 ? production : '-'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Shift 2 Loading Time */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '6px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  zIndex: 19,
                  fontSize: '12px'
                }}>
                  Loading Time (menit)
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const loadingTime = dayData?.shift2LoadingTime;
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '4px 2px',
                        textAlign: 'center',
                        backgroundColor: isWeekend ? '#ffebee' : '#fafafa',
                        color: loadingTime > 0 ? '#424242' : '#9e9e9e',
                        fontWeight: loadingTime > 0 ? 'bold' : 'normal'
                      }}
                    >
                      {loadingTime > 0 ? Math.round(loadingTime) : '-'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Shift 2 Pcs/Jam */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '6px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  zIndex: 19,
                  fontSize: '12px'
                }}>
                  Pcs/Jam
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const pcsJam = dayData?.shift2PcsJam || 0;
                  const isAboveTarget100 = pcsJam >= data.target100;
                  const isAboveTarget89 = pcsJam >= data.target89;
                  const isWeekend = weekendDates.includes(day);
                  
                  let backgroundColor = '#ffffff';
                  let textColor = '#000000';
                  
                  if (pcsJam > 0) {
                    if (isAboveTarget100) {
                      backgroundColor = '#c8e6c9';
                      textColor = '#1b5e20';
                    } else if (isAboveTarget89) {
                      backgroundColor = '#fff9c4';
                      textColor = '#f57f17';
                    } else {
                      backgroundColor = '#ffcdd2';
                      textColor = '#c62828';
                    }
                  } else {
                    backgroundColor = isWeekend ? '#ffebee' : '#f5f5f5';
                    textColor = '#9e9e9e';
                  }
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '6px 2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor,
                        color: textColor
                      }}
                    >
                      {pcsJam > 0 ? pcsJam : '-'}
                    </td>
                  );
                })}
              </tr>
              
              {/* Dangae Row */}
              <tr>
                <td style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '6px',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#fff3e0',
                  fontWeight: 'bold',
                  zIndex: 19,
                  fontSize: '12px'
                }}>
                  Dangae / Catatan
                </td>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = i + 1;
                  const dayData = data.dailyData.find(d => d.day === day);
                  const dangae = dayData?.dangae || '';
                  const isWeekend = weekendDates.includes(day);
                  
                  return (
                    <td 
                      key={i}
                      style={{ 
                        border: '1px solid #dee2e6',
                        padding: '4px 2px',
                        textAlign: 'center',
                        backgroundColor: isWeekend ? '#ffebee' : '#fff3e0',
                        color: '#5d4037',
                        fontSize: '10px'
                      }}
                    >
                      {dangae || '-'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary and Legend Section */}
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' }}>
              📋 Legend Warna Tabel:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#c8e6c9', border: '1px solid #a5d6a7' }}></div>
                <span style={{ fontSize: '12px' }}>≥ Target 100% ({data.target100} Pcs/Jam)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#fff9c4', border: '1px solid #fff59d' }}></div>
                <span style={{ fontSize: '12px' }}>≥ Target 89% ({data.target89} Pcs/Jam)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#ffcdd2', border: '1px solid #ef9a9a' }}></div>
                <span style={{ fontSize: '12px' }}>&lt; Target 89%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#ffebee', border: '1px solid #ffcdd2' }}></div>
                <span style={{ fontSize: '12px' }}>Weekend / Hari Libur</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9' }}></div>
                <span style={{ fontSize: '12px' }}>Ada Data Produksi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }}></div>
                <span style={{ fontSize: '12px' }}>Tidak Ada Data</span>
              </div>
            </div>
          </div>
          
          <div style={{ 
            flex: 1,
            minWidth: '300px',
            padding: '12px',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2c3e50', fontSize: '13px' }}>
              ℹ️ Informasi Sistem:
            </div>
            <div style={{ marginBottom: '4px' }}><strong>Line:</strong> {filters.line}</div>
            <div style={{ marginBottom: '4px' }}><strong>Produk:</strong> {filters.part || data.productCode || 'Semua Produk'}</div>
            <div style={{ marginBottom: '4px' }}><strong>Periode:</strong> {getMonthName(filters.month)} {filters.year}</div>
            <div style={{ marginBottom: '4px' }}><strong>Cycle Time:</strong> {parseFloat(data.mct || 88.4)} detik/pcs</div>
            <div style={{ marginBottom: '4px' }}><strong>Target 100%:</strong> 3600 / (Cycle Time / 10) = 3600 / ({parseFloat(data.mct || 88.4)} / 10) = {data.target100} Pcs/Jam</div>
            <div style={{ marginBottom: '4px' }}><strong>Target 89%:</strong> Target 100% × 0.89 = {data.target100} × 0.89 = {data.target89} Pcs/Jam</div>
            <div style={{ marginBottom: '4px' }}><strong>Total Hari:</strong> {totalDays} hari ({weekendDates.length} hari weekend)</div>
            <div style={{ marginBottom: '4px' }}><strong>Data Source:</strong> {getEndpointForLine(filters.line)}</div>
            <div style={{ marginBottom: '4px' }}><strong>Status:</strong> {isOnline ? '🟢 Online' : '🔴 Offline'}</div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#6c757d',
          borderTop: '1px solid #dee2e6'
        }}>
          <div>Kanriban Grafik Produksi PG21 • Sistem Monitoring Produksi Common Rail • v1.0</div>
          <div>© {new Date().getFullYear()} PT. xxx • Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-20px); }
          to { transform: translateX(-50%) translateY(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Custom scrollbar for table */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* Print styles */
        @media print {
          button, select, .no-print {
            display: none !important;
          }
          
          body {
            zoom: 85%;
          }
          
          table {
            break-inside: avoid;
          }
          
          .break-after {
            page-break-after: always;
          }
        }
      `}</style>
    </Layout>
  );
};

export default KanribanGrafikBawahPG21;
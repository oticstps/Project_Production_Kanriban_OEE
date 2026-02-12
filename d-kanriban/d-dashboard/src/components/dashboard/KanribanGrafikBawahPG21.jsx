import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../layout/Layout';

const KanribanGrafikBawahPG21 = () => {
  const [data, setData] = useState({
    productCode: '902F-F',
    line: 'CR12',
    target: '7%',
    targetValue: 6.07,
    monthlyData: [] // Kosongkan karena akan diisi dari API
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk flash alert
  const [flashAlert, setFlashAlert] = useState({
    show: false,
    message: '',
    type: 'error'
  });
  
  // State untuk filter
  const [filters, setFilters] = useState({
    line: 'CR12',
    part: '902F-F',
    year: 2026
  });
  
  // State untuk opsi filter
  const [availableLines, setAvailableLines] = useState([
    { value: 'CR1', label: 'COMMON RAIL 1' },
    { value: 'CR2', label: 'COMMON RAIL 2' },
    { value: 'CR3', label: 'COMMON RAIL 3' },
    { value: 'CR4', label: 'COMMON RAIL 4' },
    { value: 'CR5', label: 'COMMON RAIL 5' },
    { value: 'CR6', label: 'COMMON RAIL 6' },
    { value: 'CR7', label: 'COMMON RAIL 7' },
    { value: 'CR8', label: 'COMMON RAIL 8' },
    { value: 'CR9', label: 'COMMON RAIL 9' },
    { value: 'CR10', label: 'COMMON RAIL 10' },
    { value: 'CR11', label: 'COMMON RAIL 11' },
    { value: 'CR12', label: 'COMMON RAIL 12' }
  ]);
  
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Mapping antara line dan endpoint API
  const lineEndpoints = {
    'CR1': 'http://172.27.6.191:4000/apiCr1/cr1Stop',
    'CR2': 'http://172.27.6.191:4000/apiCr2/cr2Stop',
    'CR3': 'http://172.27.6.191:4000/apiCr3/cr3Stop',
    'CR4': 'http://172.27.6.191:4000/apiCr4/cr4Stop',
    'CR5': 'http://172.27.6.191:4000/apiCr5/cr5Stop',
    'CR6': 'http://172.27.6.191:4000/apiCr6/cr6Stop',
    'CR7': 'http://172.27.6.191:4000/apiCr7/cr7Stop',
    'CR8': 'http://172.27.6.191:4000/apiCr8/cr8Stop',
    'CR9': 'http://172.27.6.191:4000/apiCr9/cr9Stop',
    'CR10': 'http://172.27.6.191:4000/apiCr10/cr10Stop',
    'CR11': 'http://172.27.6.191:4000/apiCr11/cr11Stop',
    'CR12': 'http://172.27.6.191:4000/apiCr12/cr12Stop'
  };

  // State untuk menyimpan data mentah dari API
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch data saat filter berubah
  useEffect(() => {
    if (filters.line) {
      fetchManhourData();
    }
  }, [filters.line, filters.year]);

  // Fungsi untuk menampilkan flash alert
  const showFlashAlert = (message, type = 'error', duration = 5000) => {
    setFlashAlert({
      show: false,
      message: '',
      type: 'error'
    });
    
    setTimeout(() => {
      setFlashAlert({
        show: true,
        message,
        type
      });
      
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
      const response = await fetch('http://172.27.6.191:4000/apiCr12/cr12Stop');
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        setApiData(result.data);
        extractFilterOptions(result.data);
        
        const defaultFilters = getDefaultFilters(result.data);
        setFilters(defaultFilters);
        
        processManhourData(result.data, defaultFilters);
      } else {
        const message = 'No data available for COMMON RAIL 12';
        setError(message);
        showFlashAlert(message, 'warning');
        
        // Buat data bulanan kosong jika tidak ada data
        createEmptyMonthlyData();
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      const message = 'Failed to fetch initial data';
      setError(message);
      showFlashAlert(message, 'error');
      createEmptyMonthlyData();
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuat data bulanan kosong
  const createEmptyMonthlyData = () => {
    const monthNames = [
      'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUNI',
      'JULI', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'
    ];
    
    const emptyMonthlyData = [
      { month: 'Base', production: 10637, manHour: 72933, manHourPerPcs: 6.86 }
    ];
    
    // Tambahkan data kosong untuk setiap bulan
    for (let i = 0; i < 12; i++) {
      emptyMonthlyData.push({
        month: monthNames[i],
        production: 0,
        manHour: 0,
        manHourPerPcs: 0.00
      });
    }
    
    setData(prev => ({
      ...prev,
      monthlyData: emptyMonthlyData,
      targetValue: 6.07 // Default target value
    }));
  };

  // Fungsi untuk mengambil data Manhour berdasarkan line yang dipilih
  const fetchManhourData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = lineEndpoints[filters.line];
      if (!endpoint) {
        const message = `Endpoint not found for ${filters.line}`;
        setError(message);
        showFlashAlert(message, 'error');
        return;
      }
      
      const response = await fetch(endpoint);
      const result = await response.json();
      
      if (result.status === 'success' && result.data && result.data.length > 0) {
        setApiData(result.data);
        extractFilterOptions(result.data);
        
        // Update part filter jika produk yang dipilih tidak tersedia di data baru
        const currentProducts = [...new Set(result.data.map(item => item.name_product).filter(Boolean))];
        if (currentProducts.length > 0 && !currentProducts.includes(filters.part)) {
          setFilters(prev => ({ ...prev, part: currentProducts[0] }));
        }
        
        processManhourData(result.data, filters);
      } else {
        const message = `No manhour data available for ${filters.line}`;
        setError(message);
        showFlashAlert(message, 'warning');
        createEmptyMonthlyData();
      }
    } catch (error) {
      console.error('Error fetching manhour data:', error);
      const message = `Failed to fetch data from ${filters.line}`;
      setError(message);
      showFlashAlert(message, 'error');
      createEmptyMonthlyData();
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
    
    if (products.length > 0) {
      setAvailableProducts(products);
    }
    
    // Ekstrak tahun unik
    const years = [...new Set(apiData
      .map(item => {
        if (item.year) return parseInt(item.year);
        if (item.created_at) {
          const date = new Date(item.created_at);
          return date.getFullYear();
        }
        return null;
      })
      .filter(year => !isNaN(year) && year > 0)
    )].sort((a, b) => b - a);
    
    if (years.length > 0) {
      setAvailableYears(years);
    }
  };

  // Fungsi untuk mendapatkan filter default
  const getDefaultFilters = (apiData) => {
    if (!apiData || apiData.length === 0) {
      return {
        line: 'CR12',
        part: '902F-F',
        year: 2026
      };
    }
    
    // Hitung frekuensi produk
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
    
    // Dapatkan tahun terbaru
    let latestYear = 2026;
    apiData.forEach(item => {
      if (item.year) {
        const year = parseInt(item.year);
        if (year > latestYear) latestYear = year;
      } else if (item.created_at) {
        const date = new Date(item.created_at);
        const year = date.getFullYear();
        if (year > latestYear) latestYear = year;
      }
    });
    
    return {
      line: 'CR12',
      part: dominantProduct || '902F-F',
      year: latestYear
    };
  };

  // Fungsi untuk memproses data Manhour - FOKUS PADA manhour_man_minutes_per_pcs
  const processManhourData = (apiData, currentFilters) => {
    const { part, year } = currentFilters;
    
    // 1. Filter data berdasarkan kriteria
    const filteredData = apiData.filter(item => {
      // Filter produk
      if (part && item.name_product !== part) return false;
      
      // Filter tahun
      let itemYear;
      if (item.year) {
        itemYear = parseInt(item.year);
      } else if (item.created_at) {
        const date = new Date(item.created_at);
        itemYear = date.getFullYear();
      }
      
      if (year && itemYear !== year) return false;
      
      return true;
    });
    
    if (filteredData.length === 0) {
      const message = `No manhour data available for ${part} in ${year}`;
      setError(message);
      showFlashAlert(message, 'warning');
      createEmptyMonthlyData();
      return;
    }
    
    // Reset error jika data ditemukan
    setError(null);
    showFlashAlert(`Manhour data loaded: ${part} - ${year}`, 'success', 3000);
    
    // 2. Kelompokkan data per bulan - gunakan field month dari API
    const monthlyStats = {};
    
    filteredData.forEach(item => {
      let month;
      
      // Gunakan field month langsung dari API jika ada
      if (item.month) {
        month = parseInt(item.month);
      } else if (item.created_at) {
        const date = new Date(item.created_at);
        month = date.getMonth() + 1;
      } else {
        return;
      }
      
      // Inisialisasi data untuk bulan ini jika belum ada
      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          production: 0,
          totalManMinutes: 0,
          totalActual: 0,
          manHourPerPcsValues: [],
          count: 0
        };
      }
      
      // Ambil data produksi (actual)
      const actual = parseInt(item.actual) || 0;
      const manMinutesPerPcs = parseFloat(item.manhour_man_minutes_per_pcs) || 0;
      
      // Hitung total man minutes untuk bulan ini
      const manMinutesForThisRecord = actual * manMinutesPerPcs;
      
      // Akumulasi data
      monthlyStats[month].production += actual;
      monthlyStats[month].totalManMinutes += manMinutesForThisRecord;
      monthlyStats[month].totalActual += actual;
      monthlyStats[month].manHourPerPcsValues.push(manMinutesPerPcs);
      monthlyStats[month].count += 1;
    });
    
    // 3. Buat array data bulanan
    const monthNames = [
      'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUNI',
      'JULI', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'
    ];
    
    // Data Base tetap ada sebagai referensi
    const monthlyDataArray = [
      { month: 'Base', production: 10637, manHour: 72933, manHourPerPcs: 6.86 }
    ];
    
    // Tambahkan data untuk setiap bulan berdasarkan data API
    for (let i = 1; i <= 12; i++) {
      const monthData = monthlyStats[i];
      const monthName = monthNames[i - 1];
      
      if (monthData && monthData.production > 0 && monthData.totalActual > 0) {
        // Hitung Man Hour per Pcs untuk bulan ini
        const manHourPerPcs = monthData.totalManMinutes / monthData.totalActual;
        
        monthlyDataArray.push({
          month: monthName,
          production: monthData.production,
          manHour: monthData.totalManMinutes,
          manHourPerPcs: parseFloat(manHourPerPcs.toFixed(2))
        });
      } else {
        // Jika tidak ada data, tambahkan entri kosong
        monthlyDataArray.push({
          month: monthName,
          production: 0,
          manHour: 0,
          manHourPerPcs: 0.00
        });
      }
    }
    
    // 4. Hitung target value (7% turun dari Base)
    const baseManHourPerPcs = monthlyDataArray[0].manHourPerPcs;
    const targetValue = parseFloat((baseManHourPerPcs * 0.93).toFixed(2));
    
    // 5. Update state
    setData(prev => ({
      ...prev,
      productCode: part,
      line: filters.line,
      targetValue: targetValue,
      monthlyData: monthlyDataArray
    }));
    
    // Debug log
    // console.log('Processed monthly data from API:', monthlyDataArray);
    // console.log('Target value:', targetValue);
    // console.log('Data points found:', filteredData.length);
  };

  // Handler untuk perubahan filter
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Jika mengubah part, proses ulang data yang sudah ada
    if (filterType === 'part' && apiData.length > 0) {
      processManhourData(apiData, newFilters);
    }
  };

  // Fungsi untuk refresh data
  const handleRefreshData = () => {
    fetchManhourData();
  };

  // Fungsi untuk reset filter
  const handleResetFilters = () => {
    const defaultFilters = {
      line: 'CR12',
      part: availableProducts[0] || '902F-F',
      year: availableYears[0] || 2026
    };
    
    setFilters(defaultFilters);
    fetchManhourData();
  };

  // Komponen Chart yang dinamis
  const DynamicChart = useMemo(() => {
    const chartWidth = 1200;
    const chartHeight = 300;
    
    // Pastikan data.monthlyData ada dan memiliki data
    if (!data.monthlyData || data.monthlyData.length === 0) {
      return (
        <div style={{ 
          position: 'relative', 
          height: '300px', 
          marginBottom: '20px', 
          marginLeft: '17%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '16px', color: '#666' }}>
            No data available for chart. Please select filters.
          </div>
        </div>
      );
    }
    
    const totalMonths = data.monthlyData.length;
    const monthWidth = chartWidth / totalMonths;
    
    // 1. Kumpulkan semua nilai yang valid untuk menentukan range
    const allDataPoints = data.monthlyData
      .filter(d => d.manHourPerPcs > 0)
      .map(d => d.manHourPerPcs);
    
    // Tambahkan Base dan targetValue untuk perhitungan range
    const baseValue = data.monthlyData[0]?.manHourPerPcs || 6.86;
    const targetValue = data.targetValue;
    
    const allValues = [...allDataPoints, baseValue, targetValue].filter(v => v > 0);
    
    if (allValues.length === 0) {
      return (
        <div style={{ 
          position: 'relative', 
          height: '300px', 
          marginBottom: '20px', 
          marginLeft: '17%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '16px', color: '#666' }}>
            No valid data points for chart
          </div>
        </div>
      );
    }
    
    // 2. Hitung min dan max dengan margin
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    // Tambahkan margin 10% di atas dan bawah untuk tampilan yang lebih baik
    const margin = (maxValue - minValue) * 0.1;
    const chartMinY = Math.max(0.1, minValue - margin); // Minimal 0.1 untuk mencegah 0
    const chartMaxY = maxValue + margin;
    
    // 3. Fungsi untuk menghitung posisi Y (dinamis)
    const getYPosition = (value) => {
      const yRange = chartMaxY - chartMinY;
      if (yRange === 0) return chartHeight / 2;
      
      // Normalisasi: (value - chartMinY) / yRange
      // Kemudian dibalik karena SVG y=0 di atas
      const normalized = (value - chartMinY) / yRange;
      return chartHeight - (normalized * chartHeight);
    };
    
    // 4. Fungsi untuk menghitung posisi X
    const getXPosition = (monthIndex) => {
      return (monthIndex + 0.5) * monthWidth;
    };
    
    // 5. Data points untuk chart (filter hanya yang ada data)
    const chartPoints = data.monthlyData
      .map((d, index) => ({ monthIndex: index, y: d.manHourPerPcs }))
      .filter(point => point.y > 0 || point.monthIndex === 0); // Sertakan Base
    
    // 6. Konversi ke koordinat SVG
    const svgPoints = chartPoints.map(point => ({
      x: getXPosition(point.monthIndex),
      y: getYPosition(point.y)
    }));
    
    // 7. Buat string untuk polyline
    const polylinePoints = svgPoints.map(point => `${point.x},${point.y}`).join(' ');
    
    // 8. Generate grid lines yang dinamis
    const generateGridLines = () => {
      const lines = [];
      const yLabels = [];
      
      // Tentukan interval yang baik berdasarkan range
      const range = chartMaxY - chartMinY;
      let interval;
      
      if (range <= 1) interval = 0.1;
      else if (range <= 2) interval = 0.2;
      else if (range <= 5) interval = 0.5;
      else if (range <= 10) interval = 1;
      else interval = 2;
      
      // Mulai dari nilai terdekat dengan interval
      let startValue = Math.ceil(chartMinY / interval) * interval;
      
      for (let value = startValue; value <= chartMaxY; value += interval) {
        const yPos = getYPosition(value);
        lines.push(
          <line 
            key={`grid-${value}`}
            x1="0" 
            y1={yPos} 
            x2="1200" 
            y2={yPos}
            stroke="#E8F4FD" 
            strokeWidth="1"
          />
        );
        
        yLabels.push({
          value: parseFloat(value.toFixed(2)),
          yPos
        });
      }
      
      return { lines, yLabels };
    };
    
    const { lines: gridLines, yLabels } = generateGridLines();
    
    return (
      <div style={{ position: 'relative', height: '300px', marginBottom: '20px', marginLeft: '17%' }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 300" preserveAspectRatio="none">
          {/* Background */}
          <rect x="0" y="0" width="1200" height="300" fill="white" />
          
          {/* Grid lines */}
          {gridLines}
          
          {/* Vertical grid lines */}
          {data.monthlyData.map((_, idx) => (
            <line 
              key={`v-${idx}`}
              x1={idx * monthWidth} 
              y1="0" 
              x2={idx * monthWidth} 
              y2="300"
              stroke="#F0F8FF" 
              strokeWidth="1"
            />
          ))}
          
          {/* Horizontal axis line */}
          <line 
            x1="0" 
            y1="300" 
            x2="1200" 
            y2="300"
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Vertical axis line */}
          <line 
            x1="0" 
            y1="0" 
            x2="0" 
            y2="300"
            stroke="#333" 
            strokeWidth="2"
          />

          {/* Target line (dashed red) */}
          <line 
            x1="0" 
            y1={getYPosition(data.targetValue)} 
            x2="1200" 
            y2={getYPosition(data.targetValue)}
            stroke="red" 
            strokeWidth="3"
            strokeDasharray="15,10"
          />
          
          {/* Target line label */}
          <text
            x="10"
            y={getYPosition(data.targetValue) - 10}
            fill="red"
            fontSize="12"
            fontWeight="bold"
          >
            Target: {data.targetValue.toFixed(2)}
          </text>
          
          {/* Arrow at end of target line */}
          <polygon
            points="1200,0 1180,0 1180,0"
            fill="red"
            transform={`translate(0, ${getYPosition(data.targetValue)})`}
          />

          {/* Actual performance line (blue) */}
          {svgPoints.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="blue"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points (blue circles) */}
          {svgPoints.map((point, index) => {
            const monthData = data.monthlyData[chartPoints[index].monthIndex];
            return (
              <g key={index}>
                <circle 
                  cx={point.x} 
                  cy={point.y} 
                  r="6" 
                  fill="blue" 
                  stroke="white" 
                  strokeWidth="2"
                />
                {/* Tooltip - hanya tampilkan jika ada data */}
                {monthData?.manHourPerPcs > 0 && (
                  <>
                    <rect
                      x={point.x - 40}
                      y={point.y - 40}
                      width="80"
                      height="30"
                      fill="white"
                      stroke="#ccc"
                      strokeWidth="1"
                      rx="4"
                      opacity="0"
                    />
                    <text
                      x={point.x}
                      y={point.y - 20}
                      textAnchor="middle"
                      fill="#333"
                      fontSize="10"
                      fontWeight="bold"
                      opacity="0"
                    >
                      {monthData?.month}: {monthData?.manHourPerPcs.toFixed(2)}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          
          {/* Base point (special styling) */}
          {data.monthlyData[0]?.manHourPerPcs > 0 && (
            <g>
              <circle 
                cx={getXPosition(0)} 
                cy={getYPosition(data.monthlyData[0].manHourPerPcs)} 
                r="8" 
                fill="green" 
                stroke="white" 
                strokeWidth="2"
              />
              <text
                x={getXPosition(0)}
                y={getYPosition(data.monthlyData[0].manHourPerPcs) - 15}
                textAnchor="middle"
                fill="green"
                fontSize="12"
                fontWeight="bold"
              >
                Base: {data.monthlyData[0].manHourPerPcs.toFixed(2)}
              </text>
            </g>
          )}
        </svg>

        {/* Y-axis labels (dinamis) */}
        <div style={{ position: 'absolute', left: '-60px', top: '0', height: '100%' }}>
          {yLabels.map((label, idx) => (
            <div 
              key={idx}
              style={{ 
                position: 'absolute',
                top: `${label.yPos}px`,
                transform: 'translateY(-50%)',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#333',
                width: '50px',
                textAlign: 'right',
                paddingRight: '10px'
              }}
            >
              {label.value.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Y-axis title */}
        <div style={{ 
          position: 'absolute', 
          left: '-120px', 
          top: '40%',
          transform: 'rotate(-90deg)',
          fontSize: '14px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          color: '#333'
        }}>
          Man Hour (man minute/pcs)
        </div>

        {/* X-axis labels (Month labels) */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-35px', 
          left: '0', 
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          {data.monthlyData.map((month, idx) => (
            <div 
              key={idx}
              style={{ 
                width: `${monthWidth}px`,
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: month.manHourPerPcs > 0 ? '#333' : '#999',
                transform: idx === 0 ? 'translateX(25px)' : 'none'
              }}
            >
              <div>{month.month}</div>
              {month.manHourPerPcs > 0 && (
                <div style={{ 
                  fontSize: '10px', 
                  color: '#666',
                  marginTop: '2px'
                }}>
                  {month.manHourPerPcs.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Chart range info */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#666',
          border: '1px solid #ddd'
        }}>
          Range: {chartMinY.toFixed(2)} - {chartMaxY.toFixed(2)}
        </div>
      </div>
    );
  }, [data]);

  if (loading) {
    return (
      <Layout>
        <div style={{padding: '20px', textAlign: 'center', fontSize: '18px'}}>
          Loading manhour data from {filters.line}...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white',
        border: '3px solid black',
        borderRadius: '10px',
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>
              Filter Data Manhour
            </h3>
            
            <button
              onClick={handleRefreshData}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔄 Refresh Data
            </button>
          </div>
          
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
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Menampilkan data Manhour untuk: <strong>{filters.line}</strong> -{' '}
              <strong>{filters.part || 'Semua Produk'}</strong> -{' '}
              <strong>{filters.year}</strong>
              {apiData.length > 0 && (
                <div style={{ marginTop: '5px' }}>
                  Data loaded: <strong>{apiData.length}</strong> records | Filtered: <strong>{apiData.filter(item => item.name_product === filters.part && (parseInt(item.year) === filters.year || new Date(item.created_at).getFullYear() === filters.year)).length}</strong> records
                </div>
              )}
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
          
          {error && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Target : turun {data.target}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {data.targetValue.toFixed(2)} mnt./Pcs
            </div>
          </div>
          <div style={{ 
            border: '3px solid red',
            padding: '5px 20px',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'red'
          }}>
            {data.productCode}
          </div>
          <div style={{ 
            border: '3px solid orange',
            padding: '5px 20px',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'red'
          }}>
            {data.line}
          </div>
        </div>

        {/* Chart Area */}
        {DynamicChart}

        {/* Data Table */}
        {data.monthlyData.length > 0 && (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr>
                {['', ...data.monthlyData.map(d => d.month)].map((month, idx) => (
                  <th 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      backgroundColor: idx === 0 ? 'white' : '#f0f0f0',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      minWidth: idx === 0 ? '140px' : '70px'
                    }}
                  >
                    {month}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                  ΣProduksi (pcs)
                </td>
                {data.monthlyData.map((d, idx) => (
                  <td 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      textAlign: 'center',
                      backgroundColor: d.production > 0 ? '#e8f5e8' : 'transparent'
                    }}
                  >
                    {d.production > 0 ? d.production.toLocaleString() : ''}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                  ΣMan.Hour (man.minute)
                </td>
                {data.monthlyData.map((d, idx) => (
                  <td 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      textAlign: 'center',
                      backgroundColor: d.manHour > 0 ? '#e8f5e8' : 'transparent'
                    }}
                  >
                    {d.manHour > 0 ? Math.round(d.manHour).toLocaleString() : ''}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                  Man Hour (man.minute/pcs)
                </td>
                {data.monthlyData.map((d, idx) => (
                  <td 
                    key={idx}
                    style={{ 
                      border: '1px solid #333',
                      padding: '8px 4px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backgroundColor: d.manHourPerPcs > 0 ? '#e8f5e8' : 'transparent',
                      color: d.manHourPerPcs > 0 ? 
                             (d.manHourPerPcs <= data.targetValue ? 'green' : 
                              d.manHourPerPcs > 7.0 ? 'red' : 
                              d.manHourPerPcs > 6.5 ? 'orange' : 'black') : 'black'
                    }}
                  >
                    {d.manHourPerPcs > 0 ? d.manHourPerPcs.toFixed(2) : ''}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}

        {/* Info Section */}
        {/* <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Info Manhour Calculation:</div>
          <div>• <strong>Target</strong>: Turun 7% dari nilai Base (6.86 × 0.93 = {data.targetValue.toFixed(2)})</div>
          <div>• <strong>Base Data</strong>: Production = 10,637 pcs, Man Hour = 72,933 man.minute (Fixed Reference)</div>
          <div>• <strong>Man Hour/Pcs Calculation</strong>: Using <code>manhour_man_minutes_per_pcs</code> from API</div>
          <div>• <strong>Formula</strong>: Total Man Hour = Σ(actual × manhour_man_minutes_per_pcs) per month</div>
          <div>• <strong>Man Hour/Pcs</strong>: Total Man Hour ÷ Total Production per month</div>
          <div>• <strong>Chart Features</strong>: Dynamic Y-axis scaling, Auto-adjusting grid lines, Hover tooltips</div>
          <div>• <strong>Current Filter</strong>: Line: {filters.line} | Product: {filters.part} | Year: {filters.year}</div>
          <div>• <strong>API Source</strong>: {lineEndpoints[filters.line]}</div>
          <div>• <strong>Data Status</strong>: {apiData.length} total records loaded | {data.monthlyData.filter(d => d.manHourPerPcs > 0 && d.month !== 'Base').length} months with data</div>
          <div>• <strong>Last Updated</strong>: {new Date().toLocaleString()}</div>
        </div> */}
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
        
        /* Hover effects for chart points */
        circle:hover {
          r: 8 !important;
          fill: #0056b3 !important;
          cursor: pointer;
        }
        
        circle:hover ~ rect,
        circle:hover ~ text {
          opacity: 1 !important;
        }
      `}</style>
    </Layout>
  );
};

export default KanribanGrafikBawahPG21;
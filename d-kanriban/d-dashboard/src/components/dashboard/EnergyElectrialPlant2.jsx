// EnergyElectrialPlant2.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import Layout from '../layout/Layout';

const EnergyElectrialPlant2 = () => {
  const [rawData, setRawData] = useState({
    shiftUsage: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Generate year options based on available data
  const years = [2024, 2025, 2026];
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.27.6.191:4000/api/plant2/energyShiftly');
        if (response.data.success) {
          setRawData(response.data.data);
        } else {
          setError('Gagal memuat data.');
        }
      } catch (err) {
        setError('Koneksi ke server gagal.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan tahun dan bulan yang dipilih
  const filteredData = useMemo(() => {
    if (!rawData.shiftUsage || rawData.shiftUsage.length === 0) {
      return {
        totalEnergy: 0,
        totalCost: 0,
        avgDaily: 0,
        maxShiftValue: 0,
        totalCO2: 0,
        avgDailyCO2: 0,
        shiftUsage: [],
      };
    }

    // Filter shiftUsage berdasarkan tahun dan bulan
    const filteredShiftUsage = rawData.shiftUsage.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === selectedYear &&
        itemDate.getMonth() + 1 === selectedMonth
      );
    });

    // Hitung total delta_wh untuk periode yang difilter
    const totalDeltaWh = filteredShiftUsage.reduce((sum, item) => sum + item.delta_wh, 0);
    
    // Hitung max shift value untuk periode yang difilter
    const maxShiftValue = filteredShiftUsage.length > 0 
      ? Math.max(...filteredShiftUsage.map(item => item.delta_wh))
      : 0;
    
    // Dapatkan jumlah hari unik dalam periode yang difilter
    const uniqueDates = [...new Set(filteredShiftUsage.map(item => item.date))];
    const daysInPeriod = uniqueDates.length;
    
    // Hitung rata-rata harian
    const avgDaily = daysInPeriod > 0 ? totalDeltaWh / daysInPeriod : 0;
    
    // Asumsi: 1 Wh = 0.5 g CO2 (sesuaikan dengan faktor konversi aktual)
    const co2Factor = 0.92; // gram CO2 per Wh
    const totalCO2 = totalDeltaWh * co2Factor;
    const avgDailyCO2 = daysInPeriod > 0 ? totalCO2 / daysInPeriod : 0;
    
    // Asumsi: 1 Wh = 1.3 IDR (sesuaikan dengan tarif listrik aktual)
    const costPerWh = 2.09894; // IDR per Wh
    const totalCost = totalDeltaWh * costPerWh;





//     // Konstanta biaya dan emisi
// const COST_PER_KWH = 2092.94;
// const CO2_EMISSION_FACTOR = 0.92; // kg per kWh



    return {
      totalEnergy: totalDeltaWh,
      totalCost,
      avgDaily,
      maxShiftValue,
      totalCO2,
      avgDailyCO2,
      shiftUsage: filteredShiftUsage,
    };
  }, [rawData, selectedYear, selectedMonth]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatKWh = (num) => {
    return `${formatNumber(num / 1000)} kWh`;
  };

  const formatCO2 = (num) => {
    return `${formatNumber(num / 1000)} kg`;
  };

  // Prepare chart data dari data yang sudah difilter
  const prepareChartData = () => {
    const grouped = {};
    filteredData.shiftUsage.forEach(item => {
      const dateStr = item.date;
      if (!grouped[dateStr]) {
        grouped[dateStr] = { Shift1: 0, Shift2: 0 };
      }
      if (item.shift === "Shift 1") {
        grouped[dateStr].Shift1 = item.delta_wh;
      } else if (item.shift === "Shift 2") {
        grouped[dateStr].Shift2 = item.delta_wh;
      }
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    const last20Days = sortedDates.slice(0, 20).reverse();

    return last20Days.map(date => ({
      date: date,
      'Shift 1': grouped[date].Shift1 || 0,
      'Shift 2': grouped[date].Shift2 || 0,
    }));
  };

  const chartData = prepareChartData();

  // Hitung persentase perubahan dari bulan sebelumnya
  const getMonthlyChange = () => {
    if (!rawData.shiftUsage || rawData.shiftUsage.length === 0) return 0;
    
    const currentMonthData = filteredData.totalEnergy;
    
    // Hitung data bulan sebelumnya
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    
    const prevMonthData = rawData.shiftUsage
      .filter(item => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getFullYear() === prevYear &&
          itemDate.getMonth() + 1 === prevMonth
        );
      })
      .reduce((sum, item) => sum + item.delta_wh, 0);
    
    if (prevMonthData === 0) return 0;
    
    return ((currentMonthData - prevMonthData) / prevMonthData * 100).toFixed(1);
  };

  const monthlyChange = getMonthlyChange();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4 mx-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Layout>
      <div
        className="container-fluid p-3"
        style={{
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          backgroundColor: '#f8f9fa',
          maxWidth: '',
          margin: '0 auto',
        }}
      >
        {/* Header with Filters */}
        <div
          className="d-flex justify-content-between align-items-center mb-4 p-3"
          style={{
            background: 'linear-gradient(135deg, #5F9EA0 0%, #4682B4 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <div>
            <h4 className="m-0 fw-bold">ENERGY MONITORING DASHBOARD</h4>
            <small style={{ opacity: 0.9 }}>Production Plant 2</small>
          </div>
          
          {/* Filter Section */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex flex-column">
              <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>Year</small>
              <select 
                className="form-select form-select-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  minWidth: '100px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: 'white',
                }}
              >
                <option value="" disabled>Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="d-flex flex-column">
              <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>Month</small>
              <select 
                className="form-select form-select-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{
                  minWidth: '140px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: 'white',
                }}
              >
                <option value="" disabled>Select Month</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="d-flex flex-column align-items-end">
              <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>Current Period</small>
              <div className="text-end">
                <div className="fw-bold">{months.find(m => m.value === selectedMonth)?.label} {selectedYear}</div>
                <small>{filteredData.shiftUsage.length} shift records</small>
              </div>
            </div>
          </div>
        </div>

        {/* Change Indicator */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">Monthly Comparison: </span>
                    <span className={monthlyChange >= 0 ? 'text-success' : 'text-danger'}>
                      {monthlyChange >= 0 ? '↑' : '↓'} {Math.abs(monthlyChange)}% 
                      {monthlyChange >= 0 ? ' increase' : ' decrease'} from last month
                    </span>
                  </div>
                  <small className="text-muted">
                    Data filtered for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Row 1 (4 cards) */}
        <div className="row g-3 mb-3">
          {/* Total Energy */}
          <div className="col-md-3">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: '5px solid #FFD700',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#FFF8E1',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', color: '#FFD700' }}>⚡</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#495057' }}>
                        Total Energy
                      </h6>
                      <small style={{ fontSize: '0.75rem', color: '#6c757d' }}>総エネルギー</small>
                    </div>
                  </div>
                  <h3 className="fw-bold mt-3 mb-0" style={{ color: '#212529', fontSize: '1.4rem' }}>
                    {formatKWh(filteredData.totalEnergy)}
                  </h3>
                  <small className="text-muted d-block mt-1">
                    {filteredData.shiftUsage.length} shifts recorded
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="col-md-3">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: '5px solid #28a745',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#E8F5E9',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', color: '#28a745' }}>💰</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#495057' }}>
                        Total Cost
                      </h6>
                      <small style={{ fontSize: '0.75rem', color: '#6c757d' }}>総コスト</small>
                    </div>
                  </div>
                  <h3 className="fw-bold mt-3 mb-0" style={{ color: '#212529', fontSize: '1.4rem' }}>
                    {formatCurrency(filteredData.totalCost)}
                  </h3>
                  <small className="text-muted d-block mt-1">
                    Avg: {formatCurrency(filteredData.avgDaily)}/day
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Avg Daily */}
          <div className="col-md-3">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: '5px solid #6f42c1',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#F3E5F5',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', color: '#6f42c1' }}>🔄</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#495057' }}>
                        Avg Daily
                      </h6>
                      <small style={{ fontSize: '0.75rem', color: '#6c757d' }}>一日平均</small>
                    </div>
                  </div>
                  <h3 className="fw-bold mt-3 mb-0" style={{ color: '#212529', fontSize: '1.4rem' }}>
                    {formatKWh(filteredData.avgDaily)}
                  </h3>
                  <small className="text-muted d-block mt-1">
                    Based on {[...new Set(filteredData.shiftUsage.map(item => item.date))].length} days
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Max Shift Value */}
          <div className="col-md-3">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: '5px solid #fd7e14',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#FFE0B2',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', color: '#fd7e14' }}>📈</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#495057' }}>
                        Max Shift Value
                      </h6>
                      <small style={{ fontSize: '0.75rem', color: '#6c757d' }}>最大シフト値</small>
                    </div>
                  </div>
                  <h3 className="fw-bold mt-3 mb-0" style={{ color: '#212529', fontSize: '1.4rem' }}>
                    {formatKWh(filteredData.maxShiftValue)}
                  </h3>
                  <small className="text-muted d-block mt-1">
                    Highest recorded shift consumption
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Row 2 (2 cards) */}
        <div className="row g-3 mb-4">
          {/* Total CO Emissions */}
          <div className="col-md-6">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: '5px solid #6c757d',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#ECEFF1',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', color: '#6c757d' }}>🌫️</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#495057' }}>
                        Total CO₂ Emissions
                      </h6>
                      <small style={{ fontSize: '0.75rem', color: '#6c757d' }}>総CO2排出量</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h3 className="fw-bold mt-3 mb-0" style={{ color: '#212529', fontSize: '1.4rem' }}>
                        {formatCO2(filteredData.totalCO2)}
                      </h3>
                      <small className="text-muted d-block mt-1">
                        Equivalent to {formatNumber(filteredData.totalCO2 / 20000)} trees needed
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="badge bg-secondary">CO₂ Impact</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Avg Daily CO Emissions */}
          <div className="col-md-6">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                borderLeft: '5px solid #17a2b8',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#E0F7FA',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', color: '#17a2b8' }}>☁️</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#495057' }}>
                        Avg Daily CO₂ Emissions
                      </h6>
                      <small style={{ fontSize: '0.75rem', color: '#6c757d' }}>一日平均CO2排出量</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h3 className="fw-bold mt-3 mb-0" style={{ color: '#212529', fontSize: '1.4rem' }}>
                        {formatCO2(filteredData.avgDailyCO2)}
                      </h3>
                      <small className="text-muted d-block mt-1">
                        Daily average based on current period
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="badge bg-info">Daily Average</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div 
          className="card border-0 shadow-sm mt-4" 
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1" style={{ color: '#495057' }}>
                Shift Energy Consumption
              </h5>
              <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                Showing data for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: '#ADD8E6', 
                  borderRadius: '2px', 
                  marginRight: '6px' 
                }}></div>
                <small style={{ fontSize: '0.85rem', fontWeight: '500' }}>Shift 1</small>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: '#00008B', 
                  borderRadius: '2px', 
                  marginRight: '6px' 
                }}></div>
                <small style={{ fontSize: '0.85rem', fontWeight: '500' }}>Shift 2</small>
              </div>
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid 
                      stroke="#f0f0f0" 
                      strokeDasharray="3 3" 
                      vertical={false} 
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 11, fill: '#666' }}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#666' }}
                      label={{ 
                        value: 'Energy Consumption (kWh)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        offset: -10, 
                        fontSize: 12,
                        fill: '#666'
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`${formatNumber(value / 1000)} kWh`, '']}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar 
                      dataKey="Shift 1" 
                      name="Shift 1" 
                      fill="#ADD8E6" 
                      barSize={28}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="Shift 2" 
                      name="Shift 2" 
                      fill="#00008B" 
                      barSize={28}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                  Showing {chartData.length} days • Updated: {new Date().toLocaleTimeString('id-ID')}
                </small>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="text-muted mb-2">No data available for selected period</div>
              <small>Please select a different month or year</small>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <small className="text-muted">
            Energy Monitoring System • Production Plant 2 • 
            Last updated: {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </small>
        </div>
      </div>
    </Layout>
  );
};

export default EnergyElectrialPlant2;
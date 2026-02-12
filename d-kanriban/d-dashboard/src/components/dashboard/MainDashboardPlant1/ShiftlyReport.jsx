// ShiftlyReport.jsx
import React, { useState, useEffect, useRef } from 'react';
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
import * as XLSX from 'xlsx';

// Konstanta biaya dan emisi
const COST_PER_KWH = 2092.94;
const CO2_EMISSION_FACTOR = 0.92; // kg per kWh

const ShiftlyReport = () => {
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef();

  // State filter
// Helper ambil bulan & tahun sekarang
const now = new Date();
const currentMonth = now.toLocaleString('en-US', { month: 'long' });
const currentYear = now.getFullYear();

// State filter (default ke bulan & tahun sekarang)
const [selectedMonth, setSelectedMonth] = useState(currentMonth);
const [selectedYear, setSelectedYear] = useState(currentYear);


  // Daftar bulan untuk dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.27.6.191:4000/api/pm-shiftly-kub-kwh');
        if (!response.data?.success) throw new Error('Invalid API response');

        let rawData = response.data.data || [];

        // Filter berdasarkan bulan & tahun
        rawData = rawData.filter(item => {
          return item.month_name === selectedMonth && parseInt(item.year) === selectedYear;
        });

        // Kelompokkan data per hari dan shift
        const groupedByDate = {};
        rawData.forEach((item) => {
          const dateKey = `${item.day_name} ${item.day} ${item.month_name.slice(0, 3)}`;
          const shiftKey = item.shift === 'shift_1' ? 'shift1' : 'shift2';

          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = {
              date: dateKey,
              shift1: 0,
              shift2: 0,
              records: [],
            };
          }

          // Konversi dari Wh ke kWh (dibagi 1000)
          const kwh = parseFloat(item.total_kwh) / 1000;
          groupedByDate[dateKey][shiftKey] += kwh;

          // Simpan detail record untuk export
          groupedByDate[dateKey].records.push({
            ...item,
            kwh: Math.round(kwh),
            cost: Math.round(kwh * COST_PER_KWH),
            co2Kg: Math.round(kwh * CO2_EMISSION_FACTOR),
          });
        });

        // Urutkan berdasarkan tanggal (dari terlama ke terbaru)
        const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
          const dateA = new Date(a.replace(/(\w+) (\d+) (\w+)/, '$3 $2, $1'));
          const dateB = new Date(b.replace(/(\w+) (\d+) (\w+)/, '$3 $2, $1'));
          return dateA - dateB;
        });

        // Balik urutan untuk menampilkan data terbaru di kanan
        const reversedDates = [...sortedDates].reverse();

        // Buat array untuk grafik (dari kiri ke kanan: terlama ke terbaru)
        const chartData = reversedDates.map(dateKey => ({
          date: dateKey,
          shift1: Math.round(groupedByDate[dateKey].shift1),
          shift2: Math.round(groupedByDate[dateKey].shift2),
          rawDate: groupedByDate[dateKey].rawDate,
          records: groupedByDate[dateKey].records,
        }));

        setShiftData(chartData);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    const exportData = [];
    
    shiftData.forEach(day => {
      day.records.forEach(record => {
        exportData.push({
          'Date': day.date,
          'Shift': record.shift === 'shift_1' ? 'Shift 1' : 'Shift 2',
          'Energy (kWh)': record.kwh,
          'Cost (IDR)': record.cost,
          'CO2 Emission (kg)': record.co2Kg,
          'Month': selectedMonth,
          'Year': selectedYear
        });
      });
    });

    // Tambahkan summary row
    const totalKwh = shiftData.reduce((sum, item) => sum + item.shift1 + item.shift2, 0);
    const totalCost = Math.round(totalKwh * COST_PER_KWH);
    const totalCo2 = Math.round(totalKwh * CO2_EMISSION_FACTOR);

    exportData.push({});
    exportData.push({
      'Date': 'TOTAL',
      'Shift': '-',
      'Energy (kWh)': Math.round(totalKwh),
      'Cost (IDR)': totalCost,
      'CO2 Emission (kg)': totalCo2
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Energy Report');
    
    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Date
      { wch: 10 }, // Shift
      { wch: 15 }, // Energy
      { wch: 15 }, // Cost
      { wch: 18 }, // CO2
      { wch: 10 }, // Month
      { wch: 8 }   // Year
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Energy_Report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  // Fungsi untuk export ke CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Shift', 'Energy (kWh)', 'Cost (IDR)', 'CO2 Emission (kg)', 'Month', 'Year'];
    let csvContent = headers.join(',') + '\n';
    
    shiftData.forEach(day => {
      day.records.forEach(record => {
        const row = [
          `"${day.date}"`,
          `"${record.shift === 'shift_1' ? 'Shift 1' : 'Shift 2'}"`,
          record.kwh,
          record.cost,
          record.co2Kg,
          `"${selectedMonth}"`,
          selectedYear
        ];
        csvContent += row.join(',') + '\n';
      });
    });

    // Tambahkan total
    const totalKwh = shiftData.reduce((sum, item) => sum + item.shift1 + item.shift2, 0);
    const totalCost = Math.round(totalKwh * COST_PER_KWH);
    const totalCo2 = Math.round(totalKwh * CO2_EMISSION_FACTOR);
    
    csvContent += `"TOTAL","-",${Math.round(totalKwh)},${totalCost},${totalCo2},,""\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Energy_Report_${selectedMonth}_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div style={{ padding: '24px', fontSize: '16px', color: '#333' }}>Memuat data...</div>
  );

  if (error) return (
    <div style={{ padding: '24px', color: '#e74c3c', fontSize: '16px' }}>{error}</div>
  );

  // Hitung total dan statistik
  const totalKwh = shiftData.reduce((sum, item) => sum + item.shift1 + item.shift2, 0);
  const totalShift1 = shiftData.reduce((sum, item) => sum + item.shift1, 0);
  const totalShift2 = shiftData.reduce((sum, item) => sum + item.shift2, 0);
  const daysCount = shiftData.length;
  const avgDaily = daysCount > 0 ? Math.round(totalKwh / daysCount) : 0;
  const avgShift1 = daysCount > 0 ? Math.round(totalShift1 / daysCount) : 0;
  const avgShift2 = daysCount > 0 ? Math.round(totalShift2 / daysCount) : 0;
  const peakValue = Math.max(
    ...shiftData.map(item => Math.max(item.shift1, item.shift2))
  );
  const totalCost = Math.round(totalKwh * COST_PER_KWH);
  const totalCo2 = Math.round(totalKwh * CO2_EMISSION_FACTOR);

  // Helper format ribuan
  const formatNumber = (num) => {
    return num.toLocaleString('id-ID');
  };

  // Format Rp
  const formatCurrency = (num) => {
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // Format per kWh
  const formatPerKwh = (num) => {
    return `Rp ${num.toFixed(3)}`;
  };




  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif', backgroundColor: '#ffffff', height: '100%' }}>
      {/* Header Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h2 style={{ color: '#3498db', margin: 0, fontSize: '20px' }}>
            <span style={{ marginRight: '8px' }}>⚡</span> Otics Indonesia Energy Consumption Dashboard
          </h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            オーティックス・インドネシア エネルギー消費ダッシュボード
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={exportToExcel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            📊 Export Excel
          </button>
          {/* <button
            onClick={exportToCSV}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            📄 Export CSV
          </button> */}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>📅 Select Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}>
        {/* Total Energy */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', color: '#3498db' }}>⚡</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db' }}>Total Energy</span>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '4px' }}>(総エネルギー)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatNumber(totalKwh)} kWh
          </div>
        </div>

        {/* Cost */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', color: '#f39c12' }}>💰</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f39c12' }}>Cost</span>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '4px' }}>(コスト)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatCurrency(totalCost)}
          </div>
        </div>

        {/* Avg Daily */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', color: '#27ae60' }}>📈</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#27ae60' }}>Avg Daily</span>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '4px' }}>(平均日次)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatNumber(avgDaily)} kWh
          </div>
        </div>

        {/* Shift 1 Total */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', color: '#3498db' }}>⏱️</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3498db' }}>Shift 1 Total</span>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '4px' }}>(シフト1 合計)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatNumber(totalShift1)} kWh
          </div>
        </div>

        {/* Shift 2 Total */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', color: '#7f8c8d' }}>⏱️</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#7f8c8d' }}>Shift 2 Total</span>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '4px' }}>(シフト2 合計)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatNumber(totalShift2)} kWh
          </div>
        </div>

        {/* Peak Value */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', color: '#e74c3c' }}>⬆️</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#e74c3c' }}>Peak Value</span>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '4px' }}>(ピーク値)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatNumber(peakValue)} kWh
          </div>
        </div>
      </div>


      {/* CO2 Emissions Summary & Cost Analysis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}>
        {/* CO2 Emissions Summary */}
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', color: '#e74c3c' }}>🔥</span>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#e74c3c' }}>CO2 Emissions Summary</h3>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '16px' }}>(CO2排出量サマリー)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#777' }}>Monthly</div>
              <div style={{ fontSize: '12px', color: '#777' }}>(月間)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                {formatNumber(totalCo2)} kg
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#777' }}>Daily Avg</div>
              <div style={{ fontSize: '12px', color: '#777' }}>(日平均)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                {daysCount > 0 ? (totalCo2 / daysCount).toFixed(2) : '0.00'} kg
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#777' }}>Yearly</div>
              <div style={{ fontSize: '12px', color: '#777' }}>(年間)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                {formatNumber(Math.round(totalCo2 * 12))} kg
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', color: '#f39c12' }}>💰</span>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#f39c12' }}>Cost Analysis</h3>
          </div>
          <div style={{ fontSize: '14px', color: '#777', marginBottom: '16px' }}>(コスト分析)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#777' }}>Monthly</div>
              <div style={{ fontSize: '12px', color: '#777' }}>(月間)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                {formatCurrency(totalCost)}
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#777' }}>Daily Avg</div>
              <div style={{ fontSize: '12px', color: '#777' }}>(日平均)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                {daysCount > 0 ? formatCurrency(Math.round(totalCost / daysCount)) : 'Rp 0'}
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#777' }}>Per kWh</div>
              <div style={{ fontSize: '12px', color: '#777' }}>(kWhあたり)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                {formatPerKwh(COST_PER_KWH)}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Grafik Batang Per Hari */}
      <div style={{ width: '100%', height: '300px', border: '1px solid #ddd', borderRadius: '8px' }}>





        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={shiftData}
            margin={{ top: 40, right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#eee" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={0}
              textAnchor="end"
              height={40}
              tickFormatter={(value) => {
                // Format tanggal menjadi "Nov-9"
                const parts = value.split(' ');
                if (parts.length >= 3) {
                  const day = parts[1];
                  const month = parts[2];
                  return `${month}-${day}`;
                }
                return value;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatNumber(value)}
              label={{ 
                value: 'kWh', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fontWeight: 'bold' } 
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'shift1') return [`${formatNumber(value)} kWh`, 'Shift 1'];
                if (name === 'shift2') return [`${formatNumber(value)} kWh`, 'Shift 2'];
                return [value, name];
              }}
              labelFormatter={(label) => `Tanggal: ${label}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              content={() => (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    fontSize: '14px',
                    width: '100%',
                  }}
                >
                  <span>
                    <span style={{ color: 'black', fontWeight: 'bold' }}>Total Shift 1: </span>
                    <span style={{ color: '#2edace', fontWeight: 'bold' }}>{formatNumber(totalShift1)} kWh</span>
                  </span>
                  <span>
                    <span style={{ color: 'black', fontWeight: 'bold' }}>Total Shift 2: </span>
                    <span style={{ color: '#172fe5', fontWeight: 'bold' }}>{formatNumber(totalShift2)} kWh</span>
                  </span>
                </div>
              )}
            />

            
            <Bar dataKey="shift1" fill="url(#gradientShift1)" name="Shift 1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shift2" fill="url(#gradientShift2)" name="Shift 2" radius={[4, 4, 0, 0]} />



            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="gradientShift1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2edace" stopOpacity={1} />
                <stop offset="95%" stopColor="#2edace" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="gradientShift2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#172fe5" stopOpacity={1} />
                <stop offset="95%" stopColor="#172fe5" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            
          </BarChart>
        </ResponsiveContainer>
      </div>


    </div>
  );
};

export default ShiftlyReport;
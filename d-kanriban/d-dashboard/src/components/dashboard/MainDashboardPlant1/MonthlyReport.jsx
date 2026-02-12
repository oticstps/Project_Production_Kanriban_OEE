// MonthlyReport.jsx
import React, { useState, useEffect } from 'react';
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
  LabelList
} from 'recharts';

// Konstanta biaya dan emisi
const COST_PER_KWH = 2092.94;
const CO2_EMISSION_FACTOR = 0.92; // kg per kWh

const MonthlyReport = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.27.6.191:4000/api/pm-monthly-kub-kwh');
        if (!response.data?.success) throw new Error('Invalid API response');

        const rawData = response.data.data || [];

        // Kelompokkan berdasarkan bulan + tahun
        const grouped = {};
        rawData.forEach((item) => {
          const key = `${item.month} ${item.year}`;
          if (!grouped[key]) {
            grouped[key] = {
              month: item.month,
              year: item.year,
              totalWh: 0,
            };
          }
          grouped[key].totalWh += parseInt(item.total_wh || 0);
        });

        // Urutan bulan
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Format data akhir
        const formattedData = Object.values(grouped)
          .map((item) => {
            const kwh = Math.round(item.totalWh / 1000); // Wh → kWh, bulatkan
            const cost = Math.round(kwh * COST_PER_KWH); // Rp, integer
            const co2Kg = Math.round(kwh * CO2_EMISSION_FACTOR); // kg, integer

            return {
              month: item.month,
              year: item.year,
              kwh,
              cost,
              co2Kg,
            };
          })
          .sort((a, b) => {
            const aIdx = monthOrder.indexOf(a.month);
            const bIdx = monthOrder.indexOf(b.month);
            const yearDiff = parseInt(a.year) - parseInt(b.year);
            return yearDiff !== 0 ? yearDiff : aIdx - bIdx;
          });

        setMonthlyData(formattedData);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div style={{ padding: '24px', fontSize: '16px', color: '#333' }}>Memuat data...</div>
  );

  if (error) return (
    <div style={{ padding: '24px', color: '#e74c3c', fontSize: '16px' }}>{error}</div>
  );

  // Helper untuk format ribuan (tanpa desimal)
  const formatNumber = (num) => {
    return num.toLocaleString('id-ID');
  };

  const totalKwh = monthlyData.reduce((sum, item) => sum + item.kwh, 0);
  const totalCost = monthlyData.reduce((sum, item) => sum + item.cost, 0);
  const totalCO2 = monthlyData.reduce((sum, item) => sum + item.co2Kg, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif', backgroundColor: '#ffffff', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#3498db', margin: 0, fontSize: '24px' }}>Laporan Konsumsi Energi Bulanan</h2>
        <div style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '6px 12px', borderRadius: '6px', fontSize: '16px' }}>
          Total: {formatNumber(totalKwh)} kWh
        </div>
      </div>

      {/* Grafik */}
      <div style={{ width: '100%', height: '400px', marginBottom: '28px' }}>
        <ResponsiveContainer>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#eee" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
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
                if (name === 'kwh') return [`${formatNumber(value)} kWh`, 'Konsumsi'];
                if (name === 'cost') return [`Rp ${formatNumber(value)}`, 'Biaya'];
                if (name === 'co2Kg') return [`${formatNumber(value)} kg`, 'CO₂'];
                return [value, name];
              }}
              labelFormatter={(label) => `Bulan: ${label}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <Legend />
            <Bar dataKey="kwh" fill="#3498db" radius={[4, 4, 0, 0]} name="Konsumsi (kWh)">
              <LabelList 
                dataKey="kwh" 
                position="top" 
                formatter={formatNumber} 
                fill="#333" 
                fontSize={20} 
                fontWeight="bold"
              />
            </Bar>
                          
          
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '500px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '10px', textAlign: 'left', color: '#2c3e50' }}>Bulan</th>
              <th style={{ padding: '10px', textAlign: 'right', color: '#2c3e50' }}>kWh</th>
              <th style={{ padding: '10px', textAlign: 'right', color: '#2c3e50' }}>Biaya (Rp)</th>
              <th style={{ padding: '10px', textAlign: 'right', color: '#2c3e50' }}>CO₂ (kg)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((item, index) => (
              <tr
                key={`${item.month}-${item.year}`}
                style={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                }}
              >
                <td style={{ padding: '10px', fontWeight: '500' }}>
                  {item.month} {item.year}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600' }}>
                  {formatNumber(item.kwh)}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#27ae60' }}>
                  {formatNumber(item.cost)}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#e67e22' }}>
                  {formatNumber(item.co2Kg)}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Footer Total */}
          <tfoot>
            <tr style={{ borderTop: '2px solid #3498db', fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
              <td style={{ padding: '10px' }}>TOTAL</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>{formatNumber(totalKwh)}</td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#27ae60' }}>
                {formatNumber(totalCost)}
              </td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#e67e22' }}>
                {formatNumber(totalCO2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MonthlyReport;
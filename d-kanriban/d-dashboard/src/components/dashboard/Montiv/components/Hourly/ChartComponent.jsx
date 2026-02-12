import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartComponent = ({ data, chartType = 'bar', startDate, endDate }) => {
  // Format data untuk chart - urutkan dari pagi ke sore
  const chartData = data
    .map(item => ({
      name: new Date(item.created_at).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      delta_actual: parseInt(item.delta_actual, 10),
      created_at: new Date(item.created_at).toLocaleString('id-ID'),
      timestamp: new Date(item.created_at).getTime(),
      date: new Date(item.created_at).toLocaleDateString('id-ID') // Tambahkan tanggal
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Dapatkan tanggal unik untuk ditampilkan
  const uniqueDates = [...new Set(chartData.map(item => item.date))];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '8px',
          border: '1px solid #c8e6c9',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          fontSize: '11px'
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#2e7d32' }}>
            {`Waktu: ${label}`}
          </p>
          <p style={{ margin: '2px 0', color: '#4caf50', fontWeight: '500' }}>
            Δ Actual: {data.delta_actual}
          </p>
          <p style={{ margin: '2px 0', color: '#1976d2', fontSize: '10px' }}>
            Tanggal: {data.date}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#666' }}>
            {data.created_at}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 15, right: 20, left: 15, bottom: 45 }
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end"
          height={45}
          tick={{ fontSize: 10, fill: '#2e7d32' }}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: '#2e7d32' }}
          label={{ 
            value: 'Unit', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: '11px', fill: '#2e7d32' }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '11px' }}
        />
      </>
    );

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonElements}
            <Line 
              type="monotone" 
              dataKey="delta_actual" 
              name="Delta Actual" 
              stroke="#4caf50" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonElements}
            <Area 
              type="monotone" 
              dataKey="delta_actual" 
              name="Delta Actual" 
              fill="#81c784" 
              stroke="#4caf50" 
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            {commonElements}
            <Bar 
              dataKey="delta_actual" 
              name="Delta Actual" 
              fill="#4caf50" 
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  // Format tanggal untuk ditampilkan
  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('id-ID');
      const end = new Date(endDate).toLocaleDateString('id-ID');
      return `${start} - ${end}`;
    } else if (startDate) {
      return new Date(startDate).toLocaleDateString('id-ID');
    } else if (endDate) {
      return new Date(endDate).toLocaleDateString('id-ID');
    }
    return 'Semua Tanggal';
  };

  // Dapatkan informasi tanggal untuk ditampilkan
  const getDateInfo = () => {
    if (uniqueDates.length > 0) {
      if (uniqueDates.length === 1) {
        return `Data tanggal: ${uniqueDates[0]}`;
      } else {
        return `Data tanggal: ${uniqueDates[0]} sampai ${uniqueDates[uniqueDates.length - 1]}`;
      }
    }
    return 'Tidak ada data tanggal';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-gray-800">
          Grafik Delta Actual Pcs/Jam
        </h3>
        <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          {startDate && endDate ? formatDateRange() : getDateInfo()}
        </div>
      </div>

      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666',
          backgroundColor: '#f1f8e9',
          borderRadius: '4px',
          marginTop: '8px',
          fontSize: '12px',
          border: '1px solid #dcedc8'
        }}>
          Tidak ada data untuk filter yang dipilih
        </div>
      )}

      {/* Informasi tambahan tentang tanggal yang ditampilkan */}
      {data.length > 0 && uniqueDates.length > 0 && (
        <div style={{ 
          marginTop: '8px',
          padding: '6px 10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#666',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          Menampilkan data dari {uniqueDates.length} tanggal: {uniqueDates.join(', ')}
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
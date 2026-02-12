import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getShiftAndSlot } from '../../utils/shiftUtils';

const ActualConsumptionChart = ({ data, startDate, endDate }) => {
  // Filter data by date range if provided
  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return data;
    return data.filter(item => {
      const itemDate = new Date(item.created_at).toISOString().split('T')[0];
      const start = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
      const end = endDate ? new Date(endDate).toISOString().split('T')[0] : null;
      if (start && end) return itemDate >= start && itemDate <= end;
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    });
  }, [data, startDate, endDate]);

  // Group data by date and shift
  const chartData = useMemo(() => {
    const dateShiftMap = {};

    filteredData.forEach(item => {
      const { shift } = getShiftAndSlot(item.created_at);
      if (shift === 'SHIFT1' || shift === 'SHIFT2') {
        const date = new Date(item.created_at).toISOString().split('T')[0]; // YYYY-MM-DD
        if (!dateShiftMap[date]) {
          dateShiftMap[date] = { date, Shift1: 0, Shift2: 0 };
        }
        dateShiftMap[date][shift === 'SHIFT1' ? 'Shift1' : 'Shift2'] += parseInt(item.delta_actual, 10) || 0;
      }
    });

    return Object.values(dateShiftMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
            Tanggal: {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color, fontWeight: '500' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-gray-800">
          Grafik Konsumsi Actual per Shift
        </h3>
        <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          {startDate && endDate ? `${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}` : 'Semua Tanggal'}
        </div>
      </div>

      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 20, left: 15, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#2e7d32' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#2e7d32' }}
              label={{
                value: 'Konsumsi Actual',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '11px', fill: '#2e7d32' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar
              dataKey="Shift1"
              name="Shift 1"
              fill="#4caf50"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="Shift2"
              name="Shift 2"
              fill="#2196f3"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {chartData.length === 0 && (
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
          Tidak ada data konsumsi actual untuk filter yang dipilih
        </div>
      )}
    </div>
  );
};

export default ActualConsumptionChart;

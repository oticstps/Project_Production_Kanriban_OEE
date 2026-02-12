// pages/KanribanManhour/components/DeltaActualBarChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DeltaActualBarChart = ({ data }) => {
  // Format data untuk chart
  const chartData = data.map(item => ({
    name: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    delta_actual: parseInt(item.delta_actual, 10),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="delta_actual" name="Delta Actual" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeltaActualBarChart;
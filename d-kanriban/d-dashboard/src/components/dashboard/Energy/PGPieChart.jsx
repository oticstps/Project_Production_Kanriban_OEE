// PGPieChart.jsx
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PGPieChart = ({ data, tableNameMapping }) => { // Terima tableNameMapping sebagai prop
  const pgData = useMemo(() => {
    const pgMap = {};
    data.forEach(item => {
      // Gunakan mapping yang diterima dari props
      const pg = tableNameMapping[item.line_table]?.[1] || 'Unknown';
      const kWh = Number(item.total_wh) / 1000;
      if (typeof kWh === 'number' && !isNaN(kWh)) {
        pgMap[pg] = (pgMap[pg] || 0) + kWh;
      }
    });
    return Object.entries(pgMap).map(([pg, totalKWh]) => ({
      name: pg,
      value: parseFloat(totalKWh.toFixed(2))
    }));
  }, [data, tableNameMapping]); // Tambahkan tableNameMapping ke dependency array

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 h-full">
      
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pgData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pgData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'kWh']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PGPieChart;
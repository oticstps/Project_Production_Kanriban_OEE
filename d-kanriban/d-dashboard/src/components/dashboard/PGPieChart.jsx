// PGPieChart.jsx
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PGPieChart = ({ data, tableNameMapping, pgColorMap }) => {
  // Hitung total kWh per PG berdasarkan data yang difilter
  const pgData = useMemo(() => {
    const pgMap = {};
    
    data.forEach(item => {
      // Ambil PG dari mapping berdasarkan nama tabel
      const pg = tableNameMapping[item.line_table]?.[1] || 'Unknown';
      const kWh = Number(item.total_wh) / 1000;
      
      if (typeof kWh === 'number' && !isNaN(kWh)) {
        pgMap[pg] = (pgMap[pg] || 0) + kWh;
      }
    });
    
    // Konversi ke array dan urutkan berdasarkan nilai
    return Object.entries(pgMap)
      .map(([pg, totalKWh]) => ({
        name: pg,
        value: parseFloat(totalKWh.toFixed(2)),
        color: pgColorMap[pg] || '#aaaaaa'
      }))
      .sort((a, b) => b.value - a.value); // Urutkan dari terbesar ke terkecil
  }, [data, tableNameMapping, pgColorMap]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = pgData.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Konsumsi: {data.value.toLocaleString()} kWh</p>
          <p className="text-sm text-gray-600">Persentase: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const renderLegend = (props) => {
    const { payload } = props;
    const total = pgData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {payload.map((entry, index) => {
          const item = pgData.find(d => d.name === entry.value);
          const percentage = total > 0 ? ((item?.value || 0) / total * 100).toFixed(1) : 0;
          
          return (
            <div key={`legend-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-xs text-gray-600">
                {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (pgData.length === 0) {
    return (
      <>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Distribusi kWh per PG</h3>
        <div className="shadow bg-white p-4 h-full mb-1 flex flex-col rounded-lg border border-gray-200">
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Distribusi kWh per PG</h3>
      <div className="shadow bg-white p-4 h-full mb-1 flex flex-col rounded-lg border border-gray-200">
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height={300} className="rounded-lg border border-gray-200">
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
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default PGPieChart;
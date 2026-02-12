// ChartSelector.jsx
import React from 'react';

const ChartSelector = ({ label, selectedChart, onChartChange }) => {
  const chartTypes = [
    { id: 'line', label: 'Line' },
    { id: 'bar', label: 'Bar' },
    { id: 'area', label: 'Area' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
      <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
        <span className="text-xs text-gray-600">Tipe:</span>
        {chartTypes.map((chart) => (
          <button
            key={chart.id}
            onClick={() => onChartChange(chart.id)}
            className={`px-2 py-1 text-xs rounded ${
              selectedChart === chart.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {chart.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartSelector;
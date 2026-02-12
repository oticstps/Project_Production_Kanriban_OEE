// src/pages/Manhour/components/ChartControls/ChartControls.jsx

import React from 'react';
import { Activity, BarChart3, Eye, EyeOff } from 'lucide-react';

const ChartControls = ({ 
  chartType, 
  setChartType, 
  loading, 
  fetchProductionData, 
  selectedLine,
  chartData,
  viewMode,
  setViewMode,
  selectedMetrics,
  handleMetricToggle,
  getLineColor
}) => {
  return (
    <div className="bg-white p-3 border border-black shadow-xl rounded-md">
      {/* Main Controls */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        {/* Left Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Button */}
          <button
            onClick={() => fetchProductionData(selectedLine)}
            disabled={loading}
            className="px-3 py-1.5 text-xs bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black flex items-center border border-black transition-all"
            style={{
              boxShadow: '0 2px 4px 0 rgba(0,0,0,0.35), 0 1px 0 #222'
            }}
          >
            <Activity className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="bg-white text-xs px-2 py-1 border border-gray-300 text-gray-800 rounded"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1">
            {[
              { mode: 'normal', label: 'Normal' },
              { mode: 'hourly', label: 'Hourly' }
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-1 text-xs rounded border transition-all ${
                  viewMode === mode
                    ? 'bg-green-400 border-black text-black font-medium'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  boxShadow: viewMode === mode
                    ? '0 2px 4px 0 rgba(0,0,0,0.35), 0 1px 0 #222'
                    : 'none'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Info */}
        {chartData.length > 0 && (
          <div className="text-xs text-gray-600">
            Showing {chartData.length} records | Latest: {new Date(chartData[chartData.length - 1]?.created_at).toLocaleString('id-ID')}
          </div>
        )}
      </div>

      {/* Quick Metric Toggles */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-700">Metrics:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(selectedMetrics).map(([metric, isSelected]) => (
            <button
              key={metric}
              onClick={() => handleMetricToggle(metric)}
              className={`px-2 py-1 text-xs rounded border flex items-center transition-all ${
                isSelected 
                  ? 'bg-green-400 border-black text-black'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                boxShadow: isSelected
                  ? '0 2px 4px 0 rgba(0,0,0,0.35), 0 1px 0 #222'
                  : 'none'
              }}
            >
              <div 
                className="w-2 h-2 mr-1 rounded-full"
                style={{ backgroundColor: getLineColor(metric) }}
              ></div>
              {metric.replace('_', ' ').toUpperCase()}
              {isSelected ? 
                <Eye className="w-2.5 h-2.5 ml-1" /> : 
                <EyeOff className="w-2.5 h-2.5 ml-1" />
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
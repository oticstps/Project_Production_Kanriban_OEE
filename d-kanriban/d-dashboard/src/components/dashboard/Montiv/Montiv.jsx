import React, { useState, useMemo } from 'react';
import {
  LineChart, 
  BarChart, 
  AreaChart, 
  Line, 
  Bar, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { AlertTriangle, Activity, BarChart3, Eye, EyeOff } from 'lucide-react';
import { useProductionData } from './hooks/useProductionData';
import { productionLines } from './utils/constants';
import { metricColors } from './utils/constants';
import { filterDataByDateRange, getUniqueDates, getCurrentDate } from './utils/dateUtils';
import Layout from '../../layout/Layout';

const Pd1Dashboard = () => {
  return (
    <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 text-blue-900 shadow-md">
      <h2 className="text-xl font-bold mb-2">📊 PD1 Dashboard</h2>
      <p className="text-sm mb-4">
        This is the dedicated dashboard for <strong>Production Group 1</strong>. 
        It displays comprehensive metrics and analytics specific to PD1 operations.
      </p>
      <div className="bg-white p-4 rounded border border-blue-200 mt-4">
        <h3 className="font-semibold text-blue-800 mb-2">Key Features:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Real-time production efficiency tracking</li>
          <li>Performance comparison against targets</li>
          <li>Quality metrics and defect analysis</li>
          <li>Resource utilization reports</li>
        </ul>
      </div>
      <div className="mt-6 text-xs text-blue-600 italic">
        This dashboard provides specialized insights for PD1 operations management.
      </div>
    </div>
  );
};

const ChartComponent = ({ data, chartType, startDate, endDate }) => {
  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="created_at" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual_pcs" fill="#8884d8" name="Actual PCS" />
            <Bar dataKey="target" fill="#82ca9d" name="Target" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="created_at" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual_pcs" stroke="#8884d8" name="Actual PCS" />
            <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" />
          </LineChart>
        );
      default:
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="created_at" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual_pcs" fill="#8884d8" name="Actual PCS" />
            <Bar dataKey="target" fill="#82ca9d" name="Target" />
          </BarChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

const FilterControls = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  selectedChartType, 
  onChartTypeChange,
  availableDates 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 rounded border">
      <div className="flex items-center gap-1">
        <label className="text-xs text-gray-600">Start:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-gray-600">End:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-gray-600">Chart:</label>
        <select
          value={selectedChartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
      </div>
    </div>
  );
};

const ActualConsumptionChart = ({ data, startDate, endDate }) => {
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return filterDataByDateRange(data, startDate, endDate);
  }, [data, startDate, endDate]);

  const aggregatedData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const shiftData = {};
    filteredData.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      const shift = item.shift || 'unknown';
      const key = `${date}-${shift}`;
      
      if (!shiftData[key]) {
        shiftData[key] = {
          date: date,
          shift: shift,
          actual_pcs: 0,
          target: 0
        };
      }
      
      shiftData[key].actual_pcs += item.actual_pcs || 0;
      shiftData[key].target += item.target || 0;
    });
    
    return Object.values(shiftData);
  }, [filteredData]);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual_pcs" fill="#8884d8" name="Actual PCS" />
          <Bar dataKey="target" fill="#82ca9d" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const getLineSeries = (selectedMetrics, getLineColor) => {
  return Object.entries(selectedMetrics)
    .filter(([_, isSelected]) => isSelected)
    .map(([metric, _]) => ({
      dataKey: metric,
      stroke: getLineColor(metric),
      strokeWidth: 2,
      dot: false,
      name: metric.replace('_', ' ').toUpperCase()
    }));
};

const getBarSeries = (selectedMetrics, getLineColor) => {
  return Object.entries(selectedMetrics)
    .filter(([_, isSelected]) => isSelected)
    .map(([metric, _]) => ({
      dataKey: metric,
      fill: getLineColor(metric),
      name: metric.replace('_', ' ').toUpperCase()
    }));
};

const getAreaSeries = (selectedMetrics, getLineColor) => {
  return Object.entries(selectedMetrics)
    .filter(([_, isSelected]) => isSelected)
    .map(([metric, _]) => ({
      dataKey: metric,
      fill: getLineColor(metric),
      stroke: getLineColor(metric),
      name: metric.replace('_', ' ').toUpperCase()
    }));
};

const ProductionChart = ({ 
  chartType, 
  setChartType,
  chartData, 
  loading, 
  error, 
  fetchProductionData, 
  selectedLine, 
  selectedMetrics, 
  handleMetricToggle,
  getLineColor
}) => {
  const renderChart = () => {
    const commonChartProps = {
      data: chartData,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    const commonComponents = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
        <XAxis 
          dataKey="created_at" 
          stroke="#000000ff" 
          fontSize={10} 
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          }}
        />
        <YAxis stroke="#000000ff" fontSize={10} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  className="bg-white border border-black p-2 text-xs text-black"
                  style={{
                    border: '1px solid #111',
                    borderRadius: 4,
                  }}
                >
                  <p className="font-semibold">{new Date(label).toLocaleString('id-ID')}</p>
                  {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                      {entry.dataKey}: <strong>{entry.value}</strong>
                    </p>
                  ))}
                  {payload[0]?.payload?.name_product && (
                    <p className="mt-1 text-black">
                      Product: <strong>{payload[0].payload.name_product}</strong>
                    </p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#374151' }} />
      </>
    );

    switch (chartType) {
      case 'line': {
        const lineSeries = getLineSeries(selectedMetrics, getLineColor);
        return (
          <LineChart {...commonChartProps}>
            {commonComponents}
            {lineSeries.map((series, index) => (
              <Line key={index} type="monotone" {...series} />
            ))}
          </LineChart>
        );
      }

      case 'bar': {
        const barSeries = getBarSeries(selectedMetrics, getLineColor);
        return (
          <BarChart {...commonChartProps}>
            {commonComponents}
            {barSeries.map((series, index) => (
              <Bar key={index} {...series} />
            ))}
          </BarChart>
        );
      }

      case 'area': {
        const areaSeries = getAreaSeries(selectedMetrics, getLineColor);
        return (
          <AreaChart {...commonChartProps}>
            {commonComponents}
            {areaSeries.map((series, index) => (
              <Area key={index} type="monotone" {...series} />
            ))}
          </AreaChart>
        );
      }

      default: {
        return (
          <LineChart {...commonChartProps}>
            {commonComponents}
          </LineChart>
        );
      }
    }
  };

  return (
    <div className="bg-white p-4 border rounded-md">
      {/* Chart Controls */}
      <div className="bg-gray-50 p-3 border shadow-md rounded-md mb-4">
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

      {/* Chart Content */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-green-700">Production Chart</h3>
        {loading && (
          <div className="flex items-center text-blue-500 text-xs">
            <div className="animate-spin h-3 w-3 border-b-2 border-black mr-1"></div>
            Loading...
          </div>
        )}
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center h-96 text-red-500">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium mb-1">Failed to Load Data</p>
          <p className="text-xs text-black mb-3">{error}</p>
          <button
            onClick={() => fetchProductionData(selectedLine)}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-black"
          >
            Try Again
          </button>
        </div>
      ) : chartData.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-96 text-black">
          <Activity className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium mb-1">No Data Available</p>
          <p className="text-xs text-black mb-3">No production data found</p>
          <button
            onClick={() => fetchProductionData(selectedLine)}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-black"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="h-64 md:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}
    </div>



  );
};

const productionGroups = [
  { id: 'pg_1', name: 'PG-1' },
  { id: 'pg_2_1', name: 'PG 2-1' },
  { id: 'pg_2_2', name: 'PG 2-2' },
  { id: 'pg_2_3', name: 'PG 2-3' },
  { id: 'pg_3_1', name: 'PG 3-1' },
  { id: 'pg_3_2', name: 'PG 3-2' },
];

// Fungsi untuk mendapatkan tanggal kemarin
const getYesterdayDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Fungsi untuk mendapatkan awal bulan ini
const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};

// Fungsi untuk mendapatkan akhir bulan ini
const getCurrentMonthEnd = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
};

const Montiv = () => {
  const [chartType, setChartType] = useState('line');
  const [viewMode, setViewMode] = useState('normal');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLine, setSelectedLine] = useState('common_rail_12_filtered');
  const [selectedMetrics, setSelectedMetrics] = useState({
    actual_pcs: false,
    target: false,
    efficiency: false,
    loading_time: false,
    cycle_time: true,
    actual_ct: true
  });

  // State untuk hourly view
  const [startDate, setStartDate] = useState(getYesterdayDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedChartType, setSelectedChartType] = useState('bar');

  // State untuk shift view
  const [shiftStartDate, setShiftStartDate] = useState(getCurrentMonthStart());
  const [shiftEndDate, setShiftEndDate] = useState(getCurrentMonthEnd());

  const { chartData, loading, error, fetchProductionData } = useProductionData(selectedLine);
  
  // Mock hourly data for demonstration
  const { hourlyData, loading: hourlyLoading, error: hourlyError } = useMemo(() => {
    // This would normally be replaced with a real hook
    const mockHourlyData = [
      { created_at: '2023-01-01T08:00:00', actual_pcs: 100, target: 120, shift: '1' },
      { created_at: '2023-01-01T09:00:00', actual_pcs: 110, target: 120, shift: '1' },
      { created_at: '2023-01-01T10:00:00', actual_pcs: 95, target: 120, shift: '1' },
      { created_at: '2023-01-01T11:00:00', actual_pcs: 105, target: 120, shift: '1' },
      { created_at: '2023-01-01T12:00:00', actual_pcs: 115, target: 120, shift: '1' },
    ];
    
    return {
      hourlyData: mockHourlyData,
      loading: false,
      error: null
    };
  }, []);

  // Add null check for hourlyData
  const availableDates = useMemo(() => {
    if (!hourlyData || !Array.isArray(hourlyData)) return [];
    return getUniqueDates(hourlyData);
  }, [hourlyData]);
  
  const filteredData = useMemo(
    () => {
      if (!hourlyData || !Array.isArray(hourlyData)) return [];
      return filterDataByDateRange(hourlyData, startDate, endDate);
    },
    [hourlyData, startDate, endDate]
  );

  const handleLineChange = (lineId) => setSelectedLine(lineId);
  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);
  const handleChartTypeChange = (chartType) => setSelectedChartType(chartType);

  const handleShiftStartDateChange = (date) => setShiftStartDate(date);
  const handleShiftEndDateChange = (date) => setShiftEndDate(date);

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const getLineColor = (metric) => metricColors[metric] || '#ffffff';

  const isProductionGroup = productionGroups.some(pg => pg.id === selectedLine);
  const selectedGroup = productionGroups.find(pg => pg.id === selectedLine);

  return (


    
    <Layout>
      
      
      
      <div className={`h-[640px] ${darkMode ? 'bg-gray-900' : 'bg-white'} text-gray-900 p-4`}>



        <div className="flex flex-col lg:flex-row gap-4">
          {/* Line Selection Menu - Positioned on the left */}
          <div className="lg:w-[115px] flex-shrink-0">
            <div className="bg-white p-3 border rounded-md shadow-md h-[calc(100vh-8rem)] overflow-y-auto">
              
              
              
              {/* Header */}
              <div className="mb-3">
                <h2 className="text-lg font-bold text-green-700">Analytics</h2>
              </div>
              






              {/* Groups Section
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 text-green-700">Groups</h3>
                <div className="grid grid-cols-2 gap-2">
                  {productionGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleLineChange(group.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded border flex items-center transition-all ${
                        selectedLine === group.id
                          ? 'bg-green-400 border-black text-black shadow-[0_2px_4px_0_rgba(0,0,0,0.35),_0_1px_0_#222]'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <div
                        className="w-2 h-2 mr-2 rounded-full"
                        style={{
                          backgroundColor: selectedLine === group.id ? '#166534' : '#16a34a',
                        }}
                      ></div>
                      {group.name}
                    </button>
                  ))}
                </div>






              </div> */}
              





              {/* Lines Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-green-700">Lines</h3>
                <div className="space-y-1">
                  {productionLines.map((line) => (
                    <button
                      key={line.id}
                      onClick={() => handleLineChange(line.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded border flex items-center transition-all ${
                        selectedLine === line.id
                          ? 'bg-green-400 border-black text-black shadow-[0_2px_4px_0_rgba(0,0,0,0.35),_0_1px_0_#222]'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <div 
                        className="w-2 h-2 mr-2 rounded-full"
                        style={{ backgroundColor: selectedLine === line.id ? '#166534' : '#16a34a' }}
                      ></div>
                      {line.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          






          {/* Main Content Area */}
          
          
          
          
          
          <div className="flex-1">
            {/* <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Monitoring Produksi</h1>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">View Mode:</label>
                  <div className="flex bg-gray-200 p-1 rounded-md">
                    <button
                      onClick={() => setViewMode('normal')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        viewMode === 'normal'
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setViewMode('hourly')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        viewMode === 'hourly'
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('shift');
                        setShiftStartDate(getCurrentMonthStart());
                        setShiftEndDate(getCurrentMonthEnd());
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        viewMode === 'shift'
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Shift
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="space-y-4 py-2">
              {isProductionGroup && selectedLine === 'pg_1' ? (
                <Pd1Dashboard />
              ) : isProductionGroup ? (
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 text-blue-900 shadow-md">
                  <h2 className="text-xl font-bold mb-2">📊 Group Dashboard: {selectedGroup?.name}</h2>
                  <p className="text-sm mb-4">
                    You have selected <strong>{selectedGroup?.name}</strong>. This section will display aggregated efficiency, productivity, and performance metrics across all lines within this group.
                  </p>
                  <div className="bg-white p-4 rounded border border-blue-200 mt-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Coming Soon Features:</h3>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                      <li>Combined efficiency chart across lines</li>
                      <li>Productivity comparison vs target</li>
                      <li>Shift-wise performance summary</li>
                      <li>Exportable group report</li>
                    </ul>
                  </div>
                  <div className="mt-6 text-xs text-blue-600 italic">
                    Please stay tuned — development in progress!
                  </div>
                </div>
              ) : viewMode === 'hourly' ? (
                <div className="p-2 md:p-4 bg-white rounded shadow border border-gray-300 box-border min-h-[60vh] md:min-h-[70vh] w-full font-['Segoe UI', Roboto, 'Helvetica Neue', sans-serif]">
                  {hourlyLoading ? (
                    <div className="p-4 text-center">
                      <div className="text-sm md:text-base font-medium">Memuat data...</div>
                    </div>
                  ) : hourlyError ? (
                    <div className="p-4 text-red-500 text-center text-sm md:text-base">
                      Error: {hourlyError}
                    </div>
                  ) : (
                    <>
                      <h1 className="text-center text-xl md:text-2xl font-semibold mb-2 text-gray-800 mt-1">
                        Catatan Produksi Per Jam - {selectedLine.replace('_', ' ').toUpperCase()}
                      </h1>

                      <FilterControls
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                        selectedChartType={selectedChartType}
                        onChartTypeChange={handleChartTypeChange}
                        availableDates={availableDates}
                      />

                      <div className="w-full mt-2 min-h-[22rem] md:min-h-[28rem] mb-2">
                        <ChartComponent
                          data={filteredData}
                          chartType={selectedChartType}
                          startDate={startDate}
                          endDate={endDate}
                        />
                      </div>

                      {(startDate || endDate) && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-300 text-sm md:text-base text-gray-600 text-center shadow-sm mb-2">
                          <strong>Filter Aktif:</strong>{' '}
                          {startDate ? `Tanggal Mulai: ${new Date(startDate).toLocaleDateString('id-ID')}` : ''}{' '}
                          {endDate ? ` | Tanggal Akhir: ${new Date(endDate).toLocaleDateString('id-ID')}` : ''}
                        </div>
                      )}

                      <div className="h-2"></div>
                    </>
                  )}
                </div>
              ) : viewMode === 'shift' ? (
                <div className="p-2 md:p-4 bg-white rounded shadow border border-gray-300 box-border min-h-[60vh] md:min-h-[70vh] w-full font-['Segoe UI', Roboto, 'Helvetica Neue', sans-serif]">
                  {hourlyLoading ? (
                    <div className="p-4 text-center">
                      <div className="text-sm md:text-base font-medium">Memuat data...</div>
                    </div>
                  ) : hourlyError ? (
                    <div className="p-4 text-red-500 text-center text-sm md:text-base">
                      Error: {hourlyError}
                    </div>
                  ) : (
                    <>
                      <h1 className="text-center text-xl md:text-2xl font-semibold mb-2 text-gray-800 mt-1">
                        Konsumsi Actual per Shift - {selectedLine.replace('_', ' ').toUpperCase()}
                      </h1>

                      <FilterControls
                        startDate={shiftStartDate}
                        endDate={shiftEndDate}
                        onStartDateChange={handleShiftStartDateChange}
                        onEndDateChange={handleShiftEndDateChange}
                        selectedChartType={selectedChartType}
                        onChartTypeChange={handleChartTypeChange}
                        availableDates={availableDates}
                      />

                      <div className="w-full mt-4 min-h-[22rem] md:min-h-[28rem] mb-2">
                        <ActualConsumptionChart
                          data={hourlyData}
                          startDate={shiftStartDate}
                          endDate={shiftEndDate}
                        />
                      </div>

                      {(shiftStartDate || shiftEndDate) && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-300 text-sm md:text-base text-gray-600 text-center shadow-sm mb-2">
                          <strong>Filter Aktif:</strong>{' '}
                          {shiftStartDate ? `Tanggal Mulai: ${new Date(shiftStartDate).toLocaleDateString('id-ID')}` : ''}{' '}
                          {shiftEndDate ? ` | Tanggal Akhir: ${new Date(shiftEndDate).toLocaleDateString('id-ID')}` : ''}
                        </div>
                      )}

                      <div className="h-2"></div>
                    </>
                  )}
                </div>
              ) : (
                <ProductionChart
                  chartType={chartType}
                  setChartType={setChartType}
                  chartData={chartData}
                  loading={loading}
                  error={error}
                  fetchProductionData={fetchProductionData}
                  selectedLine={selectedLine}
                  selectedMetrics={selectedMetrics}
                  handleMetricToggle={handleMetricToggle}
                  getLineColor={getLineColor}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              )}
            </div>




          </div>




          
        </div>





      </div>
    </Layout>


  );
};

export default Montiv;
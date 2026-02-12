import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Layout from '../layout/Layout';


const ManhourYearly = () => {
  const [activeView, setActiveView] = useState('table');
  const [chartType, setChartType] = useState('line');

  // Data berdasarkan tabel CR06
  const tableData = {
    headers: ['RZ4E-B', 'Base', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUNI', 'JULI', 'AGS', 'SEP', 'OKT', 'NOV', 'DES', 'Rata-rata', 'Turun (%)', 'BASE 2023', 'Target 2023', 'RZ4E-B'],
    
    rows: [
      {
        title: 'Σ Produkti (pcs)',
        base: '526',
        monthly: ['11,220', '5,958', '0', '4,362', '9,862', '10,150', '11,808', '10,290', '10,302', '12,654', '11,286', '11,274'],
        rataRata: '86,606',
        turun: '7',
        base2023: '',
        target2023: '#DIV/0!',
        gdB: '11375'
      },
      {
        title: 'Σ Man.Hour (man.minute)',
        base: '4,238',
        monthly: ['88,082', '46,908', '0', '37,088', '90,232', '83,436', '90,928', '77,420', '75,000', '91,464', '81,968', '83,772'],
        rataRata: '680,558',
        turun: '',
        base2023: '',
        target2023: '',
        gdB: '81015'
      },
      {
        title: 'Man Hour (man.minute/pcs)',
        base: '8.06',
        monthly: ['7.85', '7.87', '0.00', '8.50', '9.15', '8.22', '7.70', '7.52', '7.28', '7.23', '7.26', '7.43'],
        rataRata: '7.86',
        turun: '0.07',
        base2023: '#DIV/0!',
        target2023: '',
        gdB: ''
      },
      {
        title: 'Target Produktivitas (hours)',
        base: '71',
        monthly: ['1507', '800', '0', '586', '1325', '1363', '1586', '1382', '1384', '1700', '1516', '1514'],
        rataRata: '11,633',
        turun: '',
        base2023: '0',
        target2023: '',
        gdB: ''
      },
      {
        title: 'Produktivitas Actual (hours)',
        base: '71',
        monthly: ['1468', '782', '0', '618', '1504', '1391', '1515', '1290', '1250', '1524', '1366', '1396'],
        rataRata: '11,343',
        turun: '',
        base2023: '0',
        target2023: '',
        gdB: ''
      },
      {
        title: '',
        base: '0.05',
        monthly: ['7.50', '8.01', '7.97', '7.92', '7.87', '7.82', '7.78', '7.73', '7.68', '7.64', '7.59', '7.54'],
        rataRata: '7.50',
        turun: '',
        base2023: '',
        target2023: '',
        gdB: ''
      }
    ]
  };

  // Data pencapaian actual
  const pencapaianData = {
    base: '',
    monthly: ['98', '99', '0', '108', '117', '106', '100', '98', '95', '95', '96', '99'],
    rataRata: '',
    note: ''
  };

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUNI', 'JULI', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'];

  // Data untuk chart - Man Hour (man.minute/pcs)
  const manHourData = months.map((month, index) => {
    const value = parseFloat(tableData.rows[2].monthly[index].replace(/,/g, '')) || 0;
    const targetValue = parseFloat(tableData.rows[5].monthly[index]) || 0;
    const pencapaian = parseFloat(pencapaianData.monthly[index]) || 0;
    
    return {
      month,
      manHour: value,
      target: targetValue,
      pencapaian: pencapaian,
      // Warna berdasarkan nilai
      color: value === 0 ? '#9CA3AF' : 
             value > 8.5 ? '#F97316' : 
             value > 8 ? '#F59E0B' : 
             value < 7.5 ? '#10B981' : '#F59E0B'
    };
  });

  // Data untuk chart produksi
  const productionData = months.map((month, index) => {
    const production = parseFloat(tableData.rows[0].monthly[index].replace(/,/g, '')) || 0;
    const manHourTotal = parseFloat(tableData.rows[1].monthly[index].replace(/,/g, '')) || 0;
    
    return {
      month,
      production,
      manHourTotal
    };
  });

  // Helper functions
  const formatCell = (value) => {
    if (!value || value === '') return '-';
    return value;
  };

  const getValueColor = (value, rowIndex) => {
    if (!value || value === '' || value === '0' || value === '0.00') return 'text-gray-800';
    
    if (rowIndex === 0) { // Produksi
      const num = parseFloat(value.replace(/,/g, ''));
      if (num > 10000) return 'text-orange-600 font-semibold';
      if (num > 5000) return 'text-yellow-600 font-medium';
      if (num === 0) return 'text-gray-400';
    }
    
    if (rowIndex === 2) { // Man Hour per pcs
      const num = parseFloat(value);
      if (num === 0) return 'text-gray-400';
      if (num > 8.5) return 'text-orange-600 font-semibold';
      if (num < 7.5) return 'text-green-600 font-semibold';
      return 'text-yellow-600 font-medium';
    }
    
    return 'text-gray-800';
  };

  const getCellBgColor = (value, rowIndex, colIndex) => {
    if (rowIndex === 2) { // Man Hour per pcs row
      const num = parseFloat(value);
      if (num === 0 || !value) return '';
      if (num > 9) return 'bg-orange-200';
      if (num > 8) return 'bg-yellow-200';
      if (num < 7.5) return 'bg-green-200';
      return 'bg-yellow-100';
    }
    return '';
  };

  const getPencapaianColor = (value) => {
    if (!value || value === '' || value === '0') return 'text-gray-400';
    const num = parseFloat(value);
    if (num >= 100) return 'bg-green-200 text-green-900 font-semibold';
    if (num >= 95) return 'bg-yellow-200 text-yellow-900 font-medium';
    return 'bg-orange-200 text-orange-900 font-medium';
  };

  // Custom tooltip untuk chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: <span className="font-bold">{entry.value.toFixed(2)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (

    <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Produksi CR06</h1>
                    <p className="text-gray-600 mt-1">Monitoring Produksi RZ4E-B</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                        Periode: Jan - Des 2023
                    </div>
                    </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Grafik Man Hour (man.minute/pcs)</h2>
                        {/* <p className="text-gray-600 text-sm mt-1">Perkembangan bulanan efisiensi produksi</p> */}
                    </div>
                    
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <button
                          onClick={() => setChartType('line')}
                          className={`px-4 py-2 rounded-lg font-medium ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          Line Chart
                        </button>
                        <button
                          onClick={() => setChartType('bar')}
                          className={`px-4 py-2 rounded-lg font-medium ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          Bar Chart
                        </button>
                    </div>
                  </div>

                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                        <LineChart
                            data={manHourData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis 
                            dataKey="month" 
                            stroke="#6B7280"
                            fontSize={12}
                            />
                            <YAxis 
                            stroke="#6B7280"
                            fontSize={12}
                            label={{ 
                                value: 'man.minute/pcs', 
                                angle: -90, 
                                position: 'insideLeft',
                                offset: -10,
                                style: { textAnchor: 'middle' }
                            }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                            type="monotone"
                            dataKey="manHour"
                            name="Man Hour Actual"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                            dot={{ r: 4 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="target"
                              name="Target"
                              stroke="#10B981"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                        </LineChart>
                        ) : (
                        <BarChart
                          data={manHourData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6B7280"
                            fontSize={12}
                            label={{ 
                                value: 'man.minute/pcs', 
                                angle: -90, 
                                position: 'insideLeft',
                                offset: -10,
                                style: { textAnchor: 'middle' }
                              }}
                          />

                          <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          <Bar
                            name="Man Hour (man.minute/pcs)"
                            dataKey="manHour"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                          >
                            {manHourData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                        )}
                    </ResponsiveContainer>
                  </div>

                  {/* Legend Information */}
                  {/* <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Baik (&lt; 7.5)</span>
                  </div>
                  <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Sedang (7.5 - 8.0)</span>
                  </div>
                  <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-200 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Perhatian (&gt; 8.0)</span>
                  </div>
                  <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Tidak Ada Data</span>
                  </div>
                  </div> */}
                </div>
              </div>

              {/* Main Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Data Produksi CR06 - RZ4E-B</h2>
                  <p className="text-gray-600 text-sm mt-1">Tabel detail produksi per bulan</p>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                      <tr className="bg-gray-50">
                      {tableData.headers.map((header, index) => (
                          <th 
                          key={index} 
                          className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < tableData.headers.length - 1 ? 'border-r border-gray-200' : ''}`}
                          >
                          {header}
                          </th>
                      ))}
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {tableData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100">
                          {row.title}
                          </td>
                          <td className={`px-4 py-3 whitespace-nowrap text-sm border-r border-gray-100 ${getCellBgColor(row.base, rowIndex, -1)}`}>
                          <span className={getValueColor(row.base, rowIndex)}>
                              {formatCell(row.base)}
                          </span>
                          </td>
                          
                          {row.monthly.map((value, monthIndex) => (
                          <td 
                              key={monthIndex} 
                              className={`px-4 py-3 whitespace-nowrap text-sm border-r border-gray-100 ${getCellBgColor(value, rowIndex, monthIndex)} ${getValueColor(value, rowIndex)}`}
                          >
                              {formatCell(value)}
                          </td>
                          ))}
                          
                          <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold border-r border-gray-100 ${getCellBgColor(row.rataRata, rowIndex, -2)} ${rowIndex === 2 ? 'bg-green-200 text-green-900' : 'bg-blue-50 text-gray-900'}`}>
                          {formatCell(row.rataRata)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
                          {formatCell(row.turun)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
                          {formatCell(row.base2023)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
                          {formatCell(row.target2023)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCell(row.gdB)}
                          </td>
                      </tr>
                      ))}
                      
                      {/* Pencapaian Actual Row */}
                      <tr className="bg-blue-50 hover:bg-blue-100">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-200">
                          Pencapaian Actual (%)
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                          <span className={pencapaianData.base ? getPencapaianColor(pencapaianData.base) : ''}>
                          {formatCell(pencapaianData.base)}
                          </span>
                      </td>
                      
                      {pencapaianData.monthly.map((value, index) => (
                          <td 
                          key={index} 
                          className={`px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200`}
                          >
                          <span className={`px-2 py-1 rounded ${getPencapaianColor(value)}`}>
                              {formatCell(value)}
                          </span>
                          </td>
                      ))}
                      
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 border-r border-gray-200 bg-blue-100">
                          {formatCell(pencapaianData.rataRata)}
                      </td>
                      <td colSpan="4" className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 italic">
                          {pencapaianData.note}
                      </td>
                      </tr>
                  </tbody>
                  </table>
              </div>
              </div>
          </div>
        </div>
    </Layout>
  );
};

export default ManhourYearly;
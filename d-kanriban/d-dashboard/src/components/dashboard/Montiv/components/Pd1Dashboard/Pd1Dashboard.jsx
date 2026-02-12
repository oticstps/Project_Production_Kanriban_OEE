// src/pages/Montiv/components/Pd1Dashboard/Pd1Dashboard.jsx
import React from 'react';
import { pd1Data } from '../../utils/constants';
import ProductivityChart from '../ProductivityChart/ProductivityChart';
import ParetoChart from '../ParetoChart/ParetoChart';

const Pd1Dashboard = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">PD-1 Productivity Dashboard</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
          Target: {pd1Data.target}%
        </div>
      </div>


      {/* Productivity Chart */}
      <ProductivityChart />
      {/* Table */}
      <div className="overflow-x-auto mt-6 mb-6 border-gray-600 rounded-lg shadow-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left font-bold text-gray-800">Kategori</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Base</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Jan</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Feb</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Mar</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Apr</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Mei</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-left font-medium text-gray-800">Target Produktivitas (hours)</td>
              <td className="px-4 py-3 text-right text-gray-700">73.06</td>
              <td className="px-4 py-3 text-right text-gray-700">7.964</td>
              <td className="px-4 py-3 text-right text-gray-700">7.618</td>
              <td className="px-4 py-3 text-right text-gray-700">6.764</td>
              <td className="px-4 py-3 text-right text-gray-700">6.633</td>
              <td className="px-4 py-3 text-right text-gray-700">7.620</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-left font-medium text-gray-800">Produktivitas Actual (hours)</td>
              <td className="px-4 py-3 text-right text-gray-700">73.06</td>
              <td className="px-4 py-3 text-right text-gray-700">7.422</td>
              <td className="px-4 py-3 text-right text-gray-700">7.378</td>
              <td className="px-4 py-3 text-right text-gray-700">6.333</td>
              <td className="px-4 py-3 text-right text-gray-700">6.029</td>
              <td className="px-4 py-3 text-right text-gray-700">7.100</td>
            </tr>
            <tr className="border-b border-gray-200 bg-blue-50">
              <td className="px-4 py-3 text-left font-bold text-blue-800">Persentase (%)</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">100</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">93.19</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">96.85</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">93.62</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">90.90</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">93.19</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-left font-medium text-gray-800">Total man hour</td>
              <td className="px-4 py-3 text-right text-gray-700">20.94</td>
              <td className="px-4 py-3 text-right text-gray-700">18.87</td>
              <td className="px-4 py-3 text-right text-gray-700">19.91</td>
              <td className="px-4 py-3 text-right text-gray-700">18.97</td>
              <td className="px-4 py-3 text-right text-gray-700">18.54</td>
              <td className="px-4 py-3 text-right text-gray-700">19.46</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Pareto Chart */}
      <ParetoChart />


    </div>
  );
};

export default Pd1Dashboard;
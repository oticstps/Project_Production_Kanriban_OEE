import React from 'react';
import { Activity, Target, TrendingUp, Clock } from 'lucide-react';
import DigitalClock from '../DigitalClock';

const Header = ({ latestData }) => {
  return (
    <div className="bg-white p-2 border border-gray-300 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1 flex-wrap">
          {latestData.line_name && (
            <p className="text-sm font-bold text-gray-800">Line: {latestData.line_name}</p>
          )}
          {latestData.name_product && (
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-amber-700">Product: {latestData.name_product}</p>
              <div className={`px-1 py-0.5 text-xs font-semibold rounded ${
                latestData.status === 'NORMAL' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {latestData.status || 'LOADING'}
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <DigitalClock />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        <div className="bg-gray-50 p-1 rounded border border-gray-200">
          <div className="flex items-center mb-0.5">
            <Activity className="w-3 h-3 text-blue-600 mr-0.5" />
            <span className="text-xs font-medium text-gray-700">Actual PCS</span>
          </div>
          <div className="text-sm font-bold text-gray-900">{latestData.actual_pcs || '---'}</div>
        </div>
        <div className="bg-gray-50 p-1 rounded border border-gray-200">
          <div className="flex items-center mb-0.5">
            <Target className="w-3 h-3 text-green-600 mr-0.5" />
            <span className="text-xs font-medium text-gray-700">Target</span>
          </div>
          <div className="text-sm font-bold text-gray-900">{latestData.target || '---'}</div>
        </div>
        <div className="bg-gray-50 p-1 rounded border border-gray-200">
          <div className="flex items-center mb-0.5">
            <TrendingUp className="w-3 h-3 text-purple-600 mr-0.5" />
            <span className="text-xs font-medium text-gray-700">Efficiency</span>
          </div>
          <div className="text-sm font-bold text-gray-900">{latestData.efficiency || '---'}%</div>
        </div>
        <div className="bg-gray-50 p-1 rounded border border-gray-200">
          <div className="flex items-center mb-0.5">
            <Clock className="w-3 h-3 text-orange-600 mr-0.5" />
            <span className="text-xs font-medium text-gray-700">Cycle Time</span>
          </div>
          <div className="text-sm font-bold text-gray-900">{latestData.cycle_time || '---'}s</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
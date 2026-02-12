import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    <div className="mb-2 p-2 border border-gray-300 rounded-lg bg-white shadow-md">
      <h3 className="mb-2 text-gray-800 text-base font-semibold">
        Kontrol Filter
      </h3>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <label className="font-medium w-20 text-sm text-gray-700">
          Tanggal:
        </label>
        <div className="flex items-center gap-2 flex-1">
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(date) => onStartDateChange(date ? date.toISOString().split('T')[0] : '')}
            maxDate={availableDates[0] ? new Date(availableDates[0]) : null}
            dateFormat="yyyy-MM-dd"
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900 w-36 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Mulai"
          />
          <span className="text-gray-500">-</span>
          <DatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={(date) => onEndDateChange(date ? date.toISOString().split('T')[0] : '')}
            maxDate={availableDates[0] ? new Date(availableDates[0]) : null}
            dateFormat="yyyy-MM-dd"
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900 w-36 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Akhir"
          />
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <label className="font-medium w-20 text-sm text-gray-700">
          Chart:
        </label>
        <div className="flex gap-1 flex-wrap flex-1">
          {['bar', 'line', 'area'].map(type => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                selectedChartType === type
                  ? type === 'bar'
                    ? 'bg-green-500 text-white border-green-500'
                    : type === 'line'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-orange-500 text-white border-orange-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'bar' ? 'Bar' : type === 'line' ? 'Line' : 'Area'}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {(startDate || endDate) && (
        <button
          onClick={() => {
            onStartDateChange('');
            onEndDateChange('');
          }}
          className="px-3 py-1 bg-red-500 text-white border border-red-500 rounded-md cursor-pointer text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
      )}

      {/* Info */}
      {availableDates.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Tanggal tersedia: {availableDates.length} hari
        </div>
      )}
    </div>
  );
};

export default FilterControls;
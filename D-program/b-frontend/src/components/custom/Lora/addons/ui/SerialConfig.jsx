// addons/ui/SerialConfig.jsx
import React from 'react';
import { BAUD_RATES, DATA_BITS, STOP_BITS, PARITY_OPTIONS } from '../settings';

const SerialConfig = ({ config, onChange }) => {
  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-blue-100">
      <h2 className="text-base md:text-lg font-bold text-blue-800 mb-2 md:mb-3">Serial Configuration</h2>
      <div className="space-y-2">
        <div>
          <label className="block text-xs md:text-sm text-gray-600 mb-1">Port</label>
          <input
            type="text"
            value={config.port}
            onChange={(e) => onChange('port', e.target.value)}
            className="w-full p-1.5 md:p-2 text-xs md:text-sm border border-gray-300 rounded-lg"
            placeholder="e.g., COM4 or /dev/ttyUSB0"
          />
        </div>
        <div>
          <label className="block text-xs md:text-sm text-gray-600 mb-1">Baud Rate</label>
          <select
            value={config.baudRate}
            onChange={(e) => onChange('baudRate', parseInt(e.target.value))}
            className="w-full p-1.5 md:p-2 text-xs md:text-sm border border-gray-300 rounded-lg"
          >
            {BAUD_RATES.map(rate => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs md:text-sm text-gray-600 mb-1">Data Bits</label>
          <select
            value={config.dataBits}
            onChange={(e) => onChange('dataBits', parseInt(e.target.value))}
            className="w-full p-1.5 md:p-2 text-xs md:text-sm border border-gray-300 rounded-lg"
          >
            {DATA_BITS.map(bits => (
              <option key={bits} value={bits}>{bits}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs md:text-sm text-gray-600 mb-1">Stop Bits</label>
          <select
            value={config.stopBits}
            onChange={(e) => onChange('stopBits', parseInt(e.target.value))}
            className="w-full p-1.5 md:p-2 text-xs md:text-sm border border-gray-300 rounded-lg"
          >
            {STOP_BITS.map(bits => (
              <option key={bits} value={bits}>{bits}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs md:text-sm text-gray-600 mb-1">Parity</label>
          <select
            value={config.parity}
            onChange={(e) => onChange('parity', e.target.value)}
            className="w-full p-1.5 md:p-2 text-xs md:text-sm border border-gray-300 rounded-lg"
          >
            {PARITY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SerialConfig;
// src/pages/Montiv/components/ProductivityChart/ProductivityChart.jsx
import React from 'react';
import { pd1Data } from '../../utils/constants';

const ProductivityChart = () => {
  const width = 800;
  const height = 300;
  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Skala Y: 60% → bottom, 100% → top (1% = 0.6px)
  const scaleY = (value) => {
    return chartHeight - ((value - 60) * 0.6);
  };

  // Skala X: 13 titik (Base + 12 bulan)
  const scaleX = (index) => {
    return padding + (index * (chartWidth / (pd1Data.months.length - 1)));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Produktivitas Bulanan (%)</h3>
      <div className="relative w-full h-72 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="select-none">
          {/* Grid Lines (horizontal) */}
          {[...Array(11)].map((_, i) => {
            const y = padding + (i * (chartHeight / 10));
            const label = 100 - i * 4; // 100, 96, ..., 60
            return (
              <g key={`grid-y-${i}`}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6b7280"
                  className="select-none"
                >
                  {label}%
                </text>
              </g>
            );
          })}

          {/* Grid Lines (vertical) */}
          {pd1Data.months.map((_, i) => {
            const x = scaleX(i);
            return (
              <line
                key={`grid-x-${i}`}
                x1={x}
                y1={padding}
                x2={x}
                y2={height - padding}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* Target Line */}
          <line
            x1={padding}
            y1={scaleY(pd1Data.target)}
            x2={width - padding}
            y2={scaleY(pd1Data.target)}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="6,4"
            className="opacity-90"
          />

          {/* Data Line */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pd1Data.productivityPercent.map((pct, i) => {
              const x = scaleX(i);
              const y = scaleY(pct);
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Data Points */}
          {pd1Data.productivityPercent.map((pct, i) => {
            const x = scaleX(i);
            const y = scaleY(pct);
            return (
              <circle
                key={`point-${i}`}
                cx={x}
                cy={y}
                r="5"
                fill="#2563eb"
                stroke="#1d4ed8"
                strokeWidth="2"
                className="drop-shadow-sm hover:r-6 transition-all duration-200 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-600 font-medium">
          {pd1Data.months.map((month, i) => (
            <span key={i} className="text-center min-w-[40px]">{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
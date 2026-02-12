// src/pages/Montiv/components/ParetoChart/ParetoChart.jsx
import React from 'react';
import { paretoData, paretoTotal } from '../../utils/constants';

const ParetoChart = () => {
  const width = 1000;
  const height = 320;
  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Skala Y: 0 → bottom, 14 → top (1 min = 10px)
  const scaleY = (value) => {
    return chartHeight - (value * 10);
  };

  // Skala X: 11 bar → 800px, jadi setiap bar = ~70px
  const scaleX = (index) => {
    return padding + (index * (chartWidth / (paretoData.length - 1)));
  };

  // Kumulatif Persentase
  const cumulativePercentages = paretoData.map((item, i) => {
    const total = paretoData.slice(0, i + 1).reduce((sum, d) => sum + d.value, 0);
    return (total / paretoTotal) * 100;
  });

  // Skala Y untuk persentase (0% → bottom, 100% → top)
  const scalePercentY = (percent) => {
    return chartHeight - (percent * 2); // 1% = 2px
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Pareto Rata-rata Man Hour per Line PD-1</h3>
      <div className="relative w-full h-72 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="select-none">
          {/* Grid Lines (horizontal) */}
          {[...Array(15)].map((_, i) => {
            const y = padding + (i * (chartHeight / 14));
            const label = 14 - i * 1; // 14, 13, ..., 0
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
                  {label.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid Lines */}
          {paretoData.map((_, i) => {
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

          {/* Line Chart: Kumulatif Persentase */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            points={cumulativePercentages.map((pct, i) => {
              const x = scaleX(i);
              const y = scalePercentY(pct);
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Points on Line */}
          {cumulativePercentages.map((pct, i) => {
            const x = scaleX(i);
            const y = scalePercentY(pct);
            return (
              <circle
                key={`point-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                stroke="#1d4ed8"
                strokeWidth="1"
              />
            );
          })}

          {/* Bar Chart */}
          {paretoData.map((item, i) => {
            const x = scaleX(i);
            const y = scaleY(item.value);
            const barWidth = (chartWidth / (paretoData.length - 1)) * 0.8;
            return (
              <g key={`bar-${i}`}>
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={chartHeight - y}
                  fill="#3b82f6"
                  opacity="0.8"
                  rx="4"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#1f2937"
                  fontWeight="bold"
                >
                  {item.value.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Total Label */}
          <text
            x={width / 2}
            y={height / 2 + 10}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="bold"
          >
            Total = {paretoTotal} Mnt / pcs
          </text>

          {/* Y-Axis Labels */}
          <text
            x={padding - 20}
            y={padding + 10}
            transform="rotate(-90, 0, 0)"
            fontSize="10"
            fill="#6b7280"
            textAnchor="middle"
          >
            Minutes (pcs)
          </text>

          {/* Right Y-Axis (Persentase) */}
          <g transform="translate(0, 0)">
            <text
              x={width - padding + 10}
              y={padding + 10}
              transform="rotate(90, 0, 0)"
              fontSize="10"
              fill="#6b7280"
              textAnchor="middle"
            >
              Cumulative %
            </text>
            {[0, 20, 40, 60, 80, 100].map((pct) => (
              <g key={`right-y-${pct}`}>
                <line
                  x1={width - padding}
                  y1={scalePercentY(pct)}
                  x2={width - padding + 5}
                  y2={scalePercentY(pct)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={width - padding + 10}
                  y={scalePercentY(pct) + 4}
                  textAnchor="start"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {pct}%
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-600 font-medium">
          {paretoData.map((item, i) => (
            <div key={i} className="text-center min-w-[80px]">
              <div className="truncate">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParetoChart;
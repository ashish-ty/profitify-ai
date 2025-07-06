import React from 'react';
import { ChartData } from '../../types';

interface ProfessionalChartProps {
  data: ChartData[];
  title: string;
  type?: 'line' | 'area' | 'bar';
  color?: string;
  height?: number;
  showGrid?: boolean;
  showDataPoints?: boolean;
  gradient?: boolean;
}

export function ProfessionalChart({
  data,
  title,
  type = 'line',
  color = '#16A34A',
  height = 300,
  showGrid = true,
  showDataPoints = true,
  gradient = true
}: ProfessionalChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = 60;
  const chartWidth = 800;
  const chartHeight = height - 100;

  // Calculate positions
  const stepX = (chartWidth - padding * 2) / (data.length - 1);
  const points = data.map((item, index) => ({
    x: padding + index * stepX,
    y: padding + (chartHeight - padding * 2) - ((item.value - minValue) / range) * (chartHeight - padding * 2),
    value: item.value,
    label: item.month
  }));

  // Generate smooth curve path
  const generateSmoothPath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === 1) {
        // First curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Smooth curves using control points
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y + (curr.y - prev.y) * 0.3;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y - (curr.y - prev.y) * 0.3;
        path += ` S ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    const linePath = generateSmoothPath();
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${linePath} L ${lastPoint.x} ${chartHeight + padding} L ${firstPoint.x} ${chartHeight + padding} Z`;
  };

  // Generate Y-axis labels
  const yAxisLabels = [];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const value = minValue + (range * i / steps);
    const y = padding + (chartHeight - padding * 2) - (i / steps) * (chartHeight - padding * 2);
    yAxisLabels.push({ value, y });
  }

  return (
    <div className="w-full mb-8">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      
      <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="overflow-visible mb-4"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
            
            <linearGradient id={`line-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </linearGradient>

            {/* Drop shadow filter */}
            <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Grid Lines */}
          {showGrid && (
            <g className="opacity-30">
              {/* Horizontal grid lines */}
              {yAxisLabels.map((label, index) => (
                <line
                  key={`h-grid-${index}`}
                  x1={padding}
                  y1={label.y}
                  x2={chartWidth - padding}
                  y2={label.y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              ))}
              
              {/* Vertical grid lines */}
              {points.map((point, index) => (
                <line
                  key={`v-grid-${index}`}
                  x1={point.x}
                  y1={padding}
                  x2={point.x}
                  y2={chartHeight + padding}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}

          {/* Area Fill (for area chart) */}
          {(type === 'area' || gradient) && (
            <path
              d={generateAreaPath()}
              fill={`url(#gradient-${color.replace('#', '')})`}
              className="transition-all duration-500"
            />
          )}

          {/* Main Line */}
          <path
            d={generateSmoothPath()}
            fill="none"
            stroke={`url(#line-gradient-${color.replace('#', '')})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#dropshadow)"
            className="transition-all duration-500"
          />

          {/* Data Points */}
          {showDataPoints && points.map((point, index) => (
            <g key={`point-${index}`} className="group">
              {/* Outer ring */}
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="white"
                stroke={color}
                strokeWidth="3"
                className="transition-all duration-200 group-hover:r-10 drop-shadow-sm"
              />
              
              {/* Inner dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={color}
                className="transition-all duration-200"
              />
              
              {/* Hover tooltip */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect
                  x={point.x - 35}
                  y={point.y - 45}
                  width="70"
                  height="30"
                  rx="6"
                  fill="rgba(0, 0, 0, 0.8)"
                  className="drop-shadow-lg"
                />
                <text
                  x={point.x}
                  y={point.y - 30}
                  textAnchor="middle"
                  className="fill-white text-xs font-medium"
                >
                  {typeof point.value === 'number' ? point.value.toLocaleString() : point.value}
                </text>
                <text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor="middle"
                  className="fill-gray-300 text-xs"
                >
                  {point.label}
                </text>
              </g>
            </g>
          ))}

          {/* Y-Axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight + padding}
            stroke="#6B7280"
            strokeWidth="2"
          />

          {/* X-Axis */}
          <line
            x1={padding}
            y1={chartHeight + padding}
            x2={chartWidth - padding}
            y2={chartHeight + padding}
            stroke="#6B7280"
            strokeWidth="2"
          />

          {/* Y-Axis Labels */}
          {yAxisLabels.map((label, index) => (
            <text
              key={`y-label-${index}`}
              x={padding - 10}
              y={label.y + 4}
              textAnchor="end"
              className="fill-gray-600 text-sm font-medium"
            >
              {typeof label.value === 'number' ? 
                (label.value >= 1000 ? `${(label.value / 1000).toFixed(0)}K` : label.value.toFixed(0)) : 
                label.value
              }
            </text>
          ))}

          {/* X-Axis Labels */}
          {points.map((point, index) => (
            <text
              key={`x-label-${index}`}
              x={point.x}
              y={chartHeight + padding + 20}
              textAnchor="middle"
              className="fill-gray-600 text-sm font-medium"
            >
              {point.label}
            </text>
          ))}
        </svg>

        {/* Chart Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-500">Highest</div>
            <div className="text-lg font-semibold text-gray-900">
              {typeof maxValue === 'number' ? maxValue.toLocaleString() : maxValue}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Average</div>
            <div className="text-lg font-semibold text-gray-900">
              {typeof maxValue === 'number' ? 
                Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString() : 
                'N/A'
              }
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Trend</div>
            <div className={`text-lg font-semibold ${
              data.length > 1 && data[data.length - 1].value > data[0].value ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.length > 1 ? 
                `${data[data.length - 1].value > data[0].value ? '+' : ''}${(((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1)}%` : 
                'N/A'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
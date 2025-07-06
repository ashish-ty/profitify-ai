import React from 'react';
import { ChartData } from '../../../types';

interface SimpleChartProps {
  data: ChartData[];
  title: string;
  color?: string;
  type?: 'bar' | 'line';
}

export function SimpleChart({ data, title, color = 'bg-primary-600', type = 'bar' }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  // Generate SVG path for line chart
  const generateLinePath = () => {
    if (data.length === 0) return '';
    
    const width = 100;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    let path = '';
    data.forEach((item, index) => {
      const x = index * stepX;
      const y = height - ((item.value - minValue) / range) * height;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  // Generate area path for line chart
  const generateAreaPath = () => {
    if (data.length === 0) return '';
    
    const width = 100;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    let path = `M 0 ${height}`;
    data.forEach((item, index) => {
      const x = index * stepX;
      const y = height - ((item.value - minValue) / range) * height;
      path += ` L ${x} ${y}`;
    });
    path += ` L ${width} ${height} Z`;
    
    return path;
  };

  if (type === 'line') {
    return (
      <div className="h-full">
        {title && <h3 className="text-lg font-semibold text-primary-900 mb-4">{title}</h3>}
        <div className="h-full flex flex-col">
          {/* Line Chart SVG */}
          <div className="flex-1 relative">
            <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="60" fill="url(#grid)" />
              
              {/* Area under the line */}
              <path
                d={generateAreaPath()}
                fill={color.replace('bg-', '').includes('primary') ? '#16A34A' : '#3B82F6'}
                fillOpacity="0.1"
              />
              
              {/* Line */}
              <path
                d={generateLinePath()}
                fill="none"
                stroke={color.replace('bg-', '').includes('primary') ? '#16A34A' : '#3B82F6'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 60 - ((item.value - minValue) / range) * 60;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={color.replace('bg-', '').includes('primary') ? '#16A34A' : '#3B82F6'}
                    className="hover:r-3 transition-all duration-200"
                  />
                );
              })}
            </svg>
            
            {/* Hover tooltips */}
            <div className="absolute inset-0 flex">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 relative group cursor-pointer"
                  style={{ left: `${(index / (data.length - 1)) * 100}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    {item.month}: {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-accent-600">
            {data.map((item, index) => (
              <span key={index} className="text-center">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Bar chart (existing implementation)
  return (
    <div className="h-full">
      {title && <h3 className="text-lg font-semibold text-primary-900 mb-4">{title}</h3>}
      <div className="space-y-3 h-full flex flex-col justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between group">
            <span className="text-sm font-medium text-accent-700 w-20 truncate">{item.month}</span>
            <div className="flex-1 mx-4">
              <div className="bg-primary-100 rounded-full h-4 relative overflow-hidden">
                <div
                  className={`${color} h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-primary-900 w-20 text-right">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
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

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
      <h3 className="text-lg font-semibold text-primary-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-accent-700 w-20">{item.month}</span>
            <div className="flex-1 mx-4">
              <div className="bg-primary-100 rounded-full h-4 relative overflow-hidden">
                <div
                  className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
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
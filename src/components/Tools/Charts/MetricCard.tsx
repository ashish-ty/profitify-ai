import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { MetricCard as MetricCardType } from '../../../types';

interface MetricCardProps {
  metric: MetricCardType;
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
          <metric.icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {metric.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>{metric.change}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-primary-900 mb-1">{metric.value}</h3>
        <p className="text-accent-600 text-sm">{metric.title}</p>
      </div>
    </div>
  );
}
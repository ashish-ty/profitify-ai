import React, { useState } from 'react';
import { BarChart3, Table, Download } from 'lucide-react';
import { SimpleChart } from '../Tools/Charts/SimpleChart';
import { ChartData } from '../../types';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'percentage';
}

export interface TableRow {
  [key: string]: any;
}

interface ChartTableToggleProps {
  title: string;
  chartData: ChartData[];
  tableColumns: TableColumn[];
  tableData: TableRow[];
  chartColor?: string;
  chartType?: 'bar' | 'line';
  className?: string;
}

export function ChartTableToggle({
  title,
  chartData,
  tableColumns,
  tableData,
  chartColor = 'bg-primary-600',
  chartType = 'bar',
  className = ''
}: ChartTableToggleProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const formatCellValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'number':
        return Number(value).toLocaleString();
      case 'percentage':
        return `${Number(value).toFixed(1)}%`;
      default:
        return String(value);
    }
  };

  const exportToCSV = () => {
    const headers = tableColumns.map(col => col.label).join(',');
    const rows = tableData.map(row => 
      tableColumns.map(col => row[col.key]).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-primary-100 ${className}`}>
      {/* Header with Toggle */}
      <div className="p-6 border-b border-primary-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">{title}</h3>
          <div className="flex items-center space-x-2">
            {/* View Toggle */}
            <div className="flex bg-accent-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-accent-600 hover:text-primary-900'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Chart</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-accent-600 hover:text-primary-900'
                }`}
              >
                <Table className="h-4 w-4" />
                <span>Table</span>
              </button>
            </div>
            
            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'chart' ? (
          <div className={`${chartType === 'line' ? 'h-80' : 'h-64'} w-full`}>
            <SimpleChart
              data={chartData}
              title=""
              color={chartColor}
              type={chartType}
            />
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-accent-50 sticky top-0">
                <tr>
                  {tableColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-accent-200">
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-accent-50 transition-colors">
                    {tableColumns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-accent-900 whitespace-nowrap"
                      >
                        {formatCellValue(row[column.key], column.type)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
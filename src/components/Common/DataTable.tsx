import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search, Filter, Download } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'currency';
}

export interface TableData {
  [key: string]: any;
}

interface DataTableProps {
  columns: TableColumn[];
  data: TableData[];
  title: string;
  isLoading?: boolean;
  onRowClick?: (row: TableData) => void;
  onEdit?: (row: TableData) => void;
  onDelete?: (row: TableData) => void;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
}

export function DataTable({
  columns,
  data,
  title,
  isLoading = false,
  onRowClick,
  onEdit,
  onDelete,
  searchable = true,
  filterable = true,
  exportable = true,
  pageSize = 10
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search data
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const formatCellValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return `₹${Number(value).toLocaleString()}`;
      case 'number':
        return Number(value).toLocaleString();
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return String(value);
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => row[col.key]).join(',')
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-primary-100">
      {/* Header */}
      <div className="p-6 border-b border-primary-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-900">{title}</h3>
          <div className="flex items-center space-x-2">
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-3 py-2 text-sm border border-accent-300 rounded-lg hover:bg-accent-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
            {exportable && (
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-accent-50 rounded-lg">
            <p className="text-sm text-accent-600">Advanced filters coming soon...</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-accent-700 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-accent-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-accent-200">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-accent-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-primary-100 flex items-center justify-between">
          <div className="text-sm text-accent-600">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm border border-accent-300 rounded-lg hover:bg-accent-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'border border-accent-300 hover:bg-accent-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm border border-accent-300 rounded-lg hover:bg-accent-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
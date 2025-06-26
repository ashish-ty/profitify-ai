import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

interface BillRegisterRow {
  medicalRecordNumber: string;
  inpatientNumber: string;
  billNumber: string;
  city: string;
  state: string;
  gender: 'M' | 'F' | 'O';
  age: number;
  admissionDate: string;
  dischargeDate: string;
  doctorIdentifier: string;
  doctorDepartmentName: string;
  billType: string;
  billMonth: string;
  patientCategory: string;
  grossBillAmount: number;
  discountAmount: number;
  netBillAmount: number;
  intensiveCaredays: number;
  nonIntensiveCareDays: number;
  payorType: string;
  payorName: string;
  paymentMethod: string;
  billingCategory: string;
  coPayor1Name?: string;
  coPayor1Amount?: number;
  coPayor2Name?: string;
  coPayor2Amount?: number;
  coPayor3Name?: string;
  coPayor3Amount?: number;
}

interface TableColumn {
  key: keyof BillRegisterRow;
  label: string;
  width: number;
  type: 'text' | 'number' | 'date' | 'currency';
  visible: boolean;
}

const BILL_REGISTER_COLUMNS: TableColumn[] = [
  { key: 'medicalRecordNumber', label: 'Medical Record Number', width: 180, type: 'text', visible: true },
  { key: 'inpatientNumber', label: 'Inpatient Number', width: 150, type: 'text', visible: true },
  { key: 'billNumber', label: 'Bill Number', width: 130, type: 'text', visible: true },
  { key: 'city', label: 'City', width: 120, type: 'text', visible: true },
  { key: 'state', label: 'State', width: 100, type: 'text', visible: true },
  { key: 'gender', label: 'Gender', width: 80, type: 'text', visible: true },
  { key: 'age', label: 'Age', width: 70, type: 'number', visible: true },
  { key: 'admissionDate', label: 'Admission Date', width: 130, type: 'date', visible: true },
  { key: 'dischargeDate', label: 'Discharge Date', width: 130, type: 'date', visible: true },
  { key: 'doctorIdentifier', label: 'Doctor ID', width: 120, type: 'text', visible: true },
  { key: 'doctorDepartmentName', label: 'Department', width: 140, type: 'text', visible: true },
  { key: 'billType', label: 'Bill Type', width: 100, type: 'text', visible: true },
  { key: 'billMonth', label: 'Bill Month', width: 110, type: 'text', visible: true },
  { key: 'patientCategory', label: 'Patient Category', width: 140, type: 'text', visible: true },
  { key: 'grossBillAmount', label: 'Gross Amount', width: 130, type: 'currency', visible: true },
  { key: 'discountAmount', label: 'Discount', width: 110, type: 'currency', visible: true },
  { key: 'netBillAmount', label: 'Net Amount', width: 130, type: 'currency', visible: true },
  { key: 'intensiveCaredays', label: 'ICU Days', width: 100, type: 'number', visible: true },
  { key: 'nonIntensiveCareDays', label: 'Non-ICU Days', width: 120, type: 'number', visible: true },
  { key: 'payorType', label: 'Payor Type', width: 120, type: 'text', visible: true },
  { key: 'payorName', label: 'Payor Name', width: 150, type: 'text', visible: true },
  { key: 'paymentMethod', label: 'Payment Method', width: 140, type: 'text', visible: true },
  { key: 'billingCategory', label: 'Billing Category', width: 140, type: 'text', visible: true },
  { key: 'coPayor1Name', label: 'Co-Payor 1 Name', width: 150, type: 'text', visible: false },
  { key: 'coPayor1Amount', label: 'Co-Payor 1 Amount', width: 150, type: 'currency', visible: false },
  { key: 'coPayor2Name', label: 'Co-Payor 2 Name', width: 150, type: 'text', visible: false },
  { key: 'coPayor2Amount', label: 'Co-Payor 2 Amount', width: 150, type: 'currency', visible: false },
  { key: 'coPayor3Name', label: 'Co-Payor 3 Name', width: 150, type: 'text', visible: false },
  { key: 'coPayor3Amount', label: 'Co-Payor 3 Amount', width: 150, type: 'currency', visible: false },
];

// Dummy data for Bill Register
const DUMMY_BILL_REGISTER_DATA: BillRegisterRow[] = Array.from({ length: 150 }, (_, index) => ({
  medicalRecordNumber: `MRN${String(index + 1).padStart(6, '0')}`,
  inpatientNumber: `IP${String(index + 1).padStart(5, '0')}`,
  billNumber: `BILL${String(index + 1).padStart(7, '0')}`,
  city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][index % 5],
  state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal'][index % 5],
  gender: ['M', 'F', 'O'][index % 3] as 'M' | 'F' | 'O',
  age: 20 + (index % 60),
  admissionDate: new Date(2024, (index % 12), (index % 28) + 1).toISOString().split('T')[0],
  dischargeDate: new Date(2024, (index % 12), (index % 28) + 3).toISOString().split('T')[0],
  doctorIdentifier: `DOC${String(index % 50 + 1).padStart(3, '0')}`,
  doctorDepartmentName: ['Cardiology', 'Oncology', 'Neurology', 'Gynaecology', 'Emergency'][index % 5],
  billType: ['IPD', 'OPD', 'Emergency'][index % 3],
  billMonth: ['January', 'February', 'March', 'April', 'May', 'June'][index % 6],
  patientCategory: ['General', 'Senior Citizen', 'Child', 'VIP'][index % 4],
  grossBillAmount: 5000 + (index * 150),
  discountAmount: 200 + (index * 10),
  netBillAmount: 4800 + (index * 140),
  intensiveCaredays: index % 10,
  nonIntensiveCareDays: (index % 15) + 1,
  payorType: ['Insurance', 'Cash', 'Corporate'][index % 3],
  payorName: ['HDFC ERGO', 'Star Health', 'Self Pay', 'TCS Corporate'][index % 4],
  paymentMethod: ['Credit Card', 'Cash', 'UPI', 'Bank Transfer'][index % 4],
  billingCategory: ['Cash', 'Credit'][index % 2],
  coPayor1Name: index % 3 === 0 ? 'Secondary Insurance' : undefined,
  coPayor1Amount: index % 3 === 0 ? 1000 : undefined,
  coPayor2Name: index % 5 === 0 ? 'Family Member' : undefined,
  coPayor2Amount: index % 5 === 0 ? 500 : undefined,
  coPayor3Name: index % 7 === 0 ? 'Employer' : undefined,
  coPayor3Amount: index % 7 === 0 ? 2000 : undefined,
}));

interface RevenueTableViewProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function RevenueTableView({ onToggleSidebar, sidebarCollapsed }: RevenueTableViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState(BILL_REGISTER_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  const visibleColumns = columns.filter(col => col.visible);
  const totalWidth = visibleColumns.reduce((sum, col) => sum + col.width, 0);

  // Filter data based on search
  const filteredData = DUMMY_BILL_REGISTER_DATA.filter(row =>
    Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Handle horizontal scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const maxScroll = e.currentTarget.scrollWidth - e.currentTarget.clientWidth;
    const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setScrollPosition(scrollPercentage);
  };

  // Handle scrollbar drag
  const handleScrollbarDrag = (e: React.MouseEvent) => {
    if (!tableRef.current || !scrollbarRef.current) return;

    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - scrollbarRect.left) / scrollbarRect.width;
    const maxScroll = tableRef.current.scrollWidth - tableRef.current.clientWidth;
    tableRef.current.scrollLeft = clickPosition * maxScroll;
  };

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return Number(value).toLocaleString();
      default:
        return value.toString();
    }
  };

  const toggleColumnVisibility = (columnKey: keyof BillRegisterRow) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Bill Register</h2>
          <span className="text-sm text-gray-500">({filteredData.length} records)</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          <button
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Settings className="h-5 w-5" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="h-5 w-5" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Column Settings Dropdown */}
      {showColumnSettings && (
        <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Column Visibility</h3>
          </div>
          <div className="p-2">
            {columns.map((column) => (
              <label key={column.key} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.key)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{column.label}</span>
                {column.visible ? <Eye className="h-3 w-3 text-green-500" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          ref={tableRef}
          className="flex-1 overflow-auto"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div style={{ width: totalWidth, minWidth: '100%' }}>
            {/* Table Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
              <div className="flex">
                {visibleColumns.map((column) => (
                  <div
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    {column.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div>
              {paginatedData.map((row, index) => (
                <div
                  key={`${row.billNumber}-${index}`}
                  className={`flex border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  {visibleColumns.map((column) => (
                    <div
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 last:border-r-0"
                      style={{ width: column.width, minWidth: column.width }}
                    >
                      {formatCellValue(row[column.key], column.type)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Horizontal Scrollbar */}
        <div className="h-4 bg-gray-100 border-t border-gray-200 relative">
          <div
            ref={scrollbarRef}
            className="h-full bg-gray-200 cursor-pointer relative"
            onClick={handleScrollbarDrag}
          >
            <div
              className="h-full bg-primary-500 rounded"
              style={{
                width: `${Math.max(20, (tableRef.current?.clientWidth || 0) / totalWidth * 100)}%`,
                transform: `translateX(${scrollPosition * (100 - Math.max(20, (tableRef.current?.clientWidth || 0) / totalWidth * 100))}%)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Showing</span>
          <span className="font-medium">{startIndex + 1}</span>
          <span>to</span>
          <span className="font-medium">{Math.min(startIndex + rowsPerPage, filteredData.length)}</span>
          <span>of</span>
          <span className="font-medium">{filteredData.length}</span>
          <span>results</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
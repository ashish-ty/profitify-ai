import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  Search,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface BillRegisterRow {
  mrn: string;
  ipdNo: string;
  billNo: string;
  cityState: string;
  genderAge: string;
  admitDate: string;
  dischargeDate: string;
  doctorId: string;
  deptCode: string;
  deptSpecialty: string;
  doctorName: string;
  billType: string;
  billMonth: string;
  category: string;
  grossAmount: number;
  discount: number;
  netAmount: number;
  icuDays: number;
  nonIcuDays: number;
  payerType: string;
  payerName: string;
  paymentMode: string;
  billingCategory: string;
  coPayer1: string;
  coPayer1Amt: number;
  coPayer2: string;
  coPayer2Amt: number;
  coPayer3: string;
  coPayer3Amt: number;
}

interface TableColumn {
  key: keyof BillRegisterRow;
  label: string;
  width: number;
  type: 'text' | 'number' | 'date' | 'currency';
  visible: boolean;
}

const BILL_REGISTER_COLUMNS: TableColumn[] = [
  { key: 'mrn', label: 'MRN', width: 120, type: 'text', visible: true },
  { key: 'ipdNo', label: 'IPD No', width: 100, type: 'text', visible: true },
  { key: 'billNo', label: 'Bill No', width: 120, type: 'text', visible: true },
  { key: 'cityState', label: 'City/State', width: 140, type: 'text', visible: true },
  { key: 'genderAge', label: 'Gender/Age', width: 100, type: 'text', visible: true },
  { key: 'admitDate', label: 'Admit Date', width: 120, type: 'date', visible: true },
  { key: 'dischargeDate', label: 'Discharge Date', width: 130, type: 'date', visible: true },
  { key: 'doctorId', label: 'Doctor ID', width: 100, type: 'text', visible: true },
  { key: 'deptCode', label: 'Dept Code', width: 100, type: 'text', visible: true },
  { key: 'deptSpecialty', label: 'Dept/Specialty', width: 140, type: 'text', visible: true },
  { key: 'doctorName', label: 'Doctor Name', width: 150, type: 'text', visible: true },
  { key: 'billType', label: 'Bill Type', width: 100, type: 'text', visible: true },
  { key: 'billMonth', label: 'Bill Month', width: 110, type: 'text', visible: true },
  { key: 'category', label: 'Category', width: 120, type: 'text', visible: true },
  { key: 'grossAmount', label: 'Gross Amount', width: 130, type: 'currency', visible: true },
  { key: 'discount', label: 'Discount', width: 110, type: 'currency', visible: true },
  { key: 'netAmount', label: 'Net Amount', width: 130, type: 'currency', visible: true },
  { key: 'icuDays', label: 'ICU Days', width: 90, type: 'number', visible: true },
  { key: 'nonIcuDays', label: 'Non-ICU Days', width: 110, type: 'number', visible: true },
  { key: 'payerType', label: 'Payer Type', width: 120, type: 'text', visible: true },
  { key: 'payerName', label: 'Payer Name', width: 150, type: 'text', visible: true },
  { key: 'paymentMode', label: 'Payment Mode', width: 130, type: 'text', visible: true },
  { key: 'billingCategory', label: 'Billing Category', width: 140, type: 'text', visible: true },
  { key: 'coPayer1', label: 'Co-Payer 1', width: 130, type: 'text', visible: false },
  { key: 'coPayer1Amt', label: 'Co-Payer 1 Amt', width: 140, type: 'currency', visible: false },
  { key: 'coPayer2', label: 'Co-Payer 2', width: 130, type: 'text', visible: false },
  { key: 'coPayer2Amt', label: 'Co-Payer 2 Amt', width: 140, type: 'currency', visible: false },
  { key: 'coPayer3', label: 'Co-Payer 3', width: 130, type: 'text', visible: false },
  { key: 'coPayer3Amt', label: 'Co-Payer 3 Amt', width: 140, type: 'currency', visible: false },
];

// Enhanced dummy data with new column structure
const DUMMY_BILL_REGISTER_DATA: BillRegisterRow[] = Array.from({ length: 150 }, (_, index) => {
  const cities = ['Mumbai, MH', 'Delhi, DL', 'Bangalore, KA', 'Chennai, TN', 'Kolkata, WB'];
  const genders = ['M', 'F'];
  const ages = [25, 34, 45, 67, 29, 52, 38, 71, 23, 56];
  const departments = ['Cardiology', 'Oncology', 'Neurology', 'Gynaecology', 'Emergency'];
  const deptCodes = ['CARD', 'ONCO', 'NEURO', 'GYNEC', 'EMRG'];
  const doctorNames = ['Dr. Sharma', 'Dr. Patel', 'Dr. Kumar', 'Dr. Singh', 'Dr. Gupta'];
  
  return {
    mrn: `MRN${String(index + 1).padStart(6, '0')}`,
    ipdNo: `IP${String(index + 1).padStart(5, '0')}`,
    billNo: `BILL${String(index + 1).padStart(7, '0')}`,
    cityState: cities[index % 5],
    genderAge: `${genders[index % 2]}/${ages[index % 10]}`,
    admitDate: new Date(2024, (index % 12), (index % 28) + 1).toISOString().split('T')[0],
    dischargeDate: new Date(2024, (index % 12), (index % 28) + 3).toISOString().split('T')[0],
    doctorId: `DOC${String(index % 50 + 1).padStart(3, '0')}`,
    deptCode: deptCodes[index % 5],
    deptSpecialty: departments[index % 5],
    doctorName: doctorNames[index % 5],
    billType: ['IPD', 'OPD', 'Emergency'][index % 3],
    billMonth: ['January', 'February', 'March', 'April', 'May', 'June'][index % 6],
    category: ['General', 'Senior Citizen', 'Child', 'VIP'][index % 4],
    grossAmount: 5000 + (index * 150),
    discount: 200 + (index * 10),
    netAmount: 4800 + (index * 140),
    icuDays: index % 10,
    nonIcuDays: (index % 15) + 1,
    payerType: ['Insurance', 'Cash', 'Corporate'][index % 3],
    payerName: ['HDFC ERGO', 'Star Health', 'Self Pay', 'TCS Corporate'][index % 4],
    paymentMode: ['Credit Card', 'Cash', 'UPI', 'Bank Transfer'][index % 4],
    billingCategory: ['Cash', 'Credit'][index % 2],
    coPayer1: index % 3 === 0 ? 'Secondary Insurance' : '',
    coPayer1Amt: index % 3 === 0 ? 1000 : 0,
    coPayer2: index % 5 === 0 ? 'Family Member' : '',
    coPayer2Amt: index % 5 === 0 ? 500 : 0,
    coPayer3: index % 7 === 0 ? 'Employer' : '',
    coPayer3Amt: index % 7 === 0 ? 2000 : 0,
  };
});

interface RevenueTableViewProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function RevenueTableView({ onToggleSidebar, sidebarCollapsed }: RevenueTableViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Changed to 5 rows per page
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

  // Handle scrollbar interaction
  const handleScrollbarClick = (e: React.MouseEvent) => {
    if (!tableRef.current || !scrollbarRef.current) return;

    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - scrollbarRect.left) / scrollbarRect.width;
    const maxScroll = tableRef.current.scrollWidth - tableRef.current.clientWidth;
    tableRef.current.scrollLeft = clickPosition * maxScroll;
  };

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === '') return '-';
    
    switch (type) {
      case 'currency':
        return `₹${Number(value).toLocaleString()}`;
      case 'date':
        return new Date(value).toLocaleDateString('en-IN');
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

  const scrollbarWidth = tableRef.current ? 
    Math.max(80, (tableRef.current.clientWidth / totalWidth) * 100) : 80;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with improved styling */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bill Register</h2>
              <p className="text-sm text-gray-600 mt-1">{filteredData.length} total records</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80 bg-white shadow-sm"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300 bg-white shadow-sm"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {/* Column Settings Dropdown */}
              {showColumnSettings && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-72 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Column Visibility</h3>
                    <p className="text-sm text-gray-600 mt-1">Show or hide table columns</p>
                  </div>
                  <div className="p-2">
                    {columns.map((column) => (
                      <label key={column.key} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => toggleColumnVisibility(column.key)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 flex-1">{column.label}</span>
                        {column.visible ? 
                          <Eye className="h-4 w-4 text-green-500" /> : 
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        }
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300 bg-white shadow-sm">
              <Filter className="h-5 w-5" />
            </button>
            
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300 bg-white shadow-sm">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container with margins and rounded corners */}
      <div className="flex-1 flex flex-col p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
          <div 
            ref={tableRef}
            className="flex-1 overflow-auto"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div style={{ width: totalWidth, minWidth: '100%' }}>
              {/* Table Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 z-10">
                <div className="flex">
                  {visibleColumns.map((column, index) => (
                    <div
                      key={column.key}
                      className={`px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                        index < visibleColumns.length - 1 ? 'border-r border-gray-200' : ''
                      }`}
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
                    key={`${row.billNo}-${index}`}
                    className={`flex border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {visibleColumns.map((column, colIndex) => (
                      <div
                        key={column.key}
                        className={`px-4 py-4 text-sm text-gray-900 ${
                          colIndex < visibleColumns.length - 1 ? 'border-r border-gray-100' : ''
                        } ${column.type === 'currency' ? 'font-medium' : ''} ${
                          column.type === 'number' ? 'text-center' : ''
                        }`}
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

          {/* Professional Custom Horizontal Scrollbar - Reduced gap */}
          <div className="h-4 bg-gray-50 border-t border-gray-200 relative rounded-b-2xl">
            <div
              ref={scrollbarRef}
              className="h-full cursor-pointer relative px-3 py-1.5"
              onClick={handleScrollbarClick}
            >
              <div className="h-1.5 bg-gray-200 rounded-full relative">
                <div
                  className="h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm transition-all duration-150 ease-out hover:from-primary-600 hover:to-primary-700"
                  style={{
                    width: `${scrollbarWidth}%`,
                    transform: `translateX(${scrollPosition * (100 - scrollbarWidth)}%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pagination - Matching vertical pagination style */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Showing</span>
            <span className="font-semibold text-gray-900">{startIndex + 1}</span>
            <span>to</span>
            <span className="font-semibold text-gray-900">{Math.min(startIndex + rowsPerPage, filteredData.length)}</span>
            <span>of</span>
            <span className="font-semibold text-gray-900">{filteredData.length}</span>
            <span>results</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
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
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
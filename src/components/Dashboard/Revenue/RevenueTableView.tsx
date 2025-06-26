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
  { key: 'mrn', label: 'MRN', width: 100, type: 'text', visible: true },
  { key: 'ipdNo', label: 'IPD No', width: 90, type: 'text', visible: true },
  { key: 'billNo', label: 'Bill No', width: 110, type: 'text', visible: true },
  { key: 'cityState', label: 'City/State', width: 120, type: 'text', visible: true },
  { key: 'genderAge', label: 'Gender/Age', width: 90, type: 'text', visible: true },
  { key: 'admitDate', label: 'Admit Date', width: 100, type: 'date', visible: true },
  { key: 'dischargeDate', label: 'Discharge Date', width: 110, type: 'date', visible: true },
  { key: 'doctorId', label: 'Doctor ID', width: 90, type: 'text', visible: true },
  { key: 'deptCode', label: 'Dept Code', width: 90, type: 'text', visible: true },
  { key: 'deptSpecialty', label: 'Dept/Specialty', width: 120, type: 'text', visible: true },
  { key: 'doctorName', label: 'Doctor Name', width: 130, type: 'text', visible: true },
  { key: 'billType', label: 'Bill Type', width: 90, type: 'text', visible: true },
  { key: 'billMonth', label: 'Bill Month', width: 100, type: 'text', visible: true },
  { key: 'category', label: 'Category', width: 100, type: 'text', visible: true },
  { key: 'grossAmount', label: 'Gross Amount', width: 110, type: 'currency', visible: true },
  { key: 'discount', label: 'Discount', width: 90, type: 'currency', visible: true },
  { key: 'netAmount', label: 'Net Amount', width: 110, type: 'currency', visible: true },
  { key: 'icuDays', label: 'ICU Days', width: 80, type: 'number', visible: true },
  { key: 'nonIcuDays', label: 'Non-ICU Days', width: 100, type: 'number', visible: true },
  { key: 'payerType', label: 'Payer Type', width: 100, type: 'text', visible: true },
  { key: 'payerName', label: 'Payer Name', width: 130, type: 'text', visible: true },
  { key: 'paymentMode', label: 'Payment Mode', width: 110, type: 'text', visible: true },
  { key: 'billingCategory', label: 'Billing Category', width: 120, type: 'text', visible: true },
  { key: 'coPayer1', label: 'Co-Payer 1', width: 110, type: 'text', visible: false },
  { key: 'coPayer1Amt', label: 'Co-Payer 1 Amt', width: 120, type: 'currency', visible: false },
  { key: 'coPayer2', label: 'Co-Payer 2', width: 110, type: 'text', visible: false },
  { key: 'coPayer2Amt', label: 'Co-Payer 2 Amt', width: 120, type: 'currency', visible: false },
  { key: 'coPayer3', label: 'Co-Payer 3', width: 110, type: 'text', visible: false },
  { key: 'coPayer3Amt', label: 'Co-Payer 3 Amt', width: 120, type: 'currency', visible: false },
];

// Compact dummy data - only 20 records for better performance
const DUMMY_BILL_REGISTER_DATA: BillRegisterRow[] = Array.from({ length: 20 }, (_, index) => {
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
  const [rowsPerPage] = useState(4); // Fixed to 4 rows
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
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bill Register</h2>
              <p className="text-xs text-gray-600">{filteredData.length} records</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 bg-white shadow-sm text-sm"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 bg-white shadow-sm"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              {/* Compact Column Settings Dropdown */}
              {showColumnSettings && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-64 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 text-sm">Column Visibility</h3>
                  </div>
                  <div className="p-1">
                    {columns.map((column) => (
                      <label key={column.key} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => toggleColumnVisibility(column.key)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3"
                        />
                        <span className="text-xs text-gray-700 flex-1">{column.label}</span>
                        {column.visible ? 
                          <Eye className="h-3 w-3 text-green-500" /> : 
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        }
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 bg-white shadow-sm">
              <Filter className="h-4 w-4" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 bg-white shadow-sm">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Table Container */}
      <div className="flex-1 flex flex-col p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col" style={{ height: '400px' }}>
          <div 
            ref={tableRef}
            className="flex-1 overflow-auto"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div style={{ width: totalWidth, minWidth: '100%' }}>
              {/* Compact Table Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 z-10">
                <div className="flex">
                  {visibleColumns.map((column, index) => (
                    <div
                      key={column.key}
                      className={`px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                        index < visibleColumns.length - 1 ? 'border-r border-gray-200' : ''
                      }`}
                      style={{ width: column.width, minWidth: column.width }}
                    >
                      {column.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Table Body */}
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
                        className={`px-3 py-3 text-xs text-gray-900 ${
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

          {/* Compact Custom Horizontal Scrollbar */}
          <div className="h-2 bg-gray-50 border-t border-gray-200 relative rounded-b-xl">
            <div
              ref={scrollbarRef}
              className="h-full cursor-pointer relative px-1 py-0.5"
              onClick={handleScrollbarClick}
            >
              <div className="h-0.5 bg-gray-200 rounded-full relative">
                <div
                  className="h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm transition-all duration-150 ease-out"
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

      {/* Compact Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-700">
            <span>Showing</span>
            <span className="font-semibold text-gray-900">{startIndex + 1}</span>
            <span>to</span>
            <span className="font-semibold text-gray-900">{Math.min(startIndex + rowsPerPage, filteredData.length)}</span>
            <span>of</span>
            <span className="font-semibold text-gray-900">{filteredData.length}</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            
            <div className="flex items-center space-x-0.5">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white shadow-sm'
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
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
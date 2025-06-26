import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  Search,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  Users,
  DollarSign
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
  priority: 'high' | 'medium' | 'low'; // For responsive hiding
}

const BILL_REGISTER_COLUMNS: TableColumn[] = [
  { key: 'mrn', label: 'MRN', width: 120, type: 'text', visible: true, priority: 'high' },
  { key: 'ipdNo', label: 'IPD No', width: 100, type: 'text', visible: true, priority: 'high' },
  { key: 'billNo', label: 'Bill No', width: 120, type: 'text', visible: true, priority: 'high' },
  { key: 'cityState', label: 'City/State', width: 140, type: 'text', visible: true, priority: 'medium' },
  { key: 'genderAge', label: 'Gender/Age', width: 100, type: 'text', visible: true, priority: 'medium' },
  { key: 'admitDate', label: 'Admit Date', width: 120, type: 'date', visible: true, priority: 'high' },
  { key: 'dischargeDate', label: 'Discharge Date', width: 130, type: 'date', visible: true, priority: 'medium' },
  { key: 'doctorId', label: 'Doctor ID', width: 100, type: 'text', visible: true, priority: 'low' },
  { key: 'deptCode', label: 'Dept Code', width: 100, type: 'text', visible: true, priority: 'medium' },
  { key: 'deptSpecialty', label: 'Dept/Specialty', width: 140, type: 'text', visible: true, priority: 'high' },
  { key: 'doctorName', label: 'Doctor Name', width: 150, type: 'text', visible: true, priority: 'high' },
  { key: 'billType', label: 'Bill Type', width: 100, type: 'text', visible: true, priority: 'medium' },
  { key: 'billMonth', label: 'Bill Month', width: 110, type: 'text', visible: true, priority: 'low' },
  { key: 'category', label: 'Category', width: 120, type: 'text', visible: true, priority: 'medium' },
  { key: 'grossAmount', label: 'Gross Amount', width: 130, type: 'currency', visible: true, priority: 'high' },
  { key: 'discount', label: 'Discount', width: 110, type: 'currency', visible: true, priority: 'high' },
  { key: 'netAmount', label: 'Net Amount', width: 130, type: 'currency', visible: true, priority: 'high' },
  { key: 'icuDays', label: 'ICU Days', width: 90, type: 'number', visible: true, priority: 'medium' },
  { key: 'nonIcuDays', label: 'Non-ICU Days', width: 110, type: 'number', visible: true, priority: 'medium' },
  { key: 'payerType', label: 'Payer Type', width: 120, type: 'text', visible: true, priority: 'high' },
  { key: 'payerName', label: 'Payer Name', width: 150, type: 'text', visible: true, priority: 'medium' },
  { key: 'paymentMode', label: 'Payment Mode', width: 130, type: 'text', visible: true, priority: 'medium' },
  { key: 'billingCategory', label: 'Billing Category', width: 140, type: 'text', visible: true, priority: 'low' },
  { key: 'coPayer1', label: 'Co-Payer 1', width: 130, type: 'text', visible: false, priority: 'low' },
  { key: 'coPayer1Amt', label: 'Co-Payer 1 Amt', width: 140, type: 'currency', visible: false, priority: 'low' },
  { key: 'coPayer2', label: 'Co-Payer 2', width: 130, type: 'text', visible: false, priority: 'low' },
  { key: 'coPayer2Amt', label: 'Co-Payer 2 Amt', width: 140, type: 'currency', visible: false, priority: 'low' },
  { key: 'coPayer3', label: 'Co-Payer 3', width: 130, type: 'text', visible: false, priority: 'low' },
  { key: 'coPayer3Amt', label: 'Co-Payer 3 Amt', width: 140, type: 'currency', visible: false, priority: 'low' },
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
  const [rowsPerPage] = useState(5); // Changed to 5 records per page
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState(BILL_REGISTER_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Calculate summary statistics
  const totalRevenue = filteredData.reduce((sum, row) => sum + row.netAmount, 0);
  const totalPatients = filteredData.length;
  const avgBillAmount = totalPatients > 0 ? totalRevenue / totalPatients : 0;

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
        return `₹${Number(value).toLocaleString('en-IN')}`;
      case 'date':
        return new Date(value).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      case 'number':
        return Number(value).toLocaleString('en-IN');
      default:
        return value.toString();
    }
  };

  const toggleColumnVisibility = (columnKey: keyof BillRegisterRow) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const scrollbarWidth = tableRef.current ? 
    Math.max(80, (tableRef.current.clientWidth / totalWidth) * 100) : 80;

  // Quick navigation
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header with Summary Cards */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="p-6">
          {/* Top Row - Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleSidebar}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Bill Register</h2>
                <p className="text-sm text-gray-600 mt-1">Comprehensive billing records and patient details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300 bg-white shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bills, patients, doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80 bg-white shadow-sm transition-all duration-200 focus:shadow-md"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300 bg-white shadow-sm hover:shadow-md"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                {/* Enhanced Column Settings Dropdown */}
                {showColumnSettings && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 w-80 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
                      <h3 className="font-semibold text-gray-900">Column Visibility</h3>
                      <p className="text-sm text-gray-600 mt-1">Customize your table view</p>
                    </div>
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {columns.map((column) => (
                        <label key={column.key} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={column.visible}
                            onChange={() => toggleColumnVisibility(column.key)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 flex-1">{column.label}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              column.priority === 'high' ? 'bg-green-100 text-green-700' :
                              column.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {column.priority}
                            </span>
                            {column.visible ? 
                              <Eye className="h-4 w-4 text-green-500" /> : 
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            }
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300 bg-white shadow-sm hover:shadow-md">
                <Filter className="h-5 w-5" />
              </button>
              
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300 bg-white shadow-sm hover:shadow-md">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Records</p>
                  <p className="text-2xl font-bold text-blue-900">{filteredData.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Bill Amount</p>
                  <p className="text-2xl font-bold text-purple-900">₹{Math.round(avgBillAmount).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Current Page</p>
                  <p className="text-2xl font-bold text-orange-900">{currentPage} of {totalPages}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table Container */}
      <div className="flex-1 flex flex-col p-8">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col backdrop-blur-sm">
          <div 
            ref={tableRef}
            className="flex-1 overflow-auto"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div style={{ width: totalWidth, minWidth: '100%' }}>
              {/* Enhanced Table Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-b border-gray-200 z-10 shadow-sm">
                <div className="flex">
                  {visibleColumns.map((column, index) => (
                    <div
                      key={column.key}
                      className={`px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${
                        index < visibleColumns.length - 1 ? 'border-r border-gray-200' : ''
                      } hover:bg-gray-200 transition-colors cursor-pointer`}
                      style={{ width: column.width, minWidth: column.width }}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.label}</span>
                        {column.priority === 'high' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Table Body with Better Spacing */}
              <div>
                {paginatedData.map((row, index) => (
                  <div
                    key={`${row.billNo}-${index}`}
                    className={`flex border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-sm ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {visibleColumns.map((column, colIndex) => (
                      <div
                        key={column.key}
                        className={`px-6 py-5 text-sm ${
                          colIndex < visibleColumns.length - 1 ? 'border-r border-gray-100' : ''
                        } ${
                          column.type === 'currency' ? 'font-semibold text-green-700' : 
                          column.type === 'date' ? 'text-blue-600' :
                          column.type === 'number' ? 'text-center font-medium' : 'text-gray-900'
                        }`}
                        style={{ width: column.width, minWidth: column.width }}
                      >
                        {formatCellValue(row[column.key], column.type)}
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* Empty State for fewer records */}
                {paginatedData.length < rowsPerPage && (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm">Showing {paginatedData.length} of {filteredData.length} records</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Professional Custom Horizontal Scrollbar */}
          <div className="h-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 relative rounded-b-3xl">
            <div
              ref={scrollbarRef}
              className="h-full cursor-pointer relative px-3 py-1.5"
              onClick={handleScrollbarClick}
            >
              <div className="h-1.5 bg-gray-200 rounded-full relative shadow-inner">
                <div
                  className="h-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full shadow-lg transition-all duration-200 ease-out hover:shadow-xl"
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

      {/* Enhanced Pagination with Better UX */}
      <div className="bg-white border-t border-gray-200 px-8 py-6 rounded-b-3xl mx-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Showing</span>
              <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{startIndex + 1}</span>
              <span>to</span>
              <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{Math.min(startIndex + rowsPerPage, filteredData.length)}</span>
              <span>of</span>
              <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{filteredData.length}</span>
              <span>results</span>
            </div>
            
            {/* Quick Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                First
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Last
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
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
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
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
              className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
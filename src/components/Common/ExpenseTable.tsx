import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from './DataTable';

export interface ExpenseRecord {
  id: string;
  month: string;
  year: number;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  department: string;
  vendor: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  approvedBy: string;
}

// Dummy expense data
const dummyExpenseData: ExpenseRecord[] = [
  {
    id: 'EXP001',
    month: 'January',
    year: 2024,
    category: 'Medical Supplies',
    subcategory: 'Pharmacy',
    description: 'Cardiac medications',
    amount: 45000,
    department: 'Cardiology',
    vendor: 'MedSupply Co.',
    date: '2024-01-15',
    status: 'Approved',
    approvedBy: 'Dr. Smith'
  },
  {
    id: 'EXP002',
    month: 'January',
    year: 2024,
    category: 'Staff Costs',
    subcategory: 'Salaries',
    description: 'Nursing staff salaries',
    amount: 180000,
    department: 'Nursing',
    vendor: 'Internal',
    date: '2024-01-31',
    status: 'Approved',
    approvedBy: 'HR Manager'
  },
  {
    id: 'EXP003',
    month: 'January',
    year: 2024,
    category: 'Utilities',
    subcategory: 'Electricity',
    description: 'Monthly electricity bill',
    amount: 25000,
    department: 'Administration',
    vendor: 'Power Corp',
    date: '2024-01-20',
    status: 'Approved',
    approvedBy: 'Admin Manager'
  }
];

const expenseColumns: TableColumn[] = [
  { key: 'id', label: 'Expense ID', width: '100px', sortable: true },
  { key: 'date', label: 'Date', width: '120px', type: 'date', sortable: true },
  { key: 'category', label: 'Category', width: '120px', sortable: true },
  { key: 'subcategory', label: 'Subcategory', width: '120px', sortable: true },
  { key: 'description', label: 'Description', width: '200px', sortable: true },
  { key: 'department', label: 'Department', width: '120px', sortable: true },
  { key: 'amount', label: 'Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'vendor', label: 'Vendor', width: '150px', sortable: true },
  { key: 'status', label: 'Status', width: '100px', sortable: true },
  { key: 'approvedBy', label: 'Approved By', width: '120px', sortable: true }
];

export function ExpenseTable() {
  const [expenseData, setExpenseData] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setExpenseData(dummyExpenseData);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleRowClick = (row: ExpenseRecord) => {
    console.log('Expense row clicked:', row);
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={expenseColumns}
        data={expenseData}
        title="Expense Records"
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        filterable={true}
        exportable={true}
        pageSize={10}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${expenseData.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Approved</h3>
          <p className="text-2xl font-bold text-green-600">
            {expenseData.filter(e => e.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {expenseData.filter(e => e.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Amount</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${expenseData.length > 0 ? Math.round(expenseData.reduce((sum, expense) => sum + expense.amount, 0) / expenseData.length).toLocaleString() : 0}
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../../Common/DataTable';
import { TrialBalanceNew, ExpenseWise, VariableCostBillWiseNew, HRNew } from '../../../types/expense';
import { useTrialBalance, useExpenseWise, useVariableCostBillWise, useHRData } from '../../../hooks/useNewTables';
import { FileText, Calculator, DollarSign, Users } from 'lucide-react';

// Column definitions
const trialBalanceColumns: TableColumn[] = [
  { key: 'category_code', label: 'Category Code', width: '120px', sortable: true },
  { key: 'category', label: 'Category', width: '150px', sortable: true },
  { key: 'grouping_code', label: 'Grouping Code', width: '120px', sortable: true },
  { key: 'grouping', label: 'Grouping', width: '150px', sortable: true },
  { key: 'ledger_code', label: 'Ledger Code', width: '120px', sortable: true },
  { key: 'ledger_name', label: 'Ledger Name', width: '180px', sortable: true },
  { key: 'alias_code', label: 'Alias Code', width: '100px', sortable: true },
  { key: 'alias_name', label: 'Alias Name', width: '150px', sortable: true },
  { key: 'amount', label: 'Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '200px', sortable: true },
  { key: 'primary_cost_driver', label: 'Primary Cost Driver', width: '150px', sortable: true }
];

const expenseWiseColumns: TableColumn[] = [
  { key: 'nature_of_data', label: 'Nature of Data', width: '120px', sortable: true },
  { key: 'ledger_code', label: 'Ledger Code', width: '120px', sortable: true },
  { key: 'ledger_name', label: 'Ledger Name', width: '180px', sortable: true },
  { key: 'alias_name', label: 'Alias Name', width: '150px', sortable: true },
  { key: 'sub_cost_centre_code', label: 'Sub Cost Centre Code', width: '150px', sortable: true },
  { key: 'sub_cost_centre', label: 'Sub Cost Centre', width: '180px', sortable: true },
  { key: 'amount', label: 'Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'remarks', label: 'Remarks', width: '200px', sortable: true }
];

const variableCostColumns: TableColumn[] = [
  { key: 'patient_type', label: 'Patient Type', width: '100px', sortable: true },
  { key: 'reg_no', label: 'Reg. No.', width: '100px', sortable: true },
  { key: 'ipd_number', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'bill_no', label: 'Bill No.', width: '100px', sortable: true },
  { key: 'pharmacy_charged_to_patient', label: 'Pharmacy', width: '120px', type: 'currency', sortable: true },
  { key: 'medical_surgical_consumables', label: 'Med & Surgical', width: '130px', type: 'currency', sortable: true },
  { key: 'implants_and_prosthetics', label: 'Implants', width: '120px', type: 'currency', sortable: true },
  { key: 'non_medical_consumables', label: 'Non-Medical', width: '120px', type: 'currency', sortable: true },
  { key: 'fee_for_service', label: 'Fee for Service', width: '120px', type: 'currency', sortable: true },
  { key: 'incentives_to_doctors', label: 'Doctor Incentives', width: '130px', type: 'currency', sortable: true },
  { key: 'patient_food_beverages', label: 'Food & Beverages', width: '130px', type: 'currency', sortable: true },
  { key: 'laboratory_test_outsource', label: 'Lab Outsource', width: '120px', type: 'currency', sortable: true },
  { key: 'other_outsourced_services_1', label: 'Other Outsource 1', width: '140px', type: 'currency', sortable: true },
  { key: 'other_outsourced_services_2', label: 'Other Outsource 2', width: '140px', type: 'currency', sortable: true },
  { key: 'other_outsourced_services_3', label: 'Other Outsource 3', width: '140px', type: 'currency', sortable: true },
  { key: 'brokerage_commission', label: 'Brokerage', width: '120px', type: 'currency', sortable: true },
  { key: 'provision_for_bad_debts', label: 'Bad Debts', width: '120px', type: 'currency', sortable: true },
  { key: 'doctor_name', label: 'Doctor Name', width: '150px', sortable: true },
  { key: 'service_name', label: 'Service Name', width: '180px', sortable: true },
  { key: 'payor_type', label: 'Payor Type', width: '100px', sortable: true }
];

const hrColumns: TableColumn[] = [
  { key: 'nature_of_data', label: 'Nature of Data', width: '120px', sortable: true },
  { key: 'group_name', label: 'Group Name', width: '120px', sortable: true },
  { key: 'sub_group_name', label: 'Sub Group Name', width: '130px', sortable: true },
  { key: 'associate_name', label: 'Employee Name', width: '150px', sortable: true },
  { key: 'period', label: 'Period', width: '120px', sortable: true },
  { key: 'department', label: 'Department', width: '120px', sortable: true },
  { key: 'sub_department', label: 'Sub Department', width: '130px', sortable: true },
  { key: 'designation', label: 'Designation', width: '150px', sortable: true },
  { key: 'working_period', label: 'Working Period', width: '120px', sortable: true },
  { key: 'basic_pay', label: 'Basic Pay', width: '120px', type: 'currency', sortable: true },
  { key: 'allowances', label: 'Allowances', width: '120px', type: 'currency', sortable: true },
  { key: 'other_benefits', label: 'Benefits', width: '100px', type: 'currency', sortable: true },
  { key: 'gross_total', label: 'Gross Total', width: '120px', type: 'currency', sortable: true },
  { key: 'deduction', label: 'Deductions', width: '120px', type: 'currency', sortable: true },
  { key: 'net_salary', label: 'Net Salary', width: '120px', type: 'currency', sortable: true },
  { key: 'utilization', label: 'Utilization %', width: '120px', type: 'number', sortable: true },
  { key: 'no_of_headcount', label: 'Headcount', width: '100px', type: 'number', sortable: true }
];

export function ExpenseTablesNew() {
  const [activeTable, setActiveTable] = useState<'trial-balance' | 'expense-wise' | 'variable-cost' | 'hr'>('trial-balance');
  
  // Use hooks for each table
  const { trialBalanceData, isLoading: trialBalanceLoading, error: trialBalanceError } = useTrialBalance();
  const { expenseWiseData, isLoading: expenseWiseLoading, error: expenseWiseError } = useExpenseWise();
  const { variableCostData, isLoading: variableCostLoading, error: variableCostError } = useVariableCostBillWise();
  const { hrData, isLoading: hrLoading, error: hrError } = useHRData();

  const isLoading = trialBalanceLoading || expenseWiseLoading || variableCostLoading || hrLoading;
  const error = trialBalanceError || expenseWiseError || variableCostError || hrError;

  const handleRowClick = (row: any) => {
    console.log('Expense row clicked:', row);
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case 'trial-balance':
        return trialBalanceData;
      case 'expense-wise':
        return expenseWiseData;
      case 'variable-cost':
        return variableCostData;
      case 'hr':
        return hrData;
      default:
        return [];
    }
  };

  const getCurrentColumns = () => {
    switch (activeTable) {
      case 'trial-balance':
        return trialBalanceColumns;
      case 'expense-wise':
        return expenseWiseColumns;
      case 'variable-cost':
        return variableCostColumns;
      case 'hr':
        return hrColumns;
      default:
        return [];
    }
  };

  const getTableTitle = () => {
    switch (activeTable) {
      case 'trial-balance':
        return 'Trial Balance';
      case 'expense-wise':
        return 'Expense Wise';
      case 'variable-cost':
        return 'Variable Cost Bill Wise';
      case 'hr':
        return 'HR Salary Sheet';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-primary-900">Expense Data</h2>
          <div className="flex bg-accent-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTable('trial-balance')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'trial-balance'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Trial Balance</span>
            </button>
            <button
              onClick={() => setActiveTable('expense-wise')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'expense-wise'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Expense Wise</span>
            </button>
            <button
              onClick={() => setActiveTable('variable-cost')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'variable-cost'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Variable Cost</span>
            </button>
            <button
              onClick={() => setActiveTable('hr')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTable === 'hr'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-accent-600 hover:text-primary-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>HR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Table */}
      <DataTable
        columns={getCurrentColumns()}
        data={getCurrentData()}
        title={getTableTitle()}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        filterable={true}
        exportable={true}
        pageSize={10}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTable === 'trial-balance' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Amount</h3>
              <p className="text-2xl font-bold text-primary-900">
                ${trialBalanceData.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Categories</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(trialBalanceData.map(item => item.category)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Ledgers</h3>
              <p className="text-2xl font-bold text-green-600">{trialBalanceData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Amount</h3>
              <p className="text-2xl font-bold text-purple-600">
                ${trialBalanceData.length > 0 ? Math.round(trialBalanceData.reduce((sum, item) => sum + (item.amount || 0), 0) / trialBalanceData.length).toLocaleString() : 0}
              </p>
            </div>
          </>
        )}

        {activeTable === 'expense-wise' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">
                ${expenseWiseData.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Direct Costs</h3>
              <p className="text-2xl font-bold text-green-600">
                ${expenseWiseData.filter(item => item.nature_of_data === 'Direct Cost').reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Indirect Costs</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${expenseWiseData.filter(item => item.nature_of_data === 'Indirect Cost').reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Cost Centres</h3>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(expenseWiseData.map(item => item.sub_cost_centre)).size}
              </p>
            </div>
          </>
        )}

        {activeTable === 'variable-cost' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Bills</h3>
              <p className="text-2xl font-bold text-primary-900">{variableCostData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Pharmacy</h3>
              <p className="text-2xl font-bold text-green-600">
                ${variableCostData.reduce((sum, item) => sum + (item.pharmacy_charged_to_patient || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Implants</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${variableCostData.reduce((sum, item) => sum + (item.implants_and_prosthetics || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">IPD Bills</h3>
              <p className="text-2xl font-bold text-purple-600">
                {variableCostData.filter(item => item.patient_type === 'IPD').length}
              </p>
            </div>
          </>
        )}

        {activeTable === 'hr' && (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Employees</h3>
              <p className="text-2xl font-bold text-primary-900">{hrData.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Gross Pay</h3>
              <p className="text-2xl font-bold text-green-600">
                ${hrData.reduce((sum, item) => sum + (item.gross_total || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Total Net Pay</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${hrData.reduce((sum, item) => sum + (item.net_salary || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Utilization</h3>
              <p className="text-2xl font-bold text-purple-600">
                {`${hrData.length > 0 ? Math.round(hrData.reduce((sum, item) => sum + (item.utilization || 0), 0) / hrData.length) : 0}%`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
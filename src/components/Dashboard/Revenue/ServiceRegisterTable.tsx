import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from '../../Common/DataTable';
import { ServiceRegister } from '../../../types/revenue';
import { useServiceRegister } from '../../../hooks/useNewTables';

const serviceRegisterColumns: TableColumn[] = [
  { key: 'date_of_final_bill', label: 'Final Bill Date', width: '120px', type: 'date', sortable: true },
  { key: 'month', label: 'Month', width: '100px', sortable: true },
  { key: 'bill_no', label: 'Bill No.', width: '100px', sortable: true },
  { key: 'patient_type', label: 'Patient Type', width: '100px', sortable: true },
  { key: 'reg_no', label: 'Reg. No.', width: '100px', sortable: true },
  { key: 'ipd_number', label: 'IPD Number', width: '120px', sortable: true },
  { key: 'payor_type', label: 'Payor Type', width: '100px', sortable: true },
  { key: 'payor_alias_name', label: 'Payor Name', width: '120px', sortable: true },
  { key: 'admitting_doctor_name', label: 'Admitting Doctor', width: '150px', sortable: true },
  { key: 'admitting_doctor_department_speciality_name', label: 'Admitting Dept', width: '130px', sortable: true },
  { key: 'performing_doctor_name', label: 'Performing Doctor', width: '150px', sortable: true },
  { key: 'performing_doctor_department_speciality_name', label: 'Performing Dept', width: '130px', sortable: true },
  { key: 'refering_doctor_name', label: 'Referring Doctor', width: '150px', sortable: true },
  { key: 'refering_doctor_department_speciality_name', label: 'Referring Dept', width: '130px', sortable: true },
  { key: 'service_name', label: 'Service Name', width: '200px', sortable: true },
  { key: 'service_department', label: 'Service Dept', width: '120px', sortable: true },
  { key: 'service_sub_department', label: 'Service Sub Dept', width: '130px', sortable: true },
  { key: 'service_status', label: 'Status', width: '80px', sortable: true },
  { key: 'is_packaged', label: 'Packaged', width: '80px', sortable: true },
  { key: 'is_outsourced', label: 'Outsourced', width: '90px', sortable: true },
  { key: 'quantity', label: 'Quantity', width: '80px', type: 'number', sortable: true },
  { key: 'gross_amount', label: 'Gross Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'discount', label: 'Discount', width: '100px', type: 'currency', sortable: true },
  { key: 'net_amount', label: 'Net Amount', width: '120px', type: 'currency', sortable: true },
  { key: 'emergency_charges_applied', label: 'Emergency', width: '90px', sortable: true },
  { key: 'performing_doctor_share_if_applicable', label: 'Doctor Share', width: '120px', type: 'currency', sortable: true },
  { key: 'cost_of_pharmacy_material_billed_to_patient', label: 'Material Cost', width: '120px', type: 'currency', sortable: true },
  { key: 'share_of_outsource_service_billed', label: 'Outsource Share', width: '130px', type: 'currency', sortable: true },
  { key: 'sub_cost_centre_code', label: 'Cost Centre Code', width: '130px', sortable: true },
  { key: 'sub_cost_centre', label: 'Cost Centre Name', width: '130px', sortable: true },
  { key: 'service_tat', label: 'Service TAT', width: '100px', sortable: true },
  { key: 'service_date', label: 'Service Date', width: '120px', type: 'date', sortable: true }
];

export default function ServiceRegisterTable() {
  const { serviceRegisterData, isLoading, error, fetchServiceRegister } = useServiceRegister();

  const handleRowClick = (row: ServiceRegister) => {
    console.log('Service register row clicked:', row);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">Service Register</h2>
      </div>

      <DataTable
        columns={serviceRegisterColumns}
        data={serviceRegisterData}
        title="Service Register"
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
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Services</h3>
          <p className="text-2xl font-bold text-primary-900">{serviceRegisterData.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{serviceRegisterData.reduce((sum, service) => sum + (Number(service.net_amount) || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Outsourced Services</h3>
          <p className="text-2xl font-bold text-blue-600">
            {serviceRegisterData.filter(service => service.is_outsourced === true).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Emergency Services</h3>
          <p className="text-2xl font-bold text-red-600">
            {serviceRegisterData.filter(service => service.emergency_charges_applied === true || service.emergency_charges_applied === 'true').length}
          </p>
        </div>
      </div>
    </div>
  );
}

export { ServiceRegisterTable }
import React, { useState, useEffect } from 'react';
import { DataTable, TableColumn } from './DataTable';

export interface MetadataRecord {
  id: string;
  month: string;
  year: number;
  bedsICU: number;
  bedsNonICU: number;
  totalBeds: number;
  occupancyRateICU: number;
  occupancyRateNonICU: number;
  nurses: number;
  doctors: number;
  technicians: number;
  totalStaff: number;
  patientToNurseRatio: number;
  patientToDoctorRatio: number;
  avgLengthOfStay: number;
  readmissionRate: number;
}

// Dummy metadata
const dummyMetadataData: MetadataRecord[] = [
  {
    id: 'META001',
    month: 'January',
    year: 2024,
    bedsICU: 20,
    bedsNonICU: 80,
    totalBeds: 100,
    occupancyRateICU: 85.5,
    occupancyRateNonICU: 72.3,
    nurses: 45,
    doctors: 12,
    technicians: 25,
    totalStaff: 82,
    patientToNurseRatio: 2.8,
    patientToDoctorRatio: 10.5,
    avgLengthOfStay: 4.2,
    readmissionRate: 8.5
  },
  {
    id: 'META002',
    month: 'February',
    year: 2024,
    bedsICU: 22,
    bedsNonICU: 82,
    totalBeds: 104,
    occupancyRateICU: 88.2,
    occupancyRateNonICU: 75.1,
    nurses: 47,
    doctors: 13,
    technicians: 26,
    totalStaff: 86,
    patientToNurseRatio: 2.9,
    patientToDoctorRatio: 10.8,
    avgLengthOfStay: 4.1,
    readmissionRate: 7.8
  }
];

const metadataColumns: TableColumn[] = [
  { key: 'month', label: 'Month', width: '100px', sortable: true },
  { key: 'year', label: 'Year', width: '80px', sortable: true },
  { key: 'totalBeds', label: 'Total Beds', width: '100px', type: 'number', sortable: true },
  { key: 'bedsICU', label: 'ICU Beds', width: '90px', type: 'number', sortable: true },
  { key: 'bedsNonICU', label: 'Non-ICU Beds', width: '110px', type: 'number', sortable: true },
  { key: 'occupancyRateICU', label: 'ICU Occupancy %', width: '130px', type: 'number', sortable: true },
  { key: 'occupancyRateNonICU', label: 'Non-ICU Occupancy %', width: '150px', type: 'number', sortable: true },
  { key: 'totalStaff', label: 'Total Staff', width: '100px', type: 'number', sortable: true },
  { key: 'nurses', label: 'Nurses', width: '80px', type: 'number', sortable: true },
  { key: 'doctors', label: 'Doctors', width: '80px', type: 'number', sortable: true },
  { key: 'technicians', label: 'Technicians', width: '100px', type: 'number', sortable: true },
  { key: 'patientToNurseRatio', label: 'Patient:Nurse', width: '120px', type: 'number', sortable: true },
  { key: 'avgLengthOfStay', label: 'Avg LOS (days)', width: '120px', type: 'number', sortable: true },
  { key: 'readmissionRate', label: 'Readmission %', width: '120px', type: 'number', sortable: true }
];

export function MetadataTable() {
  const [metadataData, setMetadataData] = useState<MetadataRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMetadataData(dummyMetadataData);
      setIsLoading(false);
    }, 600);
  }, []);

  const handleRowClick = (row: MetadataRecord) => {
    console.log('Metadata row clicked:', row);
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={metadataColumns}
        data={metadataData}
        title="Hospital Metadata"
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
          <h3 className="text-sm font-medium text-accent-600 mb-2">Current Capacity</h3>
          <p className="text-2xl font-bold text-primary-900">
            {metadataData.length > 0 ? metadataData[metadataData.length - 1].totalBeds : 0} beds
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Total Staff</h3>
          <p className="text-2xl font-bold text-blue-600">
            {metadataData.length > 0 ? metadataData[metadataData.length - 1].totalStaff : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Avg Occupancy</h3>
          <p className="text-2xl font-bold text-green-600">
            {metadataData.length > 0 ? 
              ((metadataData[metadataData.length - 1].occupancyRateICU + metadataData[metadataData.length - 1].occupancyRateNonICU) / 2).toFixed(1) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-sm font-medium text-accent-600 mb-2">Readmission Rate</h3>
          <p className="text-2xl font-bold text-orange-600">
            {metadataData.length > 0 ? metadataData[metadataData.length - 1].readmissionRate : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
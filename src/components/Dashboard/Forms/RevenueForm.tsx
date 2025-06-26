import React, { useState, useEffect } from 'react';
import { useRevenueData } from '../../../hooks/useRevenueData';
import { apiService } from '../../../services/api';

interface RevenueFormProps {
  month: string;
  onMonthChange: (month: string) => void;
}

interface SpecialtyRevenueData {
  cash: {
    numberOfPatients: number;
    bedDaysICU?: number;
    bedDaysNonICU?: number;
    grossAmount: number;
    discount: number;
    ot_time_hrs?: number;
    day_care_procedures?: number;
  };
  credit: {
    numberOfPatients: number;
    bedDaysICU?: number;
    bedDaysNonICU?: number;
    grossAmount: number;
    discount: number;
    ot_time_hrs?: number;
    day_care_procedures?: number;
  };
}

interface PatientTypeData {
  [specialty: string]: SpecialtyRevenueData;
}

export function RevenueForm({ month, onMonthChange }: RevenueFormProps) {
  const { createBulkRevenueData, fetchRevenueData, fetchRevenueSummary, revenueData, isLoading } = useRevenueData();
  const [activePatientType, setActivePatientType] = useState<'OPD' | 'IPD'>('OPD');
  const [isSaving, setIsSaving] = useState(false);
  const [currentRevenueIds, setCurrentRevenueIds] = useState<{ [key: string]: string }>({});
  const currentYear = new Date().getFullYear();
  
  const specialties = ['Cardiology', 'Oncology', 'Neurology', 'Gynaecology'];

  // Initialize form data
  const initializePatientTypeData = (includesBedDays: boolean): PatientTypeData => {
    const data: PatientTypeData = {};
    specialties.forEach(specialty => {
      data[specialty] = {
        cash: {
          numberOfPatients: '',
          grossAmount: '',
          discount: '',
          ...(includesBedDays
            ? {
                bedDaysICU: '',
                bedDaysNonICU: '',
                ot_time_hrs: '',
              }
            : {
                day_care_procedures: '',
              }),
        },
        credit: {
          numberOfPatients: '',
          grossAmount: '',
          discount: '',
          ...(includesBedDays
            ? {
                bedDaysICU: '',
                bedDaysNonICU: '',
                ot_time_hrs: '',
              }
            : {
                day_care_procedures: '',
              }),
        },
      };
    });
    return data;
  };

  const [opdData, setOpdData] = useState<PatientTypeData>(initializePatientTypeData(false));
  const [ipdData, setIpdData] = useState<PatientTypeData>(initializePatientTypeData(true));

  // Add useEffect for fetching data when month changes
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchRevenueData({ year: currentYear, month }),
        fetchRevenueSummary({ year: currentYear, month })
      ]);
    };
    fetchData();
  }, [month, currentYear]);

  // Add useEffect to update form data when revenueData changes
  useEffect(() => {
    if (revenueData) {
      const currentMonthData = revenueData.filter(
        revenue => revenue.month === month && revenue.year === currentYear
      );

      if (currentMonthData.length > 0) {
        // Create a map of IDs for existing records
        const ids: { [key: string]: string } = {};
        currentMonthData.forEach(record => {
          const key = `${record.patient_type}_${record.specialty}_${record.billing_category}`;
          ids[key] = record.id;
        });
        setCurrentRevenueIds(ids);

        // Update form data
        const newOpdData = { ...opdData };
        const newIpdData = { ...ipdData };

        currentMonthData.forEach(record => {
          const data = record.patient_type === 'OPD' ? newOpdData : newIpdData;
          const billingType = record.billing_category.toLowerCase() as 'cash' | 'credit';
          
          if (data[record.specialty]) {
            data[record.specialty][billingType] = {
              numberOfPatients: record.number_of_patients || '',
              grossAmount: record.gross_amount || '',
              discount: record.discount || '',
              ...(record.patient_type === 'IPD' && {
                bedDaysICU: record.bed_days_icu || '',
                bedDaysNonICU: record.bed_days_non_icu || '',
                ot_time_hrs: record.ot_time_hrs || '',
              }),
              ...(record.patient_type === 'OPD' && {
                day_care_procedures: record.day_care_procedures || '',
              }),
            };
          }
        });

        setOpdData(newOpdData);
        setIpdData(newIpdData);
      } else {
        setCurrentRevenueIds({});
        setOpdData(initializePatientTypeData(false));
        setIpdData(initializePatientTypeData(true));
      }
    }
  }, [revenueData, month, currentYear]);

  const handleChange = (
    patientType: 'OPD' | 'IPD',
    specialty: string,
    billingType: 'cash' | 'credit',
    field: string,
    value: string | number
  ) => {
    const setData = patientType === 'OPD' ? setOpdData : setIpdData;
    
    setData(prev => ({
      ...prev,
      [specialty]: {
        ...prev[specialty],
        [billingType]: {
          ...prev[specialty][billingType],
          [field]: value === '' ? '' : Number(value)
        }
      }
    }));
  };

  const calculateTotals = (data: PatientTypeData) => {
    let totalPatients = 0;
    let totalBedDaysICU = 0;
    let totalBedDaysNonICU = 0;
    let totalGrossAmount = 0;
    let totalDiscount = 0;

    Object.values(data).forEach(specialty => {
      ['cash', 'credit'].forEach(billingType => {
        const entry = specialty[billingType as 'cash' | 'credit'];
        totalPatients += entry.numberOfPatients;
        totalBedDaysICU += entry.bedDaysICU || 0;
        totalBedDaysNonICU += entry.bedDaysNonICU || 0;
        totalGrossAmount += entry.grossAmount;
        totalDiscount += entry.discount;
      });
    });

    return {
      totalPatients,
      totalBedDaysICU,
      totalBedDaysNonICU,
      totalGrossAmount,
      totalDiscount,
      netRevenue: totalGrossAmount - totalDiscount
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const revenueEntries = [];
      const updatePromises = [];

      // Process OPD data
      for (const specialty of specialties) {
        const opdSpecialtyData = opdData[specialty];
        
        // Cash entry
        if (opdSpecialtyData.cash.numberOfPatients > 0 || opdSpecialtyData.cash.grossAmount > 0) {
          const key = `OPD_${specialty}_Cash`;
          const entry = {
            month,
            year: currentYear,
            patient_type: 'OPD' as const,
            specialty: specialty as any,
            billing_category: 'Cash' as const,
            number_of_patients: opdSpecialtyData.cash.numberOfPatients,
            gross_amount: opdSpecialtyData.cash.grossAmount,
            discount: opdSpecialtyData.cash.discount,
            day_care_procedures: opdSpecialtyData.cash.day_care_procedures || 0,
          };

          if (currentRevenueIds[key]) {
            updatePromises.push(
              apiService.updateRevenueData(currentRevenueIds[key], entry)
            );
          } else {
            revenueEntries.push(entry);
          }
        }

        // Credit entry
        if (opdSpecialtyData.credit.numberOfPatients > 0 || opdSpecialtyData.credit.grossAmount > 0) {
          const key = `OPD_${specialty}_Credit`;
          const entry = {
            month,
            year: currentYear,
            patient_type: 'OPD' as const,
            specialty: specialty as any,
            billing_category: 'Credit' as const,
            number_of_patients: opdSpecialtyData.credit.numberOfPatients,
            gross_amount: opdSpecialtyData.credit.grossAmount,
            discount: opdSpecialtyData.credit.discount,
            day_care_procedures: opdSpecialtyData.credit.day_care_procedures || 0,
          };

          if (currentRevenueIds[key]) {
            updatePromises.push(
              apiService.updateRevenueData(currentRevenueIds[key], entry)
            );
          } else {
            revenueEntries.push(entry);
          }
        }
      }

      // Process IPD data
      for (const specialty of specialties) {
        const ipdSpecialtyData = ipdData[specialty];
        
        // Cash entry
        if (ipdSpecialtyData.cash.numberOfPatients > 0 || ipdSpecialtyData.cash.grossAmount > 0) {
          const key = `IPD_${specialty}_Cash`;
          const entry = {
            month,
            year: currentYear,
            patient_type: 'IPD' as const,
            specialty: specialty as any,
            billing_category: 'Cash' as const,
            number_of_patients: ipdSpecialtyData.cash.numberOfPatients,
            bed_days_icu: ipdSpecialtyData.cash.bedDaysICU || 0,
            bed_days_non_icu: ipdSpecialtyData.cash.bedDaysNonICU || 0,
            gross_amount: ipdSpecialtyData.cash.grossAmount,
            discount: ipdSpecialtyData.cash.discount,
            ot_time_hrs: ipdSpecialtyData.cash.ot_time_hrs || 0,
          };

          if (currentRevenueIds[key]) {
            updatePromises.push(
              apiService.updateRevenueData(currentRevenueIds[key], entry)
            );
          } else {
            revenueEntries.push(entry);
          }
        }

        // Credit entry
        if (ipdSpecialtyData.credit.numberOfPatients > 0 || ipdSpecialtyData.credit.grossAmount > 0) {
          const key = `IPD_${specialty}_Credit`;
          const entry = {
            month,
            year: currentYear,
            patient_type: 'IPD' as const,
            specialty: specialty as any,
            billing_category: 'Credit' as const,
            number_of_patients: ipdSpecialtyData.credit.numberOfPatients,
            bed_days_icu: ipdSpecialtyData.credit.bedDaysICU || 0,
            bed_days_non_icu: ipdSpecialtyData.credit.bedDaysNonICU || 0,
            gross_amount: ipdSpecialtyData.credit.grossAmount,
            discount: ipdSpecialtyData.credit.discount,
            ot_time_hrs: ipdSpecialtyData.credit.ot_time_hrs || 0,
          };

          if (currentRevenueIds[key]) {
            updatePromises.push(
              apiService.updateRevenueData(currentRevenueIds[key], entry)
            );
          } else {
            revenueEntries.push(entry);
          }
        }
      }

      // Execute all operations
      await Promise.all([
        ...(revenueEntries.length > 0 ? [createBulkRevenueData(revenueEntries)] : []),
        ...updatePromises
      ]);

      alert('Revenue data saved successfully!');
      // Fetch updated data and summary
      await Promise.all([
        fetchRevenueData({ year: currentYear, month }),
        fetchRevenueSummary({ year: currentYear, month })
      ]);
    } catch (error) {
      console.error('Failed to save revenue data:', error);
      alert('Failed to save revenue data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentData = activePatientType === 'OPD' ? opdData : ipdData;
  const totals = calculateTotals(currentData);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">{activePatientType} Revenue Data - {month}</h3>
            <p className="text-sm text-accent-600">Enter revenue data for all specialties</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActivePatientType('OPD')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activePatientType === 'OPD'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                OPD
              </button>
              <button
                onClick={() => setActivePatientType('IPD')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activePatientType === 'IPD'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                IPD
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Compact Form Grid - Fixed Height */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          {/* Specialty Grid - 2x2 Layout */}
          <div className="flex-1 grid grid-cols-2 gap-0 border-b border-gray-200">
            {specialties.map((specialty, index) => {
              const specialtyData = currentData[specialty];
              const cashNet = (specialtyData.cash.grossAmount || 0) - (specialtyData.cash.discount || 0);
              const creditNet = (specialtyData.credit.grossAmount || 0) - (specialtyData.credit.discount || 0);
              const totalNet = cashNet + creditNet;
              
              return (
                <div 
                  key={specialty} 
                  className={`p-4 ${index % 2 === 0 ? 'border-r border-gray-200' : ''} ${index < 2 ? 'border-b border-gray-200' : ''} overflow-y-auto`}
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-primary-900 text-sm">{specialty}</h4>
                    {totalNet > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        Net: ₹{totalNet.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Cash Column */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-green-800 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Cash
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Patients"
                          value={specialtyData.cash.numberOfPatients === 0 ? '' : specialtyData.cash.numberOfPatients}
                          onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'numberOfPatients', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                          min="0"
                        />
                        
                        {activePatientType === 'IPD' && (
                          <>
                            <input
                              type="number"
                              placeholder="ICU Days"
                              value={specialtyData.cash.bedDaysICU === 0 ? '' : specialtyData.cash.bedDaysICU}
                              onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'bedDaysICU', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="Non-ICU Days"
                              value={specialtyData.cash.bedDaysNonICU === 0 ? '' : specialtyData.cash.bedDaysNonICU}
                              onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'bedDaysNonICU', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="OT Hours"
                              value={specialtyData.cash.ot_time_hrs === 0 ? '' : specialtyData.cash.ot_time_hrs || ''}
                              onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'ot_time_hrs', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                              min="0"
                              step="0.1"
                            />
                          </>
                        )}
                        
                        {activePatientType === 'OPD' && (
                          <input
                            type="number"
                            placeholder="Day Care"
                            value={specialtyData.cash.day_care_procedures === 0 ? '' : specialtyData.cash.day_care_procedures || ''}
                            onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'day_care_procedures', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                            min="0"
                          />
                        )}
                        
                        <input
                          type="number"
                          placeholder="Gross Amount"
                          value={specialtyData.cash.grossAmount === 0 ? '' : specialtyData.cash.grossAmount}
                          onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'grossAmount', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                          min="0"
                        />
                        
                        <input
                          type="number"
                          placeholder="Discount"
                          value={specialtyData.cash.discount === 0 ? '' : specialtyData.cash.discount}
                          onChange={(e) => handleChange(activePatientType, specialty, 'cash', 'discount', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      
                      {cashNet > 0 && (
                        <div className="mt-2 pt-2 border-t border-green-200">
                          <div className="text-xs font-medium text-green-800">
                            Net: ₹{cashNet.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Credit Column */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-blue-800 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        Credit
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Patients"
                          value={specialtyData.credit.numberOfPatients === 0 ? '' : specialtyData.credit.numberOfPatients}
                          onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'numberOfPatients', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                        
                        {activePatientType === 'IPD' && (
                          <>
                            <input
                              type="number"
                              placeholder="ICU Days"
                              value={specialtyData.credit.bedDaysICU === 0 ? '' : specialtyData.credit.bedDaysICU}
                              onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'bedDaysICU', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="Non-ICU Days"
                              value={specialtyData.credit.bedDaysNonICU === 0 ? '' : specialtyData.credit.bedDaysNonICU}
                              onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'bedDaysNonICU', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="OT Hours"
                              value={specialtyData.credit.ot_time_hrs === 0 ? '' : specialtyData.credit.ot_time_hrs || ''}
                              onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'ot_time_hrs', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              step="0.1"
                            />
                          </>
                        )}
                        
                        {activePatientType === 'OPD' && (
                          <input
                            type="number"
                            placeholder="Day Care"
                            value={specialtyData.credit.day_care_procedures === 0 ? '' : specialtyData.credit.day_care_procedures || ''}
                            onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'day_care_procedures', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                          />
                        )}
                        
                        <input
                          type="number"
                          placeholder="Gross Amount"
                          value={specialtyData.credit.grossAmount === 0 ? '' : specialtyData.credit.grossAmount}
                          onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'grossAmount', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                        
                        <input
                          type="number"
                          placeholder="Discount"
                          value={specialtyData.credit.discount === 0 ? '' : specialtyData.credit.discount}
                          onChange={(e) => handleChange(activePatientType, specialty, 'credit', 'discount', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      
                      {creditNet > 0 && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <div className="text-xs font-medium text-blue-800">
                            Net: ₹{creditNet.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact Summary Footer */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-primary-900">
                {activePatientType} Summary
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <span className="text-accent-600">Patients:</span>
                  <span className="font-semibold text-primary-900 ml-1">{totals.totalPatients}</span>
                </div>
                <div>
                  <span className="text-accent-600">Gross:</span>
                  <span className="font-semibold text-green-600 ml-1">₹{totals.totalGrossAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-accent-600">Discount:</span>
                  <span className="font-semibold text-red-600 ml-1">₹{totals.totalDiscount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-accent-600">Net Revenue:</span>
                  <span className="font-bold text-primary-900 ml-1">₹{totals.netRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
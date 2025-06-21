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
  };
  credit: {
    numberOfPatients: number;
    bedDaysICU?: number;
    bedDaysNonICU?: number;
    grossAmount: number;
    discount: number;
  };
}

interface PatientTypeData {
  [specialty: string]: SpecialtyRevenueData;
}

export function RevenueForm({ month, onMonthChange }: RevenueFormProps) {
  const { createBulkRevenueData, fetchRevenueData, fetchRevenueSummary, revenueData, isLoading } = useRevenueData();
  const [activePatientType, setActivePatientType] = useState<'OPD' | 'IPD'>('OPD');
  const [activeCategory, setActiveCategory] = useState<string>('Cardiology');
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
          ...(includesBedDays && { 
            bedDaysICU: '',
            bedDaysNonICU: ''
          })
        },
        credit: {
          numberOfPatients: '',
          grossAmount: '',
          discount: '',
          ...(includesBedDays && { 
            bedDaysICU: '',
            bedDaysNonICU: ''
          })
        }
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
                bedDaysNonICU: record.bed_days_non_icu || ''
              })
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

  const calculateCategoryTotals = (data: PatientTypeData, category: string) => {
    const categoryData = data[category];
    if (!categoryData) return { patients: 0, grossAmount: 0, discount: 0, netRevenue: 0 };

    // Convert string values to numbers, defaulting to 0 if empty string or invalid
    const cashGrossAmount = Number(categoryData.cash.grossAmount) || 0;
    const cashDiscount = Number(categoryData.cash.discount) || 0;
    const creditGrossAmount = Number(categoryData.credit.grossAmount) || 0;
    const creditDiscount = Number(categoryData.credit.discount) || 0;
    const cashPatients = Number(categoryData.cash.numberOfPatients) || 0;
    const creditPatients = Number(categoryData.credit.numberOfPatients) || 0;

    const cashNet = cashGrossAmount - cashDiscount;
    const creditNet = creditGrossAmount - creditDiscount;
    
    return {
      patients: cashPatients + creditPatients,
      grossAmount: cashGrossAmount + creditGrossAmount,
      discount: cashDiscount + creditDiscount,
      netRevenue: cashNet + creditNet
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
          };

          if (currentRevenueIds[key]) {
            // Update existing record
            const updateData = {
              number_of_patients: opdSpecialtyData.cash.numberOfPatients,
              gross_amount: opdSpecialtyData.cash.grossAmount,
              discount: opdSpecialtyData.cash.discount,
              ...(opdSpecialtyData.cash.bedDaysICU && {
                bed_days_icu: opdSpecialtyData.cash.bedDaysICU,
                bed_days_non_icu: opdSpecialtyData.cash.bedDaysNonICU,
              })
            };
            
            updatePromises.push(
              apiService.updateRevenueData(currentRevenueIds[key], updateData)
            );
          } else {
            // Create new record
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
  const categoryTotals = calculateCategoryTotals(currentData, activeCategory);

  return (
    <div className="flex">
      {/* Vertical Navigation */}
      <div className="w-48 border-r border-primary-200 pr-6">
        <div className="space-y-2">
          <button
            onClick={() => setActivePatientType('OPD')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activePatientType === 'OPD'
                ? 'bg-primary-900 text-white'
                : 'text-accent-700 hover:bg-primary-50'
            }`}
          >
            <div className="font-medium">OPD</div>
            <div className="text-sm opacity-75">Outpatient Department</div>
          </button>
          <button
            onClick={() => setActivePatientType('IPD')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activePatientType === 'IPD'
                ? 'bg-primary-900 text-white'
                : 'text-accent-700 hover:bg-primary-50'
            }`}
          >
            <div className="font-medium">IPD</div>
            <div className="text-sm opacity-75">Inpatient Department</div>
          </button>
        </div>

        {/* Overall Summary */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 className="font-medium text-primary-900 mb-3 text-sm">
            {activePatientType} Total Summary
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-accent-600">Patients:</span>
              <span className="font-semibold text-primary-900">{totals.totalPatients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-accent-600">Net Revenue:</span>
              <span className="font-semibold text-primary-900">${totals.netRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="w-full bg-primary-900 text-white py-3 rounded-lg hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save All Data'}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 pl-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary-900 mb-2">
            {activePatientType} Revenue Data - {month}
          </h3>
          <p className="text-accent-600 text-sm">
            Select a specialty category and enter revenue data for Cash and Credit billing
          </p>
        </div>

        {/* Horizontal Category Navigation */}
        <div className="mb-6">
          <div className="border-b border-primary-200">
            <nav className="flex space-x-8">
              {specialties.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => setActiveCategory(specialty)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeCategory === specialty
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-accent-500 hover:text-accent-700 hover:border-accent-300'
                  }`}
                >
                  {specialty}
                  {/* Show indicator if category has data */}
                  {calculateCategoryTotals(currentData, specialty).netRevenue > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ${Math.round(calculateCategoryTotals(currentData, specialty).netRevenue / 1000)}K
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <form className="space-y-6">
          {/* Active Category Form */}
          <div className="bg-white rounded-lg border border-primary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-primary-900">
                {activeCategory} - {activePatientType}
              </h4>
              {categoryTotals.netRevenue > 0 && (
                <div className="text-sm text-accent-600">
                  Category Revenue: <span className="font-semibold text-primary-900">${categoryTotals.netRevenue.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Column */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <h5 className="font-medium text-green-900">Cash Payments</h5>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Number of Patients
                    </label>
                    <input
                      type="number"
                      value={currentData[activeCategory]?.cash.numberOfPatients === 0 ? '' : currentData[activeCategory]?.cash.numberOfPatients}
                      onChange={(e) => handleChange(activePatientType, activeCategory, 'cash', 'numberOfPatients', e.target.value)}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Enter number of patients"
                      min="0"
                      step="1"
                    />
                  </div>

                  {activePatientType === 'IPD' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">
                          Bed Days - ICU
                        </label>
                        <input
                          type="number"
                          value={currentData[activeCategory]?.cash.bedDaysICU === 0 ? '' : currentData[activeCategory]?.cash.bedDaysICU}
                          onChange={(e) => handleChange(activePatientType, activeCategory, 'cash', 'bedDaysICU', e.target.value)}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder="Enter ICU bed days"
                          min="0"
                          step="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">
                          Bed Days - Non ICU
                        </label>
                        <input
                          type="number"
                          value={currentData[activeCategory]?.cash.bedDaysNonICU === 0 ? '' : currentData[activeCategory]?.cash.bedDaysNonICU}
                          onChange={(e) => handleChange(activePatientType, activeCategory, 'cash', 'bedDaysNonICU', e.target.value)}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder="Enter non-ICU bed days"
                          min="0"
                          step="1"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Gross Amount ($)
                    </label>
                    <input
                      type="number"
                      value={currentData[activeCategory]?.cash.grossAmount === 0 ? '' : currentData[activeCategory]?.cash.grossAmount}
                      onChange={(e) => handleChange(activePatientType, activeCategory, 'cash', 'grossAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Enter gross amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      value={currentData[activeCategory]?.cash.discount === 0 ? '' : currentData[activeCategory]?.cash.discount}
                      onChange={(e) => handleChange(activePatientType, activeCategory, 'cash', 'discount', e.target.value)}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Enter discount amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-green-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-green-800">Net Revenue:</span>
                    <span className="font-semibold text-green-900">
                      ${((currentData[activeCategory]?.cash.grossAmount || 0) - (currentData[activeCategory]?.cash.discount || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credit Column */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <h5 className="font-medium text-blue-900">Credit Payments</h5>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Number of Patients
                    </label>
                    <input
                      type="number"
                      value={currentData[activeCategory]?.credit.numberOfPatients === 0 ? '' : currentData[activeCategory]?.credit.numberOfPatients}
                      onChange={(e) => handleChange(activePatientType, activeCategory, 'credit', 'numberOfPatients', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter number of patients"
                      min="0"
                      step="1"
                    />
                  </div>

                  {activePatientType === 'IPD' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">
                          Bed Days - ICU
                        </label>
                        <input
                          type="number"
                          value={currentData[activeCategory]?.credit.bedDaysICU === 0 ? '' : currentData[activeCategory]?.credit.bedDaysICU}
                          onChange={(e) => handleChange(activePatientType, activeCategory, 'credit', 'bedDaysICU', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter ICU bed days"
                          min="0"
                          step="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">
                          Bed Days - Non ICU
                        </label>
                        <input
                          type="number"
                          value={currentData[activeCategory]?.credit.bedDaysNonICU === 0 ? '' : currentData[activeCategory]?.credit.bedDaysNonICU}
                          onChange={(e) => handleChange(activePatientType, activeCategory, 'credit', 'bedDaysNonICU', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter non-ICU bed days"
                          min="0"
                          step="1"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Gross Amount ($)
                    </label>
                    <input
                      type="number"
                      value={currentData[activeCategory]?.credit.grossAmount === 0 ? '' : currentData[activeCategory]?.credit.grossAmount}
                      onChange={(e) => handleChange(activePatientType, activeCategory, 'credit', 'grossAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter gross amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      value={currentData[activeCategory]?.credit.discount === 0 ? '' : currentData[activeCategory]?.credit.discount}
                      onChange={(e) => handleChange(activePatientType, activeCategory, 'credit', 'discount', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter discount amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-blue-800">Net Revenue:</span>
                    <span className="font-semibold text-blue-900">
                      ${((currentData[activeCategory]?.credit.grossAmount || 0) - (currentData[activeCategory]?.credit.discount || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Summary */}
            <div className="mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-3">
                {activeCategory} Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-accent-600">Total Patients:</span>
                  <div className="font-semibold text-primary-900">{categoryTotals.patients}</div>
                </div>
                <div>
                  <span className="text-accent-600">Gross Amount:</span>
                  <div className="font-semibold text-green-600">${categoryTotals.grossAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-accent-600">Total Discount:</span>
                  <div className="font-semibold text-red-600">${categoryTotals.discount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-accent-600">Net Revenue:</span>
                  <div className="font-bold text-primary-900">${categoryTotals.netRevenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
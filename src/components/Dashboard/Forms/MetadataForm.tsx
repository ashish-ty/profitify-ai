import React, { useState, useEffect } from 'react';
import { useHospitalData } from '../../../hooks/useHospitalData';
import { apiService } from '../../../services/api';

interface MetadataFormProps {
  month: string;
}

export function MetadataForm({ month }: MetadataFormProps) {
  const { createMetadata, fetchMetadata, metadata, isLoading, updateMetadata } = useHospitalData();
  const [isSaving, setIsSaving] = useState(false);
  const [currentMetadataId, setCurrentMetadataId] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const defaultFormData = {
    beds_icu: 0,
    beds_non_icu: 0,
    number_of_nurses: 0,
    resident_doctors: 0,
    technician_staff: 0
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Define metadata fields for modular rendering
  const metadataFields = [
    { key: 'beds_icu', label: 'Available ICU Beds' },
    { key: 'beds_non_icu', label: 'Available Non-ICU Beds' },
    { key: 'number_of_nurses', label: 'Number of Nurses' },
    { key: 'resident_doctors', label: 'Number of Resident Doctors' },
    { key: 'technician_staff', label: 'Technician & Support Staff' }
  ];

  // Fetch data when month changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchMetadata({ year: currentYear, month });
    };
    fetchData();
  }, [month, currentYear]);

  // Update form data when metadata changes
  useEffect(() => {
    if (metadata) {
      const currentMonthData = metadata.find(
        data => data.month === month && data.year === currentYear
      );

      if (currentMonthData) {
        setCurrentMetadataId(currentMonthData.id); // Store the ID for updates
        setFormData({
          beds_icu: currentMonthData.beds_icu,
          beds_non_icu: currentMonthData.beds_non_icu,
          number_of_nurses: currentMonthData.number_of_nurses,
          resident_doctors: currentMonthData.resident_doctors,
          technician_staff: currentMonthData.technician_staff
        });
      } else {
        setCurrentMetadataId(null); // Reset ID when no data exists
        setFormData(defaultFormData);
      }
    }
  }, [metadata, month, currentYear]);

  const handleChange = (field: string, value: string) => {
    // Allow empty string for better UX when clearing the input
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentMetadataId) {
        // Update existing record - only send the fields that need to be updated
        await updateMetadata(currentMetadataId, {
          beds_icu: formData.beds_icu,
          beds_non_icu: formData.beds_non_icu,
          number_of_nurses: formData.number_of_nurses,
          resident_doctors: formData.resident_doctors,
          technician_staff: formData.technician_staff
        });
      } else {
        // Create new record - send all required fields
        await createMetadata({
          month,
          year: currentYear,
          ...formData
        });
      }

      alert('Hospital metadata saved successfully!');
      // Fetch updated data
      await fetchMetadata({ year: currentYear, month });
    } catch (error) {
      console.error('Failed to save hospital metadata:', error);
      alert('Failed to save hospital metadata. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalBeds = formData.beds_icu + formData.beds_non_icu;
  const totalStaff = formData.number_of_nurses + formData.resident_doctors + formData.technician_staff;

  return (
    <form className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Hospital Capacity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metadataFields.slice(0, 2).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  {label}
                </label>
                <input
                  type="number"
                  value={formData[key as keyof typeof formData] === 0 ? '' : formData[key as keyof typeof formData]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  disabled={isLoading || isSaving}
                  min="0"
                  step="1"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Staff Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metadataFields.slice(2).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  {label}
                </label>
                <input
                  type="number"
                  value={formData[key as keyof typeof formData] === 0 ? '' : formData[key as keyof typeof formData]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  disabled={isLoading || isSaving}
                  min="0"
                  step="1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-4">Hospital Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-blue-900 mb-2">Capacity Summary</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-accent-600">ICU Beds:</span>
                <span className="font-semibold text-blue-900">{formData.beds_icu || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-600">Non-ICU Beds:</span>
                <span className="font-semibold text-blue-900">{formData.beds_non_icu || 0}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="font-medium text-blue-900">Total Beds:</span>
                <span className="font-bold text-blue-900">{totalBeds}</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-blue-900 mb-2">Staff Summary</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-accent-600">Nurses:</span>
                <span className="font-semibold text-blue-900">{formData.number_of_nurses || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-600">Doctors:</span>
                <span className="font-semibold text-blue-900">{formData.resident_doctors || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-600">Support Staff:</span>
                <span className="font-semibold text-blue-900">{formData.technician_staff || 0}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="font-medium text-blue-900">Total Staff:</span>
                <span className="font-bold text-blue-900">{totalStaff}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Metadata'}
        </button>
      </div>
    </form>
  );
}
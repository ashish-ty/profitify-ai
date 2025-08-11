import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { Calculator, TrendingUp, Target, DollarSign, Users, Percent } from 'lucide-react';

export function BudgetPlanning() {
  const [userInputs, setUserInputs] = useState({
    patientGrowth: 0,
    revenuePerPatientGrowth: 0,
    costGrowth: 0
  });

  const [showComparison, setShowComparison] = useState(false);

  // Current baseline data (dummy)
  const currentData = {
    patients: 14600,
    revenuePerPatient: 225,
    totalRevenue: 3285000,
    totalCosts: 2770000,
    netProfit: 515000,
    profitMargin: 15.7
  };

  // Industry averages (dummy)
  const industryAverages = {
    patientGrowth: 5.2,
    revenuePerPatientGrowth: 3.8,
    costGrowth: 4.1
  };

  const handleInputChange = (field: string, value: number) => {
    setUserInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateProjections = (inputs: typeof userInputs) => {
    const newPatients = currentData.patients * (1 + inputs.patientGrowth / 100);
    const newRevenuePerPatient = currentData.revenuePerPatient * (1 + inputs.revenuePerPatientGrowth / 100);
    const newTotalRevenue = newPatients * newRevenuePerPatient;
    const newTotalCosts = currentData.totalCosts * (1 + inputs.costGrowth / 100);
    const newNetProfit = newTotalRevenue - newTotalCosts;
    const newProfitMargin = (newNetProfit / newTotalRevenue) * 100;

    return {
      patients: Math.round(newPatients),
      revenuePerPatient: Math.round(newRevenuePerPatient),
      totalRevenue: Math.round(newTotalRevenue),
      totalCosts: Math.round(newTotalCosts),
      netProfit: Math.round(newNetProfit),
      profitMargin: Number(newProfitMargin.toFixed(1))
    };
  };

  const userProjections = calculateProjections(userInputs);
  const industryProjections = calculateProjections(industryAverages);

  return (
    <ToolLayout
      title="Budget Planning"
      description="Interactive budget planning with percentage-based projections and scenario analysis"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Budget Planning Parameters
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Revenue Factors</h4>
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Patient Volume Change (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={userInputs.patientGrowth}
                    onChange={(e) => handleInputChange('patientGrowth', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                    step="0.1"
                  />
                  <Percent className="absolute right-3 top-2.5 h-4 w-4 text-accent-400" />
                </div>
                <div className="text-xs text-accent-500 mt-1">
                  Industry avg: +{industryAverages.patientGrowth}%
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Revenue per Patient Change (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={userInputs.revenuePerPatientGrowth}
                    onChange={(e) => handleInputChange('revenuePerPatientGrowth', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                    step="0.1"
                  />
                  <Percent className="absolute right-3 top-2.5 h-4 w-4 text-accent-400" />
                </div>
                <div className="text-xs text-accent-500 mt-1">
                  Industry avg: +{industryAverages.revenuePerPatientGrowth}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Cost Factors</h4>
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Total Cost Change (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={userInputs.costGrowth}
                    onChange={(e) => handleInputChange('costGrowth', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                    step="0.1"
                  />
                  <Percent className="absolute right-3 top-2.5 h-4 w-4 text-accent-400" />
                </div>
                <div className="text-xs text-accent-500 mt-1">
                  Industry avg: +{industryAverages.costGrowth}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Actions</h4>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="w-full bg-primary-900 text-white py-2 rounded-lg hover:bg-primary-800 transition-colors font-medium"
              >
                {showComparison ? 'Hide' : 'Show'} Industry Comparison
              </button>
              <button
                onClick={() => setUserInputs({ patientGrowth: 0, revenuePerPatientGrowth: 0, costGrowth: 0 })}
                className="w-full border border-accent-300 text-accent-700 py-2 rounded-lg hover:bg-accent-50 transition-colors font-medium"
              >
                Reset Values
              </button>
            </div>
          </div>
        </div>

        {/* Current vs Projected Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Current Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Patients</span>
                <span className="font-semibold text-primary-900">{currentData.patients.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Revenue per Patient</span>
                <span className="font-semibold text-primary-900">₹{currentData.revenuePerPatient}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Revenue</span>
                <span className="font-semibold text-green-600">₹{currentData.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Costs</span>
                <span className="font-semibold text-red-600">₹{currentData.totalCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-primary-200 pt-2">
                <span className="font-medium text-primary-900">Net Profit</span>
                <span className="font-bold text-primary-900">₹{currentData.netProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary-900">Profit Margin</span>
                <span className="font-bold text-primary-900">{currentData.profitMargin}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Your Projected Budget</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Patients</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary-900">{userProjections.patients.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userProjections.patients > currentData.patients ? 'bg-green-100 text-green-700' : 
                    userProjections.patients < currentData.patients ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userProjections.patients > currentData.patients ? '+' : ''}
                    {((userProjections.patients - currentData.patients) / currentData.patients * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Revenue per Patient</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary-900">₹{userProjections.revenuePerPatient}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userProjections.revenuePerPatient > currentData.revenuePerPatient ? 'bg-green-100 text-green-700' : 
                    userProjections.revenuePerPatient < currentData.revenuePerPatient ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userProjections.revenuePerPatient > currentData.revenuePerPatient ? '+' : ''}
                    {((userProjections.revenuePerPatient - currentData.revenuePerPatient) / currentData.revenuePerPatient * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Revenue</span>
                <span className="font-semibold text-green-600">₹{userProjections.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600">Total Costs</span>
                <span className="font-semibold text-red-600">₹{userProjections.totalCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-primary-200 pt-2">
                <span className="font-medium text-primary-900">Net Profit</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary-900">₹{userProjections.netProfit.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userProjections.netProfit > currentData.netProfit ? 'bg-green-100 text-green-700' : 
                    userProjections.netProfit < currentData.netProfit ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userProjections.netProfit > currentData.netProfit ? '+' : ''}
                    {((userProjections.netProfit - currentData.netProfit) / currentData.netProfit * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary-900">Profit Margin</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary-900">{userProjections.profitMargin}%</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userProjections.profitMargin > currentData.profitMargin ? 'bg-green-100 text-green-700' : 
                    userProjections.profitMargin < currentData.profitMargin ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userProjections.profitMargin > currentData.profitMargin ? '+' : ''}
                    {(userProjections.profitMargin - currentData.profitMargin).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Comparison */}
        {showComparison && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Industry Average Projections</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-3">Industry Assumptions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent-600">Patient Growth:</span>
                    <span className="font-semibold">+{industryAverages.patientGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Revenue/Patient:</span>
                    <span className="font-semibold">+{industryAverages.revenuePerPatientGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Cost Growth:</span>
                    <span className="font-semibold">+{industryAverages.costGrowth}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-3">Industry Projections</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent-600">Total Revenue:</span>
                    <span className="font-semibold text-green-600">₹{industryProjections.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Total Costs:</span>
                    <span className="font-semibold text-red-600">₹{industryProjections.totalCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Net Profit:</span>
                    <span className="font-semibold text-primary-900">₹{industryProjections.netProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Profit Margin:</span>
                    <span className="font-semibold text-primary-900">{industryProjections.profitMargin}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-3">Your vs Industry</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent-600">Revenue Difference:</span>
                    <span className={`font-semibold ${
                      userProjections.totalRevenue > industryProjections.totalRevenue ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {userProjections.totalRevenue > industryProjections.totalRevenue ? '+' : ''}
                      ₹{(userProjections.totalRevenue - industryProjections.totalRevenue).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Profit Difference:</span>
                    <span className={`font-semibold ${
                      userProjections.netProfit > industryProjections.netProfit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {userProjections.netProfit > industryProjections.netProfit ? '+' : ''}
                      ₹{(userProjections.netProfit - industryProjections.netProfit).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-600">Margin Difference:</span>
                    <span className={`font-semibold ${
                      userProjections.profitMargin > industryProjections.profitMargin ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {userProjections.profitMargin > industryProjections.profitMargin ? '+' : ''}
                      {(userProjections.profitMargin - industryProjections.profitMargin).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Budget Planning Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                Conservative Scenario
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Patient growth: +3%, Revenue/patient: +2%, Cost growth: +3%
              </p>
              <div className="text-xs text-green-600 font-medium">Expected profit margin: 15.2%</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                Aggressive Scenario
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Patient growth: +8%, Revenue/patient: +5%, Cost growth: +2%
              </p>
              <div className="text-xs text-green-600 font-medium">Expected profit margin: 18.5%</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
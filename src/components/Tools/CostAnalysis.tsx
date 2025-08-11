import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { SimpleChart } from './Charts/SimpleChart';
import { Activity, DollarSign, Users, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { ChartData } from '../../types';

// Dummy data for specialty-wise cost analysis
const specialtyData = {
  Cardiology: {
    revenue: 180000,
    patients: 450,
    costs: {
      pharmacy: 32000,
      staff: 45000,
      equipment: 18000,
      facilities: 12000,
      admin: 8000
    }
  },
  Oncology: {
    revenue: 150000,
    patients: 280,
    costs: {
      pharmacy: 45000,
      staff: 38000,
      equipment: 22000,
      facilities: 10000,
      admin: 6000
    }
  },
  Neurology: {
    revenue: 120000,
    patients: 320,
    costs: {
      pharmacy: 25000,
      staff: 35000,
      equipment: 15000,
      facilities: 8000,
      admin: 5000
    }
  },
  Gynaecology: {
    revenue: 200000,
    patients: 520,
    costs: {
      pharmacy: 28000,
      staff: 42000,
      equipment: 12000,
      facilities: 15000,
      admin: 7000
    }
  }
};

export function CostAnalysis() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const calculateSpecialtyMetrics = (specialty: string) => {
    const data = specialtyData[specialty as keyof typeof specialtyData];
    const totalCosts = Object.values(data.costs).reduce((sum, cost) => sum + cost, 0);
    const profit = data.revenue - totalCosts;
    const profitMargin = (profit / data.revenue) * 100;
    const costPerPatient = totalCosts / data.patients;
    const revenuePerPatient = data.revenue / data.patients;

    return {
      ...data,
      totalCosts,
      profit,
      profitMargin,
      costPerPatient,
      revenuePerPatient
    };
  };

  const getAllSpecialtiesData = () => {
    return Object.keys(specialtyData).map(specialty => {
      const metrics = calculateSpecialtyMetrics(specialty);
      return {
        specialty,
        ...metrics
      };
    });
  };

  const specialtyProfitData: ChartData[] = Object.keys(specialtyData).map(specialty => {
    const metrics = calculateSpecialtyMetrics(specialty);
    return {
      month: specialty,
      value: Math.round(metrics.profitMargin)
    };
  });

  const specialtyRevenueData: ChartData[] = Object.keys(specialtyData).map(specialty => {
    const data = specialtyData[specialty as keyof typeof specialtyData];
    return {
      month: specialty,
      value: data.revenue
    };
  });

  const allSpecialties = getAllSpecialtiesData();
  const totalRevenue = allSpecialties.reduce((sum, s) => sum + s.revenue, 0);
  const totalCosts = allSpecialties.reduce((sum, s) => sum + s.totalCosts, 0);
  const totalPatients = allSpecialties.reduce((sum, s) => sum + s.patients, 0);

  return (
    <ToolLayout
      title="Specialty-wise Cost Analysis"
      description="Detailed cost breakdown by specialty with profitability mapping and per-patient costs"
    >
      <div className="space-y-8">
        {/* Specialty Selector */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">Select Specialty</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedSpecialty('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSpecialty === 'all'
                  ? 'bg-primary-900 text-white'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              All Specialties
            </button>
            {Object.keys(specialtyData).map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-primary-900 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-1">₹{totalRevenue.toLocaleString()}</h3>
              <p className="text-accent-600 text-sm">Total Revenue</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-1">₹{totalCosts.toLocaleString()}</h3>
              <p className="text-accent-600 text-sm">Total Costs</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-1">{totalPatients.toLocaleString()}</h3>
              <p className="text-accent-600 text-sm">Total Patients</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-1">
                {(((totalRevenue - totalCosts) / totalRevenue) * 100).toFixed(1)}%
              </h3>
              <p className="text-accent-600 text-sm">Overall Margin</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimpleChart
            data={specialtyProfitData}
            title="Profit Margin by Specialty (%)"
            color="bg-green-600"
          />
          <SimpleChart
            data={specialtyRevenueData}
            title="Revenue by Specialty"
            color="bg-blue-600"
          />
        </div>

        {/* Detailed Analysis */}
        {selectedSpecialty === 'all' ? (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">All Specialties Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-200">
                    <th className="text-left py-3 px-4 font-medium text-primary-900">Specialty</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Patients</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Costs</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Profit</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Margin</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Cost/Patient</th>
                    <th className="text-right py-3 px-4 font-medium text-primary-900">Revenue/Patient</th>
                  </tr>
                </thead>
                <tbody>
                  {allSpecialties.map((specialty) => (
                    <tr key={specialty.specialty} className="border-b border-primary-100">
                      <td className="py-3 px-4 font-medium text-primary-900">{specialty.specialty}</td>
                      <td className="py-3 px-4 text-right text-accent-700">{specialty.patients}</td>
                      <td className="py-3 px-4 text-right text-green-600 font-medium">₹{specialty.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-red-600 font-medium">₹{specialty.totalCosts.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-primary-900 font-medium">₹{specialty.profit.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${
                          specialty.profitMargin > 20 ? 'text-green-600' : 
                          specialty.profitMargin > 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {specialty.profitMargin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-accent-700">₹{specialty.costPerPatient.toFixed(0)}</td>
                      <td className="py-3 px-4 text-right text-accent-700">₹{specialty.revenuePerPatient.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">{selectedSpecialty} - Financial Overview</h3>
              {(() => {
                const metrics = calculateSpecialtyMetrics(selectedSpecialty);
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-900 mb-1">₹{metrics.revenue.toLocaleString()}</div>
                        <div className="text-green-700 text-sm">Total Revenue</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-900 mb-1">₹{metrics.totalCosts.toLocaleString()}</div>
                        <div className="text-red-700 text-sm">Total Costs</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-900 mb-1">{metrics.patients}</div>
                        <div className="text-blue-700 text-sm">Total Patients</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-900 mb-1">{metrics.profitMargin.toFixed(1)}%</div>
                        <div className="text-purple-700 text-sm">Profit Margin</div>
                      </div>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-primary-900 mb-1">₹{metrics.profit.toLocaleString()}</div>
                      <div className="text-primary-700">Net Profit</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">{selectedSpecialty} - Cost Breakdown</h3>
              {(() => {
                const metrics = calculateSpecialtyMetrics(selectedSpecialty);
                return (
                  <div className="space-y-4">
                    {Object.entries(metrics.costs).map(([category, cost]) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-accent-600 capitalize">{category.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-primary-900">₹{cost.toLocaleString()}</span>
                            <span className="text-xs text-accent-500">
                              ({((cost / metrics.totalCosts) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="bg-primary-100 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${(cost / metrics.totalCosts) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-primary-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-primary-900">Cost per Patient</span>
                        <span className="text-xl font-bold text-primary-900">₹{metrics.costPerPatient.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium text-primary-900">Revenue per Patient</span>
                        <span className="text-xl font-bold text-green-600">₹{metrics.revenuePerPatient.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Specialty Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-green-600" />
                Most Profitable Specialty
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Gynaecology shows the highest profit margin at 28.8%. Consider expanding capacity and services.
              </p>
              <div className="text-xs text-green-600 font-medium">Revenue/Patient: $385 | Cost/Patient: $200</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-red-600" />
                Cost Optimization Opportunity
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Oncology has the highest cost per patient ($432). Focus on optimizing pharmacy and equipment costs.
              </p>
              <div className="text-xs text-red-600 font-medium">Potential savings: $15,000/month</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Volume Opportunity
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Neurology has good margins (22.7%) but lower patient volume. Marketing focus could increase revenue.
              </p>
              <div className="text-xs text-blue-600 font-medium">Target: +25% patient volume</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Strategic Recommendation
              </h4>
              <p className="text-sm text-accent-600 mb-2">
                Reallocate resources from low-margin to high-margin specialties to improve overall profitability.
              </p>
              <div className="text-xs text-purple-600 font-medium">Projected impact: +3.5% overall margin</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
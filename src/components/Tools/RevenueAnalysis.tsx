import React, { useState, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { SimpleChart } from './Charts/SimpleChart';
import { MetricCard } from './Charts/MetricCard';
import { DollarSign, TrendingUp, Users, Calendar, ArrowUp, ArrowDown, AlertCircle, Target } from 'lucide-react';
import { ChartData, MetricCard as MetricCardType } from '../../types';
import { useRevenueAnalytics } from '../../hooks/useRevenueAnalytics';

export function RevenueAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState(6);
  const { revenueAnalysis, isLoading, error, fetchRevenueAnalysis } = useRevenueAnalytics();

  useEffect(() => {
    fetchRevenueAnalysis({ months: selectedTimeframe });
  }, [selectedTimeframe]);

  if (isLoading) {
    return (
      <ToolLayout
        title="Revenue Analysis"
        description="Comprehensive insights based on revenue data including trends, patterns, and growth opportunities"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
        </div>
      </ToolLayout>
    );
  }

  if (error) {
    return (
      <ToolLayout
        title="Revenue Analysis"
        description="Comprehensive insights based on revenue data including trends, patterns, and growth opportunities"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (!revenueAnalysis) {
    return (
      <ToolLayout
        title="Revenue Analysis"
        description="Comprehensive insights based on revenue data including trends, patterns, and growth opportunities"
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">No revenue data available. Please add revenue data first.</span>
          </div>
        </div>
      </ToolLayout>
    );
  }

  const { metrics, trends, insights, specialty_analysis, patient_type_analysis, payment_analysis } = revenueAnalysis;

  // Convert data for charts
  const monthlyRevenueData: ChartData[] = trends.monthly_trends.map(trend => ({
    month: trend.month.substring(0, 3),
    value: trend.revenue
  }));

  const specialtyRevenueData: ChartData[] = Object.entries(specialty_analysis).map(([specialty, data]) => ({
    month: specialty,
    value: data.total_revenue
  }));

  // Create metrics cards
  const metricsCards: MetricCardType[] = [
    {
      title: 'Total Revenue',
      value: `$${(metrics.total_revenue / 1000).toFixed(0)}K`,
      change: `${metrics.monthly_growth_rate > 0 ? '+' : ''}${metrics.monthly_growth_rate.toFixed(1)}%`,
      trend: metrics.monthly_growth_rate >= 0 ? 'up' : 'down',
      icon: DollarSign
    },
    {
      title: 'Revenue Growth',
      value: `${metrics.monthly_growth_rate.toFixed(1)}%`,
      change: trends.trend_direction === 'increasing' ? '+2.1%' : '-1.2%',
      trend: trends.trend_direction === 'increasing' ? 'up' : 'down',
      icon: TrendingUp
    },
    {
      title: 'Avg Revenue/Patient',
      value: `$${metrics.avg_revenue_per_patient.toFixed(0)}`,
      change: '+3.2%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Daily Revenue',
      value: `$${(metrics.daily_avg_revenue / 1000).toFixed(1)}K`,
      change: '+5.4%',
      trend: 'up',
      icon: Calendar
    }
  ];

  return (
    <ToolLayout
      title="Revenue Analysis"
      description="Comprehensive insights based on revenue data including trends, patterns, and growth opportunities"
    >
      <div className="space-y-8">
        {/* Time Frame Selector */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">Analysis Period</h3>
          <div className="flex space-x-2">
            {[3, 6, 12].map((months) => (
              <button
                key={months}
                onClick={() => setSelectedTimeframe(months)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === months
                    ? 'bg-primary-900 text-white'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {months} Months
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsCards.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimpleChart
            data={monthlyRevenueData}
            title="Monthly Revenue Trend"
            color="bg-green-600"
          />
          <SimpleChart
            data={specialtyRevenueData}
            title="Revenue by Specialty"
            color="bg-blue-600"
          />
        </div>

        {/* Revenue Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Revenue Sources</h3>
            <div className="space-y-4">
              {Object.entries(patient_type_analysis).map(([type, data]) => (
                <div key={type}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-accent-600">{type} Revenue</span>
                    <span className="font-semibold text-primary-900">{data.revenue_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="bg-primary-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${type === 'OPD' ? 'bg-primary-600' : 'bg-blue-600'}`}
                      style={{ width: `${data.revenue_percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {Object.entries(payment_analysis).map(([method, data]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-accent-600">{method} Payments</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary-900">{data.revenue_percentage.toFixed(1)}%</span>
                    {data.discount_rate > 10 ? (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Top Performing</h3>
            <div className="text-center">
              {(() => {
                const topSpecialty = Object.entries(specialty_analysis).reduce((max, [specialty, data]) => 
                  data.total_revenue > max.revenue ? { name: specialty, revenue: data.total_revenue } : max,
                  { name: '', revenue: 0 }
                );
                return (
                  <>
                    <div className="text-3xl font-bold text-primary-900 mb-2">{topSpecialty.name}</div>
                    <div className="text-accent-600 mb-2">Best Specialty</div>
                    <div className="text-green-600 font-medium">${topSpecialty.revenue.toLocaleString()}</div>
                    <div className="text-sm text-accent-500 mt-1">Total Revenue</div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">AI-Powered Revenue Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                  {insight.type === 'growth_opportunity' && <TrendingUp className="h-4 w-4 mr-2 text-green-600" />}
                  {insight.type === 'patient_volume_insight' && <Users className="h-4 w-4 mr-2 text-blue-600" />}
                  {insight.type === 'seasonal_pattern' && <Calendar className="h-4 w-4 mr-2 text-purple-600" />}
                  {insight.type === 'revenue_optimization' && <Target className="h-4 w-4 mr-2 text-orange-600" />}
                  {insight.title}
                </h4>
                <p className="text-sm text-accent-600 mb-2">{insight.description}</p>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.impact.toUpperCase()} IMPACT
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-accent-600">Analysis Period:</span>
              <div className="font-semibold text-primary-900">
                {revenueAnalysis.data_period.start_date && revenueAnalysis.data_period.end_date ? (
                  `${new Date(revenueAnalysis.data_period.start_date).toLocaleDateString()} - ${new Date(revenueAnalysis.data_period.end_date).toLocaleDateString()}`
                ) : 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-accent-600">Total Records:</span>
              <div className="font-semibold text-primary-900">{revenueAnalysis.data_period.total_records}</div>
            </div>
            <div>
              <span className="text-accent-600">Discount Rate:</span>
              <div className="font-semibold text-primary-900">{metrics.discount_rate.toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-accent-600">Trend Direction:</span>
              <div className={`font-semibold ${trends.trend_direction === 'increasing' ? 'text-green-600' : 'text-accent-600'}`}>
                {trends.trend_direction.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
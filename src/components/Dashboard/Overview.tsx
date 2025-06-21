import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

export function Overview() {
  const { dashboardMetrics, fetchDashboardMetrics, isLoading } = useAnalytics();

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard Overview</h1>
          <p className="text-accent-600">Monitor your hospital's financial performance at a glance</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${dashboardMetrics?.total_revenue?.toLocaleString() || '0'}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Expenses',
      value: `$${dashboardMetrics?.total_expenses?.toLocaleString() || '0'}`,
      change: '-3.2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Net Profit',
      value: `$${dashboardMetrics?.net_profit?.toLocaleString() || '0'}`,
      change: '+18.7%',
      trend: 'up',
      icon: Activity,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      title: 'Patient Volume',
      value: dashboardMetrics?.total_patients?.toLocaleString() || '0',
      change: '+5.4%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard Overview</h1>
        <p className="text-accent-600">Monitor your hospital's financial performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-1">{stat.value}</h3>
              <p className="text-accent-600 text-sm">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Key Performance Indicators</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-accent-700">Profit Margin</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-primary-100 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((dashboardMetrics?.profit_margin || 0), 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-primary-900">
                  {dashboardMetrics?.profit_margin?.toFixed(1) || '0'}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-accent-700">Revenue per Patient</span>
              <span className="text-sm font-medium text-primary-900">
                ${dashboardMetrics?.revenue_per_patient?.toFixed(0) || '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors">
              <div className="font-medium text-primary-900">Add Revenue Data</div>
              <div className="text-sm text-primary-700">Enter monthly revenue information</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors">
              <div className="font-medium text-primary-900">Record Expenses</div>
              <div className="text-sm text-primary-700">Update expense categories</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-accent-50 hover:bg-accent-100 transition-colors">
              <div className="font-medium text-primary-900">View Analytics</div>
              <div className="text-sm text-primary-700">Explore detailed insights</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
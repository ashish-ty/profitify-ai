export interface User {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
}

export type DataType = 'revenue' | 'expenses' | 'metadata' | 'cost-analysis';

export interface ToolCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  tools: Tool[];
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  route: string;
  category: string;
}

export interface ChartData {
  month: string;
  value: number;
  label?: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}

export interface ProfitabilityLevel {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
}

export interface RevenueData {
  month: string;
  patientType: 'OPD' | 'IPD';
  specialty: 'Cardiology' | 'Oncology' | 'Neurology' | 'Gynaecology';
  billingCategory: 'Cash' | 'Credit';
  numberOfPatients: number;
  bedDaysICU: number;
  bedDaysNonICU: number;
  grossAmount: number;
  discount: number;
}

export interface ExpenseData {
  month: string;
  pharmacy: number;
  materialNonMedical: number;
  doctorShare: number;
  salaryWages: number;
  powerFuel: number;
  adminFinancial: number;
  repairMaintenance: number;
  salesMarketing: number;
  depreciation: number;
}

export interface HospitalMetadata {
  month: string;
  bedsICU: number;
  bedsNonICU: number;
  numberOfNurses: number;
  residentDoctors: number;
  technicianStaff: number;
}

export type DataType = 'revenue' | 'expenses' | 'metadata';

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
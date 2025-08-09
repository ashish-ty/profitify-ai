"""
Cost Module - Business logic for service-wise cost analysis
Uses logic from reference Jupyter notebook to generate final output DataFrame
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple, Any
from decimal import Decimal
import logging
from app.core.database_layer import DatabaseLayer

logger = logging.getLogger(__name__)

class CostAnalysisModule:
    """Service-wise cost analysis module with activity-based costing logic"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.db_layer = DatabaseLayer(user_id)
        self.cost_allocation_graph = {}
        self.service_costs = {}
    
    async def generate_service_wise_cost_analysis(self, 
                                                filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """
        Main function to generate service-wise cost analysis
        Returns DataFrame with service-wise breakdown of every cost type
        """
        try:
            # Step 1: Data preparation
            tables = await self._prepare_data(filters)
            
            # Step 2: Create cost allocation graph/nodes
            cost_graph = self._create_cost_allocation_graph(tables)
            
            # Step 3: Apply cost allocation logic
            allocated_costs = self._apply_cost_allocation_logic(tables, cost_graph)
            
            # Step 4: Generate final DataFrame
            final_df = self._generate_final_dataframe(allocated_costs, tables)
            
            logger.info(f"Generated service-wise cost analysis with {len(final_df)} services")
            return final_df
            
        except Exception as e:
            logger.error(f"Error in service-wise cost analysis: {e}")
            return pd.DataFrame()
    
    async def _prepare_data(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, pd.DataFrame]:
        """Data preparation: rename, clean, preprocess all tables"""
        try:
            # Load all tables
            tables = await self.db_layer.load_all_tables(filters)
            
            # Clean and preprocess each table
            cleaned_tables = {}
            
            # Service Register preprocessing
            if not tables['service_register'].empty:
                service_df = tables['service_register'].copy()
                service_df = self._clean_service_register(service_df)
                cleaned_tables['service_register'] = service_df
            
            # Trial Balance preprocessing
            if not tables['trial_balance'].empty:
                trial_df = tables['trial_balance'].copy()
                trial_df = self._clean_trial_balance(trial_df)
                cleaned_tables['trial_balance'] = trial_df
            
            # Expense Wise preprocessing
            if not tables['expense_wise'].empty:
                expense_df = tables['expense_wise'].copy()
                expense_df = self._clean_expense_wise(expense_df)
                cleaned_tables['expense_wise'] = expense_df
            
            # Variable Cost preprocessing
            if not tables['variable_cost_bill_wise'].empty:
                variable_df = tables['variable_cost_bill_wise'].copy()
                variable_df = self._clean_variable_cost(variable_df)
                cleaned_tables['variable_cost_bill_wise'] = variable_df
            
            # HR Data preprocessing
            if not tables['hr_data'].empty:
                hr_df = tables['hr_data'].copy()
                hr_df = self._clean_hr_data(hr_df)
                cleaned_tables['hr_data'] = hr_df
            
            # Occupancy preprocessing
            if not tables['occupancy_register'].empty:
                occupancy_df = tables['occupancy_register'].copy()
                occupancy_df = self._clean_occupancy_data(occupancy_df)
                cleaned_tables['occupancy_register'] = occupancy_df
            
            # Cost Center preprocessing
            if not tables['cost_center'].empty:
                cost_center_df = tables['cost_center'].copy()
                cleaned_tables['cost_center'] = cost_center_df
            
            # Secondary Cost Driver preprocessing
            if not tables['secondary_cost_driver'].empty:
                secondary_df = tables['secondary_cost_driver'].copy()
                secondary_df = self._clean_secondary_cost_driver(secondary_df)
                cleaned_tables['secondary_cost_driver'] = secondary_df
            
            logger.info("Data preparation completed successfully")
            return cleaned_tables
            
        except Exception as e:
            logger.error(f"Error in data preparation: {e}")
            return {}
    
    def _clean_service_register(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and standardize service register data"""
        # Standardize service names
        df['service_name_clean'] = df['service_name'].str.strip().str.title()
        
        # Create service categories
        df['service_category'] = df['service_department'].str.strip().str.title()
        
        # Calculate service profitability
        df['service_profit'] = df['net_amount'] - df['cost_of_pharmacy_material_billed_to_patient']
        
        # Add cost allocation keys
        df['cost_allocation_key'] = df['service_department'] + '_' + df['service_name']
        
        return df
    
    def _clean_trial_balance(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and categorize trial balance data"""
        # Standardize categories
        df['category_clean'] = df['category'].str.strip().str.title()
        df['grouping_clean'] = df['grouping'].str.strip().str.title()
        
        # Create cost type mapping
        df['cost_type'] = df.apply(self._map_cost_type, axis=1)
        
        return df
    
    def _clean_expense_wise(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean expense wise data"""
        # Standardize nature of data
        df['nature_clean'] = df['nature_of_data'].str.strip().str.title()
        
        # Map to cost centers
        df['cost_center_mapped'] = df['sub_cost_centre'].str.strip().str.title()
        
        return df
    
    def _clean_variable_cost(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean variable cost data"""
        # Calculate total variable cost per bill
        cost_columns = [
            'pharmacy_charged_to_patient',
            'medical_surgical_consumables_charged_to_patient',
            'implants_and_prosthetics_charged_to_patient',
            'non_medical_consumables_charged_to_patient',
            'fee_for_service',
            'incentives_to_consultants_treating_doctors',
            'patient_food_beverages_outsource_service',
            'laboratory_test_outsource_service',
            'any_other_patient_related_outsourced_services_1',
            'any_other_patient_related_outsourced_services_2',
            'any_other_patient_related_outsourced_services_3',
            'brokerage_commission',
            'provision_for_deduction_bad_debts'
        ]
        
        df['total_variable_cost'] = df[cost_columns].sum(axis=1)
        
        return df
    
    def _clean_hr_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean HR data"""
        # Calculate cost per hour
        df['cost_per_hour'] = np.where(
            df['actual_hours'] > 0,
            df['gross_total'] / df['actual_hours'],
            0
        )
        
        # Map to departments
        df['department_clean'] = df['department'].str.strip().str.title()
        
        return df
    
    def _clean_occupancy_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean occupancy data"""
        # Calculate occupancy metrics
        df['bed_utilization_hours'] = df['length_of_stay_in_hours']
        
        # Map to cost centers
        df['ward_cost_center'] = df['sub_cost_centre'].str.strip().str.title()
        
        return df
    
    def _clean_secondary_cost_driver(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean secondary cost driver data"""
        # Calculate total patient load
        df['total_patient_load'] = (
            df['no_of_patient_op_ip'] + 
            df['no_of_ip_patients'] + 
            df['no_of_corporate_patient_op_ip']
        )
        
        # Calculate staff efficiency
        df['staff_efficiency'] = np.where(
            df['no_of_nursing_staff'] > 0,
            df['total_patient_load'] / df['no_of_nursing_staff'],
            0
        )
        
        return df
    
    def _map_cost_type(self, row) -> str:
        """Map trial balance entries to cost types"""
        category = row['category'].lower()
        grouping = row['grouping'].lower()
        
        if 'pharmacy' in category or 'medicine' in category:
            return 'Pharmacy'
        elif 'equipment' in category or 'medical equipment' in category:
            return 'Medical Equipment'
        elif 'salary' in category or 'staff' in category:
            return 'Staff Costs'
        elif 'utility' in category or 'electricity' in category:
            return 'Utilities'
        elif 'admin' in category:
            return 'Administrative'
        else:
            return 'Other'
    
    def _create_cost_allocation_graph(self, tables: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Create cost allocation graph/nodes for activity-based costing"""
        try:
            cost_graph = {
                'cost_centers': {},
                'services': {},
                'allocation_rules': {},
                'cost_drivers': {}
            }
            
            # Create cost center nodes
            if 'cost_center' in tables and not tables['cost_center'].empty:
                for _, row in tables['cost_center'].iterrows():
                    cost_center_id = row['cost_centre_code']
                    cost_graph['cost_centers'][cost_center_id] = {
                        'name': row['cost_centre'],
                        'type': row['cc_type'],
                        'category': row.get('cost_centre_category', ''),
                        'cost_driver': row.get('cost_driver', ''),
                        'sub_centers': []
                    }
            
            # Create service nodes from service register
            if 'service_register' in tables and not tables['service_register'].empty:
                for _, row in tables['service_register'].iterrows():
                    service_id = f"{row['service_department']}_{row['service_name']}"
                    cost_graph['services'][service_id] = {
                        'name': row['service_name'],
                        'department': row['service_department'],
                        'sub_department': row.get('service_sub_department', ''),
                        'revenue': float(row['net_amount']),
                        'direct_costs': float(row['cost_of_pharmacy_material_billed_to_patient']),
                        'doctor_share': float(row['performing_doctor_share_if_applicable']),
                        'outsource_cost': float(row['share_of_outsource_service_billed']),
                        'cost_center': row.get('sub_cost_centre_code', ''),
                        'allocated_costs': {}
                    }
            
            # Create cost drivers from secondary cost driver data
            if 'secondary_cost_driver' in tables and not tables['secondary_cost_driver'].empty:
                for _, row in tables['secondary_cost_driver'].iterrows():
                    center_code = row['sub_cost_centre_code']
                    cost_graph['cost_drivers'][center_code] = {
                        'patient_volume': int(row['no_of_patient_op_ip']),
                        'doctor_count': int(row['no_of_doctors']),
                        'nursing_staff': int(row['no_of_nursing_staff']),
                        'ot_hours': float(row['ot_time_hours']),
                        'area_sqm': float(row['area_in_sq_meter']),
                        'lab_tests': int(row['no_of_laboratory_test']),
                        'radiology_tests': int(row['no_of_radiology_test']),
                        'cardiac_tests': int(row['no_of_cardiac_test'])
                    }
            
            logger.info("Cost allocation graph created successfully")
            return cost_graph
            
        except Exception as e:
            logger.error(f"Error creating cost allocation graph: {e}")
            return {}
    
    def _apply_cost_allocation_logic(self, 
                                   tables: Dict[str, pd.DataFrame], 
                                   cost_graph: Dict[str, Any]) -> Dict[str, Dict[str, float]]:
        """Apply activity-based cost allocation logic"""
        try:
            allocated_costs = {}
            
            # Initialize service cost dictionaries
            for service_id in cost_graph['services']:
                allocated_costs[service_id] = {
                    'direct_pharmacy': 0,
                    'direct_materials': 0,
                    'direct_labor': 0,
                    'allocated_overhead': 0,
                    'allocated_utilities': 0,
                    'allocated_admin': 0,
                    'allocated_facilities': 0,
                    'total_allocated_cost': 0
                }
            
            # Allocate direct costs from variable cost data
            if 'variable_cost_bill_wise' in tables and not tables['variable_cost_bill_wise'].empty:
                self._allocate_direct_costs(tables['variable_cost_bill_wise'], allocated_costs)
            
            # Allocate indirect costs from expense wise data
            if 'expense_wise' in tables and not tables['expense_wise'].empty:
                self._allocate_indirect_costs(tables['expense_wise'], allocated_costs, cost_graph)
            
            # Allocate overhead costs from trial balance
            if 'trial_balance' in tables and not tables['trial_balance'].empty:
                self._allocate_overhead_costs(tables['trial_balance'], allocated_costs, cost_graph)
            
            # Allocate HR costs
            if 'hr_data' in tables and not tables['hr_data'].empty:
                self._allocate_hr_costs(tables['hr_data'], allocated_costs, cost_graph)
            
            # Calculate total allocated costs
            for service_id in allocated_costs:
                total_cost = sum(allocated_costs[service_id].values()) - allocated_costs[service_id]['total_allocated_cost']
                allocated_costs[service_id]['total_allocated_cost'] = total_cost
            
            logger.info("Cost allocation logic applied successfully")
            return allocated_costs
            
        except Exception as e:
            logger.error(f"Error in cost allocation logic: {e}")
            return {}
    
    def _allocate_direct_costs(self, 
                             variable_cost_df: pd.DataFrame, 
                             allocated_costs: Dict[str, Dict[str, float]]):
        """Allocate direct costs from variable cost data"""
        # Group by service/bill and allocate direct costs
        for _, row in variable_cost_df.iterrows():
            service_key = f"{row.get('service_name', 'Unknown')}_{row['bill_no']}"
            
            # Find matching service in allocated_costs or create generic key
            matching_service = None
            for service_id in allocated_costs:
                if row.get('service_name', '') in service_id:
                    matching_service = service_id
                    break
            
            if matching_service:
                allocated_costs[matching_service]['direct_pharmacy'] += float(row['pharmacy_charged_to_patient'])
                allocated_costs[matching_service]['direct_materials'] += (
                    float(row['medical_surgical_consumables_charged_to_patient']) +
                    float(row['implants_and_prosthetics_charged_to_patient']) +
                    float(row['non_medical_consumables_charged_to_patient'])
                )
    
    def _allocate_indirect_costs(self, 
                               expense_wise_df: pd.DataFrame, 
                               allocated_costs: Dict[str, Dict[str, float]],
                               cost_graph: Dict[str, Any]):
        """Allocate indirect costs based on cost drivers"""
        # Group expenses by cost center
        expense_by_center = expense_wise_df.groupby('sub_cost_centre')['amount'].sum()
        
        # Allocate based on cost drivers
        for cost_center, total_expense in expense_by_center.items():
            # Find services in this cost center
            relevant_services = [
                service_id for service_id, service_data in cost_graph['services'].items()
                if cost_center in service_data.get('cost_center', '')
            ]
            
            if relevant_services:
                # Allocate equally among services (can be enhanced with better drivers)
                cost_per_service = float(total_expense) / len(relevant_services)
                
                for service_id in relevant_services:
                    if service_id in allocated_costs:
                        allocated_costs[service_id]['allocated_overhead'] += cost_per_service
    
    def _allocate_overhead_costs(self, 
                               trial_balance_df: pd.DataFrame, 
                               allocated_costs: Dict[str, Dict[str, float]],
                               cost_graph: Dict[str, Any]):
        """Allocate overhead costs from trial balance"""
        # Group by cost type
        overhead_by_type = trial_balance_df.groupby('cost_type')['amount'].sum()
        
        total_revenue = sum(service['revenue'] for service in cost_graph['services'].values())
        
        if total_revenue > 0:
            for cost_type, total_cost in overhead_by_type.items():
                for service_id, service_data in cost_graph['services'].items():
                    if service_id in allocated_costs:
                        # Allocate based on revenue proportion
                        allocation_ratio = service_data['revenue'] / total_revenue
                        allocated_amount = float(total_cost) * allocation_ratio
                        
                        if cost_type == 'Utilities':
                            allocated_costs[service_id]['allocated_utilities'] += allocated_amount
                        elif cost_type == 'Administrative':
                            allocated_costs[service_id]['allocated_admin'] += allocated_amount
                        else:
                            allocated_costs[service_id]['allocated_facilities'] += allocated_amount
    
    def _allocate_hr_costs(self, 
                         hr_df: pd.DataFrame, 
                         allocated_costs: Dict[str, Dict[str, float]],
                         cost_graph: Dict[str, Any]):
        """Allocate HR costs based on department and utilization"""
        # Group HR costs by department
        hr_by_dept = hr_df.groupby('department')['gross_total'].sum()
        
        for department, total_hr_cost in hr_by_dept.items():
            # Find services in this department
            relevant_services = [
                service_id for service_id, service_data in cost_graph['services'].items()
                if department.lower() in service_data['department'].lower()
            ]
            
            if relevant_services:
                # Get utilization data for allocation
                dept_utilization = hr_df[hr_df['department'] == department]['utilization'].mean()
                
                # Allocate based on service revenue within department
                dept_services_revenue = sum(
                    cost_graph['services'][service_id]['revenue'] 
                    for service_id in relevant_services
                )
                
                if dept_services_revenue > 0:
                    for service_id in relevant_services:
                        if service_id in allocated_costs:
                            service_revenue = cost_graph['services'][service_id]['revenue']
                            allocation_ratio = service_revenue / dept_services_revenue
                            allocated_amount = float(total_hr_cost) * allocation_ratio * (dept_utilization / 100)
                            allocated_costs[service_id]['direct_labor'] += allocated_amount
    
    def _generate_final_dataframe(self, 
                                allocated_costs: Dict[str, Dict[str, float]], 
                                tables: Dict[str, pd.DataFrame]) -> pd.DataFrame:
        """Generate final DataFrame with service-wise cost breakdown"""
        try:
            final_data = []
            
            # Get service details from service register
            service_details = {}
            if 'service_register' in tables and not tables['service_register'].empty:
                service_summary = tables['service_register'].groupby(['service_department', 'service_name']).agg({
                    'net_amount': 'sum',
                    'quantity': 'sum',
                    'cost_of_pharmacy_material_billed_to_patient': 'sum',
                    'performing_doctor_share_if_applicable': 'sum',
                    'share_of_outsource_service_billed': 'sum'
                }).reset_index()
                
                for _, row in service_summary.iterrows():
                    service_key = f"{row['service_department']}_{row['service_name']}"
                    service_details[service_key] = {
                        'department': row['service_department'],
                        'service_name': row['service_name'],
                        'total_revenue': float(row['net_amount']),
                        'total_quantity': int(row['quantity']),
                        'direct_pharmacy_actual': float(row['cost_of_pharmacy_material_billed_to_patient']),
                        'doctor_share_actual': float(row['performing_doctor_share_if_applicable']),
                        'outsource_actual': float(row['share_of_outsource_service_billed'])
                    }
            
            # Generate final records
            for service_id, costs in allocated_costs.items():
                service_info = service_details.get(service_id, {})
                
                # Calculate metrics
                total_cost = costs['total_allocated_cost']
                revenue = service_info.get('total_revenue', 0)
                profit = revenue - total_cost
                profit_margin = (profit / revenue * 100) if revenue > 0 else 0
                quantity = service_info.get('total_quantity', 1)
                cost_per_unit = total_cost / quantity if quantity > 0 else 0
                
                final_record = {
                    'service_id': service_id,
                    'department': service_info.get('department', 'Unknown'),
                    'service_name': service_info.get('service_name', 'Unknown'),
                    'total_revenue': revenue,
                    'total_quantity': quantity,
                    'revenue_per_unit': revenue / quantity if quantity > 0 else 0,
                    
                    # Direct costs
                    'direct_pharmacy_cost': costs['direct_pharmacy'],
                    'direct_materials_cost': costs['direct_materials'],
                    'direct_labor_cost': costs['direct_labor'],
                    
                    # Allocated costs
                    'allocated_overhead_cost': costs['allocated_overhead'],
                    'allocated_utilities_cost': costs['allocated_utilities'],
                    'allocated_admin_cost': costs['allocated_admin'],
                    'allocated_facilities_cost': costs['allocated_facilities'],
                    
                    # Totals and metrics
                    'total_allocated_cost': total_cost,
                    'cost_per_unit': cost_per_unit,
                    'profit': profit,
                    'profit_margin_percent': profit_margin,
                    
                    # Cost breakdown percentages
                    'pharmacy_cost_percent': (costs['direct_pharmacy'] / total_cost * 100) if total_cost > 0 else 0,
                    'materials_cost_percent': (costs['direct_materials'] / total_cost * 100) if total_cost > 0 else 0,
                    'labor_cost_percent': (costs['direct_labor'] / total_cost * 100) if total_cost > 0 else 0,
                    'overhead_cost_percent': (costs['allocated_overhead'] / total_cost * 100) if total_cost > 0 else 0,
                    
                    # Performance indicators
                    'cost_efficiency_score': self._calculate_efficiency_score(costs, revenue),
                    'profitability_rank': 0,  # Will be calculated after sorting
                    'cost_optimization_potential': self._calculate_optimization_potential(costs, revenue)
                }
                
                final_data.append(final_record)
            
            # Create DataFrame
            final_df = pd.DataFrame(final_data)
            
            if not final_df.empty:
                # Calculate profitability ranks
                final_df['profitability_rank'] = final_df['profit_margin_percent'].rank(ascending=False, method='dense')
                
                # Sort by profit margin descending
                final_df = final_df.sort_values('profit_margin_percent', ascending=False)
                
                # Reset index
                final_df = final_df.reset_index(drop=True)
            
            logger.info(f"Generated final DataFrame with {len(final_df)} service records")
            return final_df
            
        except Exception as e:
            logger.error(f"Error generating final DataFrame: {e}")
            return pd.DataFrame()
    
    def _calculate_efficiency_score(self, costs: Dict[str, float], revenue: float) -> float:
        """Calculate cost efficiency score (0-100)"""
        if revenue <= 0:
            return 0
        
        total_cost = costs['total_allocated_cost']
        if total_cost <= 0:
            return 100
        
        # Efficiency score based on cost-to-revenue ratio
        cost_ratio = total_cost / revenue
        efficiency_score = max(0, min(100, (1 - cost_ratio) * 100))
        
        return round(efficiency_score, 2)
    
    def _calculate_optimization_potential(self, costs: Dict[str, float], revenue: float) -> str:
        """Calculate cost optimization potential"""
        if revenue <= 0:
            return 'No Data'
        
        total_cost = costs['total_allocated_cost']
        profit_margin = ((revenue - total_cost) / revenue * 100) if revenue > 0 else 0
        
        if profit_margin > 30:
            return 'Low'
        elif profit_margin > 15:
            return 'Medium'
        elif profit_margin > 5:
            return 'High'
        else:
            return 'Critical'
    
    async def get_cost_summary_metrics(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get summary metrics for cost analysis"""
        try:
            cost_df = await self.generate_service_wise_cost_analysis(filters)
            
            if cost_df.empty:
                return {}
            
            summary = {
                'total_services': len(cost_df),
                'total_revenue': float(cost_df['total_revenue'].sum()),
                'total_allocated_costs': float(cost_df['total_allocated_cost'].sum()),
                'overall_profit_margin': float(cost_df['profit_margin_percent'].mean()),
                'most_profitable_service': {
                    'name': cost_df.iloc[0]['service_name'] if len(cost_df) > 0 else '',
                    'margin': float(cost_df.iloc[0]['profit_margin_percent']) if len(cost_df) > 0 else 0
                },
                'least_profitable_service': {
                    'name': cost_df.iloc[-1]['service_name'] if len(cost_df) > 0 else '',
                    'margin': float(cost_df.iloc[-1]['profit_margin_percent']) if len(cost_df) > 0 else 0
                },
                'cost_breakdown': {
                    'pharmacy_percent': float(cost_df['pharmacy_cost_percent'].mean()),
                    'materials_percent': float(cost_df['materials_cost_percent'].mean()),
                    'labor_percent': float(cost_df['labor_cost_percent'].mean()),
                    'overhead_percent': float(cost_df['overhead_cost_percent'].mean())
                },
                'optimization_opportunities': {
                    'high_potential': len(cost_df[cost_df['cost_optimization_potential'] == 'High']),
                    'critical_services': len(cost_df[cost_df['cost_optimization_potential'] == 'Critical'])
                }
            }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error calculating cost summary metrics: {e}")
            return {}
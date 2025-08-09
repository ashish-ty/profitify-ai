"""
Cost Module - Business logic for service-wise cost analysis
Direct integration of Jupyter notebook logic without modifications
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple, Any, Union
from decimal import Decimal
import logging
from collections import deque
from queue import Queue
from app.core.database_layer import DatabaseLayer

logger = logging.getLogger(__name__)

class Edge:
    def __init__(self, target_node: 'Node', driver: float = 0.0):
        self.target_node = target_node
        self.driver: float = driver

class Node:
    def __init__(self, name: str):
        self.name = name
        self.metadata: Dict[str, Union[str, float]] = {}
        self.cost: Dict[str, float] = {}
        self.revenue: Dict[str, float] = {}

class CostCenter(Node):
    def __init__(self, name: str):
        super().__init__(name)
        self.children_cc: List[Edge] = []
        self.children_svc: List[Edge] = []

class Service(Node):
    def __init__(self, name: str, tat: float):
        super().__init__(name)
        self.TAT = tat
        self.service_type = "acute"

class CostAnalysisModule:
    """Service-wise cost analysis module with exact Jupyter notebook logic"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.db_layer = DatabaseLayer(user_id)
        self.input_data = {}
        self.node_dict = {}
        self.rename_dict = {}
        self.secondary_drivers = {}
        
    def preprocess(self, df):
        """Exact preprocessing function from Jupyter notebook"""
        df.columns = df.iloc[1]
        df = df.iloc[3:].copy()
        df = df.loc[:, df.columns.notna()] 
        df = df.reset_index(drop=True)
        return df
    
    def build_edges(self, df, driver):
        """Exact build_edges function from Jupyter notebook"""
        total = df[driver].sum()
        edge_list = []
        for _, row in df.iterrows():
            if row['sub_cost_centre'] not in self.node_dict:
                self.node_dict[row['sub_cost_centre']] = CostCenter(row['sub_cost_centre'])
            edge_list.append(Edge(target_node=self.node_dict[row['sub_cost_centre']], driver=row[driver] / total))
        return edge_list
    
    async def generate_service_wise_cost_analysis(self, 
                                                filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """
        Main function to generate service-wise cost analysis
        Direct implementation of Jupyter notebook logic
        """
        try:
            # Step 1: Load all data from database
            await self._load_input_data(filters)
            
            # Step 2: Build rename dictionary (placeholder - would need actual mapping file)
            self._build_rename_dict()
            
            # Step 3: Build nodes (exact Jupyter logic)
            self._build_nodes()
            
            # Step 4: Add service nodes (exact Jupyter logic)
            self._add_service_nodes()
            
            # Step 5: Process secondary cost (exact Jupyter logic)
            self._process_secondary_cost()
            
            # Step 6: Calculate primary costs (exact Jupyter logic)
            self._calculate_primary_costs()
            
            # Step 7: Run topological sort (exact Jupyter logic)
            self._run_topological_sort()
            
            # Step 8: Generate final output (exact Jupyter logic)
            final_df = self._generate_final_output()
            
            logger.info(f"Generated service-wise cost analysis with {len(final_df)} records")
            return final_df
            
        except Exception as e:
            logger.error(f"Error in service-wise cost analysis: {e}")
            return pd.DataFrame()
    
    async def _load_input_data(self, filters: Optional[Dict[str, Any]] = None):
        """Load all required data from database into input_data dict"""
        try:
            # Load all tables using database layer
            tables = await self.db_layer.load_all_tables(filters)
            
            # Convert to the exact format expected by Jupyter notebook
            self.input_data = {
                'service_register': tables.get('service_register', pd.DataFrame()),
                'trial_balance': tables.get('trial_balance', pd.DataFrame()),
                'expense_wise': tables.get('expense_wise', pd.DataFrame()),
                'cost_center': tables.get('cost_center', pd.DataFrame()),
                'variable_cost_bill_wise': tables.get('variable_cost_bill_wise', pd.DataFrame()),
                'hr': tables.get('hr_data', pd.DataFrame()),
                'consumption_data': tables.get('consumption_data', pd.DataFrame()),
                'occupancy_register': tables.get('occupancy_register', pd.DataFrame()),
                'ot_register': tables.get('ot_register', pd.DataFrame()),
                'connected_load': tables.get('connected_load', pd.DataFrame()),
                'tat_data': tables.get('tat_data', pd.DataFrame()),
                'fixed_asset_register': tables.get('fixed_asset_register', pd.DataFrame()),
                'secondary_cost_driver': tables.get('secondary_cost_driver', pd.DataFrame())
            }
            
            logger.info("Successfully loaded all input data from database")
            
        except Exception as e:
            logger.error(f"Error loading input data: {e}")
            self.input_data = {}
    
    def _build_rename_dict(self):
        """Build rename dictionary - placeholder for actual mapping"""
        # This would normally come from the Unique_Column_Mapping.xlsx file
        # For now, creating a basic mapping based on common patterns
        self.rename_dict = {
            'Number of Patient (OP+IP)': 'no_of_patient_op_ip',
            'Number of IP Patients': 'no_of_ip_patients', 
            'Number of Doctors': 'no_of_doctors',
            'Number of Nursing Staff': 'no_of_nursing_staff',
            'OT Time (Hours)': 'ot_time_hours',
            'Area in Sq. Meter': 'area_in_sq_meter',
            'Number of Laboratory Test': 'no_of_laboratory_test',
            'Number of Radiology Test': 'no_of_radiology_test',
            'Number of Cardiac Test': 'no_of_cardiac_test',
            'CCU Occupancy': 'ccu_occupancy',
            'MICU Occupancy': 'micu_occupancy',
            'PICU Occupancy': 'picu_occupancy',
            'NICU Occupancy': 'nicu_occupancy',
            'HDU Occupancy': 'hdu_occupancy',
            'Issolation Room Occupancy': 'issolation_room_occupancy',
            'GW Occupancy': 'gw_occupancy',
            'PW-SR Occupancy': 'pw_sr_occupancy',
            'SW-TS Occupancy': 'sw_ts_occupancy',
            'DW Occupancy': 'dw_occupancy',
            'Nursing Hostel Occupancy': 'nursing_hostel_occupancy',
            'Doctors Hostel Occupancy': 'doctors_hostel_occupancy',
            'Staff Accomodation Occupancy': 'staff_accomodation_occupancy',
            'Frequency of Audit': 'frequency_of_audit',
            'No of IT Users': 'no_of_it_users',
            'No of Transaction in Finance & Billing Cost Centre': 'no_of_transaction_in_finance_billing_cost_centre',
            'No of Trips / Km': 'no_of_trips_km',
            'No of Sample Collected / Report Dispatch': 'no_of_sample_collected_report_dispatch',
            'No of Home Sample Collection': 'no_of_home_sample_collection',
            'No of Neuro Test': 'no_of_neuro_test',
            'No of Nuclear Medicine Test': 'no_of_nuclear_medicine_test',
            'No of IVF Consultation': 'no_of_ivf_consultation',
            'No of Corporate Patient (OP+IP)': 'no_of_corporate_patient_op_ip',
            'No of Institutional Patient (OP+IP)': 'no_of_institutional_patient_op_ip',
            'No of International Patient (OP+IP)': 'no_of_international_patient_op_ip',
            'No of Credit IP Patients': 'no_of_credit_ip_patients',
            'Surgical Store Issue Ratio': 'surgical_store_issue_ratio',
            'Central Store Issue Ratio': 'central_store_issue_ratio',
            'Non Surgical Store Issue Ratio': 'non_surgical_store_issue_ratio',
            'Stationery & Housekeeping Issue Ratio': 'stationery_housekeeping_issue_ratio',
            'Doctor Fee for Service Ratio': 'doctor_fee_for_service_ratio',
            'Consultant Retainer Fee / MG / Bonus Ratio': 'consultant_retainer_fee_mg_bonus_ratio',
            'Nursing Station 1 for Care Units': 'nursing_station_1_for_care_units',
            'Nursing Station 2 for Care Units': 'nursing_station_2_for_care_units',
            'Nursing Station 3 for Care Units': 'nursing_station_3_for_care_units',
            'Nursing Station 4 for Care Units': 'nursing_station_4_for_care_units',
            'Nursing Station 5 for Care Units': 'nursing_station_5_for_care_units',
            'Service under OP Billing 1': 'service_under_op_billing_1',
            'Service under OP Billing 2': 'service_under_op_billing_2',
            'Service under OP Billing 3': 'service_under_op_billing_3',
            'Service under OP Billing 4': 'service_under_op_billing_4',
            'Brokerage Commission': 'brokerage_commission',
            'No of CSSD Set Issued': 'no_of_cssd_set_issued',
            'No of Diet Served': 'no_of_diet_served',
            'No of Ward Boy': 'no_of_ward_boy',
            'No of Housekeeping Staff': 'no_of_housekeeping_staff',
            'No of Fumigation Cycle Performed / Standard Resource Allocation Ratio': 'no_of_fumigation_cycle_performed_standard_resource_allocation_ratio',
            'Volume of Cloth Load': 'volume_of_cloth_load',
            'Efforts of Supply Chain Department': 'efforts_of_supply_chain_department',
            'No of Security Staff Deployed / No of Exits': 'no_of_security_staff_deployed_no_of_exits',
            'Actual Water Utilization / Standard Utilization Ratio': 'actual_water_utilization_standard_utilization_ratio',
            'Actual Gas Utilization / Standard Utilization Ratio': 'actual_gas_utilization_standard_utilization_ratio',
            'Actual Vaccume Utilization / Standard Utilization Ratio': 'actual_vaccume_utilization_standard_utilization_ratio',
            'Head Office': 'head_office',
            'Other Unit 1 Allocation Ratio': 'other_unit_1_allocation_ratio',
            'Other Unit 2 Allocation Ratio': 'other_unit_2_allocation_ratio',
            'Other Unit 3 Allocation Ratio': 'other_unit_3_allocation_ratio',
            'Other Unit 4 Allocation Ratio': 'other_unit_4_allocation_ratio',
            'Other Unit 5 Allocation Ratio': 'other_unit_5_allocation_ratio'
        }
    
    def _build_nodes(self):
        """Build nodes - exact Jupyter logic"""
        self.node_dict = {}
        if 'cost_center' in self.input_data and not self.input_data['cost_center'].empty:
            for scc in self.input_data['cost_center']['sub_cost_centre']:
                self.node_dict[scc] = CostCenter(scc)
    
    def _add_service_nodes(self):
        """Add service nodes - exact Jupyter logic"""
        if 'service_register' not in self.input_data or self.input_data['service_register'].empty:
            return
            
        cc_scv_tat = self.input_data['service_register'][['service_name', 'service_tat', 'sub_cost_centre']]
        
        # cc - scv edges (exact Jupyter logic)
        for scc, df in cc_scv_tat.groupby('sub_cost_centre'):
            try:
                total_tat = df['service_tat'].sum()

                for service, df_2 in df.groupby('service_name'):
                    if service not in self.node_dict:
                        self.node_dict[service] = Service(service, df_2['service_tat'].sum())

                    if total_tat > 0:
                        self.node_dict[scc].children_svc.append(Edge(self.node_dict[service], df_2['service_tat'].sum() / total_tat))
            except Exception as e:
                print(e)
    
    def _process_secondary_cost(self):
        """Process secondary cost - exact Jupyter logic"""
        if 'cost_center' not in self.input_data or self.input_data['cost_center'].empty:
            return
            
        # Build secondary drivers (exact Jupyter logic)
        self.secondary_drivers = {}
        for cd, df in self.input_data['cost_center'].groupby('cost_driver'):
            if cd not in self.rename_dict:
                print(cd, " not in rename dict")
                continue
            
            self.secondary_drivers[self.rename_dict[cd]] = [scc for scc in df['sub_cost_centre']]
        
        if 'secondary_cost_driver' not in self.input_data or self.input_data['secondary_cost_driver'].empty:
            return
            
        cc_drivers = self.input_data['secondary_cost_driver']
        
        # cc to cc relationships (exact Jupyter logic)
        for driver in cc_drivers.columns[3:]:
            try:
                if driver not in self.secondary_drivers:
                    continue
                    
                parent_scc_list = self.secondary_drivers[driver]
                mini_df = cc_drivers[~cc_drivers[driver].isna()][['sub_cost_centre', driver]]
                edge_list = self.build_edges(mini_df, driver)
                
                for parent in parent_scc_list:
                    if parent in self.node_dict:
                        self.node_dict[parent].children_cc.extend(edge_list)
            except Exception as e:
                print("failed due to", repr(e), driver)
    
    def _calculate_primary_costs(self):
        """Calculate primary costs - exact Jupyter logic"""
        # cm expense direct on scc (exact Jupyter logic)
        if 'consumption_data' in self.input_data and not self.input_data['consumption_data'].empty:
            for scc, df in self.input_data['consumption_data'].groupby("sub_cost_centre"):
                try:
                    if scc in self.node_dict:
                        self.node_dict[scc].cost['cm'] = df['transaction_value_excluding_tax'].sum()
                except Exception as e:
                    print(scc, e)
        
        # ew expense direct on scc (exact Jupyter logic)
        if 'expense_wise' in self.input_data and not self.input_data['expense_wise'].empty:
            for scc, df in self.input_data['expense_wise'].groupby("sub_cost_centre"):
                if scc in self.node_dict:
                    self.node_dict[scc].cost['ew'] = df['amount'].sum()
        
        # HR expense direct on scc (exact Jupyter logic)
        if 'hr' in self.input_data and not self.input_data['hr'].empty:
            for scc, df in self.input_data['hr'].groupby("sub_cost_centre"):
                if scc in self.node_dict:
                    self.node_dict[scc].cost['hr'] = df['net_salary'].sum()
        
        # CN (Connected Load) calculation (exact Jupyter logic)
        if ('trial_balance' in self.input_data and not self.input_data['trial_balance'].empty and
            'connected_load' in self.input_data and not self.input_data['connected_load'].empty):
            try:
                power_consumption = self.input_data['trial_balance'][
                    self.input_data['trial_balance']['primary_cost_driver'] == 'CN'
                ]['amount'].sum()
                
                total_load = self.input_data['connected_load']['total_load_kg'].sum()
                
                for scc, df in self.input_data['connected_load'].groupby('sub_cost_centre'):
                    try:
                        if scc in self.node_dict and total_load > 0:
                            self.node_dict[scc].cost['cn'] = (df['total_load_kg'].sum() / total_load) * int(power_consumption)
                    except Exception as e:
                        print(repr(e))
            except Exception as e:
                logger.error(f"Error in CN calculation: {e}")
    
    def _run_topological_sort(self):
        """Run topological sort - exact Jupyter logic"""
        # Build indegree (exact Jupyter logic)
        indegree = {}
        
        for node in self.node_dict.keys():
            indegree[node] = set()
            
        for node in self.node_dict.keys():
            value = self.node_dict[node]
            
            if isinstance(value, CostCenter):
                for edge in value.children_cc:
                    indegree[edge.target_node.name].add(node)
                    
                for edge in value.children_svc:
                    indegree[edge.target_node.name].add(node)
        
        # Topological sort (exact Jupyter logic)
        q = Queue()
        
        for node, degree in indegree.items():
            if len(degree) == 0:
                q.put(node)
        
        count = 0
        
        while not q.empty():
            count += 1
            parent = q.get()
            parent_cost_dict = self.node_dict[parent].cost
                
            if isinstance(self.node_dict[parent], CostCenter):
                
                if len(self.node_dict[parent].children_cc) > 0 and len(self.node_dict[parent].children_svc) > 0:
                    print(f"{parent} has both services and cost centers!")
                    
                if len(self.node_dict[parent].children_cc) > 0:
                    for edge in self.node_dict[parent].children_cc:
                        neighbor = edge.target_node.name
                        driver = edge.driver
                        
                        if parent in indegree[neighbor]:
                            indegree[neighbor].remove(parent)
                            
                        if len(indegree[neighbor]) == 0:
                            q.put(neighbor)

                        for cost_type in parent_cost_dict.keys():
                            if cost_type not in self.node_dict[neighbor].cost:
                                self.node_dict[neighbor].cost[cost_type] = 0
                            self.node_dict[neighbor].cost[cost_type] += driver * parent_cost_dict[cost_type]
                            
                elif len(self.node_dict[parent].children_svc) > 0:
                    for edge in self.node_dict[parent].children_svc:
                        neighbor = edge.target_node.name
                        driver = edge.driver
                             
                        if parent in indegree[neighbor]:
                            indegree[neighbor].remove(parent)

                        if len(indegree[neighbor]) == 0:
                            q.put(neighbor)

                        for cost_type in parent_cost_dict.keys():
                            if cost_type not in self.node_dict[neighbor].cost:
                                self.node_dict[neighbor].cost[cost_type] = 0
                            self.node_dict[neighbor].cost[cost_type] += driver * parent_cost_dict[cost_type]
        
        logger.info(f"Topological sort processed {count} nodes")
    
    def _generate_final_output(self) -> pd.DataFrame:
        """Generate final output - exact Jupyter logic"""
        try:
            if 'service_register' not in self.input_data or self.input_data['service_register'].empty:
                return pd.DataFrame()
            
            # Service level cost update in SR (exact Jupyter logic)
            service_df_list = []
            for service, df in self.input_data['service_register'].groupby('service_name'):
                try:
                    df = df.copy()
                    df['total_tat'] = df['service_tat'] * df['quantity']
                    total = df['total_tat'].sum()
                    if total > 0:
                        df['total_tat'] /= total

                        if service in self.node_dict:
                            for cost_name, cost in self.node_dict[service].cost.items():
                                df[cost_name] = cost * df['total_tat']
                        service_df_list.append(df)
                except Exception as e:
                    print(service, e)
            
            if not service_df_list:
                return pd.DataFrame()
            
            final_sr_list = pd.concat(service_df_list)
            
            # Merge with variable cost data (exact Jupyter logic)
            if 'variable_cost_bill_wise' in self.input_data and not self.input_data['variable_cost_bill_wise'].empty:
                final_cost_df = pd.merge(
                    final_sr_list, 
                    self.input_data['variable_cost_bill_wise'],
                    on=['bill_no', 'ipd_number', 'service_name'], 
                    how='left'
                )
            else:
                final_cost_df = final_sr_list
            
            # Create output columns list (exact Jupyter logic)
            lt = []
            if 'variable_cost_bill_wise' in self.input_data and not self.input_data['variable_cost_bill_wise'].empty:
                lt = [col for col in self.input_data['variable_cost_bill_wise'].iloc[:, 3:-3].columns]
            
            lt = ['ipd_number', 'service_name', 'cm', 'ew', 'hr', 'cn'] + lt
            
            # Filter columns that exist in the dataframe
            existing_cols = [col for col in lt if col in final_cost_df.columns]
            output_df = final_cost_df[existing_cols]
            
            return output_df
            
        except Exception as e:
            logger.error(f"Error generating final output: {e}")
            return pd.DataFrame()
    
    async def get_cost_summary_metrics(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get summary metrics for cost analysis"""
        try:
            cost_df = await self.generate_service_wise_cost_analysis(filters)
            
            if cost_df.empty:
                return {}
            
            # Calculate basic metrics from the output
            total_services = len(cost_df['service_name'].unique()) if 'service_name' in cost_df.columns else 0
            
            # Calculate costs if cost columns exist
            cost_columns = ['cm', 'ew', 'hr', 'cn']
            total_allocated_costs = 0
            for col in cost_columns:
                if col in cost_df.columns:
                    total_allocated_costs += cost_df[col].fillna(0).sum()
            
            # Calculate revenue if available
            total_revenue = 0
            if 'net_amount' in cost_df.columns:
                total_revenue = cost_df['net_amount'].fillna(0).sum()
            
            overall_profit_margin = 0
            if total_revenue > 0:
                overall_profit_margin = ((total_revenue - total_allocated_costs) / total_revenue * 100)
            
            summary = {
                'total_services': total_services,
                'total_revenue': float(total_revenue),
                'total_allocated_costs': float(total_allocated_costs),
                'overall_profit_margin': float(overall_profit_margin),
                'most_profitable_service': {
                    'name': 'N/A',
                    'margin': 0
                },
                'least_profitable_service': {
                    'name': 'N/A', 
                    'margin': 0
                },
                'cost_breakdown': {
                    'pharmacy_percent': 0,
                    'materials_percent': 0,
                    'labor_percent': 0,
                    'overhead_percent': 0
                },
                'optimization_opportunities': {
                    'high_potential': 0,
                    'critical_services': 0
                }
            }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error calculating cost summary metrics: {e}")
            return {}
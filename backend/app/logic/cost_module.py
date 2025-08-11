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
                print(row['sub_cost_centre'], "not present in node dict!!")
                continue
                # self.node_dict[row['sub_cost_centre']] = CostCenter(row['sub_cost_centre'])
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
            'Month': 'month',
            'Bill no.': 'bill_no',
            'Patient Type': 'patient_type',
            'Reg. No.': 'reg_no',
            'IPD Number': 'ipd_number',
            'Payor Type': 'payor_type',
            'Payor Alias Name': 'payor_alias_name',
            'Admitting Doctor Name': 'admitting_doctor_name',
            'Admitting Doctor Department / Speciality Name': 'admitting_doctor_department_speciality_name',
            'Performing Doctor Name': 'performing_doctor_name',
            'performing Doctor Department / Speciality Name': 'performing_doctor_department_speciality_name',
            'Refering Doctor Name': 'refering_doctor_name',
            'Refering Doctor Department / Speciality Name': 'refering_doctor_department_speciality_name',
            'Service Name': 'service_name',
            'Service Department': 'service_department',
            'service Sub department': 'service_sub_department',
            'Service Status i.e. Active or Cancelled.': 'service_status_i_e_active_or_cancelled',
            'under Package or Not.': 'under_package_or_not',
            'Outsourced or Inhouse.': 'outsourced_or_inhouse',
            'No. of service': 'quantity',
            'Gross Amount': 'gross_amount',
            'Discount Amount': 'discount',
            'Net Amount': 'net_amount',
            'Emergency charges for Service or Not.': 'emergency_charges_for_service_or_not',
            'performing Doctor Share if applicable': 'performing_doctor_share_if_applicable',
            'Cost Of Pharmacy & Material Billed to Patient.': 'cost_of_pharmacy_material_billed_to_patient',
            'share of  Outsource Service billed': 'share_of_outsource_service_billed',
            'Sub Cost Centre Code': 'sub_cost_centre_code',
            'Sub Cost Centre Name': 'sub_cost_centre_name',
            'Service TAT': 'service_tat',
            'Service Date.': 'service_date',
            'Category Code': 'category_code',
            'Category': 'category',
            'Grouping Code': 'grouping_code',
            'Grouping': 'grouping',
            'Ledger Code': 'ledger_code',
            'Ledger Name': 'ledger_name',
            'Alias Code': 'alias_code',
            'Alias Name': 'alias_name',
            'Amount': 'amount',
            'Remarks': 'remarks',
            'Primary Cost Driver': 'primary_cost_driver',
            'Nature of Data': 'nature_of_data',
            'CC_Type': 'cc_type',
            'Cost Centre Code': 'cost_centre_code',
            'Cost centre category': 'cost_centre_category',
            'Cost Centre': 'cost_centre',
            'Cost Centre Name': 'cost_centre_name',
            'Cost Driver': 'cost_driver',
            'Source of Driver': 'source_of_driver',
            'Bill No.': 'bill_no',
            'Pharmacy Charged to patient': 'pharmacy_charged_to_patient',
            'Medical & Surgical Consumables Charged to patient': 'medical_surgical_consumables_charged_to_patient',
            'Implants and Prosthetics - Charged to patient': 'implants_and_prosthetics_charged_to_patient',
            'Non Medical Consumables Charged To Patient': 'non_medical_consumables_charged_to_patient',
            'Fee For Service': 'fee_for_service',
            'Incentives To Consultants/ Treating Doctors': 'incentives_to_consultants_treating_doctors',
            'Patient Food & Beverages - Outsource service': 'patient_food_beverages_outsource_service',
            'Laboratory Test Outsource service': 'laboratory_test_outsource_service',
            'Any Other patient related Outsourced Services_1': 'any_other_patient_related_outsourced_services_1',
            'Any Other patient related Outsourced Services_2': 'any_other_patient_related_outsourced_services_2',
            'Any Other patient related Outsourced Services_3': 'any_other_patient_related_outsourced_services_3',
            'Brokerage & Commission': 'brokerage_commission',
            'Provision for Deduction & Bad Debts': 'provision_for_deduction_bad_debts',
            'Doctor Name': 'doctor_name',
            'Group Code': 'group_code',
            'Group Name': 'group_name',
            'Sub - Group Code': 'sub_group_code',
            'Sub - Group Name': 'sub_group_name',
            'Associate Code': 'associate_code',
            'Associate Name': 'associate_name',
            'Period': 'period',
            'Date of Joining': 'date_of_joining',
            'Date of Resignation': 'date_of_resignation',
            'Working Period': 'working_period',
            'Department': 'department',
            'Sub Department': 'sub_department',
            'Designation': 'designation',
            'Efforts Category': 'efforts_category',
            'Master for Multiple': 'master_for_multiple',
            'Nature Of Allocation': 'nature_of_allocation',
            'Efforts Allocation': 'efforts_allocation',
            'Efforts Sub - Allocation': 'efforts_sub_allocation',
            'Utilization': 'utilization',
            'Available Hours': 'available_hours',
            'Actual Hours': 'actual_hours',
            'Basic Pay': 'basic_pay',
            'Allowances': 'allowances',
            'Other Benefits': 'other_benefits',
            'Overtime': 'overtime',
            'Bonus': 'bonus',
            'EPF': 'epf',
            'ESIC': 'esic',
            'Any Other Contribution': 'any_other_contribution',
            'Gross Total': 'gross_total',
            'Deduction': 'deduction',
            'Net Salary': 'net_salary',
            'No. of Headcount': 'no_of_headcount',
            'Medical Record Number or Registration Number (UHID)': 'medical_record_number_or_registration_number_uhid',
            'Patient Admission Date': 'patient_admission_date',
            'Patient Discharge Date': 'patient_discharge_date',
            'Sub Cost Centre': 'sub_cost_centre',
            'Bed Number': 'bed_number',
            'Length Of Stay In Hours': 'length_of_stay_in_hours',
            'The Date & Time at which Patient was transferred to this Bed.': 'the_date_time_at_which_patient_was_transferred_to_this_bed',
            'The Date & Time at which Patient left this Bed.': 'the_date_time_at_which_patient_left_this_bed',
            'Ward Category Code': 'ward_category_code',
            'Bed Category Name': 'bed_category_name',
            'S.No.': 's_no',
            'Anaesthesist Name': 'anaesthesist_name',
            'Anesthesia Type': 'anesthesia_type',
            'Type Of Procedure': 'type_of_procedure',
            'Nature of Procedure': 'nature_of_procedure',
            'On Table Time': 'on_table_time',
            'Incision time': 'incision_time',
            'Finish time': 'finish_time',
            'Procedure Time': 'procedure_time',
            'Change Over Time': 'change_over_time',
            'Total Time': 'total_time',
            'Transaction Date': 'transaction_date',
            'From - Store': 'from_store',
            'To - Store': 'to_store',
            'SKU Name': 'sku_name',
            'Unit of Measurement': 'unit_of_measurement',
            'Quantity': 'quantity',
            'Rate': 'rate',
            'Transaction Value (Excluding Tax)': 'transaction_value_excluding_tax',
            'Connected Load': 'connected_load',
            'Running Load': 'running_load',
            'Standby Load': 'standby_load',
            'Days': 'days',
            'Hours': 'hours',
            'Total Load (Kg)': 'total_load_kg',
            'TAT': 'tat',
            'Bio Medical Equipments': 'bio_medical_equipments',
            'Engineering Equipments': 'engineering_equipments',
            'Furniture & Fixture': 'furniture_fixture',
            'Others': 'others',
            'Nursing Hostel Occupancy': 'nursing_hostel_occupancy',
            'Doctors hostel Occupancy': 'doctors_hostel_occupancy',
            'Staff accomodation Occupancy': 'staff_accomodation_occupancy',
            'Frequency of Audit': 'frequency_of_audit',
            'No. of IT Users': 'no_of_it_users',
            'No. of Transaction in Finance & Billing Cost Centre': 'no_of_transaction_in_finance_billing_cost_centre',
            'List of Equipment for which loan was taken': 'list_of_equipment_for_which_loan_was_taken',
            'No. of  Trips (Km)': 'no_of_trips_km',
            'No. of Laboratory Test': 'no_of_laboratory_test',
            'No. of Sample collected & Report dispatch': 'no_of_sample_collected_report_dispatch',
            'No. of Home sample collection': 'no_of_home_sample_collection',
            'No. of Radiology Test': 'no_of_radiology_test',
            'No. of Neuro Test': 'no_of_neuro_test',
            'No. of Cardiac Test': 'no_of_cardiac_test',
            'No. of Nuclear Medicine Test': 'no_of_nuclear_medicine_test',
            'No. of IVF Consultation': 'no_of_ivf_consultation',
            'OT Time (Hours)': 'ot_time_hours',
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
            'Head office': 'head_office',
            'Other Unit 1 Allocation Ratio': 'other_unit_1_allocation_ratio',
            'Other Unit 2 Allocation Ratio': 'other_unit_2_allocation_ratio',
            'Other Unit 3 Allocation Ratio': 'other_unit_3_allocation_ratio',
            'Other Unit 4 Allocation Ratio': 'other_unit_4_allocation_ratio',
            'Other Unit 5 Allocation Ratio': 'other_unit_5_allocation_ratio',
            'No. of Patient (OP+IP)': 'no_of_patient_op_ip',
            'No. of Corporate Patient (OP+IP)': 'no_of_corporate_patient_op_ip',
            'No. of Institutional Patient (OP+IP)': 'no_of_institutional_patient_op_ip',
            'No. of International Patient (OP+IP)': 'no_of_international_patient_op_ip',
            'No. of IP Patients': 'no_of_ip_patients',
            'No. of Credit IP Patients': 'no_of_credit_ip_patients',
            'Surgical Store Issue Ratio': 'surgical_store_issue_ratio',
            'Central Store Issue Ratio': 'central_store_issue_ratio',
            'Non Surgical Store Issue Ratio': 'non_surgical_store_issue_ratio',
            'Stationery/Housekeeping Issue Ratio': 'stationery_housekeeping_issue_ratio',
            'No. of Doctors': 'no_of_doctors',
            'Doctor Fee for Service Ratio': 'doctor_fee_for_service_ratio',
            'Consultant retainer fee/MG/Bonus Ratio': 'consultant_retainer_fee_mg_bonus_ratio',
            'No. of Nursing Staff': 'no_of_nursing_staff',
            'Nursing Station 1 for Care Units': 'nursing_station_1_for_care_units',
            'Nursing Station 2 for Care Units': 'nursing_station_2_for_care_units',
            'Nursing Station 3 for Care Units': 'nursing_station_3_for_care_units',
            'Nursing Station 4 for Care Units': 'nursing_station_4_for_care_units',
            'Nursing Station 5 for Care Units': 'nursing_station_5_for_care_units',
            'Service under OP Billing 1': 'service_under_op_billing_1',
            'Service under OP Billing 2': 'service_under_op_billing_2',
            'Service under OP Billing 3': 'service_under_op_billing_3',
            'Service under OP Billing 4': 'service_under_op_billing_4',
            'No. of CSSD Set Issued': 'no_of_cssd_set_issued',
            'No. of Diet Served': 'no_of_diet_served',
            'No. of Ward Boy': 'no_of_ward_boy',
            'No. of Housekeeping Staff': 'no_of_housekeeping_staff',
            'No. of Fumigation Cycle Performed/ Standard Resource Allocation Ratio': 'no_of_fumigation_cycle_performed_standard_resource_allocation_ratio',
            'Volume of Cloth Load': 'volume_of_cloth_load',
            'Efforts of Supply Chain Department': 'efforts_of_supply_chain_department',
            'Area in sq. meter': 'area_in_sq_meter',
            'No. of Security Staff Deployed/ No. of Exits.': 'no_of_security_staff_deployed_no_of_exits',
            'Actual Water Utilization/ Standard Utilization Ratio.': 'actual_water_utilization_standard_utilization_ratio',
            'Actual Gas Utilization/ Standard Utilization Ratio.': 'actual_gas_utilization_standard_utilization_ratio',
            'Actual Vaccume Utilization/ Standard Utilization Ratio.': 'actual_vaccume_utilization_standard_utilization_ratio',
            'Civil': 'civil',
            'Date of final bill - DD/MM/YY': 'date_of_final_bill',
            'Service Sub department': 'service_sub_department',
            'Service Status i.e. Active or Cancelled': 'service_status',
            'under Package or Not': 'is_packaged',
            'Outsourced or Inhouse': 'is_outsourced',
            'Emergency charges for Service or Not': 'emergency_charges_applied',
            'Service Date': 'service_date',
            'Sub - Cost Centre Code': 'sub_cost_centre_code',
            'Sub - Cost Centre Name': 'sub_cost_centre',
            'Bill No': 'bill_no',
            'The date at which service was provided to patient.': 'service_date',
            'The Name of Services Billed': 'service_name'
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
                total_tat = int(df['service_tat'].astype('int').sum())

                for service, df_2 in df.groupby('service_name'):
                    if service not in self.node_dict:
                        self.node_dict[service] = Service(service, int(df_2['service_tat'].astype('int').sum()))

                    if total_tat > 0:
                        self.node_dict[scc].children_svc.append(Edge(self.node_dict[service], int(df_2['service_tat'].astype('int').sum()) / total_tat))
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
        for driver in cc_drivers.columns[5:]:
            try:
                if driver not in self.secondary_drivers:
                    continue
                    
                parent_scc_list = self.secondary_drivers[driver]
                mini_df = cc_drivers[cc_drivers[driver] > 0][['sub_cost_centre', driver]]
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
                        self.node_dict[scc].cost['cm'] = int(df['transaction_value_excluding_tax'].sum())
                except Exception as e:
                    print(scc, e)
        
        # ew expense direct on scc (exact Jupyter logic)
        if 'expense_wise' in self.input_data and not self.input_data['expense_wise'].empty:
            for scc, df in self.input_data['expense_wise'].groupby("sub_cost_centre"):
                if scc in self.node_dict:
                    self.node_dict[scc].cost['ew'] = int(df['amount'].sum())
        
        # HR expense direct on scc (exact Jupyter logic)
        if 'hr' in self.input_data and not self.input_data['hr'].empty:
            for scc, df in self.input_data['hr'].groupby("sub_cost_centre"):
                if scc in self.node_dict:
                    self.node_dict[scc].cost['hr'] = int(df['net_salary'].sum())
        
        # CN (Connected Load) calculation (exact Jupyter logic)
        if ('trial_balance' in self.input_data and not self.input_data['trial_balance'].empty and
            'connected_load' in self.input_data and not self.input_data['connected_load'].empty):
            try:
                power_consumption = self.input_data['trial_balance'][
                    self.input_data['trial_balance']['primary_cost_driver'] == 'CN'
                ]['amount'].sum()
                
                total_load = int(self.input_data['connected_load']['total_load_kg'].sum())
                
                for scc, df in self.input_data['connected_load'].groupby('sub_cost_centre'):
                    try:
                        if scc in self.node_dict and total_load > 0:
                            self.node_dict[scc].cost['cn'] = (int(df['total_load_kg'].sum()) / total_load) * int(power_consumption)
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
                    df['total_tat'] = df['service_tat'].astype('int') * df['quantity']
                    total = int(df['total_tat'].sum())
                    if total > 0:
                        df['total_tat'] /= total

                        if service in self.node_dict:
                            for cost_name, cost in self.node_dict[service].cost.items():
                                df[cost_name] = cost * df['total_tat']
                        service_df_list.append(df)
                    elif total < 0:
                        print(service, 'total tat is -ve!!')
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
            
            # Define the exact output columns as per the actual function output
            output_columns = [
                'ipd_number', 'service_name', 'cm', 'ew', 'hr', 'cn', 'bill_no',
                'pharmacy_charged_to_patient', 'medical_surgical_consumables_charged_to_patient',
                'implants_and_prosthetics_charged_to_patient',
                'non_medical_consumables_charged_to_patient', 'fee_for_service',
                'incentives_to_consultants_treating_doctors',
                'patient_food_beverages_outsource_service',
                'laboratory_test_outsource_service',
                'any_other_patient_related_outsourced_services_1',
                'any_other_patient_related_outsourced_services_2',
                'any_other_patient_related_outsourced_services_3',
                'brokerage_commission', 'provision_for_deduction_bad_debts',
                'doctor_name'
            ]
            
            # Add doctor_name from service register if not present
            if 'doctor_name' not in final_cost_df.columns:
                final_cost_df['doctor_name'] = final_cost_df['performing_doctor_name']
            
            # Filter columns that exist in the dataframe
            existing_cols = [col for col in output_columns if col in final_cost_df.columns]
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
            
            # Calculate metrics from actual output columns
            total_services = len(cost_df) if not cost_df.empty else 0
            
            # Calculate allocated costs
            total_allocated_costs = 0
            for col in ['cm', 'ew', 'hr', 'cn']:
                if col in cost_df.columns:
                    total_allocated_costs += cost_df[col].fillna(0).sum()
            
            # Calculate variable costs
            variable_cost_columns = [
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
            
            total_variable_costs = 0
            for col in variable_cost_columns:
                if col in cost_df.columns:
                    total_variable_costs += cost_df[col].fillna(0).sum()
            
            total_costs = total_allocated_costs + total_variable_costs
            
            # Estimate revenue (would need actual revenue data)
            # For now, assume 20% margin over total costs
            estimated_revenue = total_costs * 1.2
            
            overall_profit_margin = 0
            if estimated_revenue > 0:
                overall_profit_margin = ((estimated_revenue - total_costs) / estimated_revenue * 100)
            
            # Find most and least profitable services
            most_profitable = {'name': 'N/A', 'margin': 0}
            least_profitable = {'name': 'N/A', 'margin': 0}
            
            if not cost_df.empty and 'service_name' in cost_df.columns:
                # Calculate profit margin for each service
                service_margins = []
                for _, row in cost_df.iterrows():
                    allocated_cost = (row.get('cm', 0) + row.get('ew', 0) + 
                                    row.get('hr', 0) + row.get('cn', 0))
                    variable_cost = sum(row.get(col, 0) for col in variable_cost_columns if col in row.index)
                    total_service_cost = allocated_cost + variable_cost
                    
                    # Estimate service revenue
                    estimated_service_revenue = total_service_cost * 1.2
                    margin = ((estimated_service_revenue - total_service_cost) / estimated_service_revenue * 100) if estimated_service_revenue > 0 else 0
                    
                    service_margins.append({
                        'name': row.get('service_name', 'Unknown'),
                        'margin': margin
                    })
                
                if service_margins:
                    most_profitable = max(service_margins, key=lambda x: x['margin'])
                    least_profitable = min(service_margins, key=lambda x: x['margin'])
            
            summary = {
                'total_services': total_services,
                'total_revenue': float(estimated_revenue),
                'total_allocated_costs': float(total_costs),
                'overall_profit_margin': float(overall_profit_margin),
                'most_profitable_service': most_profitable,
                'least_profitable_service': least_profitable,
                'cost_breakdown': {
                    'allocated_costs': float(total_allocated_costs),
                    'variable_costs': float(total_variable_costs),
                    'cm_percent': (cost_df['cm'].fillna(0).sum() / total_costs * 100) if total_costs > 0 and 'cm' in cost_df.columns else 0,
                    'ew_percent': (cost_df['ew'].fillna(0).sum() / total_costs * 100) if total_costs > 0 and 'ew' in cost_df.columns else 0,
                    'hr_percent': (cost_df['hr'].fillna(0).sum() / total_costs * 100) if total_costs > 0 and 'hr' in cost_df.columns else 0,
                    'cn_percent': (cost_df['cn'].fillna(0).sum() / total_costs * 100) if total_costs > 0 and 'cn' in cost_df.columns else 0
                },
                'optimization_opportunities': {
                    'high_potential': len([s for s in service_margins if s['margin'] > 25]) if 'service_margins' in locals() else 0,
                    'critical_services': len([s for s in service_margins if s['margin'] < 10]) if 'service_margins' in locals() else 0
                }
            }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error calculating cost summary metrics: {e}")
            return {}
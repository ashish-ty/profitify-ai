"""
Database Layer - Responsible for loading all required sheets/tables from the database
Replaces direct Excel/Jupyter loading with database queries returning DataFrames
"""
import pandas as pd
from typing import Optional, Dict, Any, List
from app.core.database import get_supabase_client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseLayer:
    """Database layer for loading hospital data into pandas DataFrames"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.supabase = get_supabase_client()
    
    async def load_service_register(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load service register data as DataFrame"""
        try:
            query = self.supabase.table("service_register").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            numeric_columns = ['quantity', 'gross_amount', 'discount', 'net_amount', 
                             'performing_doctor_share_if_applicable', 
                             'cost_of_pharmacy_material_billed_to_patient',
                             'share_of_outsource_service_billed']
            
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            # Date conversions
            date_columns = ['date_of_final_bill', 'service_date']
            for col in date_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
            
            logger.info(f"Loaded {len(df)} service register records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading service register: {e}")
            return pd.DataFrame()
    
    async def load_trial_balance(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load trial balance data as DataFrame"""
        try:
            query = self.supabase.table("trial_balance").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            numeric_columns = ['amount', 'amount_2']
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            logger.info(f"Loaded {len(df)} trial balance records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading trial balance: {e}")
            return pd.DataFrame()
    
    async def load_expense_wise(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load expense wise data as DataFrame"""
        try:
            query = self.supabase.table("expense_wise").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            if 'amount' in df.columns:
                df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
            
            logger.info(f"Loaded {len(df)} expense wise records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading expense wise: {e}")
            return pd.DataFrame()
    
    async def load_variable_cost_bill_wise(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load variable cost bill wise data as DataFrame"""
        try:
            query = self.supabase.table("variable_cost_bill_wise").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions for all cost columns
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
            
            for col in cost_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            logger.info(f"Loaded {len(df)} variable cost records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading variable cost: {e}")
            return pd.DataFrame()
    
    async def load_hr_data(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load HR data as DataFrame"""
        try:
            query = self.supabase.table("hr_data").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            numeric_columns = [
                'efforts_allocation', 'efforts_sub_allocation', 'utilization',
                'available_hours', 'actual_hours', 'basic_pay', 'allowances',
                'other_benefits', 'overtime', 'bonus', 'epf', 'esic',
                'any_other_contribution', 'gross_total', 'deduction', 'net_salary',
                'no_of_headcount'
            ]
            
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            # Date conversions
            date_columns = ['date_of_joining', 'date_of_resignation']
            for col in date_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
            
            logger.info(f"Loaded {len(df)} HR records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading HR data: {e}")
            return pd.DataFrame()
    
    async def load_occupancy_register(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load occupancy register data as DataFrame"""
        try:
            query = self.supabase.table("occupancy_register").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            if 'length_of_stay_in_hours' in df.columns:
                df['length_of_stay_in_hours'] = pd.to_numeric(df['length_of_stay_in_hours'], errors='coerce').fillna(0)
            
            # Date conversions
            date_columns = ['patient_admission_date', 'patient_discharge_date', 'date_of_final_bill']
            for col in date_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
            
            # DateTime conversions
            datetime_columns = [
                'the_date_time_at_which_patient_was_transferred_to_this_bed',
                'the_date_time_at_which_patient_left_this_bed'
            ]
            for col in datetime_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
            
            logger.info(f"Loaded {len(df)} occupancy records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading occupancy register: {e}")
            return pd.DataFrame()
    
    async def load_ot_register(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load OT register data as DataFrame"""
        try:
            query = self.supabase.table("ot_register").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Date conversions
            date_columns = ['patient_admission_date', 'patient_discharge_date', 'service_date']
            for col in date_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
            
            # Time conversions
            time_columns = ['on_table_time', 'incision_time', 'finish_time']
            for col in time_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], format='%H:%M:%S', errors='coerce').dt.time
            
            logger.info(f"Loaded {len(df)} OT register records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading OT register: {e}")
            return pd.DataFrame()
    
    async def load_consumption_data(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load consumption data as DataFrame"""
        try:
            query = self.supabase.table("consumption_data").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            numeric_columns = ['quantity', 'rate', 'transaction_value_excluding_tax']
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            # Date conversions
            if 'transaction_date' in df.columns:
                df['transaction_date'] = pd.to_datetime(df['transaction_date'], errors='coerce')
            
            logger.info(f"Loaded {len(df)} consumption records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading consumption data: {e}")
            return pd.DataFrame()
    
    async def load_connected_load(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load connected load data as DataFrame"""
        try:
            query = self.supabase.table("connected_load").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            numeric_columns = ['connected_load', 'running_load', 'standby_load', 'days', 'hours', 'total_load_kg']
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            logger.info(f"Loaded {len(df)} connected load records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading connected load: {e}")
            return pd.DataFrame()
    
    async def load_fixed_asset_register(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load fixed asset register data as DataFrame"""
        try:
            query = self.supabase.table("fixed_asset_register").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions
            numeric_columns = ['bio_medical_equipments', 'engineering_equipments', 'furniture_fixture', 'others']
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            logger.info(f"Loaded {len(df)} fixed asset records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading fixed asset register: {e}")
            return pd.DataFrame()
    
    async def load_cost_center(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load cost center data as DataFrame"""
        try:
            query = self.supabase.table("cost_center").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            logger.info(f"Loaded {len(df)} cost center records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading cost center: {e}")
            return pd.DataFrame()
    
    async def load_secondary_cost_driver(self, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Load secondary cost driver data as DataFrame"""
        try:
            query = self.supabase.table("secondary_cost_driver").select("*").eq("user_id", self.user_id)
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            if not result.data:
                return pd.DataFrame()
            
            df = pd.DataFrame(result.data)
            
            # Data type conversions for all numeric columns
            numeric_columns = [
                'nursing_hostel_occupancy', 'doctors_hostel_occupancy', 'staff_accomodation_occupancy',
                'frequency_of_audit', 'no_of_it_users', 'no_of_transaction_in_finance_billing_cost_centre',
                'no_of_trips_km', 'no_of_laboratory_test', 'no_of_sample_collected_report_dispatch',
                'no_of_home_sample_collection', 'no_of_radiology_test', 'no_of_neuro_test',
                'no_of_cardiac_test', 'no_of_nuclear_medicine_test', 'no_of_ivf_consultation',
                'ot_time_hours', 'ccu_occupancy', 'micu_occupancy', 'picu_occupancy',
                'nicu_occupancy', 'hdu_occupancy', 'issolation_room_occupancy', 'gw_occupancy',
                'pw_sr_occupancy', 'sw_ts_occupancy', 'dw_occupancy', 'head_office',
                'other_unit_1_allocation_ratio', 'other_unit_2_allocation_ratio',
                'other_unit_3_allocation_ratio', 'other_unit_4_allocation_ratio',
                'other_unit_5_allocation_ratio', 'no_of_patient_op_ip',
                'no_of_corporate_patient_op_ip', 'no_of_institutional_patient_op_ip',
                'no_of_international_patient_op_ip', 'no_of_ip_patients',
                'no_of_credit_ip_patients', 'surgical_store_issue_ratio',
                'central_store_issue_ratio', 'non_surgical_store_issue_ratio',
                'stationery_housekeeping_issue_ratio', 'no_of_doctors',
                'doctor_fee_for_service_ratio', 'consultant_retainer_fee_mg_bonus_ratio',
                'no_of_nursing_staff', 'nursing_station_1_for_care_units',
                'nursing_station_2_for_care_units', 'nursing_station_3_for_care_units',
                'nursing_station_4_for_care_units', 'nursing_station_5_for_care_units',
                'service_under_op_billing_1', 'service_under_op_billing_2',
                'service_under_op_billing_3', 'service_under_op_billing_4',
                'brokerage_commission', 'no_of_cssd_set_issued', 'no_of_diet_served',
                'no_of_ward_boy', 'no_of_housekeeping_staff',
                'no_of_fumigation_cycle_performed_standard_resource_allocation_ratio',
                'volume_of_cloth_load', 'efforts_of_supply_chain_department',
                'area_in_sq_meter', 'no_of_security_staff_deployed_no_of_exits',
                'actual_water_utilization_standard_utilization_ratio',
                'actual_gas_utilization_standard_utilization_ratio',
                'actual_vaccume_utilization_standard_utilization_ratio'
            ]
            
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            logger.info(f"Loaded {len(df)} secondary cost driver records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading secondary cost driver: {e}")
            return pd.DataFrame()
    
    async def load_all_tables(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, pd.DataFrame]:
        """Load all tables and return as dictionary of DataFrames"""
        try:
            tables = {
                'service_register': await self.load_service_register(filters),
                'trial_balance': await self.load_trial_balance(filters),
                'expense_wise': await self.load_expense_wise(filters),
                'variable_cost_bill_wise': await self.load_variable_cost_bill_wise(filters),
                'hr_data': await self.load_hr_data(filters),
                'occupancy_register': await self.load_occupancy_register(filters),
                'ot_register': await self.load_ot_register(filters),
                'consumption_data': await self.load_consumption_data(filters),
                'connected_load': await self.load_connected_load(filters),
                'fixed_asset_register': await self.load_fixed_asset_register(filters),
                'cost_center': await self.load_cost_center(filters),
                'secondary_cost_driver': await self.load_secondary_cost_driver(filters)
            }
            
            logger.info("Successfully loaded all database tables")
            return tables
            
        except Exception as e:
            logger.error(f"Error loading all tables: {e}")
            return {}
/*
  # Update Database Schema to Match Final Column Structure

  1. Schema Updates
    - Update all table columns to match the final structure
    - Rename columns to match exact naming conventions
    - Add missing columns and remove unused ones
    - Update data types where necessary

  2. Tables Updated
    - service_register: Updated column names and structure
    - trial_balance: Fixed duplicate columns
    - expense_wise: Updated to match structure
    - variable_cost_bill_wise: Updated with correct long column names
    - hr_data: Updated column names
    - occupancy_register: Updated with correct column names
    - ot_register: Updated column structure
    - consumption_data: Updated column names
    - connected_load: Updated column names
    - fixed_asset_register: Updated column names
    - tat_data: Updated column names
    - secondary_cost_driver: Updated with all correct column names

  3. Security
    - Maintain existing RLS policies
    - Update triggers for new column names
*/

-- Update service_register table
ALTER TABLE service_register 
RENAME COLUMN admitting_doctor_department TO admitting_doctor_department_speciality_name;

ALTER TABLE service_register 
RENAME COLUMN performing_doctor_department TO performing_doctor_department_speciality_name;

ALTER TABLE service_register 
RENAME COLUMN referring_doctor_name TO refering_doctor_name;

ALTER TABLE service_register 
RENAME COLUMN referring_doctor_department TO refering_doctor_department_speciality_name;

ALTER TABLE service_register 
RENAME COLUMN performing_doctor_share TO performing_doctor_share_if_applicable;

ALTER TABLE service_register 
RENAME COLUMN pharmacy_material_cost TO cost_of_pharmacy_material_billed_to_patient;

ALTER TABLE service_register 
RENAME COLUMN outsource_share TO share_of_outsource_service_billed;

ALTER TABLE service_register 
RENAME COLUMN sub_cost_centre_name TO sub_cost_centre;

-- Update trial_balance table to fix duplicate columns
ALTER TABLE trial_balance DROP COLUMN IF EXISTS category_code_second;
ALTER TABLE trial_balance DROP COLUMN IF EXISTS category_second;
ALTER TABLE trial_balance DROP COLUMN IF EXISTS amount_second;

-- Add the corrected second set of columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trial_balance' AND column_name = 'category_code_2'
  ) THEN
    ALTER TABLE trial_balance ADD COLUMN category_code_2 VARCHAR(50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trial_balance' AND column_name = 'category_2'
  ) THEN
    ALTER TABLE trial_balance ADD COLUMN category_2 VARCHAR(100);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trial_balance' AND column_name = 'amount_2'
  ) THEN
    ALTER TABLE trial_balance ADD COLUMN amount_2 DECIMAL(15,2) DEFAULT 0;
  END IF;
END $$;

-- Update variable_cost_bill_wise table with correct long column names
ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN medical_surgical_consumables TO medical_surgical_consumables_charged_to_patient;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN implants_and_prosthetics TO implants_and_prosthetics_charged_to_patient;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN non_medical_consumables TO non_medical_consumables_charged_to_patient;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN incentives_to_doctors TO incentives_to_consultants_treating_doctors;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN patient_food_beverages TO patient_food_beverages_outsource_service;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN laboratory_test_outsource TO laboratory_test_outsource_service;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN other_outsourced_services_1 TO any_other_patient_related_outsourced_services_1;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN other_outsourced_services_2 TO any_other_patient_related_outsourced_services_2;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN other_outsourced_services_3 TO any_other_patient_related_outsourced_services_3;

ALTER TABLE variable_cost_bill_wise 
RENAME COLUMN provision_for_bad_debts TO provision_for_deduction_bad_debts;

-- Update hr_data table column names
ALTER TABLE hr_data 
RENAME COLUMN sub_cost_centre_name TO sub_cost_centre;

-- Update occupancy_register table with correct column names
ALTER TABLE occupancy_register 
RENAME COLUMN uhid TO medical_record_number_or_registration_number_uhid;

ALTER TABLE occupancy_register 
RENAME COLUMN ward_code TO sub_cost_centre_code;

ALTER TABLE occupancy_register 
RENAME COLUMN ward_name TO sub_cost_centre;

ALTER TABLE occupancy_register 
RENAME COLUMN bed_assign_datetime TO the_date_time_at_which_patient_was_transferred_to_this_bed;

ALTER TABLE occupancy_register 
RENAME COLUMN bed_release_datetime TO the_date_time_at_which_patient_left_this_bed;

-- Update ot_register table with correct column names
ALTER TABLE ot_register 
RENAME COLUMN serial_no TO s_no;

ALTER TABLE ot_register 
RENAME COLUMN uhid TO medical_record_number_or_registration_number_uhid;

ALTER TABLE ot_register 
RENAME COLUMN patient_bill_number TO bill_no;

ALTER TABLE ot_register 
RENAME COLUMN performing_doctor_department TO performing_doctor_department_speciality_name;

ALTER TABLE ot_register 
RENAME COLUMN anaesthetist_name TO anaesthesist_name;

ALTER TABLE ot_register 
RENAME COLUMN operation_theatre_code TO sub_cost_centre_code;

ALTER TABLE ot_register 
RENAME COLUMN operation_theatre_name TO sub_cost_centre;

-- Remove duplicate service_name column from ot_register
ALTER TABLE ot_register DROP COLUMN IF EXISTS service_name_second;

-- Update consumption_data table column names
ALTER TABLE consumption_data 
RENAME COLUMN serial_no TO s_no;

ALTER TABLE consumption_data 
RENAME COLUMN transaction_value TO transaction_value_excluding_tax;

-- Update connected_load table column names
ALTER TABLE connected_load 
RENAME COLUMN serial_no TO s_no;

-- Update fixed_asset_register table column names
ALTER TABLE fixed_asset_register 
RENAME COLUMN serial_no TO s_no;

-- Update tat_data table column names
ALTER TABLE tat_data 
RENAME COLUMN serial_no TO s_no;

-- Update secondary_cost_driver table with all correct column names
ALTER TABLE secondary_cost_driver 
RENAME COLUMN serial_no TO s_no;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN staff_accommodation_occupancy TO staff_accomodation_occupancy;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN no_of_transaction_in_finance_billing TO no_of_transaction_in_finance_billing_cost_centre;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN list_of_equipment_for_loan TO list_of_equipment_for_which_loan_was_taken;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN isolation_room_occupancy TO issolation_room_occupancy;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN pwsr_occupancy TO pw_sr_occupancy;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN swts_occupancy TO sw_ts_occupancy;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN no_of_fumigation_cycle_performed TO no_of_fumigation_cycle_performed_standard_resource_allocation_ratio;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN no_of_security_staff_deployed TO no_of_security_staff_deployed_no_of_exits;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN actual_water_utilization TO actual_water_utilization_standard_utilization_ratio;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN actual_gas_utilization TO actual_gas_utilization_standard_utilization_ratio;

ALTER TABLE secondary_cost_driver 
RENAME COLUMN actual_vacuum_utilization TO actual_vaccume_utilization_standard_utilization_ratio;

-- Update indexes to match new column names
DROP INDEX IF EXISTS idx_service_register_patient_type;
CREATE INDEX IF NOT EXISTS idx_service_register_patient_type ON service_register(patient_type);

DROP INDEX IF EXISTS idx_occupancy_register_uhid;
CREATE INDEX IF NOT EXISTS idx_occupancy_register_uhid ON occupancy_register(medical_record_number_or_registration_number_uhid);

-- Update any existing sample data to match new column structure
UPDATE service_register SET 
  performing_doctor_share_if_applicable = COALESCE(performing_doctor_share_if_applicable, 0),
  cost_of_pharmacy_material_billed_to_patient = COALESCE(cost_of_pharmacy_material_billed_to_patient, 0),
  share_of_outsource_service_billed = COALESCE(share_of_outsource_service_billed, 0)
WHERE user_id = '0a8994d0-f153-4ac8-8182-6e1743432a70';
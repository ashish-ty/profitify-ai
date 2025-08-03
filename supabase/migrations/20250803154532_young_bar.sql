/*
  # Create New Hospital Data Schema

  1. New Tables
    - `service_register` - Revenue service tracking
    - `trial_balance` - Financial trial balance data
    - `expense_wise` - Expense categorization
    - `variable_cost_bill_wise` - Patient-specific variable costs
    - `hr_data` - Human resources and salary information
    - `occupancy_register` - Patient occupancy tracking
    - `ot_register` - Operating theater procedures
    - `consumption_data` - Material consumption tracking
    - `connected_load` - Power consumption data
    - `fixed_asset_register` - Asset management
    - `tat_data` - Turnaround time metrics
    - `cost_center` - Cost center definitions
    - `secondary_cost_driver` - Comprehensive cost driver metrics

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data

  3. Changes
    - Drop old tables (revenue_data, expense_data, hospital_metadata)
    - Create comprehensive new schema matching frontend requirements
*/

-- Drop old tables
DROP TABLE IF EXISTS revenue_data CASCADE;
DROP TABLE IF EXISTS expense_data CASCADE;
DROP TABLE IF EXISTS hospital_metadata CASCADE;

-- Service Register Table (Revenue Tab)
CREATE TABLE IF NOT EXISTS service_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_of_final_bill DATE NOT NULL,
    month VARCHAR(20) NOT NULL,
    bill_no VARCHAR(50) NOT NULL,
    patient_type VARCHAR(10) NOT NULL,
    reg_no VARCHAR(50) NOT NULL,
    ipd_number VARCHAR(50),
    payor_type VARCHAR(50) NOT NULL,
    payor_alias_name VARCHAR(100),
    admitting_doctor_name VARCHAR(100) NOT NULL,
    admitting_doctor_department VARCHAR(100) NOT NULL,
    performing_doctor_name VARCHAR(100) NOT NULL,
    performing_doctor_department VARCHAR(100) NOT NULL,
    referring_doctor_name VARCHAR(100),
    referring_doctor_department VARCHAR(100),
    service_name VARCHAR(200) NOT NULL,
    service_department VARCHAR(100) NOT NULL,
    service_sub_department VARCHAR(100),
    service_status VARCHAR(20) NOT NULL DEFAULT 'Active',
    is_packaged BOOLEAN DEFAULT FALSE,
    is_outsourced BOOLEAN DEFAULT FALSE,
    quantity INTEGER NOT NULL DEFAULT 1,
    gross_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount DECIMAL(15,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    emergency_charges_applied BOOLEAN DEFAULT FALSE,
    performing_doctor_share DECIMAL(15,2) DEFAULT 0,
    pharmacy_material_cost DECIMAL(15,2) DEFAULT 0,
    outsource_share DECIMAL(15,2) DEFAULT 0,
    sub_cost_centre_code VARCHAR(50),
    sub_cost_centre_name VARCHAR(100),
    service_tat VARCHAR(50),
    service_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trial Balance Table (Expense Tab)
CREATE TABLE IF NOT EXISTS trial_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_code VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    grouping_code VARCHAR(50) NOT NULL,
    grouping VARCHAR(100) NOT NULL,
    ledger_code VARCHAR(50) NOT NULL,
    ledger_name VARCHAR(200) NOT NULL,
    alias_code VARCHAR(50),
    alias_name VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    remarks TEXT,
    primary_cost_driver VARCHAR(200),
    category_code_second VARCHAR(50),
    category_second VARCHAR(100),
    amount_second DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Expense Wise Table (Expense Tab)
CREATE TABLE IF NOT EXISTS expense_wise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nature_of_data VARCHAR(50) NOT NULL,
    ledger_code VARCHAR(50) NOT NULL,
    ledger_name VARCHAR(200) NOT NULL,
    alias_name VARCHAR(100),
    sub_cost_centre_code VARCHAR(50),
    sub_cost_centre VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Variable Cost Bill Wise Table (Expense Tab)
CREATE TABLE IF NOT EXISTS variable_cost_bill_wise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_type VARCHAR(10) NOT NULL,
    reg_no VARCHAR(50) NOT NULL,
    ipd_number VARCHAR(50),
    bill_no VARCHAR(50) NOT NULL,
    pharmacy_charged_to_patient DECIMAL(15,2) DEFAULT 0,
    medical_surgical_consumables DECIMAL(15,2) DEFAULT 0,
    implants_and_prosthetics DECIMAL(15,2) DEFAULT 0,
    non_medical_consumables DECIMAL(15,2) DEFAULT 0,
    fee_for_service DECIMAL(15,2) DEFAULT 0,
    incentives_to_doctors DECIMAL(15,2) DEFAULT 0,
    patient_food_beverages DECIMAL(15,2) DEFAULT 0,
    laboratory_test_outsource DECIMAL(15,2) DEFAULT 0,
    other_outsourced_services_1 DECIMAL(15,2) DEFAULT 0,
    other_outsourced_services_2 DECIMAL(15,2) DEFAULT 0,
    other_outsourced_services_3 DECIMAL(15,2) DEFAULT 0,
    brokerage_commission DECIMAL(15,2) DEFAULT 0,
    provision_for_bad_debts DECIMAL(15,2) DEFAULT 0,
    doctor_name VARCHAR(100),
    service_name VARCHAR(200),
    payor_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- HR Data Table (Expense Tab)
CREATE TABLE IF NOT EXISTS hr_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nature_of_data VARCHAR(50) NOT NULL,
    group_code VARCHAR(50) NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    sub_group_code VARCHAR(50),
    sub_group_name VARCHAR(100),
    associate_code VARCHAR(50) NOT NULL,
    associate_name VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL,
    date_of_joining DATE,
    date_of_resignation DATE,
    working_period VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    sub_department VARCHAR(100),
    designation VARCHAR(100) NOT NULL,
    efforts_category VARCHAR(50),
    master_for_multiple VARCHAR(10),
    nature_of_allocation VARCHAR(50),
    efforts_allocation DECIMAL(5,2) DEFAULT 0,
    efforts_sub_allocation DECIMAL(5,2) DEFAULT 0,
    utilization DECIMAL(5,2) DEFAULT 0,
    available_hours INTEGER DEFAULT 0,
    actual_hours INTEGER DEFAULT 0,
    cost_centre_code VARCHAR(50),
    cost_centre_name VARCHAR(100),
    sub_cost_centre_code VARCHAR(50),
    sub_cost_centre_name VARCHAR(100),
    basic_pay DECIMAL(15,2) DEFAULT 0,
    allowances DECIMAL(15,2) DEFAULT 0,
    other_benefits DECIMAL(15,2) DEFAULT 0,
    overtime DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    epf DECIMAL(15,2) DEFAULT 0,
    esic DECIMAL(15,2) DEFAULT 0,
    any_other_contribution DECIMAL(15,2) DEFAULT 0,
    gross_total DECIMAL(15,2) DEFAULT 0,
    deduction DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2) DEFAULT 0,
    no_of_headcount INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Occupancy Register Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS occupancy_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nature_of_data VARCHAR(50) NOT NULL,
    uhid VARCHAR(50) NOT NULL,
    patient_admission_date DATE NOT NULL,
    patient_discharge_date DATE,
    ipd_number VARCHAR(50),
    date_of_final_bill DATE,
    bill_no VARCHAR(50),
    ward_code VARCHAR(50) NOT NULL,
    ward_name VARCHAR(100) NOT NULL,
    bed_number VARCHAR(50) NOT NULL,
    length_of_stay_in_hours INTEGER DEFAULT 0,
    bed_assign_datetime TIMESTAMPTZ,
    bed_release_datetime TIMESTAMPTZ,
    ward_category_code VARCHAR(50),
    bed_category_name VARCHAR(100),
    payor_type VARCHAR(50),
    service_name VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- OT Register Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS ot_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_no VARCHAR(50) NOT NULL,
    uhid VARCHAR(50) NOT NULL,
    patient_bill_number VARCHAR(50) NOT NULL,
    patient_admission_date DATE NOT NULL,
    patient_discharge_date DATE,
    ipd_number VARCHAR(50),
    service_date DATE NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    performing_doctor_name VARCHAR(100) NOT NULL,
    performing_doctor_department VARCHAR(100) NOT NULL,
    anaesthetist_name VARCHAR(100),
    anesthesia_type VARCHAR(50),
    type_of_procedure VARCHAR(100),
    nature_of_procedure VARCHAR(50),
    operation_theatre_code VARCHAR(50),
    operation_theatre_name VARCHAR(100),
    on_table_time TIME,
    incision_time TIME,
    finish_time TIME,
    procedure_time VARCHAR(50),
    change_over_time VARCHAR(50),
    total_time VARCHAR(50),
    remarks TEXT,
    payor_type VARCHAR(50),
    service_name_second VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Consumption Data Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS consumption_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_no VARCHAR(50) NOT NULL,
    cost_centre_code VARCHAR(50) NOT NULL,
    cost_centre VARCHAR(100) NOT NULL,
    sub_cost_centre_code VARCHAR(50),
    sub_cost_centre VARCHAR(100),
    transaction_date DATE NOT NULL,
    from_store VARCHAR(100),
    to_store VARCHAR(100),
    sku_name VARCHAR(200) NOT NULL,
    ledger_code VARCHAR(50),
    ledger_name VARCHAR(200),
    unit_of_measurement VARCHAR(50),
    quantity DECIMAL(10,2) DEFAULT 0,
    rate DECIMAL(15,2) DEFAULT 0,
    transaction_value DECIMAL(15,2) DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Connected Load Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS connected_load (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_no VARCHAR(50) NOT NULL,
    sub_cost_centre_code VARCHAR(50) NOT NULL,
    sub_cost_centre VARCHAR(100) NOT NULL,
    connected_load DECIMAL(10,2) DEFAULT 0,
    running_load DECIMAL(10,2) DEFAULT 0,
    standby_load DECIMAL(10,2) DEFAULT 0,
    days INTEGER DEFAULT 0,
    hours INTEGER DEFAULT 0,
    total_load_kg DECIMAL(15,2) DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fixed Asset Register Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS fixed_asset_register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_no VARCHAR(50) NOT NULL,
    sub_cost_centre_code VARCHAR(50) NOT NULL,
    sub_cost_centre VARCHAR(100) NOT NULL,
    bio_medical_equipments DECIMAL(15,2) DEFAULT 0,
    engineering_equipments DECIMAL(15,2) DEFAULT 0,
    furniture_fixture DECIMAL(15,2) DEFAULT 0,
    others DECIMAL(15,2) DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- TAT Data Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS tat_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_no VARCHAR(50) NOT NULL,
    sub_cost_centre_code VARCHAR(50) NOT NULL,
    sub_cost_centre VARCHAR(100) NOT NULL,
    tat VARCHAR(100) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cost Center Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS cost_center (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cc_type VARCHAR(50) NOT NULL,
    cost_centre_code VARCHAR(50) NOT NULL,
    cost_centre_category VARCHAR(100),
    cost_centre VARCHAR(100) NOT NULL,
    sub_cost_centre_code VARCHAR(50),
    sub_cost_centre VARCHAR(100),
    alias_code VARCHAR(50),
    alias_name VARCHAR(100),
    cost_driver VARCHAR(200),
    source_of_driver VARCHAR(200),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Secondary Cost Driver Table (Metadata Tab)
CREATE TABLE IF NOT EXISTS secondary_cost_driver (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serial_no VARCHAR(50) NOT NULL,
    sub_cost_centre_code VARCHAR(50) NOT NULL,
    sub_cost_centre VARCHAR(100) NOT NULL,
    nursing_hostel_occupancy INTEGER DEFAULT 0,
    doctors_hostel_occupancy INTEGER DEFAULT 0,
    staff_accommodation_occupancy INTEGER DEFAULT 0,
    frequency_of_audit INTEGER DEFAULT 0,
    no_of_it_users INTEGER DEFAULT 0,
    no_of_transaction_in_finance_billing INTEGER DEFAULT 0,
    list_of_equipment_for_loan TEXT,
    no_of_trips_km INTEGER DEFAULT 0,
    no_of_laboratory_test INTEGER DEFAULT 0,
    no_of_sample_collected_report_dispatch INTEGER DEFAULT 0,
    no_of_home_sample_collection INTEGER DEFAULT 0,
    no_of_radiology_test INTEGER DEFAULT 0,
    no_of_neuro_test INTEGER DEFAULT 0,
    no_of_cardiac_test INTEGER DEFAULT 0,
    no_of_nuclear_medicine_test INTEGER DEFAULT 0,
    no_of_ivf_consultation INTEGER DEFAULT 0,
    ot_time_hours DECIMAL(10,2) DEFAULT 0,
    ccu_occupancy INTEGER DEFAULT 0,
    micu_occupancy INTEGER DEFAULT 0,
    picu_occupancy INTEGER DEFAULT 0,
    nicu_occupancy INTEGER DEFAULT 0,
    hdu_occupancy INTEGER DEFAULT 0,
    isolation_room_occupancy INTEGER DEFAULT 0,
    gw_occupancy INTEGER DEFAULT 0,
    pwsr_occupancy INTEGER DEFAULT 0,
    swts_occupancy INTEGER DEFAULT 0,
    dw_occupancy INTEGER DEFAULT 0,
    head_office INTEGER DEFAULT 0,
    other_unit_1_allocation_ratio DECIMAL(5,2) DEFAULT 0,
    other_unit_2_allocation_ratio DECIMAL(5,2) DEFAULT 0,
    other_unit_3_allocation_ratio DECIMAL(5,2) DEFAULT 0,
    other_unit_4_allocation_ratio DECIMAL(5,2) DEFAULT 0,
    other_unit_5_allocation_ratio DECIMAL(5,2) DEFAULT 0,
    no_of_patient_op_ip INTEGER DEFAULT 0,
    no_of_corporate_patient_op_ip INTEGER DEFAULT 0,
    no_of_institutional_patient_op_ip INTEGER DEFAULT 0,
    no_of_international_patient_op_ip INTEGER DEFAULT 0,
    no_of_ip_patients INTEGER DEFAULT 0,
    no_of_credit_ip_patients INTEGER DEFAULT 0,
    surgical_store_issue_ratio DECIMAL(5,2) DEFAULT 0,
    central_store_issue_ratio DECIMAL(5,2) DEFAULT 0,
    non_surgical_store_issue_ratio DECIMAL(5,2) DEFAULT 0,
    stationery_housekeeping_issue_ratio DECIMAL(5,2) DEFAULT 0,
    no_of_doctors INTEGER DEFAULT 0,
    doctor_fee_for_service_ratio DECIMAL(5,2) DEFAULT 0,
    consultant_retainer_fee_mg_bonus_ratio DECIMAL(5,2) DEFAULT 0,
    no_of_nursing_staff INTEGER DEFAULT 0,
    nursing_station_1_for_care_units INTEGER DEFAULT 0,
    nursing_station_2_for_care_units INTEGER DEFAULT 0,
    nursing_station_3_for_care_units INTEGER DEFAULT 0,
    nursing_station_4_for_care_units INTEGER DEFAULT 0,
    nursing_station_5_for_care_units INTEGER DEFAULT 0,
    service_under_op_billing_1 INTEGER DEFAULT 0,
    service_under_op_billing_2 INTEGER DEFAULT 0,
    service_under_op_billing_3 INTEGER DEFAULT 0,
    service_under_op_billing_4 INTEGER DEFAULT 0,
    brokerage_commission DECIMAL(15,2) DEFAULT 0,
    no_of_cssd_set_issued INTEGER DEFAULT 0,
    no_of_diet_served INTEGER DEFAULT 0,
    no_of_ward_boy INTEGER DEFAULT 0,
    no_of_housekeeping_staff INTEGER DEFAULT 0,
    no_of_fumigation_cycle_performed INTEGER DEFAULT 0,
    volume_of_cloth_load INTEGER DEFAULT 0,
    efforts_of_supply_chain_department DECIMAL(5,2) DEFAULT 0,
    area_in_sq_meter DECIMAL(10,2) DEFAULT 0,
    no_of_security_staff_deployed INTEGER DEFAULT 0,
    actual_water_utilization DECIMAL(10,2) DEFAULT 0,
    actual_gas_utilization DECIMAL(10,2) DEFAULT 0,
    actual_vacuum_utilization DECIMAL(10,2) DEFAULT 0,
    civil TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_register_user_id ON service_register(user_id);
CREATE INDEX IF NOT EXISTS idx_service_register_date ON service_register(date_of_final_bill);
CREATE INDEX IF NOT EXISTS idx_service_register_patient_type ON service_register(patient_type);

CREATE INDEX IF NOT EXISTS idx_trial_balance_user_id ON trial_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_balance_category ON trial_balance(category);

CREATE INDEX IF NOT EXISTS idx_expense_wise_user_id ON expense_wise(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_wise_nature ON expense_wise(nature_of_data);

CREATE INDEX IF NOT EXISTS idx_variable_cost_user_id ON variable_cost_bill_wise(user_id);
CREATE INDEX IF NOT EXISTS idx_variable_cost_bill_no ON variable_cost_bill_wise(bill_no);

CREATE INDEX IF NOT EXISTS idx_hr_data_user_id ON hr_data(user_id);
CREATE INDEX IF NOT EXISTS idx_hr_data_department ON hr_data(department);

CREATE INDEX IF NOT EXISTS idx_occupancy_register_user_id ON occupancy_register(user_id);
CREATE INDEX IF NOT EXISTS idx_occupancy_register_uhid ON occupancy_register(uhid);

CREATE INDEX IF NOT EXISTS idx_ot_register_user_id ON ot_register(user_id);
CREATE INDEX IF NOT EXISTS idx_ot_register_service_date ON ot_register(service_date);

CREATE INDEX IF NOT EXISTS idx_consumption_data_user_id ON consumption_data(user_id);
CREATE INDEX IF NOT EXISTS idx_consumption_data_date ON consumption_data(transaction_date);

CREATE INDEX IF NOT EXISTS idx_connected_load_user_id ON connected_load(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_asset_register_user_id ON fixed_asset_register(user_id);
CREATE INDEX IF NOT EXISTS idx_tat_data_user_id ON tat_data(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_center_user_id ON cost_center(user_id);
CREATE INDEX IF NOT EXISTS idx_secondary_cost_driver_user_id ON secondary_cost_driver(user_id);

-- Enable Row Level Security
ALTER TABLE service_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_wise ENABLE ROW LEVEL SECURITY;
ALTER TABLE variable_cost_bill_wise ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancy_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumption_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_load ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_asset_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE tat_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE secondary_cost_driver ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
-- Service Register policies
CREATE POLICY "Users can view own service register data" ON service_register
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own service register data" ON service_register
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own service register data" ON service_register
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own service register data" ON service_register
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Trial Balance policies
CREATE POLICY "Users can view own trial balance data" ON trial_balance
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own trial balance data" ON trial_balance
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own trial balance data" ON trial_balance
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own trial balance data" ON trial_balance
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Expense Wise policies
CREATE POLICY "Users can view own expense wise data" ON expense_wise
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own expense wise data" ON expense_wise
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own expense wise data" ON expense_wise
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own expense wise data" ON expense_wise
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Variable Cost Bill Wise policies
CREATE POLICY "Users can view own variable cost data" ON variable_cost_bill_wise
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own variable cost data" ON variable_cost_bill_wise
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own variable cost data" ON variable_cost_bill_wise
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own variable cost data" ON variable_cost_bill_wise
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- HR Data policies
CREATE POLICY "Users can view own hr data" ON hr_data
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own hr data" ON hr_data
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own hr data" ON hr_data
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own hr data" ON hr_data
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Occupancy Register policies
CREATE POLICY "Users can view own occupancy register data" ON occupancy_register
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own occupancy register data" ON occupancy_register
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own occupancy register data" ON occupancy_register
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own occupancy register data" ON occupancy_register
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- OT Register policies
CREATE POLICY "Users can view own ot register data" ON ot_register
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own ot register data" ON ot_register
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own ot register data" ON ot_register
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own ot register data" ON ot_register
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Consumption Data policies
CREATE POLICY "Users can view own consumption data" ON consumption_data
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own consumption data" ON consumption_data
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own consumption data" ON consumption_data
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own consumption data" ON consumption_data
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Connected Load policies
CREATE POLICY "Users can view own connected load data" ON connected_load
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own connected load data" ON connected_load
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own connected load data" ON connected_load
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own connected load data" ON connected_load
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Fixed Asset Register policies
CREATE POLICY "Users can view own fixed asset data" ON fixed_asset_register
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own fixed asset data" ON fixed_asset_register
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own fixed asset data" ON fixed_asset_register
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own fixed asset data" ON fixed_asset_register
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- TAT Data policies
CREATE POLICY "Users can view own tat data" ON tat_data
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own tat data" ON tat_data
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own tat data" ON tat_data
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own tat data" ON tat_data
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Cost Center policies
CREATE POLICY "Users can view own cost center data" ON cost_center
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own cost center data" ON cost_center
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own cost center data" ON cost_center
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own cost center data" ON cost_center
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Secondary Cost Driver policies
CREATE POLICY "Users can view own secondary cost driver data" ON secondary_cost_driver
    FOR SELECT USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can insert own secondary cost driver data" ON secondary_cost_driver
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);
CREATE POLICY "Users can update own secondary cost driver data" ON secondary_cost_driver
    FOR UPDATE USING (user_id = auth.uid()::uuid);
CREATE POLICY "Users can delete own secondary cost driver data" ON secondary_cost_driver
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_service_register_updated_at BEFORE UPDATE ON service_register
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trial_balance_updated_at BEFORE UPDATE ON trial_balance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_wise_updated_at BEFORE UPDATE ON expense_wise
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variable_cost_bill_wise_updated_at BEFORE UPDATE ON variable_cost_bill_wise
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_data_updated_at BEFORE UPDATE ON hr_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occupancy_register_updated_at BEFORE UPDATE ON occupancy_register
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ot_register_updated_at BEFORE UPDATE ON ot_register
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consumption_data_updated_at BEFORE UPDATE ON consumption_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connected_load_updated_at BEFORE UPDATE ON connected_load
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixed_asset_register_updated_at BEFORE UPDATE ON fixed_asset_register
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tat_data_updated_at BEFORE UPDATE ON tat_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_center_updated_at BEFORE UPDATE ON cost_center
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secondary_cost_driver_updated_at BEFORE UPDATE ON secondary_cost_driver
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
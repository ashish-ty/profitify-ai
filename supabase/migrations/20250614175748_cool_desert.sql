-- Medicost.ai Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    hospital_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospital metadata table
CREATE TABLE hospital_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    beds_icu INTEGER NOT NULL DEFAULT 0,
    beds_non_icu INTEGER NOT NULL DEFAULT 0,
    number_of_nurses INTEGER NOT NULL DEFAULT 0,
    resident_doctors INTEGER NOT NULL DEFAULT 0,
    technician_staff INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

-- Revenue data table
CREATE TABLE revenue_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    patient_type VARCHAR(10) NOT NULL CHECK (patient_type IN ('OPD', 'IPD')),
    specialty VARCHAR(50) NOT NULL CHECK (specialty IN ('Cardiology', 'Oncology', 'Neurology', 'Gynaecology')),
    billing_category VARCHAR(10) NOT NULL CHECK (billing_category IN ('Cash', 'Credit')),
    number_of_patients INTEGER NOT NULL DEFAULT 0,
    bed_days_icu INTEGER DEFAULT 0,
    bed_days_non_icu INTEGER DEFAULT 0,
    gross_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount DECIMAL(15,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense data table
CREATE TABLE expense_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    pharmacy DECIMAL(15,2) NOT NULL DEFAULT 0,
    material_non_medical DECIMAL(15,2) NOT NULL DEFAULT 0,
    doctor_share DECIMAL(15,2) NOT NULL DEFAULT 0,
    salary_wages DECIMAL(15,2) NOT NULL DEFAULT 0,
    power_fuel DECIMAL(15,2) NOT NULL DEFAULT 0,
    admin_financial DECIMAL(15,2) NOT NULL DEFAULT 0,
    repair_maintenance DECIMAL(15,2) NOT NULL DEFAULT 0,
    sales_marketing DECIMAL(15,2) NOT NULL DEFAULT 0,
    depreciation DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_expenses DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

-- Create indexes for better performance
CREATE INDEX idx_hospital_metadata_user_id ON hospital_metadata(user_id);
CREATE INDEX idx_hospital_metadata_year_month ON hospital_metadata(year, month);

CREATE INDEX idx_revenue_data_user_id ON revenue_data(user_id);
CREATE INDEX idx_revenue_data_year_month ON revenue_data(year, month);
CREATE INDEX idx_revenue_data_patient_type ON revenue_data(patient_type);
CREATE INDEX idx_revenue_data_specialty ON revenue_data(specialty);

CREATE INDEX idx_expense_data_user_id ON expense_data(user_id);
CREATE INDEX idx_expense_data_year_month ON expense_data(year, month);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_data ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid()::uuid);

-- Hospital metadata policies
CREATE POLICY "Users can view own hospital metadata" ON hospital_metadata
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own hospital metadata" ON hospital_metadata
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own hospital metadata" ON hospital_metadata
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own hospital metadata" ON hospital_metadata
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Revenue data policies
CREATE POLICY "Users can view own revenue data" ON revenue_data
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own revenue data" ON revenue_data
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own revenue data" ON revenue_data
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own revenue data" ON revenue_data
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Expense data policies
CREATE POLICY "Users can view own expense data" ON expense_data
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own expense data" ON expense_data
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own expense data" ON expense_data
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own expense data" ON expense_data
    FOR DELETE USING (user_id = auth.uid()::uuid);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospital_metadata_updated_at BEFORE UPDATE ON hospital_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_data_updated_at BEFORE UPDATE ON revenue_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_data_updated_at BEFORE UPDATE ON expense_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
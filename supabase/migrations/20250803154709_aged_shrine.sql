/*
  # Add Sample Data for New Hospital Schema

  1. Sample Data
    - Add realistic sample data for all new tables
    - Use consistent user_id for demo purposes
    - Include various scenarios and data types

  2. Data Coverage
    - Service register with different patient types and services
    - Trial balance with various financial categories
    - Expense wise data across different cost centers
    - Variable cost data for different bill types
    - HR data for different employee categories
    - Occupancy data for various ward types
    - OT register with different procedure types
    - Consumption data for materials and supplies
    - Connected load for power consumption
    - Fixed assets across departments
    - TAT data for service delivery times
    - Cost center definitions
    - Secondary cost drivers with comprehensive metrics
*/

-- Sample user ID for demo data
-- Using the existing demo user ID from the old schema
INSERT INTO service_register (user_id, date_of_final_bill, month, bill_no, patient_type, reg_no, ipd_number, payor_type, payor_alias_name, admitting_doctor_name, admitting_doctor_department, performing_doctor_name, performing_doctor_department, referring_doctor_name, referring_doctor_department, service_name, service_department, service_sub_department, service_status, is_packaged, is_outsourced, quantity, gross_amount, discount, net_amount, emergency_charges_applied, performing_doctor_share, pharmacy_material_cost, outsource_share, sub_cost_centre_code, sub_cost_centre_name, service_tat, service_date) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', '2024-01-20', 'January', 'B001', 'IPD', 'REG001', 'IPD2024001', 'Insurance', 'Star Health', 'Dr. Smith', 'Cardiology', 'Dr. Smith', 'Cardiology', 'Dr. Brown', 'General Medicine', 'Echocardiography', 'Cardiology', 'Echo Lab', 'Active', false, false, 1, 8500.00, 500.00, 8000.00, false, 1700.00, 200.00, 0.00, 'CC001', 'Echo Lab', '2 hours', '2024-01-16'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', '2024-01-22', 'January', 'B002', 'IPD', 'REG002', 'IPD2024002', 'Cash', 'Self Pay', 'Dr. Johnson', 'Oncology', 'Dr. Wilson', 'Radiology', 'Dr. Johnson', 'Oncology', 'CT Scan Chest', 'Radiology', 'CT Scan', 'Active', false, true, 1, 12000.00, 1000.00, 11000.00, false, 2200.00, 0.00, 3000.00, 'CC002', 'Radiology', '4 hours', '2024-01-17'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', '2024-01-25', 'January', 'B003', 'OPD', 'REG003', '', 'Insurance', 'HDFC ERGO', 'Dr. Wilson', 'Gynaecology', 'Dr. Wilson', 'Gynaecology', '', '', 'Ultrasound Pelvis', 'Gynaecology', 'Ultrasound', 'Active', false, false, 1, 3500.00, 200.00, 3300.00, false, 700.00, 50.00, 0.00, 'CC004', 'OPD', '30 minutes', '2024-01-25'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', '2024-01-28', 'January', 'B004', 'OPD', 'REG004', '', 'Cash', 'Self Pay', 'Dr. Brown', 'Neurology', 'Dr. Miller', 'Laboratory', 'Dr. Brown', 'Neurology', 'MRI Brain', 'Radiology', 'MRI Unit', 'Active', true, false, 1, 15000.00, 1000.00, 14000.00, true, 3000.00, 0.00, 0.00, 'CC003', 'MRI Unit', '6 hours', '2024-01-23'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', '2024-01-30', 'January', 'B005', 'IPD', 'REG005', 'IPD2024005', 'Insurance', 'LIC Health', 'Dr. Davis', 'Cardiology', 'Dr. Davis', 'Cardiology', 'Dr. Kumar', 'Emergency', 'Angioplasty', 'Cardiology', 'Cath Lab', 'Active', false, false, 1, 85000.00, 5000.00, 80000.00, true, 17000.00, 25000.00, 0.00, 'CC006', 'Cath Lab', '3 hours', '2024-01-26');

-- Trial Balance sample data
INSERT INTO trial_balance (user_id, category_code, category, grouping_code, grouping, ledger_code, ledger_name, alias_code, alias_name, amount, remarks, primary_cost_driver, category_code_second, category_second, amount_second) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CAT001', 'Medical Equipment', 'GRP001', 'Fixed Assets', 'LED001', 'CT Scanner', 'CT001', 'CT Machine', 2500000.00, 'Main CT scanner', 'Number of scans', 'CAT001', 'Medical Equipment', 2500000.00),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CAT002', 'Pharmacy', 'GRP002', 'Variable Costs', 'LED002', 'Cardiac Medicines', 'CARD001', 'Heart Drugs', 180000.00, 'Monthly pharmacy stock', 'Number of patients', 'CAT002', 'Pharmacy', 180000.00),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CAT003', 'Staff Salaries', 'GRP003', 'Personnel Costs', 'LED003', 'Doctor Salaries', 'DOC001', 'Medical Staff', 450000.00, 'Monthly doctor salaries', 'Number of doctors', 'CAT003', 'Staff Salaries', 450000.00),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CAT004', 'Utilities', 'GRP004', 'Operating Expenses', 'LED004', 'Electricity', 'ELEC001', 'Power Supply', 85000.00, 'Monthly electricity bill', 'kWh consumed', 'CAT004', 'Utilities', 85000.00),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CAT005', 'Administrative', 'GRP005', 'Overhead Costs', 'LED005', 'Office Supplies', 'OFF001', 'Stationery', 25000.00, 'Monthly office expenses', 'Number of staff', 'CAT005', 'Administrative', 25000.00);

-- Expense Wise sample data
INSERT INTO expense_wise (user_id, nature_of_data, ledger_code, ledger_name, alias_name, sub_cost_centre_code, sub_cost_centre, amount, remarks) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Direct Cost', 'LED001', 'Pharmacy Supplies', 'Medical Drugs', 'SCC001', 'Cardiology Pharmacy', 85000.00, 'Cardiac medications and supplies'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Indirect Cost', 'LED002', 'Electricity', 'Power Supply', 'SCC002', 'ICU', 45000.00, 'ICU power consumption'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Direct Cost', 'LED003', 'Medical Consumables', 'Surgical Items', 'SCC003', 'Operation Theatre', 65000.00, 'OT consumables and instruments'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Overhead', 'LED004', 'Administrative Expenses', 'Admin Costs', 'SCC004', 'Administration', 35000.00, 'General administrative expenses'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Direct Cost', 'LED005', 'Laboratory Reagents', 'Lab Supplies', 'SCC005', 'Laboratory', 28000.00, 'Lab testing materials');

-- Variable Cost Bill Wise sample data
INSERT INTO variable_cost_bill_wise (user_id, patient_type, reg_no, ipd_number, bill_no, pharmacy_charged_to_patient, medical_surgical_consumables, implants_and_prosthetics, non_medical_consumables, fee_for_service, incentives_to_doctors, patient_food_beverages, laboratory_test_outsource, other_outsourced_services_1, other_outsourced_services_2, other_outsourced_services_3, brokerage_commission, provision_for_bad_debts, doctor_name, service_name, payor_type) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'IPD', 'REG001', 'IPD2024001', 'B001', 8500.00, 12000.00, 25000.00, 1500.00, 15000.00, 3000.00, 1200.00, 4500.00, 3000.00, 2000.00, 1500.00, 2500.00, 1000.00, 'Dr. Smith', 'Cardiac Surgery', 'Insurance'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OPD', 'REG002', '', 'B002', 3500.00, 2000.00, 0.00, 500.00, 5000.00, 1000.00, 0.00, 1500.00, 800.00, 0.00, 0.00, 500.00, 200.00, 'Dr. Johnson', 'Consultation', 'Cash'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'IPD', 'REG003', 'IPD2024003', 'B003', 15000.00, 18000.00, 45000.00, 2500.00, 25000.00, 5000.00, 2000.00, 8000.00, 5000.00, 3500.00, 2000.00, 4000.00, 2000.00, 'Dr. Brown', 'Neurosurgery', 'Insurance'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OPD', 'REG004', '', 'B004', 2800.00, 1200.00, 0.00, 300.00, 3500.00, 700.00, 0.00, 2000.00, 500.00, 0.00, 0.00, 350.00, 150.00, 'Dr. Wilson', 'Gynecology Consultation', 'Cash'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'IPD', 'REG005', 'IPD2024005', 'B005', 22000.00, 28000.00, 65000.00, 3000.00, 35000.00, 7000.00, 2500.00, 12000.00, 8000.00, 5000.00, 3000.00, 6000.00, 3000.00, 'Dr. Davis', 'Oncology Treatment', 'Insurance');

-- HR Data sample data
INSERT INTO hr_data (user_id, nature_of_data, group_code, group_name, sub_group_code, sub_group_name, associate_code, associate_name, period, date_of_joining, date_of_resignation, working_period, department, sub_department, designation, efforts_category, master_for_multiple, nature_of_allocation, efforts_allocation, efforts_sub_allocation, utilization, available_hours, actual_hours, cost_centre_code, cost_centre_name, sub_cost_centre_code, sub_cost_centre_name, basic_pay, allowances, other_benefits, overtime, bonus, epf, esic, any_other_contribution, gross_total, deduction, net_salary, no_of_headcount) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Medical Staff', 'GRP001', 'Doctors', 'SG001', 'Senior Consultants', 'EMP001', 'Dr. Smith', 'January 2024', '2020-01-15', NULL, '4 years', 'Cardiology', 'Interventional', 'Senior Consultant', 'Clinical', 'Yes', 'Direct', 100.00, 80.00, 85.00, 160, 136, 'CC001', 'Cardiology Dept', 'SCC001', 'Cath Lab', 180000.00, 45000.00, 25000.00, 8000.00, 15000.00, 18000.00, 2500.00, 3000.00, 296500.00, 23500.00, 273000.00, 1),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Nursing Staff', 'GRP002', 'Nurses', 'SG002', 'Staff Nurses', 'EMP002', 'Sarah Johnson', 'January 2024', '2019-03-20', NULL, '5 years', 'ICU', 'Cardiac ICU', 'Senior Staff Nurse', 'Clinical', 'No', 'Direct', 100.00, 100.00, 95.00, 160, 152, 'CC002', 'ICU', 'SCC002', 'Cardiac ICU', 45000.00, 12000.00, 8000.00, 5000.00, 3000.00, 4500.00, 800.00, 1000.00, 79300.00, 6300.00, 73000.00, 1),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Support Staff', 'GRP003', 'Technicians', 'SG003', 'Lab Technicians', 'EMP003', 'Mike Brown', 'January 2024', '2021-06-10', NULL, '3 years', 'Laboratory', 'Biochemistry', 'Senior Technician', 'Technical', 'No', 'Indirect', 80.00, 60.00, 90.00, 160, 144, 'CC003', 'Laboratory', 'SCC003', 'Biochemistry Lab', 35000.00, 8000.00, 5000.00, 3000.00, 2000.00, 3500.00, 600.00, 800.00, 57900.00, 4900.00, 53000.00, 1),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Administrative', 'GRP004', 'Administration', 'SG004', 'Finance', 'EMP004', 'Lisa Davis', 'January 2024', '2020-11-15', NULL, '3 years', 'Finance', 'Accounts', 'Finance Manager', 'Administrative', 'No', 'Indirect', 100.00, 100.00, 92.00, 160, 147, 'CC005', 'Administration', 'SCC005', 'Finance Dept', 75000.00, 18000.00, 12000.00, 4000.00, 6000.00, 7500.00, 1200.00, 1500.00, 125200.00, 10200.00, 115000.00, 1),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Medical Staff', 'GRP001', 'Doctors', 'SG005', 'Junior Consultants', 'EMP005', 'Dr. Kumar', 'January 2024', '2022-09-01', NULL, '1.5 years', 'Emergency', 'Emergency Medicine', 'Emergency Physician', 'Clinical', 'No', 'Direct', 100.00, 90.00, 88.00, 160, 141, 'CC006', 'Emergency Dept', 'SCC006', 'Emergency Room', 120000.00, 30000.00, 18000.00, 12000.00, 8000.00, 12000.00, 1800.00, 2000.00, 203800.00, 15800.00, 188000.00, 1);

-- Occupancy Register sample data
INSERT INTO occupancy_register (user_id, nature_of_data, uhid, patient_admission_date, patient_discharge_date, ipd_number, date_of_final_bill, bill_no, ward_code, ward_name, bed_number, length_of_stay_in_hours, bed_assign_datetime, bed_release_datetime, ward_category_code, bed_category_name, payor_type, service_name) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Patient Stay', 'UH001', '2024-01-15', '2024-01-20', 'IPD2024001', '2024-01-20', 'B001', 'ICU01', 'Cardiac ICU', 'ICU-01', 120, '2024-01-15 10:00:00', '2024-01-20 10:00:00', 'ICU', 'ICU Bed', 'Insurance', 'Cardiac Monitoring'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Patient Stay', 'UH002', '2024-01-18', '2024-01-22', 'IPD2024002', '2024-01-22', 'B002', 'GW01', 'General Ward', 'GW-15', 96, '2024-01-18 14:00:00', '2024-01-22 14:00:00', 'GEN', 'General Bed', 'Cash', 'General Care'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Patient Stay', 'UH003', '2024-01-20', '2024-01-25', 'IPD2024003', '2024-01-25', 'B003', 'PW01', 'Private Ward', 'PW-08', 120, '2024-01-20 16:00:00', '2024-01-25 16:00:00', 'PVT', 'Private Bed', 'Insurance', 'Private Care'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Patient Stay', 'UH004', '2024-01-22', '2024-01-27', 'IPD2024004', '2024-01-27', 'B004', 'ICU02', 'Medical ICU', 'ICU-05', 120, '2024-01-22 08:00:00', '2024-01-27 08:00:00', 'ICU', 'ICU Bed', 'Cash', 'Critical Care'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Patient Stay', 'UH005', '2024-01-25', '2024-01-30', 'IPD2024005', '2024-01-30', 'B005', 'GW02', 'General Ward 2', 'GW2-12', 120, '2024-01-25 16:00:00', '2024-01-30 16:00:00', 'GEN', 'General Bed', 'Insurance', 'General Care');

-- OT Register sample data
INSERT INTO ot_register (user_id, serial_no, uhid, patient_bill_number, patient_admission_date, patient_discharge_date, ipd_number, service_date, service_name, performing_doctor_name, performing_doctor_department, anaesthetist_name, anesthesia_type, type_of_procedure, nature_of_procedure, operation_theatre_code, operation_theatre_name, on_table_time, incision_time, finish_time, procedure_time, change_over_time, total_time, remarks, payor_type, service_name_second) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OT001', 'UH001', 'B001', '2024-01-15', '2024-01-20', 'IPD2024001', '2024-01-16', 'Cardiac Catheterization', 'Dr. Smith', 'Cardiology', 'Dr. Anesthesia', 'General', 'Interventional', 'Elective', 'OT01', 'Cath Lab 1', '09:00:00', '09:15:00', '11:30:00', '135 min', '30 min', '165 min', 'Successful procedure', 'Insurance', 'Cardiac Catheterization'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OT002', 'UH002', 'B002', '2024-01-18', '2024-01-22', 'IPD2024002', '2024-01-19', 'Angioplasty', 'Dr. Smith', 'Cardiology', 'Dr. Anesthesia', 'Local', 'Interventional', 'Emergency', 'OT01', 'Cath Lab 1', '14:00:00', '14:10:00', '16:45:00', '155 min', '25 min', '180 min', 'Emergency procedure completed', 'Cash', 'Angioplasty'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OT003', 'UH003', 'B003', '2024-01-20', '2024-01-25', 'IPD2024003', '2024-01-21', 'Pacemaker Implantation', 'Dr. Johnson', 'Cardiology', 'Dr. Anesthesia2', 'Local', 'Implantation', 'Elective', 'OT02', 'Cath Lab 2', '10:30:00', '10:45:00', '12:15:00', '90 min', '20 min', '110 min', 'Pacemaker implanted successfully', 'Insurance', 'Pacemaker Implantation'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OT004', 'UH004', 'B004', '2024-01-22', '2024-01-27', 'IPD2024004', '2024-01-23', 'Coronary Bypass', 'Dr. Brown', 'Cardiology', 'Dr. Anesthesia', 'General', 'Surgical', 'Elective', 'OT03', 'Main OT 1', '08:00:00', '08:30:00', '14:00:00', '330 min', '45 min', '375 min', 'Complex bypass surgery completed', 'Cash', 'Coronary Bypass'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'OT005', 'UH005', 'B005', '2024-01-25', '2024-01-30', 'IPD2024005', '2024-01-26', 'Valve Replacement', 'Dr. Brown', 'Cardiology', 'Dr. Anesthesia3', 'General', 'Surgical', 'Elective', 'OT03', 'Main OT 1', '09:00:00', '09:45:00', '15:30:00', '345 min', '40 min', '385 min', 'Valve replacement successful', 'Insurance', 'Valve Replacement');

-- Consumption Data sample data
INSERT INTO consumption_data (user_id, serial_no, cost_centre_code, cost_centre, sub_cost_centre_code, sub_cost_centre, transaction_date, from_store, to_store, sku_name, ledger_code, ledger_name, unit_of_measurement, quantity, rate, transaction_value, remarks) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'C001', 'CC001', 'Cardiology', 'SCC001', 'Cath Lab', '2024-01-15', 'Central Pharmacy', 'Cath Lab Store', 'Cardiac Stents', 'LED001', 'Medical Implants', 'Pieces', 5.00, 25000.00, 125000.00, 'Cardiac stent consumption'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'C002', 'CC002', 'Laboratory', 'SCC002', 'Biochemistry', '2024-01-16', 'Central Store', 'Lab Store', 'Lab Reagents', 'LED002', 'Laboratory Supplies', 'Bottles', 20.00, 500.00, 10000.00, 'Monthly reagent supply'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'C003', 'CC003', 'Operation Theatre', 'SCC003', 'Main OT', '2024-01-17', 'Surgical Store', 'OT Store', 'Surgical Instruments', 'LED003', 'Surgical Supplies', 'Sets', 15.00, 2000.00, 30000.00, 'OT instrument consumption'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'C004', 'CC004', 'ICU', 'SCC004', 'Cardiac ICU', '2024-01-18', 'Central Pharmacy', 'ICU Store', 'ICU Medicines', 'LED004', 'Critical Care Drugs', 'Vials', 50.00, 800.00, 40000.00, 'ICU medication consumption'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'C005', 'CC005', 'Radiology', 'SCC005', 'CT Scan', '2024-01-19', 'Central Store', 'Radiology Store', 'Contrast Media', 'LED005', 'Radiology Supplies', 'Bottles', 10.00, 1500.00, 15000.00, 'CT contrast consumption');

-- Connected Load sample data
INSERT INTO connected_load (user_id, serial_no, sub_cost_centre_code, sub_cost_centre, connected_load, running_load, standby_load, days, hours, total_load_kg, remarks) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CL001', 'SCC001', 'Cath Lab', 150.00, 120.00, 25.00, 31, 12, 44640.00, 'High usage during procedures'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CL002', 'SCC002', 'ICU', 200.00, 180.00, 40.00, 31, 24, 133920.00, '24/7 operation'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CL003', 'SCC003', 'OT Complex', 300.00, 250.00, 50.00, 31, 16, 124000.00, 'Multiple OTs running'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CL004', 'SCC004', 'Radiology', 180.00, 150.00, 30.00, 31, 10, 46500.00, 'CT and MRI operations'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'CL005', 'SCC005', 'General Wards', 100.00, 80.00, 20.00, 31, 24, 59520.00, 'Patient care areas');

-- Fixed Asset Register sample data
INSERT INTO fixed_asset_register (user_id, serial_no, sub_cost_centre_code, sub_cost_centre, bio_medical_equipments, engineering_equipments, furniture_fixture, others, remarks) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'FA001', 'SCC001', 'Cath Lab', 2500000.00, 500000.00, 150000.00, 100000.00, 'Cath lab equipment valuation'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'FA002', 'SCC002', 'ICU', 1800000.00, 300000.00, 200000.00, 80000.00, 'ICU equipment and furniture'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'FA003', 'SCC003', 'Laboratory', 1200000.00, 200000.00, 100000.00, 50000.00, 'Lab equipment and setup'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'FA004', 'SCC004', 'Radiology', 3000000.00, 400000.00, 120000.00, 80000.00, 'CT, MRI and X-ray equipment'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'FA005', 'SCC005', 'Operation Theatre', 2200000.00, 600000.00, 180000.00, 120000.00, 'OT equipment and infrastructure');

-- TAT Data sample data
INSERT INTO tat_data (user_id, serial_no, sub_cost_centre_code, sub_cost_centre, tat, remarks) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'TAT001', 'SCC001', 'Laboratory', '2 hours', 'Standard lab test turnaround time'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'TAT002', 'SCC002', 'Radiology', '4 hours', 'CT scan report delivery time'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'TAT003', 'SCC003', 'Pharmacy', '30 minutes', 'Medicine dispensing time'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'TAT004', 'SCC004', 'Emergency', '15 minutes', 'Emergency response time'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'TAT005', 'SCC005', 'OT Booking', '24 hours', 'Surgery scheduling time');

-- Cost Center sample data
INSERT INTO cost_center (user_id, cc_type, cost_centre_code, cost_centre_category, cost_centre, sub_cost_centre_code, sub_cost_centre, alias_code, alias_name, cost_driver, source_of_driver, remarks) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Revenue', 'CC001', 'Clinical', 'Cardiology', 'SCC001', 'Cath Lab', 'CATH01', 'Cardiac Catheterization', 'Number of procedures', 'OT Register', 'Primary cardiac intervention center'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Support', 'CC002', 'Support', 'Laboratory', 'SCC002', 'Biochemistry', 'LAB01', 'Bio Lab', 'Number of tests', 'Lab Register', 'Main biochemistry laboratory'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Revenue', 'CC003', 'Clinical', 'Radiology', 'SCC003', 'CT Scan', 'RAD01', 'CT Scanner', 'Number of scans', 'Radiology Register', 'CT imaging department'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Revenue', 'CC004', 'Clinical', 'ICU', 'SCC004', 'Cardiac ICU', 'ICU01', 'CICU', 'Bed days', 'Occupancy Register', 'Cardiac intensive care unit'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'Support', 'CC005', 'Support', 'Administration', 'SCC005', 'Finance', 'ADM01', 'Finance Dept', 'Number of transactions', 'Finance System', 'Financial management department');

-- Secondary Cost Driver sample data
INSERT INTO secondary_cost_driver (user_id, serial_no, sub_cost_centre_code, sub_cost_centre, nursing_hostel_occupancy, doctors_hostel_occupancy, staff_accommodation_occupancy, frequency_of_audit, no_of_it_users, no_of_transaction_in_finance_billing, list_of_equipment_for_loan, no_of_trips_km, no_of_laboratory_test, no_of_sample_collected_report_dispatch, no_of_home_sample_collection, no_of_radiology_test, no_of_neuro_test, no_of_cardiac_test, no_of_nuclear_medicine_test, no_of_ivf_consultation, ot_time_hours, ccu_occupancy, micu_occupancy, picu_occupancy, nicu_occupancy, hdu_occupancy, isolation_room_occupancy, gw_occupancy, pwsr_occupancy, swts_occupancy, dw_occupancy, head_office, other_unit_1_allocation_ratio, other_unit_2_allocation_ratio, other_unit_3_allocation_ratio, other_unit_4_allocation_ratio, other_unit_5_allocation_ratio, no_of_patient_op_ip, no_of_corporate_patient_op_ip, no_of_institutional_patient_op_ip, no_of_international_patient_op_ip, no_of_ip_patients, no_of_credit_ip_patients, surgical_store_issue_ratio, central_store_issue_ratio, non_surgical_store_issue_ratio, stationery_housekeeping_issue_ratio, no_of_doctors, doctor_fee_for_service_ratio, consultant_retainer_fee_mg_bonus_ratio, no_of_nursing_staff, nursing_station_1_for_care_units, nursing_station_2_for_care_units, nursing_station_3_for_care_units, nursing_station_4_for_care_units, nursing_station_5_for_care_units, service_under_op_billing_1, service_under_op_billing_2, service_under_op_billing_3, service_under_op_billing_4, brokerage_commission, no_of_cssd_set_issued, no_of_diet_served, no_of_ward_boy, no_of_housekeeping_staff, no_of_fumigation_cycle_performed, volume_of_cloth_load, efforts_of_supply_chain_department, area_in_sq_meter, no_of_security_staff_deployed, actual_water_utilization, actual_gas_utilization, actual_vacuum_utilization, civil) VALUES
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'SCD001', 'SCC001', 'Cath Lab', 0, 0, 0, 2, 15, 450, 'Cath Lab Equipment', 0, 0, 0, 0, 25, 0, 85, 0, 0, 180.00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 450, 120, 80, 15, 180, 120, 0.80, 0.60, 0.40, 0.20, 8, 0.15, 0.25, 25, 8, 8, 9, 0, 0, 150, 120, 80, 0, 15000.00, 85, 540, 12, 8, 4, 250, 0.30, 1200.00, 6, 15000.00, 8000.00, 2000.00, 'Good condition'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'SCD002', 'SCC002', 'ICU', 0, 0, 0, 1, 12, 300, 'ICU Equipment', 0, 0, 0, 0, 15, 0, 45, 0, 0, 0.00, 45, 20, 15, 10, 8, 5, 0, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 280, 80, 50, 10, 120, 80, 0.60, 0.80, 0.30, 0.15, 6, 0.20, 0.30, 35, 12, 12, 11, 0, 0, 80, 60, 40, 0, 8000.00, 45, 360, 8, 6, 2, 180, 0.20, 800.00, 4, 12000.00, 6000.00, 1500.00, 'Excellent condition'),
('0a8994d0-f153-4ac8-8182-6e1743432a70', 'SCD003', 'SCC003', 'Laboratory', 0, 0, 0, 3, 8, 200, 'Lab Equipment', 0, 850, 850, 25, 120, 15, 30, 5, 0, 0.00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 320, 60, 40, 8, 0, 0, 0.70, 0.90, 0.50, 0.25, 4, 0.10, 0.15, 18, 6, 6, 6, 0, 0, 200, 180, 120, 0, 5000.00, 0, 0, 4, 3, 1, 120, 0.15, 600.00, 2, 8000.00, 3000.00, 800.00, 'Good condition');
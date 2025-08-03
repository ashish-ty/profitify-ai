"""
Script to add sample data for the new table structure
"""
import asyncio
from supabase import create_client
from app.core.config import settings
from datetime import datetime, date

async def add_sample_data_new_tables():
    print("📊 Adding Sample Data to New Table Structure...")
    print("=" * 50)
    
    try:
        # Initialize Supabase client
        supabase = create_client(settings.supabase_url, settings.supabase_service_key)
        
        # Use existing demo user ID
        user_id = "0a8994d0-f153-4ac8-8182-6e1743432a70"
        
        print("1. Adding Service Register data...")
        service_register_data = [
            {
                "user_id": user_id,
                "date_of_final_bill": "2024-01-20",
                "month": "January",
                "bill_no": "B001",
                "patient_type": "IPD",
                "reg_no": "REG001",
                "ipd_number": "IPD2024001",
                "payor_type": "Insurance",
                "payor_alias_name": "Star Health",
                "admitting_doctor_name": "Dr. Smith",
                "admitting_doctor_department": "Cardiology",
                "performing_doctor_name": "Dr. Smith",
                "performing_doctor_department": "Cardiology",
                "referring_doctor_name": "Dr. Brown",
                "referring_doctor_department": "General Medicine",
                "service_name": "Echocardiography",
                "service_department": "Cardiology",
                "service_sub_department": "Echo Lab",
                "service_status": "Active",
                "is_packaged": False,
                "is_outsourced": False,
                "quantity": 1,
                "gross_amount": 8500.00,
                "discount": 500.00,
                "net_amount": 8000.00,
                "emergency_charges_applied": False,
                "performing_doctor_share": 1700.00,
                "pharmacy_material_cost": 200.00,
                "outsource_share": 0.00,
                "sub_cost_centre_code": "CC001",
                "sub_cost_centre_name": "Echo Lab",
                "service_tat": "2 hours",
                "service_date": "2024-01-16"
            },
            {
                "user_id": user_id,
                "date_of_final_bill": "2024-01-25",
                "month": "January",
                "bill_no": "B002",
                "patient_type": "OPD",
                "reg_no": "REG002",
                "ipd_number": "",
                "payor_type": "Cash",
                "payor_alias_name": "Self Pay",
                "admitting_doctor_name": "Dr. Wilson",
                "admitting_doctor_department": "Gynaecology",
                "performing_doctor_name": "Dr. Wilson",
                "performing_doctor_department": "Gynaecology",
                "referring_doctor_name": "",
                "referring_doctor_department": "",
                "service_name": "Ultrasound Pelvis",
                "service_department": "Gynaecology",
                "service_sub_department": "Ultrasound",
                "service_status": "Active",
                "is_packaged": False,
                "is_outsourced": False,
                "quantity": 1,
                "gross_amount": 3500.00,
                "discount": 200.00,
                "net_amount": 3300.00,
                "emergency_charges_applied": False,
                "performing_doctor_share": 700.00,
                "pharmacy_material_cost": 50.00,
                "outsource_share": 0.00,
                "sub_cost_centre_code": "CC004",
                "sub_cost_centre_name": "OPD",
                "service_tat": "30 minutes",
                "service_date": "2024-01-25"
            }
        ]
        
        for service in service_register_data:
            try:
                supabase.table("service_register").insert(service).execute()
                print(f"✅ Added service register entry for {service['bill_no']}")
            except Exception as e:
                print(f"⚠️  Service register entry might already exist: {e}")
        
        print("2. Adding Trial Balance data...")
        trial_balance_data = [
            {
                "user_id": user_id,
                "category_code": "CAT001",
                "category": "Medical Equipment",
                "grouping_code": "GRP001",
                "grouping": "Fixed Assets",
                "ledger_code": "LED001",
                "ledger_name": "CT Scanner",
                "alias_code": "CT001",
                "alias_name": "CT Machine",
                "amount": 2500000.00,
                "remarks": "Main CT scanner",
                "primary_cost_driver": "Number of scans",
                "category_code_second": "CAT001",
                "category_second": "Medical Equipment",
                "amount_second": 2500000.00
            },
            {
                "user_id": user_id,
                "category_code": "CAT002",
                "category": "Pharmacy",
                "grouping_code": "GRP002",
                "grouping": "Variable Costs",
                "ledger_code": "LED002",
                "ledger_name": "Cardiac Medicines",
                "alias_code": "CARD001",
                "alias_name": "Heart Drugs",
                "amount": 180000.00,
                "remarks": "Monthly pharmacy stock",
                "primary_cost_driver": "Number of patients",
                "category_code_second": "CAT002",
                "category_second": "Pharmacy",
                "amount_second": 180000.00
            }
        ]
        
        for trial in trial_balance_data:
            try:
                supabase.table("trial_balance").insert(trial).execute()
                print(f"✅ Added trial balance entry for {trial['category']}")
            except Exception as e:
                print(f"⚠️  Trial balance entry might already exist: {e}")
        
        print("3. Adding Expense Wise data...")
        expense_wise_data = [
            {
                "user_id": user_id,
                "nature_of_data": "Direct Cost",
                "ledger_code": "LED001",
                "ledger_name": "Pharmacy Supplies",
                "alias_name": "Medical Drugs",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Cardiology Pharmacy",
                "amount": 85000.00,
                "remarks": "Cardiac medications and supplies"
            },
            {
                "user_id": user_id,
                "nature_of_data": "Indirect Cost",
                "ledger_code": "LED002",
                "ledger_name": "Electricity",
                "alias_name": "Power Supply",
                "sub_cost_centre_code": "SCC002",
                "sub_cost_centre": "ICU",
                "amount": 45000.00,
                "remarks": "ICU power consumption"
            }
        ]
        
        for expense in expense_wise_data:
            try:
                supabase.table("expense_wise").insert(expense).execute()
                print(f"✅ Added expense wise entry for {expense['ledger_name']}")
            except Exception as e:
                print(f"⚠️  Expense wise entry might already exist: {e}")
        
        print("4. Adding Variable Cost Bill Wise data...")
        variable_cost_data = [
            {
                "user_id": user_id,
                "patient_type": "IPD",
                "reg_no": "REG001",
                "ipd_number": "IPD2024001",
                "bill_no": "B001",
                "pharmacy_charged_to_patient": 8500.00,
                "medical_surgical_consumables": 12000.00,
                "implants_and_prosthetics": 25000.00,
                "non_medical_consumables": 1500.00,
                "fee_for_service": 15000.00,
                "incentives_to_doctors": 3000.00,
                "patient_food_beverages": 1200.00,
                "laboratory_test_outsource": 4500.00,
                "other_outsourced_services_1": 3000.00,
                "other_outsourced_services_2": 2000.00,
                "other_outsourced_services_3": 1500.00,
                "brokerage_commission": 2500.00,
                "provision_for_bad_debts": 1000.00,
                "doctor_name": "Dr. Smith",
                "service_name": "Cardiac Surgery",
                "payor_type": "Insurance"
            }
        ]
        
        for variable in variable_cost_data:
            try:
                supabase.table("variable_cost_bill_wise").insert(variable).execute()
                print(f"✅ Added variable cost entry for {variable['bill_no']}")
            except Exception as e:
                print(f"⚠️  Variable cost entry might already exist: {e}")
        
        print("5. Adding HR data...")
        hr_data = [
            {
                "user_id": user_id,
                "nature_of_data": "Medical Staff",
                "group_code": "GRP001",
                "group_name": "Doctors",
                "sub_group_code": "SG001",
                "sub_group_name": "Senior Consultants",
                "associate_code": "EMP001",
                "associate_name": "Dr. Smith",
                "period": "January 2024",
                "date_of_joining": "2020-01-15",
                "date_of_resignation": None,
                "working_period": "4 years",
                "department": "Cardiology",
                "sub_department": "Interventional",
                "designation": "Senior Consultant",
                "efforts_category": "Clinical",
                "master_for_multiple": "Yes",
                "nature_of_allocation": "Direct",
                "efforts_allocation": 100.00,
                "efforts_sub_allocation": 80.00,
                "utilization": 85.00,
                "available_hours": 160,
                "actual_hours": 136,
                "cost_centre_code": "CC001",
                "cost_centre_name": "Cardiology Dept",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre_name": "Cath Lab",
                "basic_pay": 180000.00,
                "allowances": 45000.00,
                "other_benefits": 25000.00,
                "overtime": 8000.00,
                "bonus": 15000.00,
                "epf": 18000.00,
                "esic": 2500.00,
                "any_other_contribution": 3000.00,
                "gross_total": 296500.00,
                "deduction": 23500.00,
                "net_salary": 273000.00,
                "no_of_headcount": 1
            }
        ]
        
        for hr in hr_data:
            try:
                supabase.table("hr_data").insert(hr).execute()
                print(f"✅ Added HR data for {hr['associate_name']}")
            except Exception as e:
                print(f"⚠️  HR data might already exist: {e}")
        
        print("6. Adding Occupancy Register data...")
        occupancy_data = [
            {
                "user_id": user_id,
                "nature_of_data": "Patient Stay",
                "uhid": "UH001",
                "patient_admission_date": "2024-01-15",
                "patient_discharge_date": "2024-01-20",
                "ipd_number": "IPD2024001",
                "date_of_final_bill": "2024-01-20",
                "bill_no": "B001",
                "ward_code": "ICU01",
                "ward_name": "Cardiac ICU",
                "bed_number": "ICU-01",
                "length_of_stay_in_hours": 120,
                "bed_assign_datetime": "2024-01-15T10:00:00Z",
                "bed_release_datetime": "2024-01-20T10:00:00Z",
                "ward_category_code": "ICU",
                "bed_category_name": "ICU Bed",
                "payor_type": "Insurance",
                "service_name": "Cardiac Monitoring"
            }
        ]
        
        for occupancy in occupancy_data:
            try:
                supabase.table("occupancy_register").insert(occupancy).execute()
                print(f"✅ Added occupancy register entry for {occupancy['uhid']}")
            except Exception as e:
                print(f"⚠️  Occupancy register entry might already exist: {e}")
        
        print("7. Adding OT Register data...")
        ot_data = [
            {
                "user_id": user_id,
                "serial_no": "OT001",
                "uhid": "UH001",
                "patient_bill_number": "B001",
                "patient_admission_date": "2024-01-15",
                "patient_discharge_date": "2024-01-20",
                "ipd_number": "IPD2024001",
                "service_date": "2024-01-16",
                "service_name": "Cardiac Catheterization",
                "performing_doctor_name": "Dr. Smith",
                "performing_doctor_department": "Cardiology",
                "anaesthetist_name": "Dr. Anesthesia",
                "anesthesia_type": "General",
                "type_of_procedure": "Interventional",
                "nature_of_procedure": "Elective",
                "operation_theatre_code": "OT01",
                "operation_theatre_name": "Cath Lab 1",
                "on_table_time": "09:00:00",
                "incision_time": "09:15:00",
                "finish_time": "11:30:00",
                "procedure_time": "135 min",
                "change_over_time": "30 min",
                "total_time": "165 min",
                "remarks": "Successful procedure",
                "payor_type": "Insurance",
                "service_name_second": "Cardiac Catheterization"
            }
        ]
        
        for ot in ot_data:
            try:
                supabase.table("ot_register").insert(ot).execute()
                print(f"✅ Added OT register entry for {ot['serial_no']}")
            except Exception as e:
                print(f"⚠️  OT register entry might already exist: {e}")
        
        print("8. Adding remaining metadata tables...")
        
        # Consumption Data
        consumption_data = [
            {
                "user_id": user_id,
                "serial_no": "C001",
                "cost_centre_code": "CC001",
                "cost_centre": "Cardiology",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Cath Lab",
                "transaction_date": "2024-01-15",
                "from_store": "Central Pharmacy",
                "to_store": "Cath Lab Store",
                "sku_name": "Cardiac Stents",
                "ledger_code": "LED001",
                "ledger_name": "Medical Implants",
                "unit_of_measurement": "Pieces",
                "quantity": 5.00,
                "rate": 25000.00,
                "transaction_value": 125000.00,
                "remarks": "Cardiac stent consumption"
            }
        ]
        
        for consumption in consumption_data:
            try:
                supabase.table("consumption_data").insert(consumption).execute()
                print(f"✅ Added consumption data for {consumption['sku_name']}")
            except Exception as e:
                print(f"⚠️  Consumption data might already exist: {e}")
        
        # Connected Load
        connected_load_data = [
            {
                "user_id": user_id,
                "serial_no": "CL001",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Cath Lab",
                "connected_load": 150.00,
                "running_load": 120.00,
                "standby_load": 25.00,
                "days": 31,
                "hours": 12,
                "total_load_kg": 44640.00,
                "remarks": "High usage during procedures"
            }
        ]
        
        for load in connected_load_data:
            try:
                supabase.table("connected_load").insert(load).execute()
                print(f"✅ Added connected load data for {load['sub_cost_centre']}")
            except Exception as e:
                print(f"⚠️  Connected load data might already exist: {e}")
        
        # Fixed Asset Register
        fixed_asset_data = [
            {
                "user_id": user_id,
                "serial_no": "FA001",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Cath Lab",
                "bio_medical_equipments": 2500000.00,
                "engineering_equipments": 500000.00,
                "furniture_fixture": 150000.00,
                "others": 100000.00,
                "remarks": "Cath lab equipment valuation"
            }
        ]
        
        for asset in fixed_asset_data:
            try:
                supabase.table("fixed_asset_register").insert(asset).execute()
                print(f"✅ Added fixed asset data for {asset['sub_cost_centre']}")
            except Exception as e:
                print(f"⚠️  Fixed asset data might already exist: {e}")
        
        # TAT Data
        tat_data = [
            {
                "user_id": user_id,
                "serial_no": "TAT001",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Laboratory",
                "tat": "2 hours",
                "remarks": "Standard lab test turnaround time"
            }
        ]
        
        for tat in tat_data:
            try:
                supabase.table("tat_data").insert(tat).execute()
                print(f"✅ Added TAT data for {tat['sub_cost_centre']}")
            except Exception as e:
                print(f"⚠️  TAT data might already exist: {e}")
        
        # Cost Center
        cost_center_data = [
            {
                "user_id": user_id,
                "cc_type": "Revenue",
                "cost_centre_code": "CC001",
                "cost_centre_category": "Clinical",
                "cost_centre": "Cardiology",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Cath Lab",
                "alias_code": "CATH01",
                "alias_name": "Cardiac Catheterization",
                "cost_driver": "Number of procedures",
                "source_of_driver": "OT Register",
                "remarks": "Primary cardiac intervention center"
            }
        ]
        
        for cost_center in cost_center_data:
            try:
                supabase.table("cost_center").insert(cost_center).execute()
                print(f"✅ Added cost center data for {cost_center['cost_centre']}")
            except Exception as e:
                print(f"⚠️  Cost center data might already exist: {e}")
        
        # Secondary Cost Driver
        secondary_cost_data = [
            {
                "user_id": user_id,
                "serial_no": "SCD001",
                "sub_cost_centre_code": "SCC001",
                "sub_cost_centre": "Cath Lab",
                "nursing_hostel_occupancy": 0,
                "doctors_hostel_occupancy": 0,
                "staff_accommodation_occupancy": 0,
                "frequency_of_audit": 2,
                "no_of_it_users": 15,
                "no_of_transaction_in_finance_billing": 450,
                "list_of_equipment_for_loan": "Cath Lab Equipment",
                "no_of_trips_km": 0,
                "no_of_laboratory_test": 0,
                "no_of_sample_collected_report_dispatch": 0,
                "no_of_home_sample_collection": 0,
                "no_of_radiology_test": 25,
                "no_of_neuro_test": 0,
                "no_of_cardiac_test": 85,
                "no_of_nuclear_medicine_test": 0,
                "no_of_ivf_consultation": 0,
                "ot_time_hours": 180.00,
                "no_of_patient_op_ip": 450,
                "no_of_corporate_patient_op_ip": 120,
                "no_of_institutional_patient_op_ip": 80,
                "no_of_international_patient_op_ip": 15,
                "no_of_ip_patients": 180,
                "no_of_credit_ip_patients": 120,
                "surgical_store_issue_ratio": 0.80,
                "central_store_issue_ratio": 0.60,
                "non_surgical_store_issue_ratio": 0.40,
                "stationery_housekeeping_issue_ratio": 0.20,
                "no_of_doctors": 8,
                "doctor_fee_for_service_ratio": 0.15,
                "consultant_retainer_fee_mg_bonus_ratio": 0.25,
                "no_of_nursing_staff": 25,
                "nursing_station_1_for_care_units": 8,
                "nursing_station_2_for_care_units": 8,
                "nursing_station_3_for_care_units": 9,
                "service_under_op_billing_1": 150,
                "service_under_op_billing_2": 120,
                "service_under_op_billing_3": 80,
                "brokerage_commission": 15000.00,
                "no_of_cssd_set_issued": 85,
                "no_of_diet_served": 540,
                "no_of_ward_boy": 12,
                "no_of_housekeeping_staff": 8,
                "no_of_fumigation_cycle_performed": 4,
                "volume_of_cloth_load": 250,
                "efforts_of_supply_chain_department": 0.30,
                "area_in_sq_meter": 1200.00,
                "no_of_security_staff_deployed": 6,
                "actual_water_utilization": 15000.00,
                "actual_gas_utilization": 8000.00,
                "actual_vacuum_utilization": 2000.00,
                "civil": "Good condition"
            }
        ]
        
        for secondary in secondary_cost_data:
            try:
                supabase.table("secondary_cost_driver").insert(secondary).execute()
                print(f"✅ Added secondary cost driver data for {secondary['sub_cost_centre']}")
            except Exception as e:
                print(f"⚠️  Secondary cost driver data might already exist: {e}")
        
        print("\n🎉 Sample data for new tables added successfully!")
        print("\nNew table structure is now ready for use!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")

if __name__ == "__main__":
    asyncio.run(add_sample_data_new_tables())
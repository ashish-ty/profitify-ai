"""
Script to add sample data for testing the application
"""
import asyncio
from supabase import create_client
from app.core.config import settings
from app.core.security import get_password_hash
import uuid

async def add_sample_data():
    print("📊 Adding Sample Data to Medicost.ai...")
    print("=" * 50)
    
    try:
        # Initialize Supabase client
        supabase = create_client(settings.supabase_url, settings.supabase_service_key)
        
        # Create sample user
        print("1. Creating sample user...")
        user_id = "0a8994d0-f153-4ac8-8182-6e1743432a70"
        # sample_user = {
        #     "id": user_id,
        #     "email": "demo@hospital.com",
        #     "name": "Dr. John Smith",
        #     "hospital_name": "City General Hospital",
        #     "password_hash": get_password_hash("demo123")
        # }
        
        # # Check if user already exists
        # existing_user = supabase.table("users").select("*").eq("email", "demo@hospital.com").execute()
        # if existing_user.data:
        #     print("✅ Sample user already exists")
        #     user_id = existing_user.data[0]["id"]
        # else:
        #     result = supabase.table("users").insert(sample_user).execute()
        #     print("✅ Sample user created")
        
        # Add hospital metadata
        print("2. Adding hospital metadata...")
        metadata_entries = [
            {
                "user_id": user_id,
                "month": "January",
                "year": 2024,
                "beds_icu": 20,
                "beds_non_icu": 80,
                "number_of_nurses": 45,
                "resident_doctors": 12,
                "technician_staff": 25
            },
            {
                "user_id": user_id,
                "month": "February",
                "year": 2024,
                "beds_icu": 22,
                "beds_non_icu": 82,
                "number_of_nurses": 47,
                "resident_doctors": 13,
                "technician_staff": 26
            }
        ]
        
        for metadata in metadata_entries:
            try:
                supabase.table("hospital_metadata").insert(metadata).execute()
                print(f"✅ Added metadata for {metadata['month']}")
            except Exception as e:
                print(f"⚠️  Metadata for {metadata['month']} might already exist")
        
        # Add revenue data
        print("3. Adding revenue data...")
        revenue_entries = [
            # January OPD Data
            {
                "user_id": user_id,
                "month": "January",
                "year": 2024,
                "patient_type": "OPD",
                "specialty": "Cardiology",
                "billing_category": "Cash",
                "number_of_patients": 150,
                "gross_amount": 75000,
                "discount": 5000,
                "net_amount": 70000
            },
            {
                "user_id": user_id,
                "month": "January",
                "year": 2024,
                "patient_type": "OPD",
                "specialty": "Cardiology",
                "billing_category": "Credit",
                "number_of_patients": 100,
                "gross_amount": 60000,
                "discount": 8000,
                "net_amount": 52000
            },
            # January IPD Data
            {
                "user_id": user_id,
                "month": "January",
                "year": 2024,
                "patient_type": "IPD",
                "specialty": "Cardiology",
                "billing_category": "Cash",
                "number_of_patients": 45,
                "bed_days_icu": 120,
                "bed_days_non_icu": 200,
                "gross_amount": 180000,
                "discount": 15000,
                "net_amount": 165000
            },
            # February Data
            {
                "user_id": user_id,
                "month": "February",
                "year": 2024,
                "patient_type": "OPD",
                "specialty": "Oncology",
                "billing_category": "Cash",
                "number_of_patients": 120,
                "gross_amount": 90000,
                "discount": 6000,
                "net_amount": 84000
            }
        ]
        
        for revenue in revenue_entries:
            try:
                supabase.table("revenue_data").insert(revenue).execute()
                print(f"✅ Added revenue data for {revenue['month']} - {revenue['specialty']}")
            except Exception as e:
                print(f"⚠️  Revenue data might already exist: {e}")
        
        # Add expense data
        print("4. Adding expense data...")
        expense_entries = [
            {
                "user_id": user_id,
                "month": "January",
                "year": 2024,
                "pharmacy": 85000,
                "material_non_medical": 25000,
                "doctor_share": 120000,
                "salary_wages": 180000,
                "power_fuel": 35000,
                "admin_financial": 28000,
                "repair_maintenance": 15000,
                "sales_marketing": 12000,
                "depreciation": 22000,
                "total_expenses": 522000
            },
            {
                "user_id": user_id,
                "month": "February",
                "year": 2024,
                "pharmacy": 92000,
                "material_non_medical": 27000,
                "doctor_share": 125000,
                "salary_wages": 185000,
                "power_fuel": 38000,
                "admin_financial": 30000,
                "repair_maintenance": 18000,
                "sales_marketing": 14000,
                "depreciation": 22000,
                "total_expenses": 551000
            }
        ]
        
        for expense in expense_entries:
            try:
                supabase.table("expense_data").insert(expense).execute()
                print(f"✅ Added expense data for {expense['month']}")
            except Exception as e:
                print(f"⚠️  Expense data for {expense['month']} might already exist")
        
        # print("\n🎉 Sample data added successfully!")
        # print("\nSample Login Credentials:")
        # print("Email: demo@hospital.com")
        # print("Password: demo123")
        print("\nYou can now test the application with real data!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")

if __name__ == "__main__":
    asyncio.run(add_sample_data())
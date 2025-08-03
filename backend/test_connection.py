"""
Test script to verify backend setup and database connection
"""
import asyncio
import os
from dotenv import load_dotenv
from supabase import create_client
from app.core.config import settings

load_dotenv()

async def test_setup():
    print("🔧 Testing Profitify.ai Backend Setup...")
    print("=" * 50)
    
    # Test 1: Environment Variables
    print("1. Testing Environment Variables...")
    required_vars = [
        'SUPABASE_URL',
        'SUPABASE_KEY', 
    ]
    
    missing_vars = []
    for var in required_vars:
        if not getattr(settings, var.lower(), None):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ All environment variables configured")
    
    # Test 2: Supabase Connection
    print("\n2. Testing Supabase Connection...")
    try:
        supabase = create_client(settings.supabase_url, settings.supabase_key)
        
        # Test basic connection
        response = supabase.table('users').select('count').execute()
        print("✅ Supabase connection successful")
        
        # Test new tables exist
        new_tables = [
            'users',
            # Revenue Tab
            'service_register',
            # Expense Tab
            'trial_balance',
            'expense_wise', 
            'variable_cost_bill_wise',
            'hr_data',
            # Metadata Tab
            'occupancy_register',
            'ot_register',
            'consumption_data',
            'connected_load',
            'fixed_asset_register',
            'tat_data',
            'cost_center',
            'secondary_cost_driver'
        ]
        
        for table in tables:
            try:
                supabase.table(table).select('count').execute()
                print(f"✅ Table '{table}' exists")
            except Exception as e:
                print(f"❌ Table '{table}' missing or inaccessible: {e}")
        
        # Test sample data exists
        print("\n3. Testing Sample Data...")
        sample_data_tables = {
            'service_register': 'Service Register',
            'trial_balance': 'Trial Balance',
            'expense_wise': 'Expense Wise',
            'variable_cost_bill_wise': 'Variable Cost Bill Wise',
            'hr_data': 'HR Data',
            'occupancy_register': 'Occupancy Register',
            'ot_register': 'OT Register',
            'consumption_data': 'Consumption Data',
            'connected_load': 'Connected Load',
            'fixed_asset_register': 'Fixed Asset Register',
            'tat_data': 'TAT Data',
            'cost_center': 'Cost Center',
            'secondary_cost_driver': 'Secondary Cost Driver'
        }
        
        for table_name, display_name in sample_data_tables.items():
            try:
                result = supabase.table(table_name).select('count').execute()
                count = len(result.data) if result.data else 0
                if count > 0:
                    print(f"✅ {display_name}: {count} records")
                else:
                    print(f"⚠️  {display_name}: No sample data found")
            except Exception as e:
                print(f"❌ {display_name}: Error accessing table - {e}")
                
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return False
    
    # Test 4: FastAPI Dependencies
    print("\n4. Testing FastAPI Dependencies...")
    try:
        from fastapi import FastAPI
        from app.main import app
        from app.routers import new_tables
        print("✅ FastAPI imports successful")
        print("✅ New tables router imported successfully")
    except Exception as e:
        print(f"❌ FastAPI import failed: {e}")
        return False
    
    # Test 5: New Table Models
    print("\n5. Testing New Table Models...")
    try:
        from app.models.new_tables import (
            ServiceRegisterCreate, TrialBalanceCreate, ExpenseWiseCreate,
            VariableCostBillWiseCreate, HRDataCreate, OccupancyRegisterCreate,
            OTRegisterCreate, ConsumptionDataCreate, ConnectedLoadCreate,
            FixedAssetRegisterCreate, TATDataCreate, CostCenterCreate,
            SecondaryCostDriverCreate
        )
        print("✅ All new table models imported successfully")
    except Exception as e:
        print(f"❌ New table models import failed: {e}")
        return False
    
    print("\n🎉 Backend setup test completed successfully!")
    print("\nNext steps:")
    print("1. Start the backend: python run.py")
    print("2. Visit http://localhost:8000/docs to see API documentation")
    print("3. Test the new table endpoints at http://localhost:8000/api/new-tables/")
    print("4. Test the frontend at http://localhost:5173")
    print("\nNew Table Structure:")
    print("📊 Revenue Tab: 1 table (Service Register)")
    print("💰 Expense Tab: 4 tables (Trial Balance, Expense Wise, Variable Cost, HR)")
    print("🏥 Metadata Tab: 8 tables (Occupancy, OT, Consumption, Power, Assets, TAT, Cost Centers, Drivers)")
    
    return True

if __name__ == "__main__":
    asyncio.run(test_setup())
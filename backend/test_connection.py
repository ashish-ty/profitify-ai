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
    print("🔧 Testing Medicost.ai Backend Setup...")
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
        
        # Test tables exist
        tables = ['users', 'hospital_metadata', 'revenue_data', 'expense_data']
        for table in tables:
            try:
                supabase.table(table).select('count').execute()
                print(f"✅ Table '{table}' exists")
            except Exception as e:
                print(f"❌ Table '{table}' missing or inaccessible: {e}")
                
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return False
    
    # Test 3: FastAPI Dependencies
    print("\n3. Testing FastAPI Dependencies...")
    try:
        from fastapi import FastAPI
        from app.main import app
        print("✅ FastAPI imports successful")
    except Exception as e:
        print(f"❌ FastAPI import failed: {e}")
        return False
    
    print("\n🎉 Backend setup test completed successfully!")
    print("\nNext steps:")
    print("1. Start the backend: python run.py")
    print("2. Visit http://localhost:8000/docs to see API documentation")
    print("3. Test the frontend at http://localhost:5173")
    
    return True

if __name__ == "__main__":
    asyncio.run(test_setup())
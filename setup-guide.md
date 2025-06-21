# Medicost.ai Complete Setup Guide

## 🚀 Step-by-Step Setup Instructions

### Step 1: Supabase Project Setup

1. **Create Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up or log in to your account
   - Click "New Project"

2. **Create New Project**
   - Choose your organization
   - Enter project name: `medicost-ai`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

3. **Get Project Credentials**
   - Go to Settings → API
   - Copy the following values:
     - Project URL
     - Project API Key (anon public)
     - Project API Key (service_role) - **Keep this secret!**

### Step 2: Database Schema Setup

1. **Open SQL Editor**
   - In your Supabase dashboard, go to "SQL Editor"
   - Click "New Query"

2. **Run the Database Schema**
   - Copy the entire content from `supabase/migrations/20250614175748_cool_desert.sql`
   - Paste it in the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see these tables:
     - `users`
     - `hospital_metadata`
     - `revenue_data`
     - `expense_data`

### Step 3: Backend Configuration

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   JWT_SECRET_KEY=your-super-secret-jwt-key-here
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Generate JWT Secret Key**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Use this output as your JWT_SECRET_KEY

### Step 4: Frontend Configuration

1. **Configure Frontend Environment**
   ```bash
   # In root directory
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

### Step 5: Start the Application

1. **Start Backend Server**
   ```bash
   cd backend
   python run.py
   ```
   
   You should see:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

2. **Start Frontend (in new terminal)**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Local:   http://localhost:5173/
   ```

### Step 6: Test the Application

1. **Access the Application**
   - Open browser to `http://localhost:5173`
   - You should see the Medicost.ai landing page

2. **Test User Registration**
   - Click "Get Started" or "Sign Up"
   - Fill in the registration form
   - Check if user is created successfully

3. **Test Data Entry**
   - Navigate to "Hospital Data"
   - Try entering revenue, expense, and metadata
   - Verify data is saved in Supabase

4. **Check Backend API**
   - Visit `http://localhost:8000/docs`
   - You should see the FastAPI documentation
   - Test endpoints directly

### Step 7: Verify Database Data

1. **Check Supabase Tables**
   - Go to Supabase → Table Editor
   - Check if data appears in tables after form submissions

2. **Test Analytics**
   - Enter some sample data
   - Check if dashboard shows real metrics

## 🔧 Troubleshooting

### Common Issues:

1. **Backend won't start**
   - Check if all dependencies are installed
   - Verify .env file has correct Supabase credentials
   - Ensure virtual environment is activated

2. **Frontend can't connect to backend**
   - Verify backend is running on port 8000
   - Check VITE_API_URL in frontend .env

3. **Database connection issues**
   - Verify Supabase credentials
   - Check if database schema was created properly
   - Ensure RLS policies are enabled

4. **Authentication not working**
   - Check JWT_SECRET_KEY is set
   - Verify Supabase keys are correct
   - Check browser console for errors

### Useful Commands:

```bash
# Check backend logs
cd backend && python run.py

# Check if backend is responding
curl http://localhost:8000/health

# Reset database (if needed)
# Re-run the SQL schema in Supabase

# Check frontend build
npm run build
```

## 🎯 Next Steps After Setup

1. **Add Sample Data** - Enter test revenue/expense data
2. **Test All Features** - Try all forms and analytics tools
3. **Deploy to Production** - Set up production environment
4. **Configure Monitoring** - Set up logging and monitoring

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check browser console and terminal logs for errors
4. Ensure Supabase project is properly configured
# Profitify.ai Backend API

A FastAPI-based backend service for the Profitify.ai hospital financial management platform.

## Features

- **User Authentication**: JWT-based authentication with Supabase integration
- **Hospital Data Management**: Comprehensive data management across 13 different tables
- **Row-Level Security**: Secure data access with Supabase RLS
- **RESTful API**: Well-documented API endpoints with automatic OpenAPI documentation

## Setup Instructions

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ```

### 2. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL migrations in your Supabase SQL editor
3. Enable Row Level Security (RLS) for all tables

### 3. Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 4. Running the Application

1. Start the development server:
   ```bash
   python run.py
   ```

2. The API will be available at:
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### New Tables Data Management
- Service Register (Revenue)
- Trial Balance, Expense Wise, Variable Cost, HR Data (Expenses)
- Occupancy, OT Register, Consumption, Connected Load, Fixed Assets, TAT, Cost Centers, Secondary Cost Drivers (Metadata)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Row Level Security**: Database-level access control
- **Password Hashing**: Bcrypt password hashing
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Pydantic model validation

## Data Structure

The system manages 13 comprehensive tables:
- **Revenue Tab**: 1 table (Service Register)
- **Expense Tab**: 4 tables (Trial Balance, Expense Wise, Variable Cost, HR)
- **Metadata Tab**: 8 tables (Occupancy, OT, Consumption, Power, Assets, TAT, Cost Centers, Drivers)
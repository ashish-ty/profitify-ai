# Medicost.ai Backend API

A FastAPI-based backend service for the Medicost.ai hospital financial management platform.

## Features

- **User Authentication**: JWT-based authentication with Supabase integration
- **Hospital Data Management**: CRUD operations for hospital metadata, revenue, and expense data
- **Analytics Engine**: Advanced analytics and insights generation
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
2. Run the SQL schema in `database/schema.sql` in your Supabase SQL editor
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
   - Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Hospital Data
- `POST /api/hospitals/metadata` - Create hospital metadata
- `GET /api/hospitals/metadata` - Get hospital metadata
- `PUT /api/hospitals/metadata/{id}` - Update hospital metadata
- `DELETE /api/hospitals/metadata/{id}` - Delete hospital metadata

### Revenue Management
- `POST /api/revenue/` - Create revenue data
- `GET /api/revenue/` - Get revenue data with filtering
- `GET /api/revenue/summary` - Get revenue summary
- `PUT /api/revenue/{id}` - Update revenue data
- `DELETE /api/revenue/{id}` - Delete revenue data

### Expense Management
- `POST /api/expenses/` - Create expense data
- `GET /api/expenses/` - Get expense data with filtering
- `GET /api/expenses/summary` - Get expense summary
- `PUT /api/expenses/{id}` - Update expense data
- `DELETE /api/expenses/{id}` - Delete expense data

### Analytics
- `GET /api/analytics/dashboard-metrics` - Get dashboard metrics
- `GET /api/analytics/revenue-trends` - Get revenue trends
- `GET /api/analytics/expense-analysis` - Get expense analysis
- `GET /api/analytics/profitability-analysis` - Get profitability analysis
- `GET /api/analytics/patient-volume-analysis` - Get patient volume analysis

## Data Models

### User
- Email, name, hospital name
- JWT-based authentication
- Row-level security enabled

### Hospital Metadata
- Monthly capacity data (ICU/Non-ICU beds)
- Staff information (nurses, doctors, technicians)
- User-specific data isolation

### Revenue Data
- Patient type (OPD/IPD)
- Specialty categories
- Billing categories (Cash/Credit)
- Patient counts and bed days
- Gross amount and discounts

### Expense Data
- 9 expense categories
- Monthly tracking
- Automatic total calculation
- Cost analysis capabilities

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Row Level Security**: Database-level access control
- **Password Hashing**: Bcrypt password hashing
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Pydantic model validation

## Development

### Running Tests
```bash
pytest
```

### Code Structure
```
backend/
├── app/
│   ├── core/          # Core functionality (config, database, security)
│   ├── models/        # Pydantic models
│   ├── routers/       # API route handlers
│   └── main.py        # FastAPI application
├── database/
│   └── schema.sql     # Database schema
├── requirements.txt   # Python dependencies
└── run.py            # Application runner
```

## Production Deployment

1. Set environment variables for production
2. Use a production WSGI server like Gunicorn
3. Configure proper logging
4. Set up monitoring and health checks
5. Use HTTPS in production

## Contributing

1. Follow PEP 8 style guidelines
2. Add tests for new features
3. Update documentation
4. Use type hints
5. Follow RESTful API conventions
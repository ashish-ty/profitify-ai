from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.core.database import get_supabase_client
from app.core.security import create_access_token, verify_token, get_password_hash, verify_password
from datetime import timedelta
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()

@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user"""
    supabase = get_supabase_client()
    
    try:
        # Check if user already exists
        existing_user = supabase.table("users").select("*").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user in Supabase
        user_record = {
            "email": user_data.email,
            "name": user_data.name,
            "hospital_name": user_data.hospital_name,
            "password_hash": hashed_password
        }
        
        result = supabase.table("users").insert(user_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        user = result.data[0]
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.jwt_access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user["id"], "email": user["email"]},
            expires_delta=access_token_expires
        )
        
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            hospital_name=user["hospital_name"],
            created_at=user["created_at"]
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Authenticate user and return access token"""
    supabase = get_supabase_client()
    
    try:
        # Get user from database
        result = supabase.table("users").select("*").eq("email", user_credentials.email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(user_credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.jwt_access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user["id"], "email": user["email"]},
            expires_delta=access_token_expires
        )
        
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            hospital_name=user["hospital_name"],
            created_at=user["created_at"],
            updated_at=user.get("updated_at")
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    supabase = get_supabase_client()
    result = supabase.table("users").select("*").eq("id", user_id).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return result.data[0]

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        name=current_user["name"],
        hospital_name=current_user["hospital_name"],
        created_at=current_user["created_at"],
        updated_at=current_user.get("updated_at")
    )
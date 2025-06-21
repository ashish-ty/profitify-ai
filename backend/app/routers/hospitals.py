from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.models.hospital import HospitalMetadataCreate, HospitalMetadataUpdate, HospitalMetadataResponse
from app.routers.auth import get_current_user
from app.core.database import get_supabase_client

router = APIRouter()

@router.post("/metadata", response_model=HospitalMetadataResponse)
async def create_hospital_metadata(
    metadata: HospitalMetadataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create hospital metadata for a specific month"""
    supabase = get_supabase_client()
    
    try:
        # Check if metadata already exists for this month/year
        existing = supabase.table("hospital_metadata").select("*").eq(
            "user_id", current_user["id"]
        ).eq("month", metadata.month).eq("year", metadata.year).execute()
        
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Metadata for {metadata.month} {metadata.year} already exists"
            )
        
        # Create metadata record
        metadata_record = {
            "user_id": current_user["id"],
            "month": metadata.month,
            "year": metadata.year,
            "beds_icu": metadata.beds_icu,
            "beds_non_icu": metadata.beds_non_icu,
            "number_of_nurses": metadata.number_of_nurses,
            "resident_doctors": metadata.resident_doctors,
            "technician_staff": metadata.technician_staff
        }
        
        result = supabase.table("hospital_metadata").insert(metadata_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create hospital metadata"
            )
        
        return HospitalMetadataResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create metadata: {str(e)}"
        )

@router.get("/metadata", response_model=List[HospitalMetadataResponse])
async def get_hospital_metadata(
    year: Optional[int] = None,
    month: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get hospital metadata with optional filtering"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("hospital_metadata").select("*").eq("user_id", current_user["id"])
        
        if year:
            query = query.eq("year", year)
        if month:
            query = query.eq("month", month)
        
        result = query.order("year", desc=True).order("month", desc=True).execute()
        
        return [HospitalMetadataResponse(**record) for record in result.data]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve metadata: {str(e)}"
        )

@router.put("/metadata/{metadata_id}", response_model=HospitalMetadataResponse)
async def update_hospital_metadata(
    metadata_id: str,
    metadata_update: HospitalMetadataUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update hospital metadata"""
    supabase = get_supabase_client()
    
    print(current_user, metadata_id)
    
    try:
        # Check if metadata exists and belongs to user
        existing = supabase.table("hospital_metadata").select("*").eq(
            "id", metadata_id
        ).eq("user_id", current_user["id"]).execute()
        
        print(existing.data)
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hospital metadata not found"
            )
        
        # Update only provided fields
        update_data = {k: v for k, v in metadata_update.dict().items() if v is not None}
        update_data["updated_at"] = "now()"
        
        result = supabase.table("hospital_metadata").update(update_data).eq(
            "id", metadata_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update hospital metadata"
            )
        
        return HospitalMetadataResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update metadata: {str(e)}"
        )

@router.delete("/metadata/{metadata_id}")
async def delete_hospital_metadata(
    metadata_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete hospital metadata"""
    supabase = get_supabase_client()
    
    try:
        # Check if metadata exists and belongs to user
        existing = supabase.table("hospital_metadata").select("*").eq(
            "id", metadata_id
        ).eq("user_id", current_user["id"]).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hospital metadata not found"
            )
        
        # Delete metadata
        result = supabase.table("hospital_metadata").delete().eq("id", metadata_id).execute()
        
        return {"message": "Hospital metadata deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete metadata: {str(e)}"
        )
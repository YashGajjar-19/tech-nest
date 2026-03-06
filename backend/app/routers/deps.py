from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import supabase

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the JWT token passed in the Authorization header.
    Returns the Supabase Auth User object if valid.
    """
    token = credentials.credentials
    try:
        # Verify the JWT using Supabase
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e) if "token" in str(e).lower() else "Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_admin(user = Depends(get_current_user)):
    """
    Checks if the authenticated user has an 'admin' or 'super_admin' role
    in the public.user_roles table.
    """
    try:
        response = supabase.table("user_roles").select("role").eq("user_id", user.id).maybe_single().execute()
        
        role_data = response.data if response else None
        if not role_data or role_data.get("role") not in ["admin", "super_admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient privileges: Admin access required."
            )
        
        return {"user": user, "role": role_data.get("role")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify authorization roles."
        )

def require_super_admin(user = Depends(get_current_user)):
    """
    Strictly checks for 'super_admin' role.
    """
    try:
        response = supabase.table("user_roles").select("role").eq("user_id", user.id).maybe_single().execute()
        
        role_data = response.data if response else None
        if not role_data or role_data.get("role") != "super_admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Critical function. Super Admin access explicitly required."
            )
        
        return {"user": user, "role": role_data.get("role")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify strict super admin roles."
        )

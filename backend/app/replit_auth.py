"""
Replit Auth integration for Oratio
Uses Replit's built-in authentication system
"""
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import secrets

try:
    from replit import web
    from flask import Flask, request as flask_request
    REPLIT_AUTH_AVAILABLE = True
    print("✅ Replit Auth available")
except ImportError:
    REPLIT_AUTH_AVAILABLE = False
    print("⚠️  Replit Auth not available, using simple token auth")

from app.supabase_db import DatabaseWrapper as DB, Collections

security = HTTPBearer(auto_error=False)


class ReplitAuth:
    """
    Wrapper for Replit Authentication
    """

    @staticmethod
    def get_current_user_from_replit() -> Optional[Dict[str, Any]]:
        """
        Get currently authenticated user from Replit
        """
        if not REPLIT_AUTH_AVAILABLE:
            return None

        try:
            user_info = web.auth.name  # Get Replit username
            if user_info:
                return {
                    "username": user_info,
                    "provider": "replit",
                    "authenticated": True
                }
        except:
            pass

        return None

    @staticmethod
    def create_or_get_user(replit_username: str) -> Dict[str, Any]:
        """
        Create user or get existing user from Replit auth
        """
        # Check if user exists
        existing_user = DB.find_one(
            Collections.USERS,
            {"username": replit_username}
        )

        if existing_user:
            return existing_user

        # Create new user
        new_user = {
            "username": replit_username,
            "email": f"{replit_username}@replit.user",
            "full_name": replit_username,
            "provider": "replit",
            "xp": 0,
            "badges": [],
            "avatar_url": None,
            "bio": None
        }

        return DB.insert(Collections.USERS, new_user)

    @staticmethod
    def create_session(user_id: str) -> str:
        """
        Create session token for user
        """
        token = secrets.token_urlsafe(32)
        session_data = {
            "id": token,
            "user_id": user_id,
            "expires_at": None  # Sessions don't expire in demo
        }
        DB.insert(Collections.SESSIONS, session_data)
        return token

    @staticmethod
    def get_user_from_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Get user from session token
        """
        session = DB.get(Collections.SESSIONS, token)
        if not session:
            return None

        user_id = session.get("user_id")
        if not user_id:
            return None
        return DB.get(Collections.USERS, str(user_id))

    @staticmethod
    def simple_auth_register(username: str, email: str, password: str) -> Dict[str, Any]:
        """
        Simple registration for local development (when Replit Auth unavailable)
        """
        try:
            # Check if user exists
            existing = DB.find_one(Collections.USERS, {"email": email})
            if existing:
                raise HTTPException(
                    status_code=400, detail="User already exists")

            existing_username = DB.find_one(
                Collections.USERS, {"username": username})
            if existing_username:
                raise HTTPException(
                    status_code=400, detail="Username already taken")

            # Create user (storing password hash in real app, but simplified for demo)
            new_user = {
                "username": username,
                "email": email,
                "password_hash": password,  # In production, use proper hashing
                "full_name": username,
                "provider": "local",
                "xp": 0,
                "badges": [],
                "avatar_url": None,
                "bio": None
            }

            user = DB.insert(Collections.USERS, new_user)
            if not user or "id" not in user:
                print(f"❌ Registration failed: user insert returned {user}")
                raise Exception("Failed to create user")

            print(f"✅ User registered: {user['username']} (id: {user['id']})")
            token = ReplitAuth.create_session(str(user["id"]))

            return {"user": user, "token": token}
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            raise Exception(f"Registration failed: {str(e)}")

    @staticmethod
    def simple_auth_login(email: str, password: str) -> Dict[str, Any]:
        """
        Simple login for local development
        """
        user = DB.find_one(Collections.USERS, {"email": email})
        if not user or user.get("password_hash") != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = ReplitAuth.create_session(user["id"])
        return {"user": user, "token": token}


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency to get current authenticated user
    Works with both Replit Auth and simple token auth
    """

    # Try Replit Auth first
    if REPLIT_AUTH_AVAILABLE:
        replit_user = ReplitAuth.get_current_user_from_replit()
        if replit_user:
            return ReplitAuth.create_or_get_user(replit_user["username"])

    # Fall back to token auth
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    user = ReplitAuth.get_user_from_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[Dict[str, Any]]:
    """
    Get current user but don't require authentication
    """
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None


# Export
__all__ = ["ReplitAuth", "get_current_user",
           "get_current_user_optional", "REPLIT_AUTH_AVAILABLE"]

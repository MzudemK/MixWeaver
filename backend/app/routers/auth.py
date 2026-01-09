from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from ..services.spotify_client import SpotifyService

# Define router with prefix
router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.get("/login")
async def login(request: Request):
    spotify = SpotifyService(request.session)
    return {"url": spotify.get_auth_url()}

@router.get("/callback")
async def callback(request: Request, code: str):
    spotify = SpotifyService(request.session)
    try:
        spotify.authenticate_user(code)
        # Successful login, redirect to frontend dashboard
        # Frontend running on 127.0.0.1:5173
        return RedirectResponse(url="http://127.0.0.1:5173/dashboard")
    except Exception as e:
        return {"error": str(e)}

@router.get("/me")
async def get_current_user(request: Request):
    """Check if user is logged in and return basic info"""
    spotify = SpotifyService(request.session)
    token = spotify.handler.get_cached_token()
    if not token:
        return {"is_logged_in": False}
    
    try:
        client = spotify._get_client()
        user = client.current_user()
        return {
            "is_logged_in": True,
            "display_name": user.get('display_name'),
            "images": user.get('images'),
            "id": user.get('id')
        }
    except Exception:
         return {"is_logged_in": False}

@router.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}

from fastapi import APIRouter, Request, HTTPException
from ..services.spotify_client import SpotifyService

router = APIRouter(prefix="/api/stats", tags=["Stats"])

@router.get("/top-tracks")
def get_top_tracks(request: Request, limit: int = 10, time_range: str = "medium_term"):
    spotify = SpotifyService(request.session)
    if not spotify.handler.get_cached_token():
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return spotify.get_top_tracks(limit=limit, time_range=time_range)

@router.get("/top-artists")
def get_top_artists(request: Request, limit: int = 10, time_range: str = "medium_term"):
    spotify = SpotifyService(request.session)
    if not spotify.handler.get_cached_token():
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return spotify.get_top_artists(limit=limit, time_range=time_range)

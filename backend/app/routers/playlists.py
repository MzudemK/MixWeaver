from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from ..services.spotify_client import SpotifyService
from ..services.sorting_logic import SortingLogic

router = APIRouter(prefix="/api/playlists", tags=["Playlists"])

class SortRequest(BaseModel):
    playlist_id: str
    method: str = "name" # name, artist, bpm, album
    order: str = "asc" # asc, desc

class ShuffleRequest(BaseModel):
    playlist_id: str

@router.get("/all")
def get_all(request: Request):
    spotify = SpotifyService(request.session)
    if not spotify.handler.get_cached_token():
         raise HTTPException(status_code=401, detail="Not authenticated")
    return spotify.get_user_playlist()

@router.post("/shuffle")
def shuffle_playlist(request: Request, payload: ShuffleRequest):
    spotify = SpotifyService(request.session)
    if not spotify.handler.get_cached_token():
         raise HTTPException(status_code=401, detail="Not authenticated")
    
    sorter = SortingLogic(spotify)
    success = sorter.shuffle_playlist(payload.playlist_id)
    return {"success": success, "message": "Playlist shuffled successfully"}

@router.post("/sort")
def sort_playlist(request: Request, payload: SortRequest):
    spotify = SpotifyService(request.session)
    if not spotify.handler.get_cached_token():
         raise HTTPException(status_code=401, detail="Not authenticated")
    
    sorter = SortingLogic(spotify)
    success = sorter.smart_sort(payload.playlist_id, payload.method, payload.order)
    return {"success": success, "message": f"Playlist sorted by {payload.method} ({payload.order})"}

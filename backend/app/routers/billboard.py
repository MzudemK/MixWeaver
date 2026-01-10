from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.spotify_client import SpotifyService
from ..services.scraper import Scraper

router = APIRouter(prefix="/api/billboard", tags=["Billboard"])

class BillboardRequest(BaseModel):
    date: str
    name: str
    description: Optional[str] = None

@router.post("/create")
def create_billboard_playlist(request: Request, payload: BillboardRequest):
    spotify = SpotifyService(request.session)
    if not spotify.handler.get_cached_token():
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # 1. Scrape Billboard Data
    scraper = Scraper()
    song_names = scraper.scrape_billboard_hot_100(payload.date)
    
    if not song_names:
        raise HTTPException(status_code=404, detail="Could not fetch billboard data for this date")

    # 2. Create Playlist
    user = spotify._get_client().current_user()
    
    # Use default description if not provided or empty
    desc = payload.description if payload.description and payload.description.strip() else f"Billboard Hot 100 from {payload.date} created by MixWeaver"
    
    playlist = spotify._get_client().user_playlist_create(
        user=user['id'], 
        name=payload.name, 
        public=False,
        description=desc
    )
    
    # 3. Search and Add Songs
    sp_client = spotify._get_client()
    
    def search_song(song):
        try:
            results = sp_client.search(q=song, type="track", limit=1)
            items = results['tracks']['items']
            if items:
                return items[0]['uri']
        except (KeyError, IndexError):
            pass
        return None

    # Parallelize search to avoid timeouts (limit 10 threads)
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(search_song, song_names)
    
    track_uris = [uri for uri in results if uri]
            
    if track_uris:
        # Add in batches of 100 if needed (spotipy handles this usually, but good to be safe)
        sp_client.playlist_add_items(playlist_id=playlist['id'], items=track_uris)
        
    return {
        "message": "Playlist created successfully",
        "playlist_id": playlist['id'],
        "tracks_found": len(track_uris),
        "total_scraped": len(song_names)
    }

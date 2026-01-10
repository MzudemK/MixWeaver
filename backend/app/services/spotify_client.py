import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os

class FastAPISessionCacheHandler(spotipy.cache_handler.CacheHandler):

    """ Eigener CacheHandler, der die FastAPI Session nutz"""
    def __init__(self, session):
        self.session = session

    def get_cached_token(self):
        return self.session.get("token_info")
    
    def save_token_to_cache(self, token_info):
        self.session["token_info"] = token_info

class SpotifyService:
    def __init__(self, session: dict):
        self.scope = "playlist-modify-private playlist-modify-public playlist-read-private user-top-read user-read-private user-library-read"
        self.handler = FastAPISessionCacheHandler(session)
        self.auth_manager = SpotifyOAuth(
            client_id=os.getenv("CLIENT_ID"),
            client_secret=os.getenv("CLIENT_SECRET"),
            redirect_uri=os.getenv("REDIRECT_URI"),
            scope=self.scope,
            cache_handler=self.handler,
            show_dialog=True,
        )
    
    def _get_client(self):
        return spotipy.Spotify(auth_manager=self.auth_manager)

    def get_auth_url(self) -> str:
        """Erzeugt die URL für den Spotify-Login"""
        return self.auth_manager.get_authorize_url()
    
    def authenticate_user(self, code: str):
        """ Tauscht den Code gegen ein Token und speichert ihn in der Sesion """
        return self.auth_manager.get_access_token(code)
    
    def get_user_playlist(self):
        sp = self._get_client()
        # Ruft die ersten 50 Playlists ab
        playlists = sp.current_user_playlists(limit=50)

        return playlists["items"]
    
    def create_new_playlist(self, name: str, description: str = ""):
        """Erstell eine neue Playlist für den Nutzer"""
        sp = self._get_client()
        user = sp.current_user()
        return sp.user_playlist_create(user['id'], name, description=description)
    
    def update_playlist_order(self, playlist_id: str, track_ids: list):
        """
        Überschreibt die Playlist mit der neuen Reihenfolge.
        track_ids: Eine Liste von Spotify URIs/IDs in der neuen Ziel-Reihenfolge.
        """

        sp = self._get_client()
        return sp.playlist_replace_items(playlist_id=playlist_id, items=track_ids)
        
    def get_top_tracks(self, limit: int = 20, time_range: str = "medium_term"):
        """
        Fetches the current user's top tracks.
        time_range: 'short_term' (4 weeks), 'medium_term' (6 months), 'long_term' (years)
        """
        sp = self._get_client()
        return sp.current_user_top_tracks(limit=limit, time_range=time_range)

    def get_top_artists(self, limit: int = 20, time_range: str = "medium_term"):
        """
        Fetches the current user's top artists.
        """
        sp = self._get_client()
        return sp.current_user_top_artists(limit=limit, time_range=time_range)

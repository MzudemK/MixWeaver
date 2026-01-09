from .spotify_client import SpotifyService
import random

class SortingLogic:
    def __init__(self, spotify_service: SpotifyService):
        self.spotify = spotify_service
        self.client = spotify_service._get_client()

    def shuffle_playlist(self, playlist_id: str):
        """Truly random shuffle"""
        # 1. Get all tracks
        # Note: Need to handle pagination for > 100 tracks
        tracks = self._get_all_playlist_tracks(playlist_id)
        
        # 2. Extract URIs
        track_uris = [t['track']['uri'] for t in tracks if t['track']]
        
        # 3. Shuffle
        random.shuffle(track_uris)
        
        # 4. Update playlist (Replace items)
        # Note: replace_items supports max 100 tracks per request. 
        # For larger playlists, we need to replace first 100, then add the rest.
        # OR better: clear playlist and add back. 
        # But replace_items is cleaner for < 100. 
        # For > 100: Replace first 100, then add the rest.
        
        self._replace_large_playlist(playlist_id, track_uris)
        return True

    def smart_sort(self, playlist_id: str, method: str, order: str = 'asc'):
        """
        Sorts by: 'name', 'artist', 'album', 'duration', 'bpm' (audio features)
        order: 'asc' (A-Z) or 'desc' (Z-A)
        """
        tracks = self._get_all_playlist_tracks(playlist_id)
        reverse = (order == 'desc')
        
        # Helper to get safe track data
        def get_track_data(item):
            return item['track'] if item['track'] else {}

        sorted_tracks = []
        
        if method == 'name':
            sorted_tracks = sorted(tracks, key=lambda x: get_track_data(x).get('name', '').lower(), reverse=reverse)
        
        elif method == 'artist':
             sorted_tracks = sorted(tracks, key=lambda x: get_track_data(x).get('artists', [{}])[0].get('name', '').lower(), reverse=reverse)
             
        elif method == 'album':
             sorted_tracks = sorted(tracks, key=lambda x: get_track_data(x).get('album', {}).get('name', '').lower(), reverse=reverse)

        elif method == 'bpm':
            # Need to fetch audio features
            track_ids = [t['track']['id'] for t in tracks if t['track'] and t['track']['id']]
            features_map = self._get_audio_features_map(track_ids)
            
            # Sort by tempo (BPM)
            sorted_tracks = sorted(tracks, key=lambda x: features_map.get(get_track_data(x).get('id'), {}).get('tempo', 0), reverse=reverse)

        else:
             # Default fallback
             return False

        track_uris = [t['track']['uri'] for t in sorted_tracks if t['track']]
        self._replace_large_playlist(playlist_id, track_uris)
        return True

    def _get_all_playlist_tracks(self, playlist_id):
        results = self.client.playlist_items(playlist_id)
        tracks = results['items']
        while results['next']:
            results = self.client.next(results)
            tracks.extend(results['items'])
        return tracks

    def _replace_large_playlist(self, playlist_id, track_uris):
        # Spotify API limit for replace/add is 100
        chunk_size = 100
        chunks = [track_uris[i:i + chunk_size] for i in range(0, len(track_uris), chunk_size)]
        
        if not chunks:
            return

        # Replace first chunk
        self.client.playlist_replace_items(playlist_id, chunks[0])
        
        # Add remaining chunks
        for chunk in chunks[1:]:
            self.client.playlist_add_items(playlist_id, chunk)

    def _get_audio_features_map(self, track_ids):
        # Fetch in batches of 100
        features_map = {}
        chunk_size = 100
        chunks = [track_ids[i:i + chunk_size] for i in range(0, len(track_ids), chunk_size)]
        
        for chunk in chunks:
            features_list = self.client.audio_features(chunk)
            for f in features_list:
                if f:
                    features_map[f['id']] = f
        return features_map

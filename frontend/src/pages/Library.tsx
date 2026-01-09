import { useEffect, useState } from 'react';

import { LoadingSpinner } from '../components/LoadingSpinner';

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
    tracks: { total: number };
    external_urls: { spotify: string };
}

export const Library = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await fetch('/api/playlists/all', { credentials: 'include' });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPlaylists(data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch playlists", err);
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    if (loading) return <LoadingSpinner message="Loading your library..." />;

    return (
        <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum">
            <h1 className="text-4xl font-bold mb-8">My <span className="text-amber-brand">Library</span></h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {playlists.map((playlist) => (
                    <a 
                        key={playlist.id} 
                        href={playlist.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="group block bg-obsidian-soft p-4 rounded-xl border border-obsidian-muted hover:border-amber-brand/50 transition-all"
                    >
                        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-obsidian-muted">
                            {playlist.images?.[0]?.url ? (
                                <img 
                                    src={playlist.images[0].url} 
                                    alt={playlist.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-platinum-dim">No Image</div>
                            )}
                        </div>
                        <h3 className="font-bold text-platinum truncate">{playlist.name}</h3>
                        <p className="text-sm text-platinum-dim">{playlist.tracks.total} Tracks</p>
                    </a>
                ))}
            </div>
        </div>
    );
};

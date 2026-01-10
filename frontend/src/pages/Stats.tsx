import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Track {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    external_urls: { spotify: string };
}

interface Artist {
    name: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    genres: string[];
}

import { LoadingSpinner } from '../components/LoadingSpinner';

export const Stats = () => {
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch tracks
                const tracksRes = await fetch('/api/stats/top-tracks?limit=5', { credentials: 'include' });
                const tracksData = await tracksRes.json();
                setTopTracks(tracksData.items || []);

                // Fetch artists
                const artistsRes = await fetch('/api/stats/top-artists?limit=5', { credentials: 'include' });
                const artistsData = await artistsRes.json();
                setTopArtists(artistsData.items || []);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch stats", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner message="Fetching your top stats..." />;

    return (
        <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum">
            <Link to="/dashboard" className="text-platinum-dim hover:text-amber-brand flex items-center gap-2 mb-6 transition-colors group w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-8">Your <span className="text-amber-brand">Stats</span></h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Top Tracks Column */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-amber-brand">#</span> Top Tracks
                    </h2>
                    <div className="space-y-4">
                        {topTracks.map((track, index) => (
                            <a 
                                key={index} 
                                href={track.external_urls.spotify}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-4 bg-obsidian-soft rounded-xl border border-obsidian-muted hover:border-amber-brand/50 transition-all group"
                            >
                                <span className="text-2xl font-bold text-platinum-dim group-hover:text-amber-brand w-8 text-center">{index + 1}</span>
                                <img src={track.album.images[0]?.url} alt={track.name} className="w-16 h-16 rounded-md shadow-lg" />
                                <div>
                                    <h3 className="font-bold text-platinum truncate max-w-[200px]">{track.name}</h3>
                                    <p className="text-sm text-platinum-dim">{track.artists.map(a => a.name).join(', ')}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Top Artists Column */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-amber-brand">#</span> Top Artists
                    </h2>
                    <div className="space-y-4">
                        {topArtists.map((artist, index) => (
                            <a 
                                key={index} 
                                href={artist.external_urls.spotify}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-4 bg-obsidian-soft rounded-xl border border-obsidian-muted hover:border-amber-brand/50 transition-all group"
                            >
                                <span className="text-2xl font-bold text-platinum-dim group-hover:text-amber-brand w-8 text-center">{index + 1}</span>
                                <img src={artist.images[0]?.url} alt={artist.name} className="w-16 h-16 rounded-full shadow-lg object-cover" />
                                <div>
                                    <h3 className="font-bold text-platinum">{artist.name}</h3>
                                    <p className="text-sm text-platinum-dim capitalize">{artist.genres.slice(0, 2).join(', ')}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

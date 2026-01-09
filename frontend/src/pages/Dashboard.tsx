import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingSpinner } from '../components/LoadingSpinner';

export const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status
    fetch('/api/auth/me', {
       credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.is_logged_in) {
            setUserData(data);
        }
        setLoading(false);
    })
    .catch(err => {
        console.error("Auth check failed", err);
        setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner message="Loading Dashboard..." />;

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum">
      <h1 className="text-4xl font-bold mb-8">
        Welcome Back, <span className="text-amber-brand">{userData?.display_name || 'User'}</span>
      </h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Placeholder cards for dashboard actions */}
        <div 
          onClick={() => navigate('/library')} 
          className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/50 transition-colors cursor-pointer group"
        >
            <h3 className="text-xl font-bold mb-2 group-hover:text-amber-brand transition-colors">My Playlists</h3>
            <p className="text-sm text-platinum-dim">Manage and sort your existing playlists.</p>
        </div>
        <div 
           onClick={() => navigate('/tools')}
           className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/50 transition-colors cursor-pointer group"
        >
            <h3 className="text-xl font-bold mb-2 group-hover:text-amber-brand transition-colors">Tools</h3>
            <p className="text-sm text-platinum-dim">Shuffle, Sort, or create Billboard playlists.</p>
        </div>
        <div 
            onClick={() => navigate('/stats')}
            className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/50 transition-colors cursor-pointer group"
        >
            <h3 className="text-xl font-bold mb-2 group-hover:text-amber-brand transition-colors">Stats</h3>
            <p className="text-sm text-platinum-dim">View your listening habits and top tracks.</p>
        </div>
      </div>
    </div>
  );
};

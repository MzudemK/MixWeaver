import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { LoadingSpinner } from '../components/LoadingSpinner';

type ToolMode = 'overview' | 'shuffle' | 'sort' | 'billboard';

interface Playlist {
    id: string;
    name: string;
    owner: { id: string };
}

export const Tools = () => {
  const [mode, setMode] = useState<ToolMode>('overview');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [billboardDate, setBillboardDate] = useState<Date | null>(null);
  const [billboardName, setBillboardName] = useState('');
  const [billboardDesc, setBillboardDesc] = useState('');
  const [selectedSortMethod, setSelectedSortMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Fetch playlists and user ID when needed
  useEffect(() => {
      if (mode === 'shuffle' || mode === 'sort') {
          // Fetch user ID first to filter playlists
          fetch('/api/auth/me', { credentials: 'include' })
            .then(res => res.json())
            .then(userData => {
                if (userData.id) {
                    setUserId(userData.id);
                    // Fetch all playlists
                    return fetch('/api/playlists/all', { credentials: 'include' });
                }
                throw new Error('User not logged in');
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlaylists(data); 
                }
            })
            .catch(console.error);
      }
  }, [mode]); // Re-run when mode changes

  // Filtered playlists for selection
  const userPlaylists = playlists.filter(p => p.owner?.id === userId);

  const handleAction = async (action: 'shuffle' | 'sort' | 'create_billboard', sortMethod?: string, sortOrder: 'asc' | 'desc' = 'asc') => {
      setLoading(true);
      setMessage('');
      try {
          let url = '';
          let body = {};

          if (action === 'shuffle') {
              url = '/api/playlists/shuffle';
              body = { playlist_id: selectedPlaylist };
          } else if (action === 'sort') {
              url = '/api/playlists/sort';
              body = { playlist_id: selectedPlaylist, method: sortMethod, order: sortOrder };
          } else if (action === 'create_billboard') {
              url = '/api/billboard/create';
              
              // Fix for timezone issues: format as YYYY-MM-DD using local time
              let formattedDate = '';
              if (billboardDate) {
                  const year = billboardDate.getFullYear();
                  const month = String(billboardDate.getMonth() + 1).padStart(2, '0');
                  const day = String(billboardDate.getDate()).padStart(2, '0');
                  formattedDate = `${year}-${month}-${day}`;
              }
              
              body = { date: formattedDate, name: billboardName, description: billboardDesc };
          }

          const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
              credentials: 'include'
          });
          
          if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.detail || 'Action failed');
          }
          
          const data = await res.json();
          setMessage(data.message || 'Success!');
          
          // Reset after success
          if (action === 'create_billboard') {
              setBillboardDate(null);
              setBillboardName('');
              setBillboardDesc('');
          }
          if (action === 'sort') {
              setSelectedSortMethod(null);
          }

      } catch (error: any) {
          console.error(error);
          setMessage(`Error: ${error.message || 'An error occurred. Please try again.'}`);
      } finally {
          setLoading(false);
      }
  };

  const renderOverview = () => (
    <div className="grid md:grid-cols-3 gap-6">
      <div 
        onClick={() => setMode('shuffle')}
        className="p-8 bg-obsidian-soft rounded-xl border border-obsidian-muted hover:border-amber-brand/50 hover:bg-obsidian-soft/80 transition-all cursor-pointer group text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-amber-brand/10 rounded-full flex items-center justify-center text-amber-brand">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-platinum mb-2 group-hover:text-amber-brand">Randomize Order</h2>
        <p className="text-platinum-dim">Randomly reorder a playlist (truly random, not algorithmic).</p>
      </div>

      <div 
        onClick={() => setMode('sort')}
        className="p-8 bg-obsidian-soft rounded-xl border border-obsidian-muted hover:border-amber-brand/50 hover:bg-obsidian-soft/80 transition-all cursor-pointer group text-center"
      >
         <div className="w-16 h-16 mx-auto mb-6 bg-amber-brand/10 rounded-full flex items-center justify-center text-amber-brand">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-platinum mb-2 group-hover:text-amber-brand">Smart Sort</h2>
        <p className="text-platinum-dim">Sort by Genre, BPM, Key, or Alphabetically.</p>
      </div>

      <div 
        onClick={() => setMode('billboard')}
        className="p-8 bg-obsidian-soft rounded-xl border border-obsidian-muted hover:border-amber-brand/50 hover:bg-obsidian-soft/80 transition-all cursor-pointer group text-center"
      >
         <div className="w-16 h-16 mx-auto mb-6 bg-amber-brand/10 rounded-full flex items-center justify-center text-amber-brand">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-platinum mb-2 group-hover:text-amber-brand">Billboard Time Machine</h2>
        <p className="text-platinum-dim">Create a playlist from the Billboard Hot 100 of any past date.</p>
      </div>
    </div>
  );

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum">
      <div className="flex flex-col mb-8">
        {mode === 'overview' && (
            <Link to="/dashboard" className="text-platinum-dim hover:text-amber-brand flex items-center gap-2 mb-4 transition-colors group w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>
        )}

      <div className="flex items-center gap-4">
        {mode !== 'overview' && (
            <button 
                onClick={() => { 
                    setMode('overview'); 
                    setMessage(''); 
                    setSelectedPlaylist(''); 
                    setSelectedSortMethod(null);
                }} 
                className="text-amber-brand hover:text-amber-glow font-bold flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Tools
            </button>
        )}
        <h1 className="text-4xl font-bold">
            {mode === 'overview' && 'Tools'}
            {mode === 'shuffle' && 'Randomize Order'}
            {mode === 'sort' && 'Smart Sorting'}
            {mode === 'billboard' && 'Billboard Time Machine'}
        </h1>
      </div>
      </div>

      {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {message}
          </div>
      )}

      {mode === 'overview' && renderOverview()}
      
      {loading && mode !== 'overview' && <LoadingSpinner message={mode === 'billboard' ? "Creating your playlist in process..." : "Processing your mix..."} />}

      {mode === 'shuffle' && !loading && (
        <div className="max-w-2xl mx-auto bg-obsidian-soft p-8 rounded-xl border border-obsidian-muted">
             <h3 className="text-xl font-bold mb-4">Select a Playlist to Shuffle</h3>
             <select 
                className="w-full p-3 bg-obsidian rounded-lg border border-obsidian-muted text-platinum mb-6"
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
             >
                 <option value="">-- SELECT PLAYLIST --</option>
                 {userPlaylists.map(p => (
                     <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
             </select>
             
             <button 
                onClick={() => handleAction('shuffle')}
                disabled={!selectedPlaylist || loading}
                className="w-full bg-amber-brand hover:bg-amber-glow text-obsidian font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
             >
                 Shuffle Now
             </button>
        </div>
      )}

      {mode === 'sort' && !loading && (
        <div className="max-w-2xl mx-auto bg-obsidian-soft p-8 rounded-xl border border-obsidian-muted">
            <h3 className="text-xl font-bold mb-4">Select a Playlist & Method</h3>
            
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm text-platinum-dim mb-2 uppercase tracking-wide">Playlist</label>
                    <select 
                        className="w-full p-3 bg-obsidian rounded-lg border border-obsidian-muted text-platinum"
                        value={selectedPlaylist}
                        onChange={(e) => {
                            setSelectedPlaylist(e.target.value);
                            setSelectedSortMethod(null);
                        }}
                    >
                        <option value="">-- SELECT PLAYLIST --</option>
                        {userPlaylists.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                
                {selectedPlaylist && !selectedSortMethod && (
                     <>
                        <p className="text-sm text-platinum-dim mb-2 uppercase tracking-wide">Select Method</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setSelectedSortMethod('name')} disabled={loading} className="p-4 border border-obsidian-muted rounded-lg hover:border-amber-brand text-left bg-obsidian/50 group">
                                <span className="font-bold block uppercase group-hover:text-amber-brand">NAME</span>
                                <span className="text-xs text-platinum-dim">Alphabetical</span>
                            </button>
                            <button onClick={() => setSelectedSortMethod('artist')} disabled={loading} className="p-4 border border-obsidian-muted rounded-lg hover:border-amber-brand text-left bg-obsidian/50 group">
                                <span className="font-bold block uppercase group-hover:text-amber-brand">ARTIST</span>
                                <span className="text-xs text-platinum-dim">Alphabetical</span>
                            </button>
                            <button onClick={() => setSelectedSortMethod('album')} disabled={loading} className="p-4 border border-obsidian-muted rounded-lg hover:border-amber-brand text-left bg-obsidian/50 group">
                                <span className="font-bold block uppercase group-hover:text-amber-brand">ALBUM</span>
                                <span className="text-xs text-platinum-dim">Alphabetical</span>
                            </button>
                            <button onClick={() => setSelectedSortMethod('bpm')} disabled={loading} className="p-4 border border-obsidian-muted rounded-lg hover:border-amber-brand text-left bg-obsidian/50 group">
                                <span className="font-bold block uppercase group-hover:text-amber-brand">BPM</span>
                                <span className="text-xs text-platinum-dim">Tempo</span>
                            </button>
                        </div>
                     </>
                )}

                {selectedPlaylist && selectedSortMethod && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-platinum-dim uppercase tracking-wide">
                                Order for <span className="text-amber-brand font-bold">{selectedSortMethod}</span>
                            </p>
                            <button onClick={() => setSelectedSortMethod(null)} className="text-xs text-platinum-dim hover:text-white underline">
                                Change Method
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleAction('sort', selectedSortMethod, 'asc')} 
                                disabled={loading} 
                                className="p-6 border border-obsidian-muted rounded-lg hover:bg-amber-brand hover:text-obsidian hover:border-amber-brand transition-all text-center bg-obsidian/50"
                            >
                                <span className="font-bold block uppercase text-lg mb-1">
                                    {selectedSortMethod === 'bpm' ? 'Low to High' : 'A - Z'}
                                </span>
                                <span className="text-xs opacity-70">Ascending</span>
                            </button>
                            <button 
                                onClick={() => handleAction('sort', selectedSortMethod, 'desc')} 
                                disabled={loading} 
                                className="p-6 border border-obsidian-muted rounded-lg hover:bg-amber-brand hover:text-obsidian hover:border-amber-brand transition-all text-center bg-obsidian/50"
                            >
                                <span className="font-bold block uppercase text-lg mb-1">
                                    {selectedSortMethod === 'bpm' ? 'High to Low' : 'Z - A'}
                                </span>
                                <span className="text-xs opacity-70">Descending</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {mode === 'billboard' && !loading && (
        <div className="max-w-2xl mx-auto bg-obsidian-soft p-8 rounded-xl border border-obsidian-muted">
             <h3 className="text-xl font-bold mb-4">Create Playlist from Chart</h3>
             
             <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm text-platinum-dim mb-2 uppercase tracking-wide">Target Date</label>
                    <div className="date-picker-wrapper">
                      <DatePicker 
                          selected={billboardDate} 
                          onChange={(date: Date | null) => setBillboardDate(date)}
                          dateFormat="yyyy-MM-dd"
                          maxDate={new Date()}
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={60}
                          placeholderText="SELECT DATE (YYYY-MM-DD)"
                          className="w-full p-3 bg-obsidian rounded-lg border border-obsidian-muted text-platinum focus:outline-none focus:border-amber-brand"
                      />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-platinum-dim mb-2 uppercase tracking-wide">Playlist Name</label>
                    <input 
                        type="text" 
                        placeholder="E.G. SUMMER OF '69"
                        value={billboardName}
                        onChange={(e) => setBillboardName(e.target.value)}
                        className="w-full p-3 bg-obsidian rounded-lg border border-obsidian-muted text-platinum placeholder:text-obsidian-muted focus:outline-none focus:border-amber-brand"
                    />
                </div>
                <div>
                    <label className="block text-sm text-platinum-dim mb-2 uppercase tracking-wide">Description (Optional)</label>
                    <textarea 
                        rows={3}
                        placeholder="ENTER PLAYLIST DESCRIPTION..."
                        value={billboardDesc}
                        onChange={(e) => setBillboardDesc(e.target.value)}
                        className="w-full p-3 bg-obsidian rounded-lg border border-obsidian-muted text-platinum placeholder:text-obsidian-muted focus:outline-none focus:border-amber-brand"
                    />
                </div>
             </div>

             <button 
                onClick={() => handleAction('create_billboard')}
                disabled={!billboardDate || !billboardName || loading}
                className="w-full bg-amber-brand hover:bg-amber-glow text-obsidian font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
             >
                 Create Playlist
             </button>
        </div>
      )}
    </div>
  );
};

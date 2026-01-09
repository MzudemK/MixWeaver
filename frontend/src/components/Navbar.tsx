import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { UserData } from '../types';

import { LoadingSpinner } from './LoadingSpinner';

interface NavbarProps {
  userData: UserData | null;
}

export const Navbar = ({ userData }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
          setIsLoggingIn(false);
      }
    } catch (err) {
      console.error("Login failed", err);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      // Redirect to home and refresh to update state
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isLoggedIn = userData?.is_logged_in;
  const userImage = userData?.images?.[0]?.url;
  const displayName = userData?.display_name;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300
                    bg-obsidian/70 backdrop-blur-md border-b border-obsidian-muted/50">
      {/* Full screen loader when logging in */}
      {isLoggingIn && <LoadingSpinner fullScreen message="Connecting to Spotify..." />}

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Immer sichtbar) */}
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-brand rounded-lg flex items-center justify-center 
                          text-obsidian font-black font-display text-lg shadow-lg shadow-amber-brand/20">
            MW
          </div>
          <span className="text-2xl font-bold font-display tracking-tighter text-platinum uppercase">
            Mix<span className="text-amber-brand">Weaver</span>
          </span>
        </Link>

        {/* Navigation Links - Bedingt gerendert */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-platinum-dim uppercase font-sans">
          {!isLoggedIn ? (
            <>
              <Link to="/features" className="hover:text-amber-brand transition-colors">Features</Link>
              <Link to="/about" className="hover:text-amber-brand transition-colors">About</Link>
            </>
          ) : (
            <>
              {/* "Home" leads to Dashboard (Logged in landing) */}
              <Link to="/dashboard" className="hover:text-amber-brand transition-colors">Home</Link>
              <Link to="/library" className="hover:text-amber-brand transition-colors">My Library</Link>
              <Link to="/tools" className="hover:text-amber-brand transition-colors">Tools</Link>
              <Link to="/stats" className="hover:text-amber-brand transition-colors">Stats</Link>
            </>
          )}
        </div>

        {/* Action Button - Ändert sich je nach Status */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <button 
              onClick={handleLogin}
              className="bg-amber-brand hover:bg-amber-glow text-obsidian font-bold py-2 px-6 
                               rounded-lg transition-all shadow-amber text-sm uppercase tracking-wider cursor-pointer">
              Connect Spotify
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
              >
                <span className="text-platinum-dim text-xs hidden sm:block font-bold">{displayName}</span>
                <div className="w-10 h-10 rounded-full border border-amber-brand/50 overflow-hidden bg-obsidian-muted">
                  {userImage ? (
                    <img src={userImage} alt={displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-brand text-xs">SP</div>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-obsidian-soft rounded-xl shadow-xl border border-obsidian-muted py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-obsidian-muted mb-2">
                    <p className="text-xs text-platinum-dim">Signed in as</p>
                    <p className="text-sm font-bold text-platinum truncate">{displayName}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-platinum hover:bg-obsidian-muted hover:text-amber-brand transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
              
              {/* Click outside listener could be added here for better UX, or use a simple overlay */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

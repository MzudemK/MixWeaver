import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const Hero = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login');
      // Check if response is JSON (proxy might return HTML on 404/500 if misconfigured)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server response was not JSON");
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error("Login failed", err);
      setIsLoggingIn(false);
      alert("Could not connect to server. Please try again later.");
    }
  };

  return (
    <section className="relative overflow-hidden px-6 py-32 md:py-48 text-center font-sans">
      {/* Full screen loader when logging in */}
      {isLoggingIn && <LoadingSpinner fullScreen message="Connecting to Spotify..." />}

      {/* Dynamic Background Glow - Etwas größer und weicher für mehr Tiefe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-brand/10 blur-[130px] rounded-full -z-10"></div>
      
      {/* Subtile Grid-Struktur im Hintergrund für den "Architect"-Look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-20 opacity-20"></div>

      <div className="max-w-5xl mx-auto">
        {/* Deine gewünschte Headline-Struktur mit verbessertem Font-Handling */}
        <h1 className="text-6xl md:text-8xl font-black font-display text-platinum leading-[1.1] mb-8 tracking-tight">
          Welcome to <br /> 
          <span className="italic">Mix</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-brand via-amber-glow to-amber-brand drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Weaver
          </span>
        </h1>
        
        {/* Die neue, präzise Subline auf Englisch */}
        <p className="text-lg md:text-xl text-platinum-dim mb-12 max-w-2xl mx-auto leading-relaxed">
          The simple way to manage your Spotify library. <br className="hidden md:block" />
          Turn <span className="text-platinum">Billboard charts</span> into playlists and <span className="text-platinum">sort your music</span> just the way you like it.
        </p>

        {/* Buttons mit verstärktem Hover-Effekt */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button 
            onClick={handleLogin}
            className="group relative bg-amber-brand hover:bg-amber-glow text-obsidian font-extrabold py-4 px-12 rounded-xl transition-all shadow-amber text-lg uppercase tracking-wider cursor-pointer">
            Start with Spotify now
          </button>
          
          <button 
            onClick={() => navigate('/features')}
            className="bg-obsidian-soft border border-obsidian-muted hover:border-amber-brand/50 text-platinum py-4 px-12 rounded-xl transition-all text-lg font-bold backdrop-blur-sm cursor-pointer">
            Discover Functions
          </button>
        </div>

      </div>
    </section>
  );
};

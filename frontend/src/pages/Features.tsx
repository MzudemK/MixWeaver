export const Features = () => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum">
      <h1 className="text-4xl md:text-6xl font-black font-display mb-16 text-center">
        Explore <span className="text-amber-brand">Capabilities</span>
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Feature 1: Randomize Order */}
        <div className="p-8 bg-obsidian-soft rounded-2xl border border-obsidian-muted hover:border-amber-brand/50 transition-all group">
          <div className="w-14 h-14 bg-amber-brand/10 rounded-xl flex items-center justify-center text-amber-brand mb-6 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-platinum mb-4 group-hover:text-amber-brand transition-colors">True Shuffle</h2>
          <p className="text-platinum-dim leading-relaxed">
            Break free from Spotify's algorithms. Our "Randomize Order" tool physically reorders the tracks in your playlist, ensuring a truly random listening experience every time. No more hearing the same 20 songs on repeat.
          </p>
        </div>

        {/* Feature 2: Smart Sorting */}
        <div className="p-8 bg-obsidian-soft rounded-2xl border border-obsidian-muted hover:border-amber-brand/50 transition-all group">
           <div className="w-14 h-14 bg-amber-brand/10 rounded-xl flex items-center justify-center text-amber-brand mb-6 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-platinum mb-4 group-hover:text-amber-brand transition-colors">Smart Sorting</h2>
          <p className="text-platinum-dim leading-relaxed">
            Organize your chaos. Sort any playlist by <strong>BPM (Tempo)</strong> for workouts, <strong>Key</strong> for harmonic mixing, <strong>Artist</strong>, <strong>Album</strong>, or standard alphabetical order. You can even reverse the order with a single click.
          </p>
        </div>

        {/* Feature 4: Stats */}
        <div className="p-8 bg-obsidian-soft rounded-2xl border border-obsidian-muted hover:border-amber-brand/50 transition-all group">
           <div className="w-14 h-14 bg-amber-brand/10 rounded-xl flex items-center justify-center text-amber-brand mb-6 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-platinum mb-4 group-hover:text-amber-brand transition-colors">Deep Stats</h2>
          <p className="text-platinum-dim leading-relaxed">
            Know your habits. View your top tracks and artists over the last 4 weeks, 6 months, or all time. Discover what you've really been listening to.
          </p>
        </div>

      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum font-sans">
      <Link to="/dashboard" className="text-platinum-dim hover:text-amber-brand flex items-center gap-2 mb-6 transition-colors group w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-bold font-display mb-8">About <span className="text-amber-brand">MixWeaver</span></h1>
      
      <div className="space-y-12 max-w-4xl">
        <section className="space-y-4">
          <p className="text-lg text-platinum-dim leading-relaxed">
            MixWeaver is the ultimate companion for your Spotify library. We believe that your music collection should be as dynamic and organized as your taste. 
            Spotify's native tools are great, but sometimes you need a little more control—or a little more magic.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/30 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-amber-brand">Smart Sorting</h3>
                <p className="text-platinum-dim">
                    Take any playlist and sort it by metadata Spotify doesn't let you touch. 
                    Sort by <strong>BPM</strong> for your workout mixes, by <strong>Key</strong> for harmonic DJ transitions, or strictly alphabetically for a clean library.
                </p>
            </div>
            
             <div className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/30 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-amber-brand">Time Travel</h3>
                <p className="text-platinum-dim">
                    Our signature <strong>Billboard Time Machine</strong> lets you enter any date back to 1958. 
                    We scrape the historical Hot 100 charts and instantly build a playlist of those hits for you.
                </p>
            </div>

            <div className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/30 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-amber-brand">True Shuffle</h3>
                <p className="text-platinum-dim">
                    Streaming algorithms often prioritize the same songs. Our <strong>True Shuffle</strong> tool randomizes your playlist order completely, 
                    rediscovering forgotten gems in your library.
                </p>
            </div>

             <div className="bg-obsidian-soft p-6 rounded-xl border border-obsidian-muted hover:border-amber-brand/30 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-amber-brand">Deep Stats</h3>
                <p className="text-platinum-dim">
                    Get insights into your listening habits that go deeper than the annual wrap-up. 
                    See your current obsessions and all-time favorites updated in real-time.
                </p>
            </div>
        </section>

        <section className="space-y-4 border-t border-obsidian-muted pt-8">
            <h2 className="text-2xl font-bold font-display">Privacy & Security</h2>
            <p className="text-platinum-dim leading-relaxed">
                MixWeaver uses the official Spotify API to interact with your account. We never store your password or personal data. 
                Our connection is secure, and we only request the permissions necessary to manage your playlists and read your library.
            </p>
        </section>
      </div>
    </div>
  );
};

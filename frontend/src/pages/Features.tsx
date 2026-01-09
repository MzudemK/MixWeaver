export const Features = () => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto text-platinum">
      <h1 className="text-4xl font-bold mb-8">Features</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-obsidian-soft rounded-xl border border-obsidian-muted">
          <h2 className="text-2xl font-bold text-amber-brand mb-4">Smart Sorting</h2>
          <p className="text-platinum-dim">Sort your playlists by BPM, Genre, or Release Date automatically.</p>
        </div>
        <div className="p-6 bg-obsidian-soft rounded-xl border border-obsidian-muted">
          <h2 className="text-2xl font-bold text-amber-brand mb-4">Billboard Integration</h2>
          <p className="text-platinum-dim">Convert Billboard charts directly into Spotify playlists.</p>
        </div>
      </div>
    </div>
  );
};

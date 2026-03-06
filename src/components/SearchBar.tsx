interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="flex-1 max-w-xl px-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-cyan-500/60">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="SEARCH NEURAL PATHWAYS..."
          className="search-input placeholder-cyan-900/60"
        />
        <div className="absolute inset-y-0 right-4 flex items-center gap-2">
          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded text-cyan-500">CMD + K</span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

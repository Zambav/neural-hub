interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="SEARCH NEURAL PATHWAYS..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="search-input mono-text"
        />
        <div className="search-shortcut">
          <span>CMD + K</span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

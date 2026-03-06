import { useEffect, useMemo, useRef, useState } from "react";
import { searchTMDB, posterUrl } from "../lib/tmdb";

export default function SearchOverlay({ open, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let mounted = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      const found = await searchTMDB(query);
      if (!mounted) return;
      setResults(found.slice(0, 12));
      setLoading(false);
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [open, query]);

  const items = useMemo(() => {
    return results
      .filter((x) => x.media_type === "movie" || x.media_type === "tv")
      .map((item) => ({
        id: item.id,
        title: item.title || item.name,
        mediaType: item.media_type,
        image:
          posterUrl(item.poster_path) ||
          posterUrl(item.backdrop_path) ||
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      }));
  }, [results]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, shows, and more"
            className="search-input"
            autoFocus
          />
          <button className="btn btn--text" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="search-results">
          {loading ? (
            <p>Searching…</p>
          ) : items.length === 0 ? (
            <p>Type to search.</p>
          ) : (
            items.map((item) => (
              <button
                key={`${item.mediaType}-${item.id}`}
                type="button"
                className="search-result"
                onClick={() => onSelect(item)}
              >
                <img
                  className="search-result__image"
                  src={item.image}
                  alt={item.title}
                />
                <div className="search-result__text">
                  <span className="search-result__title">{item.title}</span>
                  <span className="search-result__type">
                    {item.mediaType === "movie" ? "Movie" : "TV Show"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

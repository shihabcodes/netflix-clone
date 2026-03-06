import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import TrailerModal from "../components/TrailerModal";
import {
  searchTMDB,
  fetchVideos,
  getYouTubeTrailerKey,
  posterUrl,
} from "../lib/tmdb";
import { useMyList } from "../lib/useMyList";

function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title || item.name,
    meta: item.release_date
      ? item.release_date.slice(0, 4)
      : item.first_air_date
        ? item.first_air_date.slice(0, 4)
        : "",
    image:
      posterUrl(item.poster_path) ||
      posterUrl(item.backdrop_path) ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    mediaType: item.media_type || "movie",
  };
}

export default function SearchPage() {
  const router = useRouter();
  const { q = "", media, id } = router.query;
  const [query, setQuery] = useState(q || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const { list, addItem, removeItem } = useMyList();

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      const found = await searchTMDB(query);
      if (!mounted) return;
      setResults(found.map(normalizeItem));
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [query]);

  useEffect(() => {
    if (!id) return;
    const selected = results.find((item) => String(item.id) === String(id));
    if (!selected) return;

    (async () => {
      const videos = await fetchVideos(
        media || selected.mediaType,
        selected.id,
      );
      setVideoKey(getYouTubeTrailerKey(videos));
    })();
  }, [id, media, results]);

  const listIds = useMemo(() => list.map((item) => item.id), [list]);

  const toggleMyList = async (item) => {
    if (listIds.includes(item.id)) {
      await removeItem(item.id);
    } else {
      await addItem(item);
    }
  };

  return (
    <>
      <Head>
        <title>Search - NetfliX Clone</title>
        <meta
          name="description"
          content="Search movies and TV shows powered by TMDB."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <section className="hero" style={{ backgroundImage: "none" }}>
          <div className="hero__overlay" />
          <div className="hero__content">
            <h1 className="hero__title">Search</h1>
            <p className="hero__meta">Search across movies and TV shows.</p>
            <div className="hero__form" style={{ justifyContent: "center" }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }
                }}
                placeholder="Search for movies, shows, actors..."
              />
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }}
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="row">
          <div className="row__header">
            <h2 className="row__title">
              {query ? `Results for "${query}"` : "Start typing to search"}
            </h2>
          </div>
          <div className="row__gallery">
            {loading ? (
              <p style={{ padding: "2rem" }}>Searching…</p>
            ) : results.length === 0 ? (
              <p style={{ padding: "2rem" }}>No results yet.</p>
            ) : (
              results.map((item) => {
                const isSelected = listIds.includes(item.id);
                return (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="card"
                    role="button"
                    tabIndex={0}
                    onClick={async () => {
                      const videos = await fetchVideos(item.mediaType, item.id);
                      setVideoKey(getYouTubeTrailerKey(videos));
                    }}
                    onKeyDown={async (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        const videos = await fetchVideos(
                          item.mediaType,
                          item.id,
                        );
                        setVideoKey(getYouTubeTrailerKey(videos));
                      }
                    }}
                  >
                    <img
                      className="card__image"
                      src={item.image}
                      alt={item.title}
                    />
                    <div className="card__overlay">
                      <h3 className="card__title">{item.title}</h3>
                      {item.meta ? (
                        <p className="card__meta">{item.meta}</p>
                      ) : null}
                      <button
                        type="button"
                        className={`card__action ${isSelected ? "card__action--active" : ""
                          }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleMyList(item);
                        }}
                      >
                        {isSelected ? "✓ My List" : "+ My List"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <TrailerModal videoKey={videoKey} onClose={() => setVideoKey(null)} />
      </main>

      <footer className="site-footer">
        <p>© 2026 NetfliX Clone. This is a demo project.</p>
      </footer>
    </>
  );
}

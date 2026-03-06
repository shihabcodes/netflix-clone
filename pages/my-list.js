import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import TrailerModal from "../components/TrailerModal";
import { fetchVideos, getYouTubeTrailerKey } from "../lib/tmdb";
import { useMyList } from "../lib/useMyList";

export default function MyList() {
  const { list, removeItem, loading } = useMyList();
  const [videoKey, setVideoKey] = useState(null);

  const playTrailer = async (item) => {
    const videos = await fetchVideos(item.mediaType || "movie", item.id);
    const key = getYouTubeTrailerKey(videos);
    setVideoKey(key);
  };

  return (
    <>
      <Head>
        <title>My List · NetfliX Clone</title>
        <meta
          name="description"
          content="Your saved list of movies and shows."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <section className="hero">
          <div className="hero__overlay" />
          <div className="hero__content">
            <h1 className="hero__title">My List</h1>
            <p className="hero__subtitle">
              Your saved movies and shows. Remove items to keep the list tidy.
            </p>
          </div>
        </section>

        <section className="row" aria-label="My list">
          <h2 className="row__title">Saved</h2>
          <div className="row__gallery">
            {loading ? (
              <p>Loading…</p>
            ) : list.length === 0 ? (
              <p>Your list is empty. Add something from the Home page.</p>
            ) : (
              list.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  role="button"
                  tabIndex={0}
                  onClick={() => playTrailer(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      playTrailer(item);
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
                      className="card__action"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeItem(item.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
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

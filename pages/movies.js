import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import CarouselRow from "../components/CarouselRow";
import TrailerModal from "../components/TrailerModal";
import {
  fetchTMDB,
  posterUrl,
  fetchVideos,
  getYouTubeTrailerKey,
} from "../lib/tmdb";
import { useMyList } from "../lib/useMyList";

const fallbackTitles = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    meta: "Sci-Fi · Drama · Thriller",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "the-crown",
    title: "The Crown",
    meta: "History · Drama",
    image:
      "https://images.unsplash.com/photo-1476231790875-016a80c274f5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    meta: "Sci-Fi · Anthology",
    image:
      "https://images.unsplash.com/photo-1530451334546-5e7a3a802624?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ozark",
    title: "Ozark",
    meta: "Crime · Drama",
    image:
      "https://images.unsplash.com/photo-1531938415761-0a7f90b1667b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "the-witcher",
    title: "The Witcher",
    meta: "Fantasy · Action",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "narcos",
    title: "Narcos",
    meta: "Crime · Thriller",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
];

function normalizeItems(items) {
  return items.map((item) => ({
    id: item.id,
    title: item.title || item.name,
    mediaType: "movie",
    meta: item.release_date
      ? item.release_date.slice(0, 4)
      : item.first_air_date
        ? item.first_air_date.slice(0, 4)
        : "",
    image:
      posterUrl(item.poster_path) ||
      posterUrl(item.backdrop_path) ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  }));
}

export default function Movies({ movies }) {
  const { list, addItem, removeItem } = useMyList();
  const listIds = list.map((item) => item.id);
  const [videoKey, setVideoKey] = useState(null);

  const toggleMyList = (item) => {
    if (listIds.includes(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const playTrailer = async (item) => {
    const videos = await fetchVideos(item.mediaType, item.id);
    const key = getYouTubeTrailerKey(videos);
    setVideoKey(key);
  };

  const heroImage = movies?.[0]?.image || "";

  return (
    <>
      <Head>
        <title>Movies · NetfliX Clone</title>
        <meta
          name="description"
          content="Browse popular movies in this Netflix-style demo."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <section
          className="hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero__overlay" />
          <div className="hero__content">
            <h1 className="hero__title">Popular Movies</h1>
            <p className="hero__subtitle">
              The most watched and trending movies right now.
            </p>
            <div className="hero__actions">
              <a className="btn btn--secondary" href="/">
                Back to Home
              </a>
            </div>
          </div>
        </section>

        <CarouselRow
          title="Popular Movies"
          items={movies}
          selectedIds={listIds}
          onToggleItem={toggleMyList}
          onCardClick={playTrailer}
        />

        <TrailerModal videoKey={videoKey} onClose={() => setVideoKey(null)} />
      </main>

      <footer className="site-footer">
        <p>© 2026 NetfliX Clone. This is a demo project.</p>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  const moviesRaw = await fetchTMDB(
    "/discover/movie?sort_by=popularity.desc&include_adult=false",
  );

  const movies = normalizeItems(moviesRaw).slice(0, 18);

  return {
    props: {
      movies: movies.length ? movies : fallbackTitles,
    },
    revalidate: 60 * 10,
  };
}

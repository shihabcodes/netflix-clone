import Head from "next/head";
import { useState } from "react";
import CarouselRow from "../components/CarouselRow";
import Header from "../components/Header";
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
    mediaType: "tv",
  },
  {
    id: "the-crown",
    title: "The Crown",
    meta: "History · Drama",
    image:
      "https://images.unsplash.com/photo-1476231790875-016a80c274f5?auto=format&fit=crop&w=800&q=80",
    mediaType: "tv",
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    meta: "Sci-Fi · Anthology",
    image:
      "https://images.unsplash.com/photo-1530451334546-5e7a3a802624?auto=format&fit=crop&w=800&q=80",
    mediaType: "tv",
  },
  {
    id: "ozark",
    title: "Ozark",
    meta: "Crime · Drama",
    image:
      "https://images.unsplash.com/photo-1531938415761-0a7f90b1667b?auto=format&fit=crop&w=800&q=80",
    mediaType: "tv",
  },
  {
    id: "the-witcher",
    title: "The Witcher",
    meta: "Fantasy · Action",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
    mediaType: "tv",
  },
  {
    id: "narcos",
    title: "Narcos",
    meta: "Crime · Thriller",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    mediaType: "tv",
  },
];

function normalizeItems(items) {
  return items.map((item) => ({
    id: item.id,
    title: item.title || item.name,
    mediaType: item.media_type || "movie",
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

export default function Home({ featured, trending, movies, shows }) {
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

  const heroTitle = featured?.title || featured?.name || "Featured";
  const heroMeta = featured?.meta || featured?.overview || "";
  const heroImage = featured?.image || "";

  return (
    <>
      <Head>
        <title>NetfliX Clone</title>
        <meta
          name="description"
          content="A simple NetfliX-style demo built with Next.js."
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
            <h1 className="hero__title">{heroTitle}</h1>
            <p className="hero__meta">{heroMeta}</p>

            <div className="hero__actions">
              <button
                className="btn btn--primary"
                type="button"
                onClick={() =>
                  playTrailer({
                    id: featured.id,
                    mediaType: featured.mediaType || "movie",
                  })
                }
              >
                ▶ Play
              </button>
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => toggleMyList(featured)}
              >
                {listIds.includes(featured?.id) ? "✓ My List" : "+ My List"}
              </button>
            </div>
          </div>
        </section>

        <CarouselRow
          title="Trending Now"
          items={trending}
          selectedIds={listIds}
          onToggleItem={toggleMyList}
          onCardClick={playTrailer}
        />
        <CarouselRow
          title="Popular Movies"
          items={movies}
          selectedIds={listIds}
          onToggleItem={toggleMyList}
          onCardClick={playTrailer}
        />
        <CarouselRow
          title="Popular Shows"
          items={shows}
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
  const trendingRaw = await fetchTMDB("/trending/all/week?");
  const moviesRaw = await fetchTMDB(
    "/discover/movie?sort_by=popularity.desc&include_adult=false",
  );
  const showsRaw = await fetchTMDB("/discover/tv?sort_by=popularity.desc");

  const trending = normalizeItems(trendingRaw).slice(0, 12);
  const movies = normalizeItems(moviesRaw).slice(0, 12);
  const shows = normalizeItems(showsRaw).slice(0, 12);

  const featured = (trending.length ? trending : fallbackTitles)[0];

  return {
    props: {
      featured,
      trending: trending.length ? trending : fallbackTitles,
      movies: movies.length ? movies : fallbackTitles,
      shows: shows.length ? shows : fallbackTitles,
    },
    revalidate: 60 * 10,
  };
}

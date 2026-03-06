const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getKey() {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY || null;
}

function withFallback(data, fallback = []) {
  if (!data) return fallback;
  if (Array.isArray(data)) return data;
  if (data.results) return data.results;
  return fallback;
}

export async function fetchTMDB(endpoint) {
  const key = getKey();
  if (!key) {
    console.warn(
      "NEXT_PUBLIC_TMDB_API_KEY is not set. TMDB requests will be skipped.",
    );
    return [];
  }

  const url = `${API_BASE}${endpoint}&api_key=${key}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`TMDB fetch failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = await res.json();
  return withFallback(json, []);
}

export async function searchTMDB(query) {
  if (!query) return [];
  const encoded = encodeURIComponent(query.trim());
  const results = await fetchTMDB(`/search/multi?query=${encoded}`);
  return results;
}

export async function fetchVideos(mediaType, id) {
  if (!mediaType || !id) return [];
  const results = await fetchTMDB(`/${mediaType}/${id}/videos?`);
  return results;
}

export function posterUrl(path) {
  if (!path) return "";
  return `${IMAGE_BASE}${path}`;
}

export function getYouTubeTrailerKey(videos) {
  if (!Array.isArray(videos)) return null;
  const trailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );
  if (trailer?.key) return trailer.key;
  const fallback = videos.find((v) => v.site === "YouTube");
  return fallback?.key || null;
}

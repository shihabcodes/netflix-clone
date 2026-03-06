# NetfliX Clone (Next.js)

A small Netflix-style demo built with **Next.js**, featuring:

- ✅ Routing for **Home**, **Movies**, and **Shows**
- ✅ TMDB integration (via `NEXT_PUBLIC_TMDB_API_KEY`)
- ✅ Smooth **horizontal carousel scrolling**
- ✅ Static generation (SSG) for fast pages

---

## Getting started

```bash
cd /Users/shihabcodes/Downloads/codew-shihab-usingclaude
npm install
```

### Run locally

```bash
npm run dev
```

Then open: `http://localhost:3000`

---

## TMDB API key (optional but recommended)

This repo uses The Movie Database (TMDB) for real data. Create a file called `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

Then update the API key:

```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

Get a free API key here: https://developers.themoviedb.org/3/getting-started/introduction

---

## Routes

- `/` – Home (trending + popular rows)
- `/movies` – Movies carousel
- `/shows` – TV shows carousel
- `/my-list` – Your saved list (stored via local API)

---

## Notes

If `NEXT_PUBLIC_TMDB_API_KEY` is not set, the app will fall back to sample placeholder cards.

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix Logo" width="300" />
  
  <br />
  <br />

  **A modern front-end clone of Netflix, built with Next.js, React, and Firebase.**

  <br />

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-blue?logo=react&logoColor=white)](https://reactjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

---

## 📖 About the Project

This is an open-source clone of the popular streaming platform, **Netflix**. The project aims to replicate the core UI/UX and essential features of the original website, serving as an excellent demonstration of modern front-end development capabilities.

This project is built to fetch real movie and TV show data using the [TMDB (The Movie Database) API](https://www.themoviedb.org/), complete with seamless horizontal scrolling and dynamic routing. It also integrates Firebase for authentication and database management.

### ✨ Features

- 🔐 **Authentication:** User login and registration functionality via Firebase.
- 🎬 **Dynamic Data:** Real-time data fetching using the TMDB API.
- 📱 **Responsive Design:** Fully responsive layout that looks great on all devices (mobile, tablet, desktop).
- 🔍 **Search Functionality:** Find your favorite movies and TV shows instantly.
- 🗂️ **My List:** Save movies and shows to a personalized list.
- 🚦 **Routing:** Fast client-side routing with Next.js (Home, Movies, Shows, My List, Search, etc.).
- 💨 **Performance:** Implementation of best practices for optimal loading speeds and SEO.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Library:** [React.js](https://reactjs.org/)
- **Styling:** CSS Modules / Vanilla CSS
- **Backend/Auth:** [Firebase](https://firebase.google.com/)
- **API:** [TMDB API](https://www.themoviedb.org/documentation/api)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or newer)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shihabcodes/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```bash
   touch .env.local
   ```
   Add the following content (replace with your actual key):
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   *You can get a free API key by signing up at [TMDB](https://developers.themoviedb.org/3/getting-started/introduction).*

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to view it.

---

## 📂 Project Structure

```text
netflix-clone/
├── components/   # Reusable UI components (Navbar, MovieCards, Row, etc.)
├── pages/        # Next.js page routing (index, login, search, my-list, etc.)
├── styles/       # Global styles and CSS Modules
├── lib/          # Helper functions and Firebase configuration
└── public/       # Static assets (images, icons)
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

To contribute:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Show some ❤️ by starring this repository!</p>
</div>

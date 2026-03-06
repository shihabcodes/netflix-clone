import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "TV Shows", href: "/shows" },
    { label: "Movies", href: "/movies" },
    { label: "My List", href: "/my-list" },
  ];

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="brand">
        <span className="brand__logo">NETFLIX</span>
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={`nav__link ${router.pathname === item.href ? "nav__link--active" : ""
              }`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="btn btn--icon"
          type="button"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
        >
          🔍
        </button>

        {user ? (
          <>
            <button
              className="btn btn--icon"
              type="button"
              aria-label="Notifications"
            >
              🔔
            </button>
            <div className="profile">
              <button
                className="btn btn--avatar"
                type="button"
                aria-label="Account"
              >
                <span className="avatar">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </button>
            </div>
            <button
              type="button"
              className="btn btn--text"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link className="btn btn--text" href="/login">
            Sign in
          </Link>
        )}
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(item) => {
          setSearchOpen(false);
          router.push(
            `/search?q=${encodeURIComponent(item.title)}&media=${item.mediaType}&id=${item.id}`,
          );
        }}
      />
    </header>
  );
}

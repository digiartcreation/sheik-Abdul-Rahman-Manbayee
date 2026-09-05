"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "முகப்பு" },
  { href: "/pirivugal", label: "பிரிவுகள்" },
  { href: "/kelvi-pathil", label: "கேள்வி-பதில்" },
  { href: "/ungal-paguthi", label: "உங்கள் பகுதி" },
  { href: "/patri", label: "எங்களை பற்றி" },
  { href: "/thodarbu", label: "தொடர்பு" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <Link href="/" className="logo" aria-label="Ahlul Islam home">
          <span className="logo-icon">☪</span>
          <span className="logo-text">AHLUL ISLAM</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-menu${menuOpen ? " is-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Switch color theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>
    </header>
  );
}

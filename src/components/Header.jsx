"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);

  // Condense the bar once the reader leaves the top of the page.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Rotating a phone to landscape can cross the 768px breakpoint, at which
  // point the drawer CSS stops applying and the menu becomes an inline bar —
  // but the scroll lock below would stay on, freezing the page. Close it.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 769px)");
    const onChange = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  // While the drawer covers the screen, the page behind it must not scroll.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        // Send focus back to the control that opened the drawer.
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // A route change should never leave the drawer hanging open — including a
  // browser back/forward, which never runs the links' onClick. Adjusting during
  // render rather than in an effect avoids a second render pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      {/* Sits outside <nav> on purpose: it must dim the page, not the nav bar. */}
      <button
        type="button"
        className={`nav-backdrop${menuOpen ? " is-open" : ""}`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />

      <nav className="nav container" aria-label="Main navigation">
        <Link href="/" className="logo" aria-label="Ahlul Islam home">
          <span className="logo-icon" aria-hidden="true">☪</span>
          <span className="logo-text">AHLUL ISLAM</span>
        </Link>

        <button
          ref={toggleRef}
          className={`nav-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="nav-menu" className={`nav-menu${menuOpen ? " is-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <span className="theme-toggle-icon">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

"use client";
import { useEffect, useState } from "react";

/** Appears after a screenful of scrolling; returns the reader to the top. */
export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      // Coalesce scroll events into one read per frame — scroll handlers that
      // touch layout on every event are a common source of jank.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setShow(window.scrollY > window.innerHeight * 0.8);
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

  return (
    <button
      type="button"
      className={`scroll-top${show ? " is-visible" : ""}`}
      aria-label="மேலே செல்ல"
      tabIndex={show ? 0 : -1}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

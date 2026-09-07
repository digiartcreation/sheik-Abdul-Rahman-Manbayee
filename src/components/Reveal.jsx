"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Reveals its children when they scroll into view.
 *
 * The old approach animated everything on page load, so anything below the fold
 * had already finished its entrance by the time you scrolled to it. This fires
 * per element instead, and only once.
 *
 * `delay` staggers siblings; keep it under ~300ms so a list never feels slow.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  as: Tag = "div",
  className = "",
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion is handled entirely in CSS — the media query in
    // globals.css forces .reveal to full opacity with no transform — so there
    // is deliberately no JS branch for it here.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // Slightly inside the viewport, so the motion is seen rather than missed.
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${shown ? " is-visible" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

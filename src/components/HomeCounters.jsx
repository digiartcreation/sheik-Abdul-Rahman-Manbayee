"use client";
import { useEffect, useRef, useState } from "react";

/** Counts up to `target` the first time it scrolls into view. */
function Counter({ target, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // A count-up is motion; someone who asked for less just gets the
          // figure, by collapsing the duration to a single frame.
          // 1ms rather than 0: the first frame can share a timestamp with
          // `start`, and 0/0 would put NaN on the screen.
          const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? 1
            : 1600;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            // Ease out cubic: races ahead, then settles. A linear count reads
            // like a loading spinner rather than a figure arriving.
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="hero-counter" ref={ref}>
      <span className="hero-counter-number">{count}+</span>
      <span className="hero-counter-label">{label}</span>
    </div>
  );
}

export default function HomeCounters({ articleCount }) {
  return (
    <div className="hero-counters animate-fade-in">
      <Counter target={articleCount} label="கட்டுரைகள்" />
      <Counter target={85} label="வீடியோக்கள்" />
      <Counter target={60} label="ஆடியோக்கள்" />
      <Counter target={40} label="வகுப்புகள்" />
    </div>
  );
}

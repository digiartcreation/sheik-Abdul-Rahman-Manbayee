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
          const duration = 1500;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * target));
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

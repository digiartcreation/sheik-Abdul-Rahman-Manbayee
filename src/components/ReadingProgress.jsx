"use client";
import { useEffect, useState } from "react";

/**
 * A thin bar across the top of the viewport showing how far through the article
 * the reader is. Long Tamil essays benefit from the sense of remaining length.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const doc = document.documentElement;
      // How far there is left to travel; guard the case where the page is
      // shorter than the viewport and this would divide by zero.
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0);
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div className="reading-progress-bar" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}

"use client";

// The links need the page's absolute URL, which only the browser knows. Rather
// than storing it in state on mount, each button reads it when it is clicked —
// so there is nothing to synchronise and the server and client render the same
// markup.
const targets = {
  whatsapp: (title, url) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  facebook: (title, url) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (title, url) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
};

export default function ShareButtons({ title }) {
  const share = (network) => () => {
    window.open(targets[network](title, window.location.href), "_blank", "noopener");
  };

  return (
    <div className="share-buttons">
      <button className="share-btn whatsapp" type="button" onClick={share("whatsapp")} aria-label="Share on WhatsApp">
        💬
      </button>
      <button className="share-btn facebook" type="button" onClick={share("facebook")} aria-label="Share on Facebook">
        f
      </button>
      <button className="share-btn twitter" type="button" onClick={share("twitter")} aria-label="Share on Twitter">
        𝕏
      </button>
      <button
        className="share-btn copy"
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied!");
        }}
        aria-label="Copy link"
      >
        🔗
      </button>
    </div>
  );
}

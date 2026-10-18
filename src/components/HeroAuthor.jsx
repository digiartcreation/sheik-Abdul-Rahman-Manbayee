"use client";
import { useRef } from "react";

const PHOTO = "/sheikh-abdur-rahman.webp";
const NAME = "Sheikh Abdur Rahman";

/**
 * The founder's portrait in the home hero. Clicking it opens the whole photo in
 * a <dialog>: `showModal()` puts it in the top layer above the sticky header,
 * traps focus and closes on Escape, none of which has to be done by hand.
 */
export default function HeroAuthor() {
  const dialogRef = useRef(null);
  const close = () => dialogRef.current?.close();

  return (
    <div className="hero-author">
      <button
        type="button"
        className="hero-author-photo"
        aria-haspopup="dialog"
        aria-label={`${NAME} — முழு படத்தை பார்க்க`}
        onClick={() => dialogRef.current?.showModal()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt={NAME} width={462} height={556} fetchPriority="high" />
        <span className="hero-author-zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </button>

      <p className="hero-author-plate">
        <span className="hero-author-name">{NAME}</span>
        <span className="hero-author-role">M. அப்துர் ரஹ்மான் மன்பஈ</span>
      </p>

      <dialog
        ref={dialogRef}
        className="photo-lightbox"
        aria-label={NAME}
        // The figure is the dialog's only box, so a click that lands on the
        // dialog itself came from the backdrop.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO} alt={NAME} width={462} height={556} />
          <figcaption>{NAME}</figcaption>
        </figure>

        <button type="button" className="photo-lightbox-close" aria-label="மூட" onClick={close}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </dialog>
    </div>
  );
}

"use client";
import { use } from "react";
import Link from "next/link";
import { getContentById, getLatestContent, formatDate } from "@/lib/data";

export default function ArticleDetailPage({ params }) {
  const { id } = use(params);
  const item = getContentById(id);

  if (!item) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 16 }}>இந்த உள்ளடக்கம் கிடைக்கவில்லை</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            தயவுசெய்து மற்ற பதிவுகளை பார்க்கவும்.
          </p>
          <Link href="/pirivugal" className="btn btn-primary">பிரிவுகளுக்கு செல்ல</Link>
        </div>
      </section>
    );
  }

  const related = getLatestContent(3).filter((r) => r.id !== item.id).slice(0, 2);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>{item.category}</p>
          <h1>{item.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-detail">
            <div className="article-detail-header">
              <div className="article-detail-meta">
                <span>✍️ {item.author}</span>
                <span>📅 {formatDate(item.date)}</span>
                <span>📂 {item.category}</span>
                {item.views && <span>👁 {item.views} பார்வைகள்</span>}
              </div>

              <Link href="/pirivugal" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                ← பிரிவுகளுக்கு திரும்ப
              </Link>
            </div>

            {item.image && (
              <img className="article-cover" src={item.image} alt={item.title} />
            )}

            {item.videoUrl && (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 32 }}>
                <iframe
                  src={item.videoUrl}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0, borderRadius: "var(--radius-md)" }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="article-body">
              {(item.content || item.description || "").split(/\n{2,}/).filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="share-buttons">
              <a className="share-btn whatsapp" href={`https://wa.me/?text=${encodeURIComponent(item.title + " " + shareUrl)}`} target="_blank" rel="noopener" aria-label="Share on WhatsApp">💬</a>
              <a className="share-btn facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" aria-label="Share on Facebook">f</a>
              <a className="share-btn twitter" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" aria-label="Share on Twitter">𝕏</a>
              <button className="share-btn copy" onClick={() => { navigator.clipboard.writeText(shareUrl); alert("Link copied!"); }} aria-label="Copy link">🔗</button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">மேலும் படிக்க</p>
              <h2>தொடர்புடைய பதிவுகள்</h2>
            </div>
            <div className="card-grid">
              {related.map((r) => (
                <article className="content-card" key={r.id}>
                  {r.image && (
                    <div className="content-card-image">
                      <img src={r.image} alt={r.title} loading="lazy" />
                    </div>
                  )}
                  <div className="content-card-body">
                    <p className="content-card-meta">{formatDate(r.date)}</p>
                    <h3><Link href={`/katurai/${r.id}`}>{r.title}</Link></h3>
                    <p>{(r.description || r.content || "").substring(0, 100)}...</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

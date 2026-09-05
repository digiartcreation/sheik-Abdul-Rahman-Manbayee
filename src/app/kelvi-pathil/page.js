"use client";
import { useState } from "react";
import Link from "next/link";
import { sampleArticles, formatDate } from "@/lib/data";

// Filter articles that were categorized as "கேள்வி & பதில்" in original site
const qaArticles = sampleArticles.filter(
  (a) => a.category === "கேள்வி & பதில்" || a.title.includes("கேள்வி") || a.title.includes("சந்தேகங்கள்")
);

export default function KelviPathilPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    e.target.reset();
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Q&A</p>
          <h1>கேள்வி - பதில்</h1>
          <p>உங்கள் ஐயங்களை இங்கு பதியவும்</p>
        </div>
      </section>

      {/* Question Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="intro-card">
            <div className="section-heading" style={{ marginBottom: 24 }}>
              <h2>உங்கள் கேள்வியை பதிவு செய்யுங்கள்</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="q-name">பெயர்</label>
                <input id="q-name" type="text" placeholder="உங்கள் பெயர்" required />
              </div>
              <div className="form-group">
                <label htmlFor="q-email">மின்னஞ்சல்</label>
                <input id="q-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="q-topic">பிரிவு</label>
                <select id="q-topic" required>
                  <option value="">-- பிரிவைத் தேர்ந்தெடுக்கவும் --</option>
                  <option value="குர்ஆன்">குர்ஆன்</option>
                  <option value="ஹதீஸ்">ஹதீஸ்</option>
                  <option value="கொள்கை">கொள்கை</option>
                  <option value="சட்டங்கள்">சட்டங்கள்</option>
                  <option value="வரலாறு">வரலாறு</option>
                  <option value="மதங்கள்">மதங்கள்</option>
                  <option value="பொதுவானவை">பொதுவானவை</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="q-question">உங்கள் கேள்வி</label>
                <textarea id="q-question" rows={5} placeholder="உங்கள் கேள்வியை இங்கு எழுதுங்கள்..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                கேள்வியை அனுப்பு
              </button>
              {submitted && (
                <p className="form-message">✅ உங்கள் கேள்வி பெறப்பட்டது. விரைவில் பதில் அளிக்கப்படும்.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Existing Q&As from real site data */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-heading">
            <p className="eyebrow">பதில்கள்</p>
            <h2>முந்தைய கேள்வி - பதில்கள்</h2>
          </div>
          <div className="stagger">
            {qaArticles.length > 0 ? (
              qaArticles.map((qa) => (
                <Link href={`/katurai/${qa.id}`} key={qa.id} className="qa-card" style={{ display: "block" }}>
                  <h3>{qa.title}</h3>
                  <p>{qa.content.substring(0, 200)}...</p>
                  <div className="content-card-footer" style={{ borderTop: "none", paddingTop: 0, marginTop: 12 }}>
                    <span className="content-card-author">{qa.author}</span>
                    <span className="content-card-meta">{formatDate(qa.date)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 24 }}>
                இன்னும் கேள்வி-பதில்கள் இல்லை.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

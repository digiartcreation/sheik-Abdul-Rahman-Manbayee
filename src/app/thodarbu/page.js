"use client";
import { useState } from "react";
import Reveal from "@/components/Reveal";

export default function ThodarbuPage() {
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
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Contact</p>
          <h1>தொடர்பு கொள்ளுங்கள்</h1>
          <p>உங்கள் கேள்விகள், கருத்துக்கள் அல்லது ஆலோசனைகளை எங்களுக்கு தெரிவியுங்கள்.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <Reveal variant="left">
              <div className="intro-card">
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 24 }}>எங்களுக்கு எழுதுங்கள்</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="c-name">பெயர்</label>
                    <input id="c-name" type="text" placeholder="உங்கள் பெயர்" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email">மின்னஞ்சல்</label>
                    <input id="c-email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-subject">தலைப்பு</label>
                    <input id="c-subject" type="text" placeholder="செய்தியின் தலைப்பு" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-message">செய்தி</label>
                    <textarea id="c-message" rows={6} placeholder="உங்கள் செய்தியை இங்கு எழுதுங்கள்..." required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                    செய்தி அனுப்பு
                  </button>
                  {submitted && (
                    <p className="form-message">✅ உங்கள் செய்தி அனுப்பப்பட்டது. விரைவில் பதில் அளிக்கப்படும்.</p>
                  )}
                </form>
              </div>
            </Reveal>

            {/* Contact Info */}
            <Reveal variant="right" delay={90}>
              <div className="contact-info-card">
                <h3>📍 முகவரி</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Pudupettai, Chennai<br />Tamil Nadu, India
                </p>
              </div>

              <div className="contact-info-card">
                <h3>📞 தொலைபேசி</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  <a href="tel:+919840828225" style={{ color: "var(--primary)", fontWeight: 600 }}>
                    +91 98408 28225
                  </a>
                </p>
              </div>

              <div className="contact-info-card">
                <h3>✉️ மின்னஞ்சல்</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  <a href="mailto:info@ahlulislam.net" style={{ color: "var(--primary)", fontWeight: 600 }}>
                    info@ahlulislam.net
                  </a>
                </p>
              </div>

              <div className="contact-info-card">
                <h3>🌐 சமூக ஊடகங்கள்</h3>
                <div className="footer-social" style={{ marginTop: 12 }}>
                  <a href="https://x.com/Ahlulislam3?s=08" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
                  <a href="https://www.facebook.com/ahlulislam.net" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                  <a href="#" aria-label="YouTube">▶</a>
                </div>
              </div>

              {/* FAQ */}
              <div className="contact-info-card" style={{ marginTop: 16 }}>
                <h3>❓ அடிக்கடி கேட்கப்படும் கேள்விகள்</h3>
                <div style={{ marginTop: 12 }}>
                  {[
                    { q: "உங்களின் ஆதாரங்கள் எவை?", a: "குர்ஆன், ஸஹீஹ் ஹதீஸ்கள், ஸலஃபுஸ் ஸாலிஹீன்களின் விளக்கங்கள்." },
                    { q: "கேள்வி அனுப்பலாமா?", a: "நிச்சயமாக! கேள்வி-பதில் பகுதியில் உங்கள் கேள்விகளை பதிவு செய்யலாம்." },
                  ].map((faq, i) => (
                    <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 1 ? "1px solid var(--border-light)" : "none" }}>
                      <p style={{ fontWeight: 700, marginBottom: 4, fontSize: "0.9rem" }}>{faq.q}</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";
import { useState } from "react";

export default function UngalPaguthiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [posts] = useState([
    { id: 1, name: "அஹ்மது", date: "2024-10-15", content: "மிகவும் பயனுள்ள இணையதளம். இஸ்லாமிய கல்வியை தமிழில் எளிமையாக புரிந்துகொள்ள உதவுகிறது. ஜஸாக்கல்லாஹு கைரன்!" },
    { id: 2, name: "ஃபாத்திமா", date: "2024-09-22", content: "ஹதீஸ் எப்படி புரிவது என்ற தொடர் மிகவும் அருமை. இன்னும் அதிக கட்டுரைகள் வெளியிடுங்கள்." },
    { id: 3, name: "இப்ராஹீம்", date: "2024-08-10", content: "மதங்கள் பிரிவு மிகவும் ஆழமாக எழுதப்பட்டுள்ளது. இது போன்ற ஒப்பீட்டு ஆய்வுகள் மேலும் தேவை." },
  ]);

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
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Your Space</p>
          <h1>உங்கள் பகுதி</h1>
          <p>உங்களின் கருத்துக்கள் ஆலோசனைகள் விமர்சனங்கள் ஆகியவற்றை இங்கு பதிவிடவும்.</p>
        </div>
      </section>

      {/* Submission Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="intro-card">
            <div className="section-heading" style={{ marginBottom: 24 }}>
              <h2>உங்கள் கருத்தை பதிவு செய்யுங்கள்</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="u-name">பெயர்</label>
                <input id="u-name" type="text" placeholder="உங்கள் பெயர்" required />
              </div>
              <div className="form-group">
                <label htmlFor="u-email">மின்னஞ்சல்</label>
                <input id="u-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="u-type">வகை</label>
                <select id="u-type" required>
                  <option value="">-- தேர்ந்தெடுக்கவும் --</option>
                  <option value="கருத்து">கருத்து</option>
                  <option value="ஆலோசனை">ஆலோசனை</option>
                  <option value="விமர்சனம்">விமர்சனம்</option>
                  <option value="பாராட்டு">பாராட்டு</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="u-content">உங்கள் கருத்து</label>
                <textarea id="u-content" rows={5} placeholder="உங்கள் கருத்தை இங்கு எழுதுங்கள்..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                பதிவு செய்
              </button>
              {submitted && (
                <p className="form-message">✅ உங்கள் கருத்து பதிவு செய்யப்பட்டது. நன்றி!</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Existing User Posts */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-heading">
            <p className="eyebrow">கருத்துக்கள்</p>
            <h2>வாசகர்களின் கருத்துக்கள்</h2>
          </div>
          <div className="stagger">
            {posts.map((post) => (
              <div className="user-post-card" key={post.id}>
                <p className="user-name">{post.name}</p>
                <p className="user-date">{new Date(post.date).toLocaleDateString("ta-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

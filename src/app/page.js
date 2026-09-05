"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { divisions } from "@/lib/divisions";
import { sampleArticles, getContentByDivision, getLatestContent, formatDate } from "@/lib/data";

/* ─── Animated Counter ─── */
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

/* ─── Content Card ─── */
function ContentCard({ item }) {
  return (
    <article className="content-card">
      {item.image && (
        <div className="content-card-image">
          <img src={item.image} alt={item.title} loading="lazy" />
          <span className="content-card-badge">{item.category}</span>
        </div>
      )}
      <div className="content-card-body">
        <p className="content-card-meta">{formatDate(item.date)}</p>
        <h3>
          <Link href={`/katurai/${item.id}`}>{item.title}</Link>
        </h3>
        <p>{(item.description || item.content || "").substring(0, 150)}...</p>
        <div className="content-card-footer">
          <span className="content-card-author">{item.author}</span>
          {item.views && (
            <span className="content-card-views">👁 {item.views}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── Category Tabs ─── */
function CategoryTabs() {
  const [activeTab, setActiveTab] = useState(divisions[0].key);
  const items = getContentByDivision(activeTab);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Browse by Category</p>
          <h2>பிரிவுகள் படி தேடுக</h2>
        </div>

        <div className="category-tab-list" role="tablist">
          {divisions.map((d) => (
            <button
              key={d.key}
              className={`category-tab-btn${activeTab === d.key ? " active" : ""}`}
              onClick={() => setActiveTab(d.key)}
              role="tab"
              aria-selected={activeTab === d.key}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>

        <div className="card-grid stagger" key={activeTab}>
          {items.length > 0 ? (
            items.slice(0, 6).map((item) => (
              <ContentCard key={item.id} item={item} />
            ))
          ) : (
            <p style={{ textAlign: "center", gridColumn: "1/-1", color: "var(--text-muted)", padding: "48px 0" }}>
              {divisions.find((d) => d.key === activeTab)?.label} பிரிவில் இன்னும் பதிவுகள் இல்லை.
            </p>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href={`/pirivugal?cat=${activeTab}`} className="btn btn-secondary">
              {divisions.find((d) => d.key === activeTab)?.label} — அனைத்தையும் காண →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function HomePage() {
  const latest = getLatestContent(3);

  return (
    <>
      {/* ═══ Hero Section ═══ */}
      <section className="hero">
        <div className="hero-pattern" />
        <div className="container hero-inner">
          <div className="hero-card animate-fade-in-up">
            <div className="hero-content">
              <div>
                <p className="hero-label">AHLUL ISLAM</p>
                <h1 className="hero-title">இஸ்லாமிய அறிவின் வாயில்</h1>
                <p className="hero-text">
                  குர்ஆன், ஹதீஸ், சட்டங்கள் மற்றும் ஆய்வுகள் தமிழில்
                  எளிமையாக புரிந்துகொள்ளுங்கள்.
                </p>
                <div className="hero-actions">
                  <Link href="/pirivugal" className="btn btn-gold">
                    கட்டுரைகளை படிக்க
                  </Link>
                  <Link href="/patri" className="btn btn-secondary" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                    எங்களை பற்றி
                  </Link>
                </div>
              </div>
              <div className="hero-author">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80"
                  alt="Sheikh Abdur Rahman"
                />
                <p className="hero-author-name">Sheikh Abdur Rahman</p>
              </div>
            </div>
          </div>

          <div className="hero-counters animate-fade-in">
            <Counter target={150} label="கட்டுரைகள்" />
            <Counter target={85} label="வீடியோக்கள்" />
            <Counter target={60} label="ஆடியோக்கள்" />
            <Counter target={40} label="வகுப்புகள்" />
          </div>
        </div>
      </section>

      {/* ═══ Introduction ═══ */}
      <section className="section" id="introduction">
        <div className="container">
          <div className="intro-card animate-fade-in-up">
            <p className="bismillah" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

            <div className="section-heading">
              <p className="eyebrow">Introduction</p>
              <h2>அறிமுகம்</h2>
            </div>

            <p className="intro-lead">
              குர்ஆன், ஹதீஸ் மற்றும் அவற்றின் பொருள்தொகுப்புகள் — ஸலஃபுஸ்
              ஸாலிஹீன்களின் வழிமுறைப்படி தெளிவாக அளிப்பதும்,
              புரிந்துகொள்வதும், செயல்படுத்துவதும் — அதுவே{" "}
              <strong>சீரிய பாதை</strong>.
            </p>

            <ul className="intro-points">
              <li>
                <span className="intro-point-title">தெளிவாக அளிப்பது</span>
                குர்ஆனையும் ஹதீஸையும் அவற்றின் பொருளுடன் தமிழில்
                எளிமையாக முன்வைக்கிறோம்.
              </li>
              <li>
                <span className="intro-point-title">சரியாகப் புரிவது</span>
                ஸலஃபுஸ் ஸாலிஹீன்களின் வழிமுறையை அடிப்படையாகக்
                கொண்டு விளக்குகிறோம்.
              </li>
              <li>
                <span className="intro-point-title">வாழ்வில் செயல்படுத்துவது</span>
                அறிந்ததை நடைமுறையில் கொண்டுவர வழிகாட்டும்
                குறிப்புகளை சேர்க்கிறோம்.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ Category Tabs ═══ */}
      <CategoryTabs />

      {/* ═══ Latest Posts ═══ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">கட்டுரைகள் / எழுத்தாளர்</p>
            <h2>புதிய பதிவுகள்</h2>
          </div>

          <div className="latest-grid stagger">
            {latest.map((item) => (
              <Link href={`/katurai/${item.id}`} key={item.id} className="latest-card">
                {item.image && <img src={item.image} alt={item.title} loading="lazy" />}
                <div className="latest-card-body">
                  <p className="content-card-meta">
                    {formatDate(item.date)} — {item.author}
                  </p>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {(item.description || item.content || "").substring(0, 150)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Subscribe ═══ */}
      <section className="subscribe-section section">
        <div className="container subscribe-box">
          <div>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Subscribe</p>
            <h2>தமிழில் இஸ்லாமிய அறிவை தொடர்ந்து பெறுங்கள்</h2>
            <p>
              புதிய கட்டுரைகள், கேள்வி பதில்கள், மற்றும் பயனுள்ள
              நினைவூட்டல்கள் உங்கள் மின்னஞ்சலுக்கு.
            </p>
          </div>
          <form className="subscribe-form" onSubmit={(e) => { e.preventDefault(); alert("நன்றி! சந்தா பதிவு செய்யப்பட்டது."); e.target.reset(); }}>
            <input type="email" placeholder="உங்கள் மின்னஞ்சல்" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}

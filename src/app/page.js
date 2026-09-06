import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import HomeCounters from "@/components/HomeCounters";
import SubscribeForm from "@/components/SubscribeForm";
import { getHomeContent } from "@/lib/content";
import { excerpt, formatDate } from "@/lib/format";

// Posts published from /admin have to show up straight away, so the page is
// rendered per request rather than cached at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { all, latest } = await getHomeContent();

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80"
                  alt="Sheikh Abdur Rahman"
                />
                <p className="hero-author-name">Sheikh Abdur Rahman</p>
              </div>
            </div>
          </div>

          <HomeCounters articleCount={all.length} />
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
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Browse by Category</p>
            <h2>பிரிவுகள் படி தேடுக</h2>
          </div>

          <CategoryTabs articles={all} limit={6} showMoreLink />
        </div>
      </section>

      {/* ═══ Latest Posts ═══ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">கட்டுரைகள் / எழுத்தாளர்</p>
            <h2>புதிய பதிவுகள்</h2>
          </div>

          <div className="latest-grid stagger">
            {latest.map((item) => (
              <Link href={`/katurai/${encodeURIComponent(item.id)}`} key={item.id} className="latest-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.image && <img src={item.image} alt={item.title} loading="lazy" />}
                <div className="latest-card-body">
                  <p className="content-card-meta">
                    {formatDate(item.date)} — {item.author}
                  </p>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {excerpt(item)}
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
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}

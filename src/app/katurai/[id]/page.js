import Link from "next/link";
import { after } from "next/server";
import ShareButtons from "@/components/ShareButtons";
import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
import { getContentById, getLatestContent } from "@/lib/content";
import { excerpt, formatDate } from "@/lib/format";
import { incrementViews } from "@/services/article.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getContentById(decodeURIComponent(id));

  if (!item) return { title: "இந்த உள்ளடக்கம் கிடைக்கவில்லை — Ahlul Islam" };

  return {
    title: `${item.title} — Ahlul Islam`,
    description: excerpt(item, 160),
    openGraph: {
      title: item.title,
      description: excerpt(item, 160),
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const item = await getContentById(decodeURIComponent(id));

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

  // Counted once the page has been sent, so a slow write never delays the read.
  after(() => incrementViews(item.id));

  const related = (await getLatestContent(3)).filter((r) => r.id !== item.id).slice(0, 2);

  return (
    <>
      <ReadingProgress />

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
                {item.views > 0 && <span>👁 {item.views} பார்வைகள்</span>}
              </div>

              <Link href="/pirivugal" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                ← பிரிவுகளுக்கு திரும்ப
              </Link>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            {item.image && <img className="article-cover" src={item.image} alt={item.title} />}

            {item.videoUrl && (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 32 }}>
                <iframe
                  src={item.videoUrl}
                  title={item.title}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0, borderRadius: "var(--radius-md)" }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="article-body">
              {(item.content || item.description || "")
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            <ShareButtons title={item.title} />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <Reveal className="section-heading">
              <p className="eyebrow">மேலும் படிக்க</p>
              <h2>தொடர்புடைய பதிவுகள்</h2>
            </Reveal>
            <div className="card-grid">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 90} variant="scale">
                <article className="content-card">
                  {r.image && (
                    <div className="content-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={r.title} loading="lazy" />
                    </div>
                  )}
                  <div className="content-card-body">
                    <p className="content-card-meta">{formatDate(r.date)}</p>
                    <h3><Link href={`/katurai/${encodeURIComponent(r.id)}`}>{r.title}</Link></h3>
                    <p>{excerpt(r, 100)}</p>
                  </div>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

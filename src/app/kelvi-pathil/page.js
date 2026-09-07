import Link from "next/link";
import QuestionForm from "@/components/QuestionForm";
import { getAllContent } from "@/lib/content";
import { excerpt, formatDate } from "@/lib/format";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "கேள்வி - பதில் — Ahlul Islam",
  description: "உங்கள் ஐயங்களை பதிவு செய்யுங்கள். முந்தைய கேள்வி-பதில்களை படிக்கலாம்.",
};

/** Posts that read as a question, however they were categorised. */
const isQuestion = (article) =>
  article.category === "கேள்வி & பதில்" ||
  article.title.includes("கேள்வி") ||
  article.title.includes("சந்தேகங்கள்");

export default async function KelviPathilPage() {
  const qaArticles = (await getAllContent()).filter(isQuestion);

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Q&amp;A</p>
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
            <QuestionForm />
          </div>
        </div>
      </section>

      {/* Existing Q&As */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-heading">
            <p className="eyebrow">பதில்கள்</p>
            <h2>முந்தைய கேள்வி - பதில்கள்</h2>
          </div>
          <div>
            {qaArticles.length > 0 ? (
              qaArticles.map((qa, i) => (
                <Reveal key={qa.id} delay={Math.min(i, 6) * 60} variant="left">
                <Link
                  href={`/katurai/${encodeURIComponent(qa.id)}`}
                  className="qa-card"
                  style={{ display: "block" }}
                >
                  <h3>{qa.title}</h3>
                  <p>{excerpt(qa, 200)}</p>
                  <div className="content-card-footer" style={{ borderTop: "none", paddingTop: 0, marginTop: 12 }}>
                    <span className="content-card-author">{qa.author}</span>
                    <span className="content-card-meta">{formatDate(qa.date)}</span>
                  </div>
                </Link>
                </Reveal>
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

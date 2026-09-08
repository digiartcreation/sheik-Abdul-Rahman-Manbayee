import Link from "next/link";
import QuestionForm from "@/components/QuestionForm";
import { getAllContent, getQuestions } from "@/lib/content";
import { excerpt, formatDate, truncate } from "@/lib/format";
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
  const [articles, questions] = await Promise.all([getAllContent(), getQuestions()]);

  // Two sources, one list: the archive carried over from the old site, plus any
  // article that reads as a question. Shown newest first, like the rest of site.
  const entries = [
    ...questions.map((q) => ({
      key: q.id,
      href: `/kelvi-pathil/${encodeURIComponent(q.id)}`,
      heading: truncate(q.question, 120),
      body: truncate(q.answer, 200),
      by: q.answeredBy === "admin" ? "Ahlul Islam" : q.answeredBy,
      date: q.date,
    })),
    ...articles.filter(isQuestion).map((a) => ({
      key: a.id,
      href: `/katurai/${encodeURIComponent(a.id)}`,
      heading: truncate(a.title, 120),
      body: excerpt(a, 200),
      by: a.author,
      date: a.date,
    })),
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));

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
            {entries.length > 0 ? (
              entries.map((qa, i) => (
                <Reveal key={qa.key} delay={Math.min(i, 6) * 60} variant="left">
                <Link href={qa.href} className="qa-card" style={{ display: "block" }}>
                  <h3>{qa.heading}</h3>
                  <p>{qa.body}</p>
                  <div className="content-card-footer" style={{ borderTop: "none", paddingTop: 0, marginTop: 12 }}>
                    <span className="content-card-author">{qa.by}</span>
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

import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import ReadingProgress from "@/components/ReadingProgress";
import { getQuestionById, getQuestions } from "@/lib/content";
import { formatDate, truncate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const q = await getQuestionById(decodeURIComponent(slug));

  if (!q) return { title: "இந்த கேள்வி கிடைக்கவில்லை" };

  return {
    title: truncate(q.question, 70),
    description: truncate(q.answer, 160),
  };
}

export default async function QuestionPage({ params }) {
  const { slug } = await params;
  const question = await getQuestionById(decodeURIComponent(slug));

  if (!question) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 16 }}>இந்த கேள்வி கிடைக்கவில்லை</h1>
          <Link href="/kelvi-pathil" className="btn btn-primary">
            கேள்வி-பதில்களுக்கு செல்ல
          </Link>
        </div>
      </section>
    );
  }

  // Neighbouring entries, so a reader can move through the archive in order.
  const all = await getQuestions();
  const at = all.findIndex((q) => q.id === question.id);
  const previous = at > 0 ? all[at - 1] : null;
  const next = at >= 0 && at < all.length - 1 ? all[at + 1] : null;

  return (
    <>
      <ReadingProgress />

      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>கேள்வி - பதில்</p>
          <h1>{truncate(question.question, 110)}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-detail">
            <div className="article-detail-header">
              <div className="article-detail-meta">
                <span>✍️ {question.answeredBy === "admin" ? "Ahlul Islam" : question.answeredBy}</span>
                <span>📅 {formatDate(question.date)}</span>
              </div>

              <Link href="/kelvi-pathil" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                ← அனைத்து கேள்விகள்
              </Link>
            </div>

            <div className="qa-question">
              <p className="qa-question-label">கேள்வி</p>
              <p>{question.question}</p>
            </div>

            <div className="article-body">
              <p className="qa-answer-label">பதில்</p>
              {question.answer
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            <ShareButtons title={truncate(question.question, 90)} />

            <div className="qa-pager">
              {previous ? (
                <Link href={`/kelvi-pathil/${encodeURIComponent(previous.id)}`}>
                  ← {truncate(previous.question, 48)}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/kelvi-pathil/${encodeURIComponent(next.id)}`}>
                  {truncate(next.question, 48)} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

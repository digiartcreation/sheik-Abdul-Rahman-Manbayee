import FeedbackForm from "@/components/FeedbackForm";
import Reveal from "@/components/Reveal";
import { getFeedback } from "@/lib/content";
import { formatDate } from "@/lib/format";

// A comment has to show up as soon as it is sent, so the page is rendered per
// request rather than cached at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "உங்கள் பகுதி",
  description: "உங்களின் கருத்துக்கள் ஆலோசனைகள் விமர்சனங்கள் ஆகியவற்றை இங்கு பதிவிடவும்.",
};

export default async function UngalPaguthiPage() {
  const posts = await getFeedback();

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
            <FeedbackForm />
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
          <div>
            {posts.length > 0 ? (
              posts.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 6) * 60} variant="left">
                <div className="user-post-card">
                  <p className="user-name">{post.name}</p>
                  <p className="user-date">
                    {post.type} · {formatDate(post.date)}
                  </p>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>{post.content}</p>
                </div>
                </Reveal>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 24 }}>
                இன்னும் கருத்துக்கள் இல்லை. முதல் கருத்தை நீங்களே பதிவு செய்யுங்கள்.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

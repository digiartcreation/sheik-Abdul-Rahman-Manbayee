"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { divisions } from "@/lib/divisions";
import { getContentByDivision, getAllContent, formatDate } from "@/lib/data";

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
        <h3><Link href={`/katurai/${item.id}`}>{item.title}</Link></h3>
        <p>{(item.description || item.content || "").substring(0, 150)}...</p>
        <div className="content-card-footer">
          <span className="content-card-author">{item.author}</span>
          {item.views && <span className="content-card-views">👁 {item.views}</span>}
        </div>
      </div>
    </article>
  );
}

export default function PirivugalPage() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || divisions[0].key;
  const [activeTab, setActiveTab] = useState(initialCat);
  const items = getContentByDivision(activeTab);

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Browse by Category</p>
          <h1>பிரிவுகள் படி தேடுக</h1>
          <p>குர்ஆன், ஹதீஸ், கொள்கை, சட்டங்கள் மற்றும் பல பிரிவுகளில் கட்டுரைகளை படிக்கலாம்.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
              items.map((item) => <ContentCard key={item.id} item={item} />)
            ) : (
              <p style={{ textAlign: "center", gridColumn: "1/-1", color: "var(--text-muted)", padding: "48px 0" }}>
                {divisions.find((d) => d.key === activeTab)?.label} பிரிவில் இன்னும் பதிவுகள் இல்லை.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

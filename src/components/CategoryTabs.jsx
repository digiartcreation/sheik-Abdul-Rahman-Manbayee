"use client";
import { useState } from "react";
import Link from "next/link";
import { divisions } from "@/lib/divisions";
import ContentCard from "@/components/ContentCard";

/**
 * The division tabs. `articles` is the whole published list, fetched once on
 * the server, so switching tabs filters in place with no extra request.
 *
 * `limit` caps how many cards a tab shows — the home page previews six, the
 * divisions page shows everything.
 */
export default function CategoryTabs({ articles, initialDivision, limit, showMoreLink = false }) {
  const [activeTab, setActiveTab] = useState(initialDivision || divisions[0].key);

  const active = divisions.find((d) => d.key === activeTab);
  const items = articles.filter((item) => item.division === activeTab);
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <>
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
        {visible.length > 0 ? (
          visible.map((item) => <ContentCard key={item.id} item={item} />)
        ) : (
          <p
            style={{
              textAlign: "center",
              gridColumn: "1/-1",
              color: "var(--text-muted)",
              padding: "48px 0",
            }}
          >
            {active?.label} பிரிவில் இன்னும் பதிவுகள் இல்லை.
          </p>
        )}
      </div>

      {showMoreLink && items.length > visible.length && (
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href={`/pirivugal?cat=${activeTab}`} className="btn btn-secondary">
            {active?.label} — அனைத்தையும் காண →
          </Link>
        </div>
      )}
    </>
  );
}

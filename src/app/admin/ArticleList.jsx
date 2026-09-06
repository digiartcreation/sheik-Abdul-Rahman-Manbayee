"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { divisions, getDivision } from "@/lib/divisions";
import { formatDate } from "@/lib/format";

export default function ArticleList({ articles, editingId, onEdit, onDelete, loading }) {
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("");

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return articles.filter((article) => {
      if (division && article.division !== division) return false;
      if (!term) return true;
      return (
        article.title.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term)
      );
    });
  }, [articles, search, division]);

  return (
    <section className="admin-panel">
      <h2>Posts</h2>
      <p className="admin-panel-sub">
        {loading ? "Loading…" : `${visible.length} of ${articles.length} posts`}
      </p>

      <div className="admin-list-filters">
        <input
          type="text"
          placeholder="Search by heading…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search posts"
        />
        <select
          value={division}
          onChange={(event) => setDivision(event.target.value)}
          aria-label="Filter by section"
        >
          <option value="">All sections</option>
          {divisions.map((item) => (
            <option key={item.key} value={item.key}>{item.label}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="admin-empty">
          {loading ? "Loading posts…" : "No posts match. Add your first one with the form."}
        </p>
      ) : (
        <div className="admin-items">
          {visible.map((article) => (
            <article
              key={article.dbId}
              className={`admin-item${editingId === article.dbId ? " is-editing" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="admin-item-thumb"
                src={article.image || `/thumbnails/${article.division}.svg`}
                alt=""
                loading="lazy"
              />

              <div className="admin-item-body">
                <h3 title={article.title}>{article.title}</h3>
                <p className="admin-item-meta">
                  <span>{getDivision(article.division).label}</span>
                  <span>·</span>
                  <span>{formatDate(article.date)}</span>
                  {article.status === "DRAFT" && <span className="admin-badge is-draft">Draft</span>}
                </p>
              </div>

              <div className="admin-item-actions">
                <Link
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  href={`/katurai/${encodeURIComponent(article.id)}`}
                  target="_blank"
                >
                  View
                </Link>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  type="button"
                  onClick={() => onEdit(article)}
                >
                  Edit
                </button>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  type="button"
                  onClick={() => onDelete(article)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

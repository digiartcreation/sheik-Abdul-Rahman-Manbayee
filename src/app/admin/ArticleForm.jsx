"use client";
import { useState } from "react";
import { divisions, getDivision } from "@/lib/divisions";
import ThumbnailField from "./ThumbnailField";
import { apiPost, apiPut } from "./api";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  title: "",
  division: divisions[0].key,
  category: "",
  author: "",
  description: "",
  content: "",
  image: "",
  videoUrl: "",
  publishedAt: today(),
  status: "PUBLISHED",
});

/** Maps a row from the list back onto the form fields. */
const toForm = (article) => ({
  title: article.title || "",
  division: article.division || divisions[0].key,
  category: article.category || "",
  author: article.author || "",
  description: article.description || "",
  content: article.content || "",
  image: article.image || "",
  videoUrl: article.videoUrl || "",
  publishedAt: article.date || today(),
  status: article.status || "PUBLISHED",
});

/**
 * The page gives this a `key` that changes with the post being edited, so
 * switching posts remounts the form and the initial state below is all that is
 * needed to load it — no effect syncing props into state.
 */
export default function ArticleForm({ editing, onSaved, onCancel }) {
  const [form, setForm] = useState(() => (editing ? toForm(editing) : emptyForm()));
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const division = getDivision(form.division);

  function chooseDivision(key) {
    // The sub-category list belongs to the division, so a stale one is dropped
    // when the section changes.
    setForm((current) => ({ ...current, division: key, category: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setFieldErrors({});
    setMessage(null);

    try {
      const saved = editing
        ? await apiPut(`/api/articles/${editing.dbId}`, form)
        : await apiPost("/api/articles", form);

      if (!editing) setForm(emptyForm());

      // Reported by the page rather than here: finishing an edit clears
      // `editing`, which resets this form and would take the message with it.
      onSaved(saved, editing ? "Post updated." : "Post published.");
    } catch (failure) {
      setFieldErrors(failure.fieldErrors || {});
      setMessage({ type: "error", text: failure.message });
    } finally {
      setBusy(false);
    }
  }

  const errorFor = (field) => fieldErrors[field]?.[0];

  return (
    <form className="admin-panel" onSubmit={handleSubmit}>
      <h2>{editing ? "Edit post" : "Add new content"}</h2>
      <p className="admin-panel-sub">
        {editing
          ? `Editing “${editing.title}”`
          : "Pick a section, give it a heading and a thumbnail, then write the full description."}
      </p>

      {message && (
        <p className={`admin-message is-${message.type}`} role="status">
          {message.text}
        </p>
      )}

      {/* 1. Section */}
      <div className="admin-field">
        <span className="admin-field-label">1. Section</span>
        <div className="admin-sections">
          {divisions.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`admin-section-btn${form.division === item.key ? " is-active" : ""}`}
              style={{ "--section-color": item.color }}
              onClick={() => chooseDivision(item.key)}
              aria-pressed={form.division === item.key}
            >
              <span className="icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        {errorFor("division") && <p className="admin-field-error">{errorFor("division")}</p>}
      </div>

      {/* 2. Heading */}
      <div className="admin-field">
        <label htmlFor="post-title">2. Heading</label>
        <input
          id="post-title"
          type="text"
          required
          placeholder="கட்டுரையின் தலைப்பு"
          value={form.title}
          onChange={set("title")}
          aria-invalid={Boolean(errorFor("title"))}
        />
        {errorFor("title") && <p className="admin-field-error">{errorFor("title")}</p>}
      </div>

      {/* 3. Thumbnail */}
      <ThumbnailField
        value={form.image}
        onChange={(image) => setForm((current) => ({ ...current, image }))}
        error={errorFor("image")}
      />

      {/* 4. Full description */}
      <div className="admin-field">
        <label htmlFor="post-content">4. Full description</label>
        <textarea
          id="post-content"
          rows={14}
          required
          placeholder="முழு கட்டுரையையும் இங்கே எழுதுங்கள்…"
          value={form.content}
          onChange={set("content")}
          aria-invalid={Boolean(errorFor("content"))}
        />
        <p className="admin-field-hint">
          Leave a blank line between paragraphs — each block becomes its own paragraph on the site.
        </p>
        {errorFor("content") && <p className="admin-field-error">{errorFor("content")}</p>}
      </div>

      <div className="admin-field">
        <label htmlFor="post-description">Short summary (optional)</label>
        <textarea
          id="post-description"
          rows={2}
          placeholder="Shown on the cards. Left empty, the start of the article is used."
          value={form.description}
          onChange={set("description")}
          aria-invalid={Boolean(errorFor("description"))}
        />
        {errorFor("description") && <p className="admin-field-error">{errorFor("description")}</p>}
      </div>

      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="post-category">Sub-category</label>
          {division.subCategories.length > 0 ? (
            <select id="post-category" value={form.category} onChange={set("category")}>
              <option value="">{division.label} (no sub-category)</option>
              {division.subCategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          ) : (
            <input
              id="post-category"
              type="text"
              placeholder={division.label}
              value={form.category}
              onChange={set("category")}
            />
          )}
        </div>

        <div className="admin-field">
          <label htmlFor="post-author">Author</label>
          <input
            id="post-author"
            type="text"
            placeholder="நிர்வாகம்"
            value={form.author}
            onChange={set("author")}
          />
        </div>
      </div>

      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="post-date">Publish date</label>
          <input id="post-date" type="date" value={form.publishedAt} onChange={set("publishedAt")} />
        </div>

        <div className="admin-field">
          <label htmlFor="post-status">Status</label>
          <select id="post-status" value={form.status} onChange={set("status")}>
            <option value="PUBLISHED">Published — visible on the site</option>
            <option value="DRAFT">Draft — only here</option>
          </select>
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="post-video">Video link (optional)</label>
        <input
          id="post-video"
          type="url"
          placeholder="https://www.youtube.com/embed/…"
          value={form.videoUrl}
          onChange={set("videoUrl")}
          aria-invalid={Boolean(errorFor("videoUrl"))}
        />
        {errorFor("videoUrl") && <p className="admin-field-error">{errorFor("videoUrl")}</p>}
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : editing ? "Update post" : "Publish post"}
        </button>

        {editing && (
          <button className="admin-btn admin-btn-ghost" type="button" onClick={onCancel} disabled={busy}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}

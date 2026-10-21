"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { apiPut } from "./api";

const toForm = (question) => ({
  question: question.question,
  answer: question.answer,
  // The site shows "admin" as Manbayee.com, so it is left empty here and stays the default.
  answeredBy: question.answeredBy === "admin" ? "" : question.answeredBy,
  // Answering a waiting question is nearly always in order to publish it.
  status: question.answer ? question.status : "PUBLISHED",
});

/**
 * The page gives this a `key` per question, so picking another one remounts the
 * form and the initial state is all that is needed to load it.
 */
export default function AnswerForm({ question, onSaved, onCancel }) {
  const [form, setForm] = useState(() => toForm(question));
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const errorFor = (field) => fieldErrors[field]?.[0];

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setFieldErrors({});
    setMessage(null);

    try {
      const saved = await apiPut(`/api/questions/${question.id}`, form);
      onSaved(
        saved,
        saved.status === "PUBLISHED"
          ? "Answer published. It is now on the கேள்வி-பதில் page."
          : "Saved. It stays off the site until you publish it."
      );
    } catch (failure) {
      setFieldErrors(failure.fieldErrors || {});
      setMessage({ type: "error", text: failure.message });
    } finally {
      setBusy(false);
    }
  }

  const submitLabel =
    form.status !== "PUBLISHED"
      ? "Save as draft"
      : question.status === "PUBLISHED"
        ? "Update answer"
        : "Publish answer";

  return (
    <form className="admin-panel" onSubmit={handleSubmit}>
      <h2>{question.answer ? "Edit answer" : "Answer this question"}</h2>
      <p className="admin-panel-sub">
        Publishing puts the question and your answer on the கேள்வி-பதில் page.
      </p>

      {message && (
        <p className={`admin-message is-${message.type}`} role="status">
          {message.text}
        </p>
      )}

      {(question.askerName || question.askerEmail) && (
        <div className="admin-asker">
          <p>
            <strong>{question.askerName || "—"}</strong>
            {question.askerEmail && (
              <>
                {" · "}
                <a href={`mailto:${question.askerEmail}`}>{question.askerEmail}</a>
              </>
            )}
          </p>
          <p>{[question.topic, `Asked ${formatDate(question.date)}`].filter(Boolean).join(" · ")}</p>
        </div>
      )}

      <div className="admin-field">
        <label htmlFor="qa-question">Question</label>
        <textarea
          id="qa-question"
          rows={4}
          required
          value={form.question}
          onChange={set("question")}
          aria-invalid={Boolean(errorFor("question"))}
        />
        <p className="admin-field-hint">Shown on the site as written here, so tidy it up if needed.</p>
        {errorFor("question") && <p className="admin-field-error">{errorFor("question")}</p>}
      </div>

      <div className="admin-field">
        <label htmlFor="qa-answer">Answer</label>
        <textarea
          id="qa-answer"
          rows={12}
          placeholder="பதிலை இங்கு எழுதுங்கள்…"
          value={form.answer}
          onChange={set("answer")}
          aria-invalid={Boolean(errorFor("answer"))}
        />
        <p className="admin-field-hint">Leave a blank line between paragraphs.</p>
        {errorFor("answer") && <p className="admin-field-error">{errorFor("answer")}</p>}
      </div>

      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="qa-by">Answered by</label>
          <input
            id="qa-by"
            type="text"
            placeholder="Manbayee.com"
            value={form.answeredBy}
            onChange={set("answeredBy")}
            aria-invalid={Boolean(errorFor("answeredBy"))}
          />
          {errorFor("answeredBy") && <p className="admin-field-error">{errorFor("answeredBy")}</p>}
        </div>

        <div className="admin-field">
          <label htmlFor="qa-status">Status</label>
          <select id="qa-status" value={form.status} onChange={set("status")}>
            <option value="PUBLISHED">Published — visible on the site</option>
            <option value="DRAFT">Draft — only here</option>
          </select>
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </button>
        <button className="admin-btn admin-btn-ghost" type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        {question.status === "PUBLISHED" && (
          <Link
            className="admin-btn admin-btn-ghost"
            href={`/kelvi-pathil/${encodeURIComponent(question.slug)}`}
            target="_blank"
          >
            View on site
          </Link>
        )}
      </div>
    </form>
  );
}

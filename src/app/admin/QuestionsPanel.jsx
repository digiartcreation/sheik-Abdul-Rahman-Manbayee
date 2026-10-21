"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { apiDelete } from "./api";
import AnswerForm from "./AnswerForm";
import ConfirmDialog from "./ConfirmDialog";

/** "waiting" is a reader's question nobody has answered yet. */
const stateOf = (q) => (q.status === "PUBLISHED" ? "published" : q.answer ? "draft" : "waiting");

export const isWaiting = (q) => stateOf(q) === "waiting";

export default function QuestionsPanel({ questions, loading, error, onChanged, onNotice }) {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  // The question waiting on the delete confirmation, if any.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const selected = questions.find((q) => q.id === selectedId) || null;
  const waiting = questions.filter(isWaiting).length;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (
      questions
        .filter((q) => !filter || stateOf(q) === filter)
        .filter(
          (q) =>
            !term ||
            q.question.toLowerCase().includes(term) ||
            q.askerName.toLowerCase().includes(term)
        )
        // Unanswered ones first: they are the reason to open this tab.
        .sort((a, b) => Number(isWaiting(b)) - Number(isWaiting(a)))
    );
  }, [questions, search, filter]);

  function select(question) {
    setSelectedId(question.id);
    onNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaved(_saved, message) {
    setSelectedId(null);
    onNotice(message);
    await onChanged();
  }

  function handleDelete(question) {
    setDeleteError("");
    setPendingDelete(question);
  }

  async function confirmDelete() {
    const question = pendingDelete;
    setDeleting(true);
    setDeleteError("");

    try {
      await apiDelete(`/api/questions/${question.id}`);
      if (selectedId === question.id) setSelectedId(null);
      setPendingDelete(null);
      onNotice("Question deleted.");
      await onChanged();
    } catch (failure) {
      // Shown inside the dialog, which stays open so it can be retried.
      setDeleteError(failure.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-grid">
      {selected ? (
        <AnswerForm
          key={selected.id}
          question={selected}
          onSaved={handleSaved}
          onCancel={() => setSelectedId(null)}
        />
      ) : (
        <section className="admin-panel">
          <h2>Answer a question</h2>
          <p className="admin-panel-sub">
            Questions sent from the கேள்வி-பதில் page arrive here as <strong>Waiting</strong>.
            Pick one from the list, write the answer and publish it. The question and answer
            then appear on the கேள்வி-பதில் page.
          </p>
          <p className="admin-empty">
            {loading
              ? "Loading questions…"
              : waiting > 0
                ? `${waiting} ${waiting === 1 ? "question is" : "questions are"} waiting for an answer.`
                : "No questions are waiting for an answer."}
          </p>
        </section>
      )}

      <section className="admin-panel">
        <h2>Questions</h2>
        <p className="admin-panel-sub">
          {loading ? "Loading…" : `${visible.length} of ${questions.length} questions`}
        </p>

        {error && <p className="admin-message is-error">{error}</p>}

        <div className="admin-list-filters">
          <input
            type="text"
            placeholder="Search questions or names…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search questions"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All questions</option>
            <option value="waiting">Waiting for an answer</option>
            <option value="draft">Answered, not published</option>
            <option value="published">Published</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="admin-empty">{loading ? "Loading questions…" : "No questions match."}</p>
        ) : (
          <div className="admin-items">
            {visible.map((q) => {
              const state = stateOf(q);
              return (
                <article
                  key={q.id}
                  className={`admin-item is-plain${selectedId === q.id ? " is-editing" : ""}`}
                >
                  <div className="admin-item-body">
                    <h3 title={q.question}>{q.question}</h3>
                    <p className="admin-item-meta">
                      {state === "waiting" && <span className="admin-badge is-waiting">Waiting</span>}
                      {state === "draft" && <span className="admin-badge is-draft">Draft</span>}
                      <span>{[q.askerName, q.topic, formatDate(q.date)].filter(Boolean).join(" · ")}</span>
                    </p>
                  </div>

                  <div className="admin-item-actions">
                    {state === "published" && (
                      <Link
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        href={`/kelvi-pathil/${encodeURIComponent(q.slug)}`}
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                    <button
                      className={`admin-btn admin-btn-sm ${state === "waiting" ? "admin-btn-primary" : "admin-btn-ghost"}`}
                      type="button"
                      onClick={() => select(q)}
                    >
                      {state === "waiting" ? "Answer" : "Edit"}
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      type="button"
                      onClick={() => handleDelete(q)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this question?"
        busy={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <p className="admin-dialog-subject">{pendingDelete?.question}</p>
        <p>
          {pendingDelete?.status === "PUBLISHED"
            ? "It will be removed from the site straight away. This cannot be undone."
            : "The reader's question and any answer you drafted will be lost. This cannot be undone."}
        </p>
      </ConfirmDialog>
    </div>
  );
}

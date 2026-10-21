"use client";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";
import { apiDelete, apiPut } from "./api";
import ConfirmDialog from "./ConfirmDialog";

export default function FeedbackPanel({ feedback, loading, error, onChanged, onNotice }) {
  const [search, setSearch] = useState("");
  // The comment whose Hide/Show request is in flight, so only its button waits.
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return feedback;
    return feedback.filter((item) =>
      [item.name, item.email, item.content].some((text) => text.toLowerCase().includes(term))
    );
  }, [feedback, search]);

  async function toggle(item) {
    const hide = item.status === "ACTIVE";
    setBusyId(item.id);
    setActionError("");

    try {
      await apiPut(`/api/feedback/${item.id}`, { status: hide ? "INACTIVE" : "ACTIVE" });
      onNotice(
        hide ? `${item.name}'s comment is now hidden from the site.` : `${item.name}'s comment is back on the site.`
      );
      await onChanged();
    } catch (failure) {
      setActionError(failure.message);
    } finally {
      setBusyId(null);
    }
  }

  function handleDelete(item) {
    setDeleteError("");
    setPendingDelete(item);
  }

  async function confirmDelete() {
    const item = pendingDelete;
    setDeleting(true);
    setDeleteError("");

    try {
      await apiDelete(`/api/feedback/${item.id}`);
      setPendingDelete(null);
      onNotice(`Deleted ${item.name}'s comment.`);
      await onChanged();
    } catch (failure) {
      // Shown inside the dialog, which stays open so it can be retried.
      setDeleteError(failure.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="admin-panel">
      <h2>Readers&apos; feedback</h2>
      <p className="admin-panel-sub">
        Comments sent from the உங்கள் பகுதி page show there as soon as they are sent. Hide one to
        take it off the site, or delete it.{" "}
        {!loading && `${visible.length} of ${feedback.length} comments.`}
      </p>

      {error && <p className="admin-message is-error">{error}</p>}
      {actionError && <p className="admin-message is-error">{actionError}</p>}

      <div className="admin-list-filters">
        <input
          type="text"
          placeholder="Search by name, email or text…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search feedback"
        />
      </div>

      {visible.length === 0 ? (
        <p className="admin-empty">
          {loading ? "Loading feedback…" : feedback.length ? "No comments match." : "No feedback yet."}
        </p>
      ) : (
        <div className="admin-items">
          {visible.map((item) => (
            <article
              key={item.id}
              className={`admin-item is-plain${item.status === "INACTIVE" ? " is-hidden" : ""}`}
            >
              <div className="admin-item-body">
                <h3>{item.name}</h3>
                <p className="admin-item-meta">
                  {item.status === "INACTIVE" && <span className="admin-badge is-draft">Hidden</span>}
                  <span>{[item.type, item.email, formatDate(item.date)].filter(Boolean).join(" · ")}</span>
                </p>
                <p className="admin-item-text">{item.content}</p>
              </div>

              <div className="admin-item-actions">
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  type="button"
                  onClick={() => toggle(item)}
                  disabled={busyId === item.id}
                >
                  {item.status === "ACTIVE" ? "Hide" : "Show"}
                </button>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  type="button"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this comment?"
        busy={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <p className="admin-dialog-subject">{pendingDelete?.name}</p>
        <p>It will be removed from the site straight away. This cannot be undone.</p>
      </ConfirmDialog>
    </section>
  );
}

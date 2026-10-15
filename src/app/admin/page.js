"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import "./admin.css";
import { apiDelete, apiGet, apiPost } from "./api";
import AdminLogin from "./AdminLogin";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";
import ConfirmDialog from "./ConfirmDialog";

export default function AdminPage() {
  // null = still checking the session cookie, false = signed out.
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // The post waiting on the delete confirmation, if any.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      setArticles(await apiGet("/api/articles"));
      setError("");
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // The session lives in an httpOnly cookie, so the only way to know whether
  // we are signed in is to ask the server.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const me = await apiGet("/api/auth/me");
        if (cancelled) return;
        setUser(me);
        await loadArticles();
      } catch {
        if (!cancelled) setUser(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadArticles]);

  async function handleSignedIn(signedInUser) {
    setUser(signedInUser);
    await loadArticles();
  }

  async function handleSignOut() {
    await apiPost("/api/auth/logout");
    setUser(false);
    setArticles([]);
    setEditing(null);
  }

  function handleDelete(article) {
    setDeleteError("");
    setPendingDelete(article);
  }

  async function confirmDelete() {
    const article = pendingDelete;
    setDeleting(true);
    setDeleteError("");

    try {
      await apiDelete(`/api/articles/${article.dbId}`);
      if (editing?.dbId === article.dbId) setEditing(null);
      setPendingDelete(null);
      setNotice(`Deleted “${article.title}”.`);
      await loadArticles();
    } catch (failure) {
      // Shown inside the dialog, which stays open so it can be retried.
      setDeleteError(failure.message);
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(article) {
    setEditing(article);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaved(_saved, message) {
    setEditing(null);
    setNotice(message);
    await loadArticles();
  }

  if (user === null) {
    return <div className="admin-wrap"><p className="admin-empty">Checking your session…</p></div>;
  }

  if (user === false) {
    return <AdminLogin onSignedIn={handleSignedIn} />;
  }

  return (
    <div className="admin-wrap">
      <header className="admin-head">
        <div>
          <h1>உள்ளடக்க நிர்வாகம்</h1>
          <p>Signed in as {user.name} ({user.email})</p>
        </div>

        <div className="admin-head-actions">
          <Link className="admin-btn admin-btn-ghost admin-btn-sm" href="/">View site</Link>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" type="button" onClick={loadArticles}>
            Refresh
          </button>
          <button className="admin-btn admin-btn-danger admin-btn-sm" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      {error && <p className="admin-message is-error">{error}</p>}
      {notice && <p className="admin-message is-success" role="status">{notice}</p>}

      <div className="admin-grid">
        <ArticleForm
          key={editing?.dbId ?? "new"}
          editing={editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
        <ArticleList
          articles={articles}
          editingId={editing?.dbId}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this post?"
        busy={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <p className="admin-dialog-subject">{pendingDelete?.title}</p>
        <p>It will be removed from the site straight away. This cannot be undone.</p>
      </ConfirmDialog>
    </div>
  );
}

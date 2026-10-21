"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import "./admin.css";
import { apiDelete, apiGet, apiPost } from "./api";
import AdminLogin from "./AdminLogin";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";
import ConfirmDialog from "./ConfirmDialog";
import FeedbackPanel from "./FeedbackPanel";
import QuestionsPanel, { isWaiting } from "./QuestionsPanel";

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

  const [tab, setTab] = useState("posts");
  // What readers send in: questions from கேள்வி-பதில், comments from உங்கள் பகுதி.
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState("");

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

  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    try {
      const [nextQuestions, nextFeedback] = await Promise.all([
        apiGet("/api/questions"),
        apiGet("/api/feedback"),
      ]);
      setQuestions(nextQuestions);
      setFeedback(nextFeedback);
      setInboxError("");
    } catch (failure) {
      setInboxError(failure.message);
    } finally {
      setInboxLoading(false);
    }
  }, []);

  const loadAll = useCallback(
    () => Promise.all([loadArticles(), loadInbox()]),
    [loadArticles, loadInbox]
  );

  // The session lives in an httpOnly cookie, so the only way to know whether
  // we are signed in is to ask the server.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const me = await apiGet("/api/auth/me");
        if (cancelled) return;
        setUser(me);
        await loadAll();
      } catch {
        if (!cancelled) setUser(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  async function handleSignedIn(signedInUser) {
    setUser(signedInUser);
    await loadAll();
  }

  async function handleSignOut() {
    await apiPost("/api/auth/logout");
    setUser(false);
    setArticles([]);
    setQuestions([]);
    setFeedback([]);
    setEditing(null);
  }

  function openTab(key) {
    setTab(key);
    setNotice("");
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

  const waiting = questions.filter(isWaiting).length;
  const tabs = [
    { key: "posts", label: "Posts", count: articles.length },
    {
      key: "questions",
      label: "Questions",
      count: waiting > 0 ? `${waiting} new` : questions.length,
      alert: waiting > 0,
    },
    { key: "feedback", label: "Feedback", count: feedback.length },
  ];

  return (
    <div className="admin-wrap">
      <header className="admin-head">
        <div>
          <h1>உள்ளடக்க நிர்வாகம்</h1>
          <p>Signed in as {user.name} ({user.email})</p>
        </div>

        <div className="admin-head-actions">
          <Link className="admin-btn admin-btn-ghost admin-btn-sm" href="/">View site</Link>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" type="button" onClick={loadAll}>
            Refresh
          </button>
          <button className="admin-btn admin-btn-danger admin-btn-sm" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      {error && <p className="admin-message is-error">{error}</p>}
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`admin-tab${tab === item.key ? " is-active" : ""}`}
            aria-pressed={tab === item.key}
            onClick={() => openTab(item.key)}
          >
            {item.label}
            <span className={`admin-tab-count${item.alert ? " is-alert" : ""}`}>{item.count}</span>
          </button>
        ))}
      </nav>

      {notice && <p className="admin-message is-success" role="status">{notice}</p>}

      {/* Inactive tabs are hidden rather than unmounted, so a half-written post
          or answer survives a look at another tab. */}
      <div hidden={tab !== "posts"}>
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
      </div>

      <div hidden={tab !== "questions"}>
        <QuestionsPanel
          questions={questions}
          loading={inboxLoading}
          error={inboxError}
          onChanged={loadInbox}
          onNotice={setNotice}
        />
      </div>

      <div hidden={tab !== "feedback"}>
        <FeedbackPanel
          feedback={feedback}
          loading={inboxLoading}
          error={inboxError}
          onChanged={loadInbox}
          onNotice={setNotice}
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

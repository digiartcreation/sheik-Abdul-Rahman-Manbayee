"use client";
import { useEffect, useId, useRef } from "react";

/**
 * A modal built on <dialog>. `showModal()` puts it in the top layer, so it sits
 * above the sticky header, traps focus, and makes the page behind it inert —
 * none of which has to be done by hand. Focus lands on Cancel, the first
 * button, so a stray Enter never deletes anything.
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Delete",
  busyLabel = "Deleting…",
  busy = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function cancel() {
    if (!busy) onCancel();
  }

  return (
    <dialog
      ref={ref}
      className="admin-dialog"
      aria-labelledby={titleId}
      // Escape: let the parent close it, so `open` stays the source of truth.
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
      // The browser can still close it on its own (a repeated Escape); keep the
      // parent in step when that happens.
      onClose={() => {
        if (open) onCancel();
      }}
      // The panel fills the dialog, so a click that lands on the dialog itself
      // came from the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) cancel();
      }}
    >
      <div className="admin-dialog-panel">
        <div className="admin-dialog-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </div>

        <h2 id={titleId}>{title}</h2>
        <div className="admin-dialog-body">{children}</div>

        {error && (
          <p className="admin-message is-error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-dialog-actions">
          <button className="admin-btn admin-btn-ghost" type="button" onClick={cancel} disabled={busy}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-danger-solid" type="button" onClick={onConfirm} disabled={busy}>
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { feedbackTypes } from "@/lib/feedback-types";
import { apiPost } from "@/app/admin/api";

/** The first validation message the API sent back, if it named a field. */
const firstFieldError = (failure) => Object.values(failure.fieldErrors || {}).flat()[0];

export default function FeedbackForm() {
  const router = useRouter();
  // { type: "success" | "error", text }
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setMessage(null);

    try {
      await apiPost("/api/feedback", Object.fromEntries(new FormData(form)));
      form.reset();
      setMessage({ type: "success", text: "✅ உங்கள் கருத்து பதிவு செய்யப்பட்டது. நன்றி!" });
      // The list of comments is rendered on the server; ask for it again so the
      // new one shows up without a reload.
      router.refresh();
    } catch (failure) {
      setMessage({
        type: "error",
        text: firstFieldError(failure) || "கருத்தை பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="u-name">பெயர்</label>
        <input id="u-name" name="name" type="text" placeholder="உங்கள் பெயர்" maxLength={120} required />
      </div>
      <div className="form-group">
        <label htmlFor="u-email">மின்னஞ்சல்</label>
        <input id="u-email" name="email" type="email" placeholder="you@example.com" maxLength={190} required />
        <p className="form-hint">உங்கள் மின்னஞ்சல் வெளியிடப்படாது.</p>
      </div>
      <div className="form-group">
        <label htmlFor="u-type">வகை</label>
        <select id="u-type" name="type" required defaultValue="">
          <option value="">-- தேர்ந்தெடுக்கவும் --</option>
          {feedbackTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="u-content">உங்கள் கருத்து</label>
        <textarea
          id="u-content"
          name="content"
          rows={5}
          placeholder="உங்கள் கருத்தை இங்கு எழுதுங்கள்..."
          minLength={5}
          maxLength={3000}
          required
        />
      </div>
      {/* Hidden from people; a bot that fills in every field gives itself away. */}
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="u-website">Website</label>
        <input id="u-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
        {busy ? "பதிவு செய்கிறது…" : "பதிவு செய்"}
      </button>
      {message && (
        <p className={`form-message${message.type === "error" ? " is-error" : ""}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  );
}

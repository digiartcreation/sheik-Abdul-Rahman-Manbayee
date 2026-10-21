"use client";
import { useState } from "react";
import { divisions } from "@/lib/divisions";
import { apiPost } from "@/app/admin/api";

/** The first validation message the API sent back, if it named a field. */
const firstFieldError = (failure) => Object.values(failure.fieldErrors || {}).flat()[0];

export default function QuestionForm() {
  // { type: "success" | "error", text }
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setMessage(null);

    try {
      // Saved as unanswered; it reaches the list below once the admin answers it.
      await apiPost("/api/questions", Object.fromEntries(new FormData(form)));
      form.reset();
      setMessage({ type: "success", text: "✅ உங்கள் கேள்வி பெறப்பட்டது. விரைவில் பதில் அளிக்கப்படும்." });
    } catch (failure) {
      setMessage({
        type: "error",
        text: firstFieldError(failure) || "கேள்வியை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="q-name">பெயர்</label>
        <input id="q-name" name="name" type="text" placeholder="உங்கள் பெயர்" maxLength={120} required />
      </div>
      <div className="form-group">
        <label htmlFor="q-email">மின்னஞ்சல்</label>
        <input id="q-email" name="email" type="email" placeholder="you@example.com" maxLength={190} required />
      </div>
      <div className="form-group">
        <label htmlFor="q-topic">பிரிவு</label>
        <select id="q-topic" name="topic" required defaultValue="">
          <option value="">-- பிரிவைத் தேர்ந்தெடுக்கவும் --</option>
          {divisions.map((division) => (
            <option key={division.key} value={division.label}>{division.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="q-question">உங்கள் கேள்வி</label>
        <textarea
          id="q-question"
          name="question"
          rows={5}
          placeholder="உங்கள் கேள்வியை இங்கு எழுதுங்கள்..."
          minLength={10}
          maxLength={3000}
          required
        />
      </div>
      {/* Hidden from people; a bot that fills in every field gives itself away. */}
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="q-website">Website</label>
        <input id="q-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
        {busy ? "அனுப்புகிறது…" : "கேள்வியை அனுப்பு"}
      </button>
      {message && (
        <p className={`form-message${message.type === "error" ? " is-error" : ""}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  );
}

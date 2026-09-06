"use client";
import { useState } from "react";
import { divisions } from "@/lib/divisions";

export default function QuestionForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.target.reset();
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="q-name">பெயர்</label>
        <input id="q-name" type="text" placeholder="உங்கள் பெயர்" required />
      </div>
      <div className="form-group">
        <label htmlFor="q-email">மின்னஞ்சல்</label>
        <input id="q-email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="form-group">
        <label htmlFor="q-topic">பிரிவு</label>
        <select id="q-topic" required defaultValue="">
          <option value="">-- பிரிவைத் தேர்ந்தெடுக்கவும் --</option>
          {divisions.map((division) => (
            <option key={division.key} value={division.label}>{division.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="q-question">உங்கள் கேள்வி</label>
        <textarea id="q-question" rows={5} placeholder="உங்கள் கேள்வியை இங்கு எழுதுங்கள்..." required />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
        கேள்வியை அனுப்பு
      </button>
      {submitted && (
        <p className="form-message">✅ உங்கள் கேள்வி பெறப்பட்டது. விரைவில் பதில் அளிக்கப்படும்.</p>
      )}
    </form>
  );
}

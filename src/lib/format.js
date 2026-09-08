// Formatting helpers shared by the public pages and the admin panel.
// Kept apart from the data access so importing them into a client component
// does not drag the database layer into the browser bundle.

/** "2020-01-19" -> "19 ஜனவரி 2020" */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ta-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** First `length` characters of the summary, falling back to the article body. */
export function excerpt(item, length = 150) {
  const text = (item?.description || item?.content || "").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

/** Trims to `length` at the last word boundary, so a heading never cuts mid-word. */
export function truncate(text, length = 120) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  const cut = clean.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > length * 0.6 ? cut.slice(0, lastSpace) : cut}…`;
}

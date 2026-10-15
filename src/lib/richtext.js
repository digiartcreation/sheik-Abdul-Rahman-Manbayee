// The article body comes in two shapes. Posts written in the admin's editor are
// stored as HTML; the posts imported from the old site are plain text with a
// blank line between paragraphs. Both have to keep working, so everything that
// reads `content` goes through these helpers.
//
// No dependencies: the admin form (browser) and the pages (server) share them.

const TAG = /<\/?[a-z][^>]*>/i;

/** True when the body was written in the editor rather than imported as text. */
export const isHtml = (value) => TAG.test(String(value || ""));

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Plain text -> `<p>` blocks, so an imported post opens in the editor with its
 * paragraphs intact. A single line break inside a block is kept as `<br>`.
 */
export function plainTextToHtml(text) {
  return String(text || "")
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** The readable text of either shape — for card excerpts and the length check. */
export function htmlToText(value) {
  const source = String(value || "");
  if (!isHtml(source)) return source;

  return source
    .replace(/<(br|\/p|\/h[1-6]|\/li|\/blockquote)\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

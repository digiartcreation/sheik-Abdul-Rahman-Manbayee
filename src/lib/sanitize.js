import "server-only";
import sanitizeHtml from "sanitize-html";
import { isHtml, plainTextToHtml } from "@/lib/richtext";

// Exactly what the editor's toolbar can produce (src/app/admin/RichTextEditor.jsx).
// The article page renders the stored body as HTML, so anything else — scripts,
// event handlers, inline styles, classes pasted in from Word — is dropped here,
// before it ever reaches the database.
const options = {
  allowedTags: ["p", "br", "h2", "h3", "strong", "i", "u", "a", "ul", "ol", "li", "blockquote"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    // Only a new-tab target survives, and it always travels with noopener.
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...(attribs.href ? { href: attribs.href } : {}),
        ...(attribs.target === "_blank" ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      },
    }),
  },
};

/** Cleans an article body for storage. Plain text is turned into paragraphs first. */
export function sanitizeArticleHtml(content) {
  const html = isHtml(content) ? content : plainTextToHtml(content);
  return sanitizeHtml(html, options);
}

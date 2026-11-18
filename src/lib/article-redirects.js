// Article numbers with no page of their own, and the number where that article
// now lives. /katurai/<from> sends the reader on to /katurai/<to>, so links to
// these numbers keep working instead of landing on "not found".
//
// No imports: prisma/fix-sequence.mjs reads this file too.

/**
 * The old site kept a hidden second copy of these posts. Only the visible copy
 * was carried over, and it has its own number.
 */
const hiddenOldCopies = {
  81: 89, 90: 84, 100: 101, 109: 113, 110: 114, 111: 112, 116: 117, 123: 124, 154: 153, 155: 153,
};

/**
 * The Word-document import (all dated 21 Jan 2020) repeated old-site articles
 * word for word. They are kept as drafts and their numbers point at the original,
 * so each article appears once and series such as கடன் முறைகளும் சட்டங்களும் read
 * in order. Matched on the article text (98–100% the same), not on the title.
 */
export const wordDocCopies = {
  1000: 43, 1001: 1, 1002: 24, 1003: 4, 1004: 11, 1005: 3, 1006: 20, 1007: 34, 1008: 40,
  1009: 31, 1010: 38, 1011: 30, 1012: 22, 1013: 17, 1014: 18, 1015: 12, 1016: 9, 1017: 10,
  1018: 13, 1019: 14, 1020: 26, 1021: 53, 1022: 6, 1023: 47, 1024: 21, 1025: 32, 1026: 33,
  1027: 37, 1028: 29, 1029: 39, 1030: 28, 1031: 25, 1032: 23, 1033: 15, 1034: 8, 1035: 46,
  1036: 44, 1037: 45, 1038: 16, 1039: 5, 1040: 42, 1041: 7, 1042: 19, 1043: 36, 1044: 41,
  1045: 27,
};

const redirects = { ...hiddenOldCopies, ...wordDocCopies };

/** Where /katurai/<slug> should go instead, or null when it has no redirect. */
export function articleRedirect(slug) {
  const target = redirects[String(slug)];
  return target ? String(target) : null;
}

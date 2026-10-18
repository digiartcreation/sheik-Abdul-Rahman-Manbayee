"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

// Deliberately small: what an article needs, and nothing that would fight the
// site's own typography — no fonts, colours, sizes or alignment. If a button is
// added here, allow its element in src/lib/sanitize.js and style it under
// .article-body in globals.css, or it will be stripped on save.
//
// Kept at module level so the object never changes between renders, which
// would make the React wrapper rebuild the editor.
const config = {
  licenseKey: "GPL",
  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Link,
    List,
    BlockQuote,
    Table,
    TableToolbar,
    Autoformat,
    PasteFromOffice,
  ],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "|",
    "link",
    "bulletedList",
    "numberedList",
    "blockQuote",
    "insertTable",
    "|",
    "undo",
    "redo",
  ],
  // The page title is the article's <h1>, so the body starts at <h2>.
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      { model: "heading2", view: "h2", title: "Heading", class: "ck-heading_heading2" },
      { model: "heading3", view: "h3", title: "Sub-heading", class: "ck-heading_heading3" },
    ],
  },
  // Rows, columns, header row/column and merged cells. No table or cell
  // properties: those write inline borders and colours.
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  link: {
    defaultProtocol: "https://",
    addTargetToExternalLinks: true,
  },
  // Keeps the sticky toolbar clear of the site header (64px).
  ui: { viewportOffset: { top: 64 } },
  placeholder: "முழு கட்டுரையையும் இங்கே எழுதுங்கள்…",
  label: "Full description",
};

export default function RichTextEditor({ value, onChange, invalid }) {
  return (
    <div className={`admin-rich${invalid ? " is-invalid" : ""}`}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={value}
        onChange={(_event, editor) => onChange(editor.getData())}
      />
    </div>
  );
}

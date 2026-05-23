import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const params = new URLSearchParams(window.location.search);
const collectionName = params.get("type");
const documentId = params.get("id");
const allowedCollections = ["articles", "videos", "qa", "khutbah"];

if (collectionName && documentId && allowedCollections.includes(collectionName)) {
  loadFirestoreDetail(collectionName, documentId);
}

async function loadFirestoreDetail(collectionName, documentId) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const snapshot = await getDoc(doc(db, collectionName, documentId));

    if (!snapshot.exists()) {
      showMissingMessage();
      return;
    }

    renderDetail({
      collectionName,
      ...snapshot.data()
    });
  } catch (error) {
    console.error(error);
    showMissingMessage("Could not load this content. Please check Firebase rules and config.");
  }
}

function renderDetail(item) {
  const title = item.title || "Untitled";
  const description = item.description || "";
  const category = item.category || item.collectionName;

  document.title = `${title} - Learnly`;

  const descriptionMeta = document.querySelector("meta[name='description']");
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", description);
  }

  document.querySelector(".article-header .eyebrow").textContent = category;
  document.querySelector(".article-header h1").textContent = title;
  document.querySelector(".article-intro").textContent = description;

  const metaItems = document.querySelectorAll(".article-meta span");
  if (metaItems[0]) metaItems[0].textContent = item.collectionName;
  if (metaItems[1]) metaItems[1].textContent = item.date || "No date";
  if (metaItems[2]) metaItems[2].textContent = category;

  const cover = document.querySelector(".article-cover");
  if (cover && item.image) {
    cover.src = item.image;
    cover.alt = title;
  }

  const sidebar = document.querySelector(".article-sidebar");
  if (sidebar) {
    sidebar.hidden = true;
  }

  const articleLayout = document.querySelector(".article-layout");
  if (articleLayout) {
    articleLayout.style.gridTemplateColumns = "minmax(0, 760px)";
  }

  const content = document.querySelector(".article-content");
  content.innerHTML = renderContent(item.content);
}

function renderContent(content = "") {
  const trimmedContent = String(content).trim();

  if (trimmedContent.startsWith("http://") || trimmedContent.startsWith("https://")) {
    return `<p><a class="btn btn-primary" href="${escapeHtml(trimmedContent)}" target="_blank" rel="noopener">Open Link</a></p>`;
  }

  return trimmedContent
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function showMissingMessage(message = "This content was not found.") {
  document.querySelector(".article-header h1").textContent = message;
  document.querySelector(".article-intro").textContent = "Please go back to the blog and try another post.";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

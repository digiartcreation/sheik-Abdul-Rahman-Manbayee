import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const tabCollections = {
  articles: "articles",
  videos: "videos",
  qa: "qa",
  khuthba: "khutbah"
};

const pageLimit = window.location.pathname.includes("blog") ? 9 : 6;

document.querySelectorAll(".category-tab-panel").forEach((panel) => {
  const grid = panel.querySelector(".content-card-grid");

  if (!grid) {
    return;
  }

  loadPanelContent(panel, grid);
});

async function loadPanelContent(panel, grid) {
  const panelType = panel.dataset.panel;
  const collectionName = tabCollections[panelType];

  if (!collectionName) {
    return;
  }

  grid.innerHTML = `<p class="content-state">Loading ${collectionName}...</p>`;

  try {
    const itemsQuery = query(collection(db, collectionName), orderBy("date", "desc"));
    const snapshot = await getDocs(itemsQuery);
    const items = [];

    snapshot.forEach((documentSnapshot) => {
      items.push({
        id: documentSnapshot.id,
        collectionName,
        panelType,
        ...documentSnapshot.data()
      });
    });

    renderGrid(grid, items.slice(0, pageLimit), panelType);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p class="content-state">Could not load content. Please check Firebase rules and config.</p>`;
  }
}

function renderGrid(grid, items, panelType) {
  if (!items.length) {
    grid.innerHTML = `<p class="content-state">No content found yet.</p>`;
    return;
  }

  grid.innerHTML = items.map((item) => createCard(item, panelType)).join("");
}

function createCard(item, panelType) {
  if (panelType === "videos") {
    return createVideoCard(item);
  }

  if (panelType === "qa") {
    return createTextCard(item, "Question", "Read More");
  }

  if (panelType === "khuthba") {
    return createTextCard(item, item.category || "Khuthba", "Listen / Read", "khuthba-card");
  }

  return createArticleCard(item);
}

function createArticleCard(item) {
  return `
    <article class="library-card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      <div class="library-card-body">
        <span class="content-badge">${escapeHtml(item.category || "Article")}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="content-link" href="${detailUrl(item)}">Read More</a>
      </div>
    </article>
  `;
}

function createVideoCard(item) {
  return `
    <article class="library-card video-card">
      <div class="video-thumb">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
        <span class="play-mark">Play</span>
      </div>
      <div class="library-card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="content-link" href="${detailUrl(item)}">Watch Video</a>
      </div>
    </article>
  `;
}

function createTextCard(item, badge, buttonText, extraClass = "") {
  return `
    <article class="library-card text-only-card ${extraClass}">
      <div class="library-card-body">
        <span class="content-badge">${escapeHtml(badge)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || item.date || "")}</p>
        <a class="content-link" href="${detailUrl(item)}">${buttonText}</a>
      </div>
    </article>
  `;
}

function detailUrl(item) {
  return `article.html?type=${encodeURIComponent(item.collectionName)}&id=${encodeURIComponent(item.id)}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

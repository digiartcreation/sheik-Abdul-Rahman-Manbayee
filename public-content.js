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

// Every collection content can live in. Divisions are a view over these, not
// separate collections, so an item is filed by its `category` field.
const contentCollections = ["articles", "videos", "qa", "khutbah"];

// பிரிவுகள் - the seven divisions from the site plan. `match` lists the
// category values that land in each one, including the older English values
// already saved in Firestore. "general" is the catch-all and matches nothing.
const divisions = {
  quran:   { label: "குர்ஆன்",      match: ["குர்ஆன்", "தஃப்சீர்", "quran", "tafsir", "tafseer"] },
  hadith:  { label: "ஹதீஸ்",        match: ["ஹதீஸ்", "நபிமொழி", "hadith", "hadeeth", "sunnah"] },
  aqeedah: { label: "கொள்கை",       match: ["கொள்கை", "தவ்ஹீத்", "aqeedah", "aqidah", "creed", "belief", "tawheed", "spirituality"] },
  rulings: { label: "சட்டங்கள்",     match: ["சட்டம்", "சட்டங்கள்", "தொழுகை", "ஸகாத்", "fiqh", "ruling", "rulings", "law", "laws", "prayer", "zakat", "halal", "family"] },
  history: { label: "வரலாறு",       match: ["வரலாறு", "சீரா", "history", "seerah", "biography"] },
  khutba:  { label: "குதுபாக்கள்",   match: ["குதுபா", "குதுபாக்கள்", "khutba", "khuthba", "khutbah", "jumuah"] },
  general: { label: "பொதுவானவை",    match: [] }
};

const pageLimit = window.location.pathname.includes("blog") ? 9 : 6;
const latestLimit = 3;

let contentPromise = null;

// Load every collection once and share it across all panels on the page.
function loadAllContent() {
  if (!contentPromise) {
    contentPromise = Promise.all(contentCollections.map(loadCollection)).then((groups) => groups.flat());
  }

  return contentPromise;
}

async function loadCollection(collectionName) {
  try {
    const itemsQuery = query(collection(db, collectionName), orderBy("date", "desc"));
    const snapshot = await getDocs(itemsQuery);
    const items = [];

    snapshot.forEach((documentSnapshot) => {
      items.push({
        id: documentSnapshot.id,
        collectionName,
        ...documentSnapshot.data()
      });
    });

    return items;
  } catch (error) {
    console.error("Could not load " + collectionName, error);
    return [];
  }
}

// Decide which division an item belongs to. Khuthbah is a collection of its
// own, so everything in it files under குதுபாக்கள் whatever its category says.
function divisionFor(item) {
  if (item.collectionName === "khutbah") {
    return "khutba";
  }

  const value = String(item.category || "").toLowerCase();

  for (const [key, division] of Object.entries(divisions)) {
    if (division.match.some((keyword) => value.includes(keyword.toLowerCase()))) {
      return key;
    }
  }

  return "general";
}

function byDateDesc(a, b) {
  return String(b.date || "").localeCompare(String(a.date || ""));
}

document.querySelectorAll(".category-tab-panel").forEach((panel) => {
  const grid = panel.querySelector(".content-card-grid");

  if (!grid) {
    return;
  }

  loadPanelContent(panel, grid);
});

async function loadPanelContent(panel, grid) {
  const panelType = panel.dataset.panel;
  const division = divisions[panelType];

  if (!division) {
    return;
  }

  grid.innerHTML = `<p class="content-state">Loading ${division.label}...</p>`;

  const items = await loadAllContent();
  const matching = items.filter((item) => divisionFor(item) === panelType).sort(byDateDesc);

  const viewAll = panel.querySelector(".tab-view-all");

  if (!matching.length) {
    grid.innerHTML = `<p class="content-state">${division.label} பிரிவில் இன்னும் பதிவுகள் இல்லை.</p>`;
    if (viewAll) {
      viewAll.hidden = true;
    }
    return;
  }

  if (viewAll) {
    viewAll.hidden = false;
  }

  grid.innerHTML = matching.slice(0, pageLimit).map(createCard).join("");
}

// புதிய பதிவுகள் - newest items across every collection, with the author.
const latestGrid = document.querySelector("[data-latest-posts]");

if (latestGrid) {
  loadLatestPosts(latestGrid);
}

async function loadLatestPosts(grid) {
  const items = await loadAllContent();
  const latest = [...items].sort(byDateDesc).slice(0, latestLimit);

  if (!latest.length) {
    grid.innerHTML = `<p class="content-state">இன்னும் பதிவுகள் இல்லை.</p>`;
    return;
  }

  grid.innerHTML = latest.map(createLatestCard).join("");
}

function createLatestCard(item) {
  const meta = [formatDate(item.date), item.author || divisions[divisionFor(item)].label]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" - ");

  return `
    <article class="latest-post-card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      <div class="latest-post-content">
        <p class="post-meta">${meta}</p>
        <h3><a href="${detailUrl(item)}">${escapeHtml(item.title)}</a></h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `;
}

// Card shape follows the collection the item came from, not the division.
function createCard(item) {
  if (item.collectionName === "videos") {
    return createVideoCard(item);
  }

  if (item.collectionName === "qa") {
    return createTextCard(item, "கேள்வி - பதில்", "Read More");
  }

  if (item.collectionName === "khutbah") {
    return createTextCard(item, item.author || item.category || "குதுபா", "Listen / Read", "khuthba-card");
  }

  return createArticleCard(item);
}

function createArticleCard(item) {
  return `
    <article class="library-card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      <div class="library-card-body">
        <span class="content-badge">${escapeHtml(item.category || divisions[divisionFor(item)].label)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${byline(item)}
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
        ${byline(item)}
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
        ${byline(item)}
        <a class="content-link" href="${detailUrl(item)}">${buttonText}</a>
      </div>
    </article>
  `;
}

// எழுத்தாளர் line, shown only when an author was entered in the admin panel.
function byline(item) {
  if (!item.author) {
    return "";
  }

  return `<p class="card-byline">${escapeHtml(item.author)}</p>`;
}

// Turn the stored yyyy-mm-dd value into something readable, leaving anything
// unparseable exactly as it was entered.
function formatDate(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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
    .replaceAll("\u0027", "&#39;");
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

console.log("Admin JS Connected");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const collections = ["articles", "videos", "qa", "khutbah"];
const formSectionMap = {
  articles: "article-form",
  videos: "video-form",
  qa: "qa-form",
  khutbah: "khuthbah-form"
};

const loginScreen = document.querySelector("#login-screen");
const adminShell = document.querySelector("#admin-shell");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const logoutBtn = document.querySelector("#logout-btn");
const refreshBtn = document.querySelector("#refresh-btn");
const postList = document.querySelector("#post-list");
const navButtons = document.querySelectorAll(".admin-nav-btn");
const adminSections = document.querySelectorAll(".admin-section");
const contentForms = document.querySelectorAll(".content-form");

onAuthStateChanged(auth, (user) => {
  const isLoggedIn = Boolean(user);
  loginScreen.classList.toggle("is-hidden", isLoggedIn);
  adminShell.classList.toggle("is-hidden", !isLoggedIn);

  if (isLoggedIn) {
    loadAllPosts();
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "Logging in...";

  const email = loginForm.querySelector("#login-email").value;
  const password = loginForm.querySelector("#login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    loginMessage.textContent = "";
  } catch (error) {
    loginMessage.textContent = "Login failed. Check your email and password.";
    console.error(error);
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

refreshBtn.addEventListener("click", loadAllPosts);

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSection(button.dataset.section);
  });
});

contentForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const collectionName = form.dataset.collection;
    const message = form.querySelector(".form-message");
    const formData = new FormData(form);
    const docId = formData.get("docId");

    const item = {
      title: formData.get("title").trim(),
      description: formData.get("description").trim(),
      image: formData.get("image").trim(),
      category: formData.get("category").trim(),
      date: formData.get("date"),
      content: formData.get("content").trim(),
      updatedAt: serverTimestamp()
    };

    try {
      if (docId) {
        await updateDoc(doc(db, collectionName, docId), item);
        message.textContent = "Updated successfully.";
      } else {
        await addDoc(collection(db, collectionName), {
          ...item,
          createdAt: serverTimestamp()
        });
        message.textContent = "Saved successfully.";
      }

      form.reset();
      form.querySelector("[name='docId']").value = "";
      await loadAllPosts();
    } catch (error) {
      message.textContent = "Save failed. Check Firebase setup.";
      console.error(error);
    }
  });
});

async function loadAllPosts() {
  postList.innerHTML = "<p class='muted'>Loading posts...</p>";

  try {
    const allItems = [];

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));

      snapshot.forEach((documentSnapshot) => {
        allItems.push({
          id: documentSnapshot.id,
          collectionName,
          ...documentSnapshot.data()
        });
      });
    }

    renderPosts(allItems);
  } catch (error) {
    postList.innerHTML = "<p class='muted'>Could not load posts. Check Firebase config and Firestore rules.</p>";
    console.error(error);
  }
}

function renderPosts(items) {
  if (!items.length) {
    postList.innerHTML = "<p class='muted'>No posts yet. Add your first item from the sidebar.</p>";
    return;
  }

  postList.innerHTML = items.map((item) => `
    <article class="post-item">
      <img src="${escapeHtml(item.image || "")}" alt="">
      <div>
        <h3>${escapeHtml(item.title || "Untitled")}</h3>
        <p>${escapeHtml(item.collectionName)} • ${escapeHtml(item.category || "No category")} • ${escapeHtml(item.date || "No date")}</p>
      </div>
      <div class="post-actions">
        <button class="small-btn" type="button" data-edit="${item.id}" data-collection="${item.collectionName}">Edit</button>
        <button class="small-btn danger" type="button" data-delete="${item.id}" data-collection="${item.collectionName}">Delete</button>
      </div>
    </article>
  `).join("");

  postList.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = items.find((post) => post.id === button.dataset.edit && post.collectionName === button.dataset.collection);
      editPost(item);
    });
  });

  postList.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const shouldDelete = confirm("Delete this item?");

      if (!shouldDelete) {
        return;
      }

      await deleteDoc(doc(db, button.dataset.collection, button.dataset.delete));
      await loadAllPosts();
    });
  });
}

function editPost(item) {
  const sectionId = formSectionMap[item.collectionName];
  const form = document.querySelector(`#${sectionId} form`);

  showSection(sectionId);

  form.querySelector("[name='docId']").value = item.id;
  form.querySelector("[name='title']").value = item.title || "";
  form.querySelector("[name='description']").value = item.description || "";
  form.querySelector("[name='image']").value = item.image || "";
  form.querySelector("[name='category']").value = item.category || "";
  form.querySelector("[name='date']").value = item.date || "";
  form.querySelector("[name='content']").value = item.content || "";
  form.querySelector(".form-message").textContent = "Editing existing item.";
}

function showSection(sectionId) {
  adminSections.forEach((section) => {
    section.classList.toggle("is-hidden", section.id !== sectionId);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === sectionId);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

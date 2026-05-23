// Select the main interactive elements.
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const newsletterForms = document.querySelectorAll(".newsletter-form");
const contactForm = document.querySelector(".contact-form");

// Apply the saved color theme when a page loads.
const savedTheme = localStorage.getItem("learnly-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.textContent = "Light";
}

// Open and close the mobile navigation menu.
navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the mobile menu after a navigation link is clicked.
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Switch between light and dark theme, then save the choice.
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");
  themeToggle.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem("learnly-theme", isDark ? "dark" : "light");
});

// Show a small success message after newsletter signup.
newsletterForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    showFormMessage(form, "Thank you for subscribing.");
  });
});

// Show a small success message after contact form submission.
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    showFormMessage(contactForm, "Thank you. Your message has been prepared.");
  });
}

function showFormMessage(form, message) {
  let formMessage = form.querySelector(".form-message");

  if (!formMessage) {
    formMessage = document.createElement("p");
    formMessage.className = "form-message";
    form.appendChild(formMessage);
  }

  formMessage.textContent = message;
}

// Switch homepage category tabs without leaving the page.
document.querySelectorAll("[data-tabs]").forEach((tabsWrapper) => {
  const tabButtons = tabsWrapper.querySelectorAll("[data-tab]");
  const tabPanels = tabsWrapper.querySelectorAll("[data-panel]");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.tab;

      tabButtons.forEach((tabButton) => {
        const isSelected = tabButton === button;
        tabButton.classList.toggle("is-active", isSelected);
        tabButton.setAttribute("aria-selected", isSelected);
      });

      tabPanels.forEach((panel) => {
        const isSelected = panel.dataset.panel === selectedTab;
        panel.hidden = !isSelected;
        panel.classList.toggle("is-active", isSelected);
      });
    });
  });
});

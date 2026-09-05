// Category/Division definitions for the site.
// Maps division keys to their Tamil labels, icons, and sub-categories.

export const divisions = [
  {
    key: "quran",
    label: "குர்ஆன்",
    icon: "📖",
    color: "#1B6B4A",
    subCategories: ["விளக்கம்", "உலூமுல் குர்ஆன்", "தர்ஜமா", "கிராஅத்"],
  },
  {
    key: "hadith",
    label: "ஹதீஸ்",
    icon: "📜",
    color: "#8B5E3C",
    subCategories: ["ஆய்வுகள்", "மற்றவை"],
  },
  {
    key: "aqeedah",
    label: "கொள்கை",
    icon: "🕌",
    color: "#2E4057",
    subCategories: ["அஹ்லுஸுன்னாஹ்", "வழிதவறிய கூட்டங்கள்"],
  },
  {
    key: "rulings",
    label: "சட்டங்கள்",
    icon: "⚖️",
    color: "#6B4C9A",
    subCategories: ["வணக்க வழிபாடுகள்", "கொடுக்கல் வாங்கல்", "குடும்பவியல்", "குற்றவியல்"],
  },
  {
    key: "history",
    label: "வரலாறு",
    icon: "🏛️",
    color: "#7D6608",
    subCategories: ["சீரா", "சரித்திரம்"],
  },
  {
    key: "religions",
    label: "மதங்கள்",
    icon: "🌍",
    color: "#C0392B",
    subCategories: ["இந்து மதம்", "கிறிஸ்துவம்", "மற்றவை"],
  },
  {
    key: "general",
    label: "பொதுவானவை",
    icon: "📚",
    color: "#34495E",
    subCategories: [],
  },
];

// Lookup helpers
export function getDivision(key) {
  return divisions.find((d) => d.key === key) || divisions[divisions.length - 1];
}

export function getDivisionByLabel(label) {
  return divisions.find((d) => d.label === label) || divisions[divisions.length - 1];
}

// Smarter data conversion with keyword-based division assignment
const fs = require('fs');
const scraped = JSON.parse(fs.readFileSync('scraped-articles.json', 'utf-8'));

// Direct category mapping
const categoryToDivision = {
  'குர்ஆன்': 'quran',
  'அகீதா': 'aqeedah',
  'சட்டங்கள்': 'rulings',
  'மதங்கள்': 'religions',
};

// Keyword-based rules for "ஆய்வுகள்" articles
function inferDivision(article) {
  // If direct category match
  const cat = article.category.replace('&amp;', '&');
  if (categoryToDivision[cat]) return categoryToDivision[cat];

  const t = (article.title + ' ' + article.content.substring(0, 300)).toLowerCase();

  // ஹதீஸ்
  if (/ஹதீஸ்|ஹதீது|hadith/.test(t)) return 'hadith';

  // கொள்கை / அகீதா
  if (/அகீதா|ஏகத்துவ|தவ்ஹீத்|சலஃப|சலபி|அஹ்லுஸ்|சுன்ன|ஷிர்க்|புத்தாக்க/.test(t)) return 'aqeedah';

  // வரலாறு (history)
  if (/வரலாற்|நபி|சீரா|இமாம்|கிலாஃபத்|உஸ்மான்|அரஃபா|முஹர்ரம்|ஆஷூரா|சரித்திர/.test(t)) return 'history';

  // சட்டங்கள் (rulings)
  if (/தொழுகை|நோன்பு|ஹஜ்|உம்ரா|நிகாஹ்|உழ்ஹிய்யா|ரமளான்|குத்பா|மஸ்ஜித்|ஒழுக்க|சட்ட|ஹலால்|ஹராம்|ஜனாஸா|ஃபிக்ஹ்|மோதிரம்/.test(t)) return 'rulings';

  // குர்ஆன் (Quran)
  if (/குர்ஆன்|வசனங்கள்|சூரா|தஃப்ஸீர்|quran/.test(t)) return 'quran';

  // மதங்கள் (religions)
  if (/சனாதன|கிறிஸ்|இந்து|தேவன்|குமாரன்|வேத|bible|hindu/.test(t)) return 'religions';

  // ஜிஹாத் / social issues → general
  return 'general';
}

// Clean content HTML entities
function cleanContent(text) {
  return text
    .replace(/&ndash;/g, '\u2013')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&hellip;/g, '\u2026')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&amp;/g, '&')
    .replace(/&zwnj;/g, '')
    .replace(/&zwj;/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// Parse date
function parseDate(dateStr) {
  if (!dateStr) return '2020-01-01';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '2020-01-01';
  return d.toISOString().split('T')[0];
}

const articles = scraped.articles.map(a => ({
  id: a.id,
  title: cleanContent(a.title),
  category: a.category.replace('&amp;', '&'),
  division: inferDivision(a),
  author: 'Sheikh Abdur Rahman',
  date: parseDate(a.date),
  image: a.image || '',
  views: a.views || 0,
  content: cleanContent(a.content),
}));

// Generate the JS module
let output = `// AUTO-GENERATED from manbayee.com — ${articles.length} articles
// Last updated: ${new Date().toISOString()}

export const sampleArticles = ${JSON.stringify(articles, null, 2)};

// Get all content sorted by date (newest first)
export function getAllContent() {
  return [...sampleArticles].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

// Get content filtered by division key
export function getContentByDivision(divisionKey) {
  return getAllContent().filter((item) => item.division === divisionKey);
}

// Get single item by ID
export function getContentById(id) {
  return sampleArticles.find((item) => item.id === id) || null;
}

// Get latest content
export function getLatestContent(limit = 3) {
  return getAllContent().slice(0, limit);
}

// Search content by keyword
export function searchContent(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return getAllContent().filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );
}

// Format date to Tamil-friendly format
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ta-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
`;

fs.writeFileSync('src/lib/data.js', output, 'utf-8');
console.log(`Generated src/lib/data.js with ${articles.length} articles`);

// Print final division distribution
const divCounts = {};
articles.forEach(a => { divCounts[a.division] = (divCounts[a.division]||0)+1; });
console.log('Division distribution:', JSON.stringify(divCounts, null, 2));

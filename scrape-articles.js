// Scrape all articles from manbayee.com and output structured JSON
// Usage: node scrape-articles.js

const http = require('http');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    }).on('error', reject);
  });
}

function extractArticle(html, id) {
  // Extract category badge
  const catMatch = html.match(/<p class="badge badge-primary[^"]*"[^>]*>(.*?)<\/p>/);
  const category = catMatch ? catMatch[1].trim() : '';

  // Extract date
  const dateMatch = html.match(/<p class="text-body"[^>]*><small>(.*?)<\/small><\/p>/);
  const date = dateMatch ? dateMatch[1].trim() : '';

  // Extract title
  const titleMatch = html.match(/<p class="h4 d-block mb-3[^"]*"[^>]*>(.*?)<\/p>/s);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract full content from the <p class="m-0" ...> tag
  const contentMatch = html.match(/<p class="m-0"[^>]*>([\s\S]*?)<\/p>\s*<\/div>\s*<div class="d-flex justify-content-between/);
  let content = '';
  if (contentMatch) {
    content = contentMatch[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // Extract image
  const imgMatch = html.match(/src="(postimages\/[^"]+)"/);
  const image = imgMatch ? `https://manbayee.com/${imgMatch[1]}` : '';

  // Extract views
  const viewsMatch = html.match(/<i class="far fa-eye mr-2"><\/i>\s*(\d+)/);
  const views = viewsMatch ? parseInt(viewsMatch[1]) : 0;

  if (!title && !content) return null;

  return { id: String(id), title, category, date, content, image, views };
}

async function main() {
  const articles = [];
  const errors = [];

  // Scrape articles from id 1 to 165
  for (let id = 1; id <= 165; id++) {
    try {
      process.stderr.write(`Fetching article ${id}...`);
      const html = await fetchUrl(`https://manbayee.com/d?id=${id}`);
      const article = extractArticle(html, id);
      if (article && article.title) {
        articles.push(article);
        process.stderr.write(` OK: ${article.title.substring(0, 40)}\n`);
      } else {
        process.stderr.write(` SKIP (no content)\n`);
      }
    } catch (err) {
      errors.push({ id, error: err.message });
      process.stderr.write(` ERROR: ${err.message}\n`);
    }
    // Small delay to be polite
    await new Promise(r => setTimeout(r, 200));
  }

  // Output as JSON
  const result = { totalArticles: articles.length, articles, errors };
  const fs = require('fs');
  fs.writeFileSync('scraped-articles.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Done! Scraped ${articles.length} articles. Saved to scraped-articles.json`);
}

main().catch(console.error);

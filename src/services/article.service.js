import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { getDivision } from "@/lib/divisions";

/**
 * Tamil titles are kept as-is in the slug — they survive URL encoding and read
 * better than a transliteration would. Only punctuation and runs of whitespace
 * are removed.
 */
function slugify(title) {
  const base = String(title)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return base || `katurai-${Date.now()}`;
}

async function uniqueSlug(title, excludeId) {
  const base = slugify(title);
  let candidate = base;

  for (let suffix = 2; ; suffix += 1) {
    const clash = await prisma.article.findUnique({ where: { slug: candidate } });
    if (!clash || clash.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
  }
}

/** Shapes a row the way the public pages and the admin list already expect. */
export function toPublicArticle(article) {
  return {
    id: article.slug,
    dbId: article.id,
    title: article.title,
    division: article.division,
    category: article.category || getDivision(article.division).label,
    author: article.author,
    description: article.description || "",
    content: article.content,
    image: article.image || "",
    videoUrl: article.videoUrl || "",
    date: article.publishedAt.toISOString().slice(0, 10),
    views: article.views,
    status: article.status,
  };
}

function toRow(data) {
  return {
    title: data.title,
    division: data.division,
    category: data.category || getDivision(data.division).label,
    author: data.author || "நிர்வாகம்",
    description: data.description || null,
    content: data.content,
    image: data.image || null,
    videoUrl: data.videoUrl || null,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    status: data.status || "PUBLISHED",
  };
}

export async function listArticles({ division, status, q } = {}) {
  const where = {};
  if (division) where.division = division;
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
      { category: { contains: q } },
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
  });

  return articles.map(toPublicArticle);
}

export async function getArticle(id) {
  const article = await prisma.article.findUnique({ where: { id: Number(id) } });
  if (!article) throw new NotFoundError("Article not found");
  return article;
}

export async function getArticleBySlug(slug) {
  const article = await prisma.article.findUnique({ where: { slug: String(slug) } });
  return article ? toPublicArticle(article) : null;
}

export async function createArticle(data, authorUserId) {
  const article = await prisma.article.create({
    data: { ...toRow(data), slug: await uniqueSlug(data.title), authorUserId },
  });
  return toPublicArticle(article);
}

export async function updateArticle(id, data) {
  const existing = await getArticle(id);

  // The slug is only re-derived when the heading actually changed, so links
  // that are already shared keep resolving.
  const slug =
    existing.title === data.title ? existing.slug : await uniqueSlug(data.title, existing.id);

  const article = await prisma.article.update({
    where: { id: existing.id },
    data: { ...toRow(data), slug },
  });

  return toPublicArticle(article);
}

export async function deleteArticle(id) {
  const existing = await getArticle(id);
  await prisma.article.delete({ where: { id: existing.id } });
}

/** Fire-and-forget from the article page; a failed count must not break the read. */
export async function incrementViews(slug) {
  await prisma.article
    .update({ where: { slug: String(slug) }, data: { views: { increment: 1 } } })
    .catch(() => {});
}

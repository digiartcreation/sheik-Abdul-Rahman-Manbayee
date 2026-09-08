import "server-only";
import { prisma } from "@/lib/prisma";
import { toPublicArticle } from "@/services/article.service";

// Read side of the site. Everything here returns the same shape the pages used
// to get from the hard-coded array in data.js, so the components did not have
// to change: `id` is the slug, `date` a YYYY-MM-DD string.
//
// Only PUBLISHED rows are ever returned — drafts stay inside /admin.

const published = { status: "PUBLISHED" };
const newestFirst = [{ publishedAt: "desc" }, { id: "desc" }];

export async function getAllContent() {
  const articles = await prisma.article.findMany({ where: published, orderBy: newestFirst });
  return articles.map(toPublicArticle);
}

export async function getContentByDivision(divisionKey) {
  const articles = await prisma.article.findMany({
    where: { ...published, division: divisionKey },
    orderBy: newestFirst,
  });
  return articles.map(toPublicArticle);
}

export async function getLatestContent(limit = 3) {
  const articles = await prisma.article.findMany({
    where: published,
    orderBy: newestFirst,
    take: limit,
  });
  return articles.map(toPublicArticle);
}

export async function getContentById(slug) {
  const article = await prisma.article.findFirst({
    where: { ...published, slug: String(slug) },
  });
  return article ? toPublicArticle(article) : null;
}

export async function searchContent(query) {
  if (!query) return [];
  const articles = await prisma.article.findMany({
    where: {
      ...published,
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { category: { contains: query } },
      ],
    },
    orderBy: newestFirst,
  });
  return articles.map(toPublicArticle);
}

/** Everything the home page needs, in one round trip to the database. */
export async function getHomeContent() {
  const all = await getAllContent();
  return { all, latest: all.slice(0, 3) };
}

/**
 * The Q&A archive carried over from the old site. Kept out of `Article` so the
 * 62 entries do not swamp the home feed or skew the division counts.
 */
export async function getQuestions() {
  const questions = await prisma.question.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "asc" }, { id: "asc" }],
  });

  return questions.map((q) => ({
    id: q.slug,
    question: q.question,
    answer: q.answer,
    answeredBy: q.answeredBy,
    date: q.publishedAt.toISOString().slice(0, 10),
  }));
}

export async function getQuestionById(slug) {
  const q = await prisma.question.findFirst({
    where: { status: "PUBLISHED", slug: String(slug) },
  });
  if (!q) return null;
  return {
    id: q.slug,
    question: q.question,
    answer: q.answer,
    answeredBy: q.answeredBy,
    date: q.publishedAt.toISOString().slice(0, 10),
  };
}

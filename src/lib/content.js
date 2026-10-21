import "server-only";
import { prisma } from "@/lib/prisma";
import { toPublicArticle } from "@/services/article.service";
import { toPublicFeedback } from "@/services/feedback.service";

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

// A reader's question stays off the site until the admin has answered it and
// published the answer.
const answered = { status: "PUBLISHED", answer: { not: null } };

const toPublicQuestion = (q) => ({
  id: q.slug,
  question: q.question,
  answer: q.answer,
  // "admin" on every imported row, and the default for answers given in /admin.
  answeredBy: !q.answeredBy || q.answeredBy === "admin" ? "Manbayee.com" : q.answeredBy,
  date: q.publishedAt.toISOString().slice(0, 10),
});

/**
 * The Q&A archive carried over from the old site, plus readers' questions the
 * admin has answered. Kept out of `Article` so they do not swamp the home feed
 * or skew the division counts.
 */
export async function getQuestions() {
  const questions = await prisma.question.findMany({
    where: answered,
    orderBy: [{ publishedAt: "asc" }, { id: "asc" }],
  });
  return questions.map(toPublicQuestion);
}

export async function getQuestionById(slug) {
  const q = await prisma.question.findFirst({
    where: { ...answered, slug: String(slug) },
  });
  return q ? toPublicQuestion(q) : null;
}

/** Readers' comments for /ungal-paguthi, newest first. Hidden ones stay in /admin. */
export async function getFeedback() {
  const feedback = await prisma.feedback.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  return feedback.map(toPublicFeedback);
}

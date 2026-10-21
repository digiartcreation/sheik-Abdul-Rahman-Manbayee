import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

const SLUG_PREFIX = "kelvi-";

/** The admin list shape. Unlike the public one it carries the asker's details. */
export function toAdminQuestion(q) {
  return {
    id: q.id,
    slug: q.slug,
    question: q.question,
    answer: q.answer || "",
    answeredBy: q.answeredBy || "",
    askerName: q.askerName || "",
    askerEmail: q.askerEmail || "",
    topic: q.topic || "",
    status: q.status,
    // When it was asked: imported rows carry the old site's date, new ones today's.
    date: q.publishedAt.toISOString().slice(0, 10),
  };
}

/** Readers' questions carry on the old site's numbering: kelvi-68, kelvi-69, … */
async function nextSlug() {
  const rows = await prisma.question.findMany({
    where: { slug: { startsWith: SLUG_PREFIX } },
    select: { slug: true },
  });
  const highest = rows.reduce(
    (max, { slug }) => Math.max(max, Number(slug.slice(SLUG_PREFIX.length)) || 0),
    0
  );
  return `${SLUG_PREFIX}${highest + 1}`;
}

/** A reader's question. It waits as an unanswered DRAFT until the admin answers it. */
export async function askQuestion(data) {
  // Two readers sending at the same moment can be handed the same number. The
  // unique index turns that into P2002, and the next attempt takes the one after.
  for (let attempt = 1; ; attempt += 1) {
    try {
      const question = await prisma.question.create({
        data: {
          slug: await nextSlug(),
          question: data.question,
          askerName: data.name,
          askerEmail: data.email,
          topic: data.topic || null,
          publishedAt: new Date(),
          status: "DRAFT",
        },
      });
      return toAdminQuestion(question);
    } catch (error) {
      const clash = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
      if (!clash || attempt >= 3) throw error;
    }
  }
}

export async function listQuestions() {
  const questions = await prisma.question.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  return questions.map(toAdminQuestion);
}

async function getQuestion(id) {
  const question = await prisma.question.findUnique({ where: { id: Number(id) } });
  if (!question) throw new NotFoundError("Question not found");
  return question;
}

export async function updateQuestion(id, data) {
  const existing = await getQuestion(id);

  const question = await prisma.question.update({
    where: { id: existing.id },
    data: {
      question: data.question,
      answer: data.answer || null,
      // "admin" is what the imported rows carry; the site shows it as Manbayee.com.
      answeredBy: data.answeredBy || (data.answer ? "admin" : null),
      status: data.status,
    },
  });

  return toAdminQuestion(question);
}

export async function deleteQuestion(id) {
  const existing = await getQuestion(id);
  await prisma.question.delete({ where: { id: existing.id } });
}

/**
 * Imports the content that the first migration left behind on the old
 * ahlulislam.net site:
 *
 *   • the 62-answer Q&A archive, which lived in its own `question_table`
 *   • the 2 posts that were never carried across
 *
 * The source data sits in prisma/legacy/*.json, extracted once from the old
 * mysqldump and committed here so this runs without the 17 MB .sql file.
 *
 * Safe to re-run: everything is keyed on a stable slug and upserted.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { divisions } from "../src/lib/divisions.js";

const prisma = new PrismaClient();

const readJson = async (name) =>
  JSON.parse(await readFile(path.join(process.cwd(), "prisma", "legacy", name), "utf8"));

/** "2020-04-14 05:57:18" -> Date. The dump has no timezone, so treat it as UTC. */
function parseDate(value, fallback = new Date()) {
  if (!value) return fallback;
  const d = new Date(String(value).replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime()) ? fallback : d;
}

async function importQuestions() {
  const questions = await readJson("questions.json");
  let created = 0;
  let updated = 0;

  for (const q of questions) {
    const slug = `kelvi-${q.oldId}`;
    const publishedAt = parseDate(q.answeredAt) || parseDate(q.askedAt);

    const data = {
      question: q.question,
      answer: q.answer,
      answeredBy: q.answeredBy || null,
      publishedAt: parseDate(q.askedAt, publishedAt),
      status: "PUBLISHED",
    };

    const existing = await prisma.question.findUnique({ where: { slug } });
    await prisma.question.upsert({ where: { slug }, update: data, create: { slug, ...data } });
    existing ? updated++ : created++;
  }

  console.log(`Q&A: ${created} created, ${updated} updated (${questions.length} total)`);
}

/**
 * The old site's numeric category ids, mapped onto this site's division keys.
 * Only the two ids the missing posts use are needed, but the rest are recorded
 * so a future re-import does not have to rediscover them.
 */
const CATEGORY_TO_DIVISION = {
  2: "aqeedah",   // அகீதா
  3: "quran",     // குர்ஆன்
  5: "rulings",   // சட்டங்கள்
  6: "hadith",    // ஆய்வுகள்
  7: "religions", // மதங்கள்
  8: "general",   // வீடியோ
  9: "rulings",   // கேள்வி & பதில்
  10: "general",  // நூல்கள்
  11: "general",  // MP3
  13: "history",  // வரலாறு
};

const CATEGORY_LABEL = {
  2: "அகீதா", 3: "குர்ஆன்", 5: "சட்டங்கள்", 6: "ஆய்வுகள்",
  7: "மதங்கள்", 8: "வீடியோ", 9: "கேள்வி & பதில்",
  10: "நூல்கள்", 11: "MP3", 13: "வரலாறு",
};

async function importMissingPosts() {
  const posts = await readJson("missing-posts.json");
  let created = 0;
  let skipped = 0;

  for (const p of posts) {
    const slug = String(p.oldId);
    const division = CATEGORY_TO_DIVISION[p.categoryId] || "general";
    const fallback = divisions.find((d) => d.key === division);

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.article.create({
      data: {
        slug,
        title: p.title.slice(0, 300),
        division,
        category: CATEGORY_LABEL[p.categoryId] || "பொதுவானவை",
        author: p.author || "Ahlul Islam",
        description: p.summary ? p.summary.slice(0, 500) : null,
        content: p.content,
        // The old image path if there was one, else the division's own artwork.
        image: p.image ? `/postimages/${p.image}` : `/thumbnails/${fallback?.key || "general"}.svg`,
        publishedAt: parseDate(p.postedAt),
        status: "PUBLISHED",
      },
    });
    created++;
  }

  console.log(`Posts: ${created} created, ${skipped} already present`);
}

/**
 * Article images were stored as absolute URLs on the old domain
 * (https://manbayee.com/postimages/…). Those resolve only while manbayee.com
 * still serves the old PHP site — the moment DNS moves to this app, all of them
 * 404. The files now live in public/postimages, so the paths become relative,
 * which also works on the temporary hostingersite.com URL.
 */
async function rewriteImagePaths() {
  const map = await readJson("image-map.json");

  const articles = await prisma.article.findMany({
    where: { image: { contains: "/postimages/" } },
    select: { id: true, image: true, division: true },
  });

  let rewritten = 0;
  let fellBack = 0;

  for (const a of articles) {
    if (a.image.startsWith("/postimages/")) continue; // already done

    const oldName = decodeURIComponent(a.image.split("/").pop());
    const newName = map[oldName];

    // Two originals are gone from both the old folder and the live old site;
    // those articles fall back to their division's artwork.
    const image = newName
      ? `/postimages/${newName}`
      : `/thumbnails/${divisions.some((d) => d.key === a.division) ? a.division : "general"}.svg`;

    await prisma.article.update({ where: { id: a.id }, data: { image } });
    newName ? rewritten++ : fellBack++;
  }

  console.log(`Images: ${rewritten} repointed locally, ${fellBack} fell back to division art`);
}

async function main() {
  await importQuestions();
  await importMissingPosts();
  await rewriteImagePaths();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

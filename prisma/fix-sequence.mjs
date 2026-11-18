/**
 * Puts the article numbering back in order:
 *
 *   • adds old post #82, the one old-site article that never came across
 *     (prisma/legacy/restored-posts.json, taken from the old mysqldump)
 *   • turns the 46 Word-document copies (/katurai/1000–1045) into drafts. Each
 *     repeats an old-site article word for word, which listed every article
 *     twice and scrambled series such as கடன் முறைகளும் சட்டங்களும். Their
 *     numbers redirect to the original (src/lib/article-redirects.js).
 *
 * Nothing is deleted, so a copy can be published again from /admin. A copy is
 * only hidden when its original is published, so no article ever disappears.
 *
 * Safe to re-run: #82 is skipped once it exists, and drafts stay drafts.
 *
 *   node prisma/fix-sequence.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { wordDocCopies } from "../src/lib/article-redirects.js";

const prisma = new PrismaClient();

/** "2021-11-21 10:30:00" -> Date. The dump has no timezone, so treat it as UTC. */
const parseDate = (value) => new Date(String(value).replace(" ", "T") + "Z");

async function restorePosts() {
  const file = path.join(process.cwd(), "prisma", "legacy", "restored-posts.json");
  const posts = JSON.parse(await readFile(file, "utf8"));
  let created = 0;

  for (const p of posts) {
    const slug = String(p.oldId);
    if (await prisma.article.findUnique({ where: { slug } })) continue;

    await prisma.article.create({
      data: {
        slug,
        title: p.title,
        division: p.division,
        category: p.category,
        author: p.author,
        content: p.content,
        image: `/thumbnails/${p.division}.svg`,
        publishedAt: parseDate(p.postedAt),
        status: "PUBLISHED",
      },
    });
    created++;
    console.log(`Added /katurai/${slug}  ${p.title}`);
  }

  console.log(`Restored posts: ${created} added, ${posts.length - created} already present`);
}

async function hideWordDocCopies() {
  let hidden = 0;
  let already = 0;
  const kept = [];

  for (const [copySlug, originalSlug] of Object.entries(wordDocCopies)) {
    const copy = await prisma.article.findUnique({ where: { slug: copySlug } });
    if (!copy) continue;
    if (copy.status === "DRAFT") {
      already++;
      continue;
    }

    const original = await prisma.article.findUnique({ where: { slug: String(originalSlug) } });
    if (original?.status !== "PUBLISHED") {
      kept.push(`/katurai/${copySlug} (original /katurai/${originalSlug} is not published)`);
      continue;
    }

    await prisma.article.update({ where: { id: copy.id }, data: { status: "DRAFT" } });
    hidden++;
  }

  console.log(`Word-document copies: ${hidden} moved to drafts, ${already} already drafts`);
  for (const line of kept) console.log(`  left published: ${line}`);
}

async function main() {
  await restorePosts();
  await hideWordDocCopies();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

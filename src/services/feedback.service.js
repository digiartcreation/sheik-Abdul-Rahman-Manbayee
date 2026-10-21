import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

/** What /ungal-paguthi shows. The email stays out of it. */
export function toPublicFeedback(f) {
  return {
    id: f.id,
    name: f.name,
    type: f.type,
    content: f.content,
    date: f.createdAt.toISOString().slice(0, 10),
  };
}

export const toAdminFeedback = (f) => ({ ...toPublicFeedback(f), email: f.email, status: f.status });

/** Goes live straight away; the admin can hide or delete it afterwards. */
export async function createFeedback(data) {
  const feedback = await prisma.feedback.create({
    data: { name: data.name, email: data.email, type: data.type, content: data.content },
  });
  return toPublicFeedback(feedback);
}

export async function listFeedback() {
  const feedback = await prisma.feedback.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  return feedback.map(toAdminFeedback);
}

async function getFeedback(id) {
  const feedback = await prisma.feedback.findUnique({ where: { id: Number(id) } });
  if (!feedback) throw new NotFoundError("Feedback not found");
  return feedback;
}

export async function setFeedbackStatus(id, status) {
  const existing = await getFeedback(id);
  const feedback = await prisma.feedback.update({ where: { id: existing.id }, data: { status } });
  return toAdminFeedback(feedback);
}

export async function deleteFeedback(id) {
  const existing = await getFeedback(id);
  await prisma.feedback.delete({ where: { id: existing.id } });
}

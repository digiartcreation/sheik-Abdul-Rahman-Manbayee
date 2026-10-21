import { body, route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { ok } from "@/lib/response";
import { askQuestion, listQuestions } from "@/services/question.service";
import { askQuestionSchema } from "@/validations/question.schema";

/** Every question, answered or not, with the asker's details. Admin only. */
export const GET = route(async () => {
  await requireAuth();
  return ok(await listQuestions(), "Questions fetched successfully");
});

/** The public form on /kelvi-pathil. Nothing about the saved row is sent back. */
export const POST = route(async (request) => {
  const payload = await body(request, askQuestionSchema);

  // A filled-in honeypot is a bot. It gets the same answer as a person, so it
  // has no reason to try again, but nothing is saved.
  if (!payload.website) await askQuestion(payload);

  return ok(null, "Question received", 201);
});

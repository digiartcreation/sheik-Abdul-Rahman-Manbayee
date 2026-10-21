import { body, route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { ok } from "@/lib/response";
import { createFeedback, listFeedback } from "@/services/feedback.service";
import { feedbackSchema } from "@/validations/feedback.schema";

/** Every comment, hidden ones included, with the sender's email. Admin only. */
export const GET = route(async () => {
  await requireAuth();
  return ok(await listFeedback(), "Feedback fetched successfully");
});

/** The public form on /ungal-paguthi. The comment is live as soon as this returns. */
export const POST = route(async (request) => {
  const payload = await body(request, feedbackSchema);

  // A filled-in honeypot is a bot. It gets the same answer as a person, so it
  // has no reason to try again, but nothing is saved.
  if (payload.website) return ok(null, "Feedback received", 201);

  return ok(await createFeedback(payload), "Feedback received", 201);
});

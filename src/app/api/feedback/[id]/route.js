import { body, route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { noContent, ok } from "@/lib/response";
import { deleteFeedback, setFeedbackStatus } from "@/services/feedback.service";
import { feedbackStatusSchema } from "@/validations/feedback.schema";

/** Hide a comment from the site, or put it back. */
export const PUT = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  const { status } = await body(request, feedbackStatusSchema);
  return ok(await setFeedbackStatus(id, status), "Feedback updated successfully");
});

export const DELETE = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  await deleteFeedback(id);
  return noContent();
});

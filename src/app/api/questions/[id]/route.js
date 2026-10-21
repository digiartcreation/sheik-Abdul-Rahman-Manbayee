import { body, route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { noContent, ok } from "@/lib/response";
import { deleteQuestion, updateQuestion } from "@/services/question.service";
import { answerQuestionSchema } from "@/validations/question.schema";

export const PUT = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  const payload = await body(request, answerQuestionSchema);
  return ok(await updateQuestion(id, payload), "Question updated successfully");
});

export const DELETE = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  await deleteQuestion(id);
  return noContent();
});

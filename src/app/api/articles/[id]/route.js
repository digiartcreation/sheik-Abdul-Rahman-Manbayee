import { body, route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { noContent, ok } from "@/lib/response";
import {
  deleteArticle,
  getArticle,
  toPublicArticle,
  updateArticle,
} from "@/services/article.service";
import { articleSchema } from "@/validations/article.schema";

export const GET = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  return ok(toPublicArticle(await getArticle(id)));
});

export const PUT = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  const payload = await body(request, articleSchema);
  return ok(await updateArticle(id, payload), "Article updated successfully");
});

export const DELETE = route(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  await deleteArticle(id);
  return noContent();
});

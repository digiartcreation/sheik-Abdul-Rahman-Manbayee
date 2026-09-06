import { body, route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { ok } from "@/lib/response";
import { createArticle, listArticles } from "@/services/article.service";
import { articleSchema } from "@/validations/article.schema";

/**
 * Signed in, the list includes drafts so the admin can see everything it owns.
 * Signed out it is the public feed, so only published posts come back.
 */
export const GET = route(async (request) => {
  const params = request.nextUrl.searchParams;
  const user = await requireAuth().catch(() => null);

  const articles = await listArticles({
    division: params.get("division") || undefined,
    q: params.get("q") || undefined,
    status: user ? params.get("status") || undefined : "PUBLISHED",
  });

  return ok(articles, "Articles fetched successfully");
});

export const POST = route(async (request) => {
  const user = await requireAuth();
  const payload = await body(request, articleSchema);
  return ok(await createArticle(payload, user.id), "Article created successfully", 201);
});

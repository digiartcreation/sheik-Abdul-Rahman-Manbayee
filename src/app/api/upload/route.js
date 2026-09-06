import { route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { ok } from "@/lib/response";
import { saveUpload } from "@/services/upload.service";

export const POST = route(async (request) => {
  await requireAuth();
  const form = await request.formData();
  return ok(await saveUpload(form.get("file")), "Image uploaded", 201);
});

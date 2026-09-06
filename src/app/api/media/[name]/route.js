import { route } from "@/lib/api";
import { readUpload } from "@/services/upload.service";

/** Serves an uploaded thumbnail. Public — these are the images on the site. */
export const GET = route(async (request, { params }) => {
  const { name } = await params;
  const { body, contentType } = await readUpload(name);

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});

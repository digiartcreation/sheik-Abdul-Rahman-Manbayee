import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BusinessError, NotFoundError } from "@/lib/errors";

// Uploads live outside `public/` and are served by /api/media, because that
// folder is part of the build output — a file dropped into it after `next build`
// is not guaranteed to be served, and on Hostinger a redeploy would wipe it.
const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "uploads");

const MAX_BYTES = 5 * 1024 * 1024;

// SVG is deliberately absent: it can carry script, and these files are served
// from the site's own origin. The built-in division thumbnails cover that need.
const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const CONTENT_TYPES = Object.fromEntries(
  Object.entries(ALLOWED).map(([type, ext]) => [ext, type])
);

export async function saveUpload(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new BusinessError("Choose an image file to upload");
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    throw new BusinessError("Thumbnail must be a JPG, PNG, WebP or GIF image");
  }

  if (file.size > MAX_BYTES) {
    throw new BusinessError("Thumbnail must be smaller than 5 MB");
  }

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  return { name, url: `/api/media/${name}` };
}

export async function readUpload(name) {
  // Resolve then confirm the result is still inside UPLOAD_DIR, so a crafted
  // "../../.env" cannot escape the folder.
  const target = path.resolve(UPLOAD_DIR, name);
  if (target !== path.join(UPLOAD_DIR, path.basename(target))) {
    throw new NotFoundError("File not found");
  }

  const contentType = CONTENT_TYPES[path.extname(target).slice(1).toLowerCase()];
  if (!contentType) throw new NotFoundError("File not found");

  try {
    return { body: await readFile(target), contentType };
  } catch {
    throw new NotFoundError("File not found");
  }
}

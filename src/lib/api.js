import { fail } from "@/lib/response";

/** Parse and validate a JSON request body. Throws ZodError, which `route` turns into a 400. */
export async function body(request, schema) {
  return schema.parse(await request.json());
}

/** Read ?page= / ?size= with sane bounds. */
export function query(request) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(0, Number(params.get("page") ?? 0) || 0);
  const size = Math.min(100, Math.max(1, Number(params.get("size") ?? 20) || 20));
  return { page, size, skip: page * size };
}

/** Wraps a route handler so every thrown error becomes a consistent JSON body. */
export function route(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return fail(error);
    }
  };
}

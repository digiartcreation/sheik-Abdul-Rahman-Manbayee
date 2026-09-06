// Thin wrapper over the /api routes. Every response uses the same
// { success, message, data, errors } envelope from src/lib/response.js, so the
// unwrapping lives here rather than in each component.

export class ApiError extends Error {
  constructor(message, fieldErrors) {
    super(message);
    this.fieldErrors = fieldErrors || {};
  }
}

async function unwrap(response) {
  // A 204 has no body to parse.
  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || "Something went wrong. Please try again.",
      payload?.errors?.fieldErrors
    );
  }

  return payload.data;
}

const json = (method) => async (url, body) =>
  unwrap(
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );

export const apiGet = async (url) => unwrap(await fetch(url));
export const apiPost = json("POST");
export const apiPut = json("PUT");
export const apiDelete = async (url) => unwrap(await fetch(url, { method: "DELETE" }));

export async function apiUpload(file) {
  const form = new FormData();
  form.append("file", file);
  return unwrap(await fetch("/api/upload", { method: "POST", body: form }));
}

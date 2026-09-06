import { route } from "@/lib/api";
import { clearedSessionCookie } from "@/lib/auth";
import { ok } from "@/lib/response";

export const POST = route(async () => {
  const response = ok(null, "Logged out");
  response.cookies.set(clearedSessionCookie());
  return response;
});

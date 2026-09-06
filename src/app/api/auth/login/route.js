import { body, route } from "@/lib/api";
import { sessionCookie } from "@/lib/auth";
import { ok } from "@/lib/response";
import { loginUser } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.schema";

export const POST = route(async (request) => {
  const payload = await body(request, loginSchema);
  const { user, token } = await loginUser(payload.email, payload.password);

  const response = ok(user, "Login successful");
  response.cookies.set(sessionCookie(token));
  return response;
});

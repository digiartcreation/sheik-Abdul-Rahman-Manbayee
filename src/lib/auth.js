import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export const AUTH_COOKIE = "manbayee_session";
const SESSION_HOURS = 8;

const key = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "development-only-change-me");

export async function signSession(user) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(key());
}

/** Signature check only — no database. Safe to call from proxy.js. */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, key());
    return payload;
  } catch {
    return null;
  }
}

/** Full check: valid cookie *and* a user row that is still active. */
export async function requireAuth() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) throw new UnauthorizedError();

  const payload = await verifySession(token);
  if (!payload) throw new UnauthorizedError("Invalid or expired session");

  const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
  if (!user || user.status !== "ACTIVE") throw new UnauthorizedError();

  return user;
}

export async function requireRole(...roles) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) throw new ForbiddenError();
  return user;
}

// `secure` is what keeps the session off plain HTTP, so NODE_ENV=production
// must be set on Hostinger or the cookie travels in the clear.
export const sessionCookie = (token) => ({
  name: AUTH_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * SESSION_HOURS,
});

export const clearedSessionCookie = () => ({ ...sessionCookie(""), maxAge: 0 });

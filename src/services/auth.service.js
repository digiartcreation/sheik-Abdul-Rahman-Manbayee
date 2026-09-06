import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Same message either way, so the form cannot be used to find out which
  // email addresses exist.
  const invalid = new UnauthorizedError("Email or password is incorrect");
  if (!user || user.status !== "ACTIVE") throw invalid;
  if (!(await bcrypt.compare(password, user.passwordHash))) throw invalid;

  return { user: publicUser(user), token: await signSession(user) };
}

export const toPublicUser = publicUser;

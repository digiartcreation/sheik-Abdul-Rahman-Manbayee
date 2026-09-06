import { route } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { ok } from "@/lib/response";
import { toPublicUser } from "@/services/auth.service";

export const GET = route(async () => ok(toPublicUser(await requireAuth())));

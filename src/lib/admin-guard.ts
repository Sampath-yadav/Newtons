import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export type AdminGuardResult =
  | { ok: true; user: { id: number; name: string; email: string } }
  | { ok: false; status: 401 | 403 };

/**
 * Server-side authorization for sensitive admin actions. Beyond the fast JWT
 * role check that middleware performs, this re-reads the acting user from the
 * database so an admin who was disabled or demoted *after* their token was
 * issued is rejected immediately — the token alone is never trusted for writes.
 */
export async function requireAdmin(req: NextRequest): Promise<AdminGuardResult> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) return { ok: false, status: 401 };
  if (token.role !== "ADMIN") return { ok: false, status: 403 };

  const user = await prisma.user.findUnique({ where: { id: Number(token.id) } });
  if (!user || user.role !== "ADMIN" || user.status !== "ACTIVE") {
    return { ok: false, status: 403 };
  }
  return { ok: true, user: { id: user.id, name: user.name, email: user.email } };
}

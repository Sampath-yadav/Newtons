import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "~/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Logs land in the Vercel function logs, so a failing prod login can be
        // diagnosed (wrong creds vs. DB error vs. session layer) without PII
        // beyond the email that was attempted.
        try {
          if (!credentials?.email || !credentials?.password) {
            console.warn("[auth] missing email or password");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.warn(`[auth] no user found for ${credentials.email}`);
            return null;
          }

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) {
            console.warn(`[auth] invalid password for ${credentials.email}`);
            return null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role as "teacher" | "admin",
          };
        } catch (e) {
          console.error("[auth] authorize() threw:", e);
          return null;
        }
      },
    }),
  ],
  // 8-hour sessions (one school day). A teacher who leaves the upload page open
  // overnight will be warned before this elapses (see SessionExpiryWarning) so
  // they don't lose work to a silent 401. Sessions are rolling, so active use
  // keeps extending them.
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: "teacher" | "admin" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: { signIn: "/teacher" },
  secret: process.env.NEXTAUTH_SECRET,
  // Force secure, prefixed cookies in production regardless of the NEXTAUTH_URL
  // protocol, so the session cookie behaves correctly behind Vercel's HTTPS.
  useSecureCookies: process.env.NODE_ENV === "production",
};

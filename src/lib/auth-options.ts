import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "~/lib/prisma";

/**
 * Authentication is split from authorization:
 *  - Google proves *who* the user is (password, device, recovery and 2FA are all
 *    owned by Google — the app never stores a password).
 *  - The database proves *whether* they may enter: the email must map to a user
 *    row whose status is ACTIVE. Role then decides which portal they land on.
 *
 * Both admins and teachers sign in exclusively through Google. There is no
 * credential provider, no sign-up, and no password reset by design.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Let users pick which Google account to use instead of silently reusing
      // a stale session — important on shared school machines.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  // 8-hour sessions (one school day). A teacher who leaves the upload page open
  // overnight will be warned before this elapses (see SessionExpiryWarning) so
  // they don't lose work to a silent 401. Sessions are rolling, so active use
  // keeps extending them.
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    // AUTHORIZATION gate. Google has proven identity; here we decide access.
    // Returning a string redirects the user there *without* creating a session,
    // which lets us show a precise reason (unknown vs disabled account).
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;

      const email = user.email;
      if (!email) return "/access-denied?reason=unauthorized";

      const dbUser = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { status: true },
      });

      if (!dbUser) {
        console.warn(`[auth] sign-in denied — no account for ${email}`);
        return "/access-denied?reason=unauthorized";
      }
      if (dbUser.status !== "ACTIVE") {
        console.warn(`[auth] sign-in denied — disabled account ${email}`);
        return "/access-denied?reason=disabled";
      }
      return true;
    },
    // Persist our DB identity into the token. We resolve role/status straight
    // from the database on initial sign-in (when `user` is present) rather than
    // trusting the provider profile — Google has no role. The token is set once
    // and reused until it expires, so this DB read only happens at login.
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (user && email) {
        const dbUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (dbUser) {
          token.id = String(dbUser.id);
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
  // signIn is the default Google surface; denied OAuth sign-ins land on the
  // shared access-denied page (the signIn callback redirects there with a reason).
  pages: { signIn: "/teacher", error: "/access-denied" },
  secret: process.env.NEXTAUTH_SECRET,
  // Force secure, prefixed cookies in production regardless of the NEXTAUTH_URL
  // protocol, so the session cookie behaves correctly behind Vercel's HTTPS.
  useSecureCookies: process.env.NODE_ENV === "production",
};

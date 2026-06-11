import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PARENT_COOKIE, verifyParentSession } from "~/lib/parent-session";
import { ParentDashboard } from "~/components/parent/ParentDashboard";

// Server guard: validate the signed parent cookie before rendering anything.
// Invalid/missing/expired → bounce to login. The client component then fetches
// the data (which re-checks the cookie server-side and scopes to this child).
export default async function ParentDashboardPage() {
  const cookieStore = await cookies();
  const studentId = verifyParentSession(cookieStore.get(PARENT_COOKIE)?.value);
  if (!studentId) {
    redirect("/parent-portal/login");
  }

  return <ParentDashboard />;
}

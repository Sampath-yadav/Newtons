import { redirect } from "next/navigation";

// Merged into the unified What's On page ("Latest Updates" timeline).
export default function NewsPage() {
  redirect("/whats-on#latest-updates");
}

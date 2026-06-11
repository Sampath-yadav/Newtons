import { redirect } from "next/navigation";

// Merged into the unified What's On page ("Upcoming Events" calendar).
export default function EventsPage() {
  redirect("/whats-on#events-calendar");
}

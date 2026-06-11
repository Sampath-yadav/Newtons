import { redirect } from "next/navigation";

// Merged into the single School Life page ("Life Beyond the Classroom" section).
export default function ClubsSportsPage() {
  redirect("/school-life#life-beyond");
}

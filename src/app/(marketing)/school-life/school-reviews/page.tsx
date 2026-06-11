import { redirect } from "next/navigation";

// Merged into the single School Life page ("Student & Parent Voices" section).
export default function SchoolReviewsPage() {
  redirect("/school-life#voices");
}

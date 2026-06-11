import { redirect } from "next/navigation";

// "Our Campus" is now merged into the consolidated Why Choose Us page
// (Explore Our Campus, facility deep-dives, Safety & Wellbeing sections).
export default function OurCampusPage() {
  redirect("/our-school/why-choose-us");
}

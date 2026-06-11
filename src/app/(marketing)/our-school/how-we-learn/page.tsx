import { redirect } from "next/navigation";

// "How We Learn" is now merged into the consolidated Why Choose Us page
// (Our Learning Philosophy + Student Learning Journey sections).
export default function HowWeLearnPage() {
  redirect("/our-school/why-choose-us");
}

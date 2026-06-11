import { WhatsOnExperience } from "~/components/whats-on/WhatsOnExperience";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";

// Unified "What's On" — News + Events merged into one interactive experience.
export default function WhatsOnPage() {
  return (
    <>
      <WhatsOnExperience />
      <AccreditationsBanner />
    </>
  );
}

import type { Metadata } from "next";
import { site } from "~/data/site";

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.tagline,
    ...overrides,
  };
}

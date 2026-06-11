"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "How to apply", href: "/admissions/how-to-apply" },
  { label: "Tuition fees", href: "/admissions/tuition-fees" },
  { label: "Enquire now", href: "/admissions/enquire-now" },
];

export function AdmissionsSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-brand-navy">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex-shrink-0 px-6 py-4 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 after:absolute after:bottom-0 after:left-6 after:right-6 after:h-[2px] after:rounded-full after:transition-all after:duration-200 ${
                  isActive
                    ? "text-brand-orange after:bg-brand-orange"
                    : "text-white/80 after:bg-transparent hover:text-white hover:after:bg-white/30"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { SessionProvider } from "next-auth/react";
import { SessionExpiryWarning } from "~/components/teacher/SessionExpiryWarning";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionExpiryWarning />
      {children}
    </SessionProvider>
  );
}

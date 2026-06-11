// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Newton's High School – Where Confidence Grows",
  description:
    "Newton's High School in Hyderabad offering Cambridge and SSC pathways for ages 3 to 18.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-white antialiased pb-[64px] lg:pb-0">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

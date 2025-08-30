// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// If your template set up a Google font (e.g., Inter), keep it:
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js + Tailwind starter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-white dark:bg-gray-950 scheme-light dark:scheme-dark"
      suppressHydrationWarning
    >
      {/* If you have a font class, merge it into body: className={`${inter.className}`} */}
      <body>{children}</body>
    </html>
  );
}

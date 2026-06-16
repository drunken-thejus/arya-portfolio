import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// IBM Plex Mono for the editorial labels; Satoshi is loaded via CSS fallback to Inter.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arya Suresh — Technical Content Writer",
  description:
    "Technical, developer-focused, and SEO/AEO-optimised content for software and engineering companies.",
  openGraph: {
    title: "Arya Suresh — Technical Content Writer",
    description: "Turning complex engineering into content people actually read.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

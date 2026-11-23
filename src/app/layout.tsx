import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "NCode — Nattapon Phliwan (Nut) · Full Stack Web Developer",
    template: "%s · NCode",
  },
  description:
    "An interactive cyberpunk portfolio of Nattapon Phliwan (Nut) — full stack web developer in Bangkok, Thailand. Built with Next.js, React, TypeScript, GSAP and Node.js.",
  keywords: [
    "Nattapon Phliwan",
    "Nut",
    "full stack developer",
    "web developer Bangkok",
    "creative developer",
    "Next.js",
    "React",
    "TypeScript",
    "GSAP",
    "portfolio",
  ],
  authors: [{ name: site.name, url: site.githubUrl }],
  creator: site.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: site.brand,
    title: "NCode — Nattapon Phliwan (Nut)",
    description:
      "Full stack web developer in Bangkok — interactive cyberpunk portfolio built with Next.js, GSAP and WebGL.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NCode — Nattapon Phliwan (Nut)",
    description:
      "Full stack web developer in Bangkok — interactive cyberpunk portfolio built with Next.js, GSAP and WebGL.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

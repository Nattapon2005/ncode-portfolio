import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "NCode — Nattapon Phliwan | Creative Developer",
  description: "An interactive developer universe: the portfolio of Nattapon Phliwan, creative developer.",
  openGraph: { title: "NCode — Nattapon Phliwan", description: "Creative developer portfolio.", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}

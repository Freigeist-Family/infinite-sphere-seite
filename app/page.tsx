import type { Metadata } from "next";
import StaticHtml from "@/components/StaticHtml";
import { getSitePage } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Infinite Sphere — Der innere Kreis der Freigeist Family" },
  description:
    "Der innere Kreis der Freigeist Family. Eine Jahres-Mastermind für Unternehmerfamilien, Zugang auf Einladung.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Infinite Sphere — Der innere Kreis der Freigeist Family",
    description:
      "Der innere Kreis der Freigeist Family. Eine Jahres-Mastermind für Unternehmerfamilien, Zugang auf Einladung.",
    url: "https://infinite-sphere.de",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return <StaticHtml page={getSitePage("index")} />;
}

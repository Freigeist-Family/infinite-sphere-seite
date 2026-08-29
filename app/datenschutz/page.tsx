import type { Metadata } from "next";
import StaticHtml from "@/components/StaticHtml";
import { getSitePage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Welche Daten beim Besuch dieser Website verarbeitet werden, auf welcher Rechtsgrundlage und welche Rechte du hast.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/datenschutz/" },
};

export default function DatenschutzPage() {
  return <StaticHtml page={getSitePage("datenschutz")} />;
}

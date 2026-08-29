import type { Metadata } from "next";
import StaticHtml from "@/components/StaticHtml";
import { getSitePage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum und Anbieterkennzeichnung nach § 5 DDG der Freigeist Family GmbH, Wangerland.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/impressum/" },
};

export default function ImpressumPage() {
  return <StaticHtml page={getSitePage("impressum")} />;
}

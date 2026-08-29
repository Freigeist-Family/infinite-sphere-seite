import type { SitePage } from "@/lib/content";

/**
 * Rendert eine der statischen Design-Seiten (Startseite, Impressum,
 * Datenschutz) 1:1: den seiten-eigenen <style>-Block plus den <body>-Inhalt.
 * Die Seiten sind reines HTML/CSS ohne JavaScript.
 */
export default function StaticHtml({ page }: { page: SitePage }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.style }} />
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </>
  );
}

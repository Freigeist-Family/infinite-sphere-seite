import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

function read(file: string): string {
  return readFileSync(file, "utf8");
}

function between(html: string, open: RegExp, closeTag: string): string {
  const start = html.match(open);
  if (!start || start.index === undefined) return "";
  const from = start.index + start[0].length;
  const to = html.indexOf(closeTag, from);
  return to === -1 ? html.slice(from) : html.slice(from, to);
}

/**
 * Relative Asset-Pfade auf absolute /assets/-Pfade ziehen, damit sie auch
 * aus Unterverzeichnissen (/impressum/, /touchpoint-x/) laden.
 */
function absolutizeAssets(html: string): string {
  return html
    .replace(/(src|href|srcset)="assets\//g, '$1="/assets/')
    .replace(/url\((['"]?)assets\//g, "url($1/assets/");
}

export interface SitePage {
  /** Inhalt des <style>-Blocks aus dem <head> (seiten-spezifische Hover-Regeln). */
  style: string;
  /** Innerer HTML-Inhalt des <body>. */
  body: string;
}

/** Startseite / Impressum / Datenschutz: content/pages/<name>.html */
export function getSitePage(name: "index" | "impressum" | "datenschutz"): SitePage {
  const html = read(path.join(CONTENT_DIR, "pages", `${name}.html`));
  return {
    style: absolutizeAssets(between(html, /<style[^>]*>/i, "</style>").trim()),
    body: absolutizeAssets(between(html, /<body[^>]*>/i, "</body>").trim()),
  };
}

export interface Touchpoint {
  slug: string;
  title: string;
  canonical: string;
  /** Innerer HTML-Inhalt des <main>. */
  main: string;
}

const TOUCHPOINTS_DIR = path.join(CONTENT_DIR, "touchpoints");

export function getTouchpointSlugs(): string[] {
  return readdirSync(TOUCHPOINTS_DIR)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""))
    .sort();
}

export function getTouchpoint(slug: string): Touchpoint {
  const html = read(path.join(TOUCHPOINTS_DIR, `${slug}.html`));
  const rawTitle = between(html, /<title[^>]*>/i, "</title>").trim();
  const canonicalMatch = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  return {
    slug,
    // "… — Archiv · infinite sphere" -> nur der Titelteil, Suffix setzt das Layout.
    title: rawTitle.replace(/\s*—\s*Archiv\s*·\s*infinite sphere\s*$/i, "").trim(),
    canonical: canonicalMatch ? canonicalMatch[1] : `https://infinite-sphere.de/${slug}/`,
    main: absolutizeAssets(between(html, /<main[^>]*>/i, "</main>").trim()),
  };
}

#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Baut public/ komplett aus assets-src/ neu auf:
 *   - PNGs verlustarm rekomprimieren, grosse Grafiken herunterskalieren,
 *     zusaetzlich als WebP ausgeben
 *   - Schriften (woff2) 1:1 kopieren
 *   - touchpoint.css kopieren (Font-Pfade auf /assets/fonts/ absolut setzen)
 *   - Downloads (xlsx) 1:1 kopieren
 *
 * Wird von `npm run dev` und `npm run build` automatisch vorher ausgefuehrt.
 * Idempotent: kann beliebig oft laufen.
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SRC = path.join(ROOT, "assets-src");
const PUB = path.join(ROOT, "public");
const OUT_ASSETS = path.join(PUB, "assets");
const OUT_FONTS = path.join(OUT_ASSETS, "fonts");
const OUT_DOWNLOADS = path.join(PUB, "downloads");

// Grafiken, die deutlich groesser geliefert werden als sie je dargestellt werden.
// Zielbreite grosszuegig fuer hochaufloesende Displays (ca. 3x Anzeigegroesse).
const RESIZE = {
  "infinite-sphere-bildmarke.png": 560,
  "freigeist-family-horizontal.png": 1400,
};
// Diese PNGs behalten ihre Originalabmessungen (nur rekomprimieren).
const KEEP_DIMENSIONS = new Set([
  "og-image.png", // Open-Graph-Vorschau muss exakt 1200x630 bleiben
]);

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function buildImages() {
  const dir = path.join(SRC, "images");
  const files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith(".png"));
  let before = 0;
  let after = 0;

  for (const file of files) {
    const input = await readFile(path.join(dir, file));
    before += input.length;

    let pipeline = sharp(input);
    const resizeTo = RESIZE[file];
    if (resizeTo && !KEEP_DIMENSIONS.has(file)) {
      const meta = await sharp(input).metadata();
      if (meta.width && meta.width > resizeTo) {
        pipeline = pipeline.resize({ width: resizeTo, withoutEnlargement: true });
      }
    }

    const png = await pipeline
      .clone()
      .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
      .toBuffer();
    await writeFile(path.join(OUT_ASSETS, file), png);
    after += png.length;

    // Zusaetzliche WebP-Variante (von <picture> auf der Startseite genutzt).
    const webpName = file.replace(/\.png$/i, ".webp");
    const webp = await pipeline
      .clone()
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    await writeFile(path.join(OUT_ASSETS, webpName), webp);

    console.log(
      `  ${file.padEnd(34)} ${fmt(input.length).padStart(10)} -> ${fmt(png.length).padStart(10)} png  |  ${fmt(webp.length).padStart(10)} webp`
    );
  }

  console.log(`\n  PNG gesamt: ${fmt(before)} -> ${fmt(after)}`);
}

async function copyFonts() {
  await cp(path.join(SRC, "fonts"), OUT_FONTS, { recursive: true });
}

async function copyTouchpointCss() {
  const css = await readFile(path.join(SRC, "touchpoint.css"), "utf8");
  // Font-Pfade relativ ('../assets/fonts/…') -> absolut ('/assets/fonts/…'),
  // damit die Datei aus public/assets/ und aus einem Bundle gleich funktioniert.
  const fixed = css.replaceAll("../assets/fonts/", "/assets/fonts/");
  await writeFile(path.join(OUT_ASSETS, "touchpoint.css"), fixed);
}

async function copyDownloads() {
  await cp(path.join(SRC, "downloads"), OUT_DOWNLOADS, { recursive: true });
}

async function main() {
  console.log("==> Assets neu bauen (assets-src/ -> public/)");
  await rm(PUB, { recursive: true, force: true });
  await mkdir(OUT_FONTS, { recursive: true });
  await mkdir(OUT_DOWNLOADS, { recursive: true });

  await buildImages();
  await copyFonts();
  await copyTouchpointCss();
  await copyDownloads();

  console.log("\n==> Fertig.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

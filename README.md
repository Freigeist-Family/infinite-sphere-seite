# Infinite Sphere — Website

Statische Next.js-Seite für **infinite-sphere.de**. Build per `output: "export"`
→ `out/` enthält reines HTML/CSS/Assets, das flach auf jeden Webserver gelegt
werden kann. Kein Node auf dem Server, kein JavaScript-Framework zur Laufzeit
nötig, keine Datenbank.

## Struktur

```
app/                     Next.js App Router
  layout.tsx             <html>, Favicons, Titel-Template
  page.tsx               Startseite  ->  /
  impressum/page.tsx     ->  /impressum/
  datenschutz/page.tsx   ->  /datenschutz/
  [slug]/page.tsx        Touchpoints  ->  /<slug>/   (aus content/touchpoints/)
  not-found.tsx          ->  404.html
components/StaticHtml.tsx  rendert die Design-Seiten 1:1 aus dem HTML
lib/content.ts            liest content/ zur Build-Zeit

content/
  pages/                 Startseite / Impressum / Datenschutz als HTML
  touchpoints/           je eine <slug>.html  ->  eine URL

assets-src/              Quell-Assets (Bilder, Schriften, CSS, Downloads)
scripts/
  optimize-images.mjs    baut public/ aus assets-src/ (Bilder optimieren)
  deploy.sh              Build + Push in den Orphan-Branch "deploy"
  DEPLOY.md              Anleitung fürs Aufspielen auf den Server

Template/                ORIGINAL-Handoff (unverändert, nur Referenz)
```

`public/`, `out/`, `.next/`, `node_modules/` sind generiert und in `.gitignore`.
`public/` wird bei jedem `npm run dev` / `npm run build` neu aus `assets-src/`
gebaut.

## Befehle

| Befehl            | Wirkung                                                        |
|-------------------|---------------------------------------------------------------|
| `npm run dev`     | Assets bauen + Dev-Server (http://localhost:3000)            |
| `npm run build`   | Assets bauen + statischer Export nach `out/`                 |
| `npm run preview` | `out/` lokal ausliefern                                      |
| `npm run deploy`  | Build + Push in den Branch `deploy` (siehe `scripts/DEPLOY.md`) |
| `npm run assets`  | nur Bilder/Schriften/Downloads nach `public/` bauen          |

## Touchpoint-URLs sind fix

Die Touchpoint-Adressen stehen als QR-Code im Buch. Der Dateiname unter
`content/touchpoints/` ist die URL:

```
content/touchpoints/touchpoint-liquiditaetsplan.html
        ->  https://infinite-sphere.de/touchpoint-liquiditaetsplan/
```

`trailingSlash: true` sorgt für den Schrägstrich. **Dateien dort nicht
umbenennen.** Neue Seite = neue HTML-Datei in gleicher Struktur, sonst nichts.

## Bilder

`scripts/optimize-images.mjs` rekomprimiert alle PNGs verlustarm, skaliert die
großen Grafiken herunter und legt zusätzlich WebP-Varianten an
(Startseite nutzt `<picture>`). Die Open-Graph-Grafik bleibt exakt 1200×630.
Aktuell: ~2,3 MB → ~205 KB.

## Datenschutz-Hinweis

`content/pages/datenschutz.html` ist auf „Stand: August 2026" datiert und nennt
Hetzner als Hoster. Bei Änderungen / anderem Hoster dort anpassen.

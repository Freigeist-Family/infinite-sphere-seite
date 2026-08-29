# Deployment — infinite-sphere.de

Statische Next.js-Seite (`output: "export"`). Der Build erzeugt `out/` mit
reinem HTML/CSS/Assets – **kein** Node auf dem Server, keine Datenbank, kein
Server-Code.

Ausgeliefert wird über einen **Orphan-Branch `deploy`**, dessen
Wurzelverzeichnis direkt das Web-Root ist (`index.html`, `assets/`,
`downloads/`, `touchpoint-…/` …). Quellcode landet nie auf dem Server.

`scripts/deploy.sh` baut und schiebt `out/` flach in diesen Branch. Dasselbe
Script wird unverändert im Schwesterprojekt genutzt – Remote und Branch sind
über `REMOTE=` / `BRANCH=` einstellbar.

---

## Wichtig: die Touchpoint-URLs sind fix

Die Adressen der Touchpoint-Seiten stehen als QR-Codes gedruckt im Buch und
**dürfen sich nie ändern**:

```
https://infinite-sphere.de/<ordnername>/
```

Jeder Ordner unter `content/touchpoints/` wird 1:1 zu einem solchen Pfad
(`touchpoint-liquiditaetsplan.html` → `/touchpoint-liquiditaetsplan/`).
`trailingSlash: true` in `next.config.mjs` sorgt für den abschließenden
Schrägstrich. **Dateien in `content/touchpoints/` nicht umbenennen.**

Neue Touchpoint-Seite: HTML-Datei nach `content/touchpoints/<slug>.html`
legen (gleiche Struktur wie die bestehenden: `<title>`, `<link rel=canonical>`,
`<main>…</main>`), fertig – die Route entsteht beim nächsten Build automatisch.

---

## Einmalig einrichten

### 1. Git-Repo anlegen

```bash
cd /Users/timofullmann/Documents/GitHub/infinite-sphere-seite
git init
git add .
git commit -m "Statische Next.js-Seite infinite-sphere.de"
```

### 2. Remote hinterlegen

```bash
git remote add origin git@github.com:<user>/infinite-sphere-seite.git
git push -u origin main
```

`node_modules/`, `.next/`, `out/` und `public/` sind in `.gitignore` –
`public/` wird bei jedem Build aus `assets-src/` neu erzeugt.

---

## Deployen

```bash
npm run deploy
```

Das Script:

1. bricht ab, wenn nicht alles committet ist
2. `npm ci` + `npm run build`
   → `scripts/optimize-images.mjs` (Bilder optimieren) + `next build`
   → erzeugt `out/`
3. checkt Branch `deploy` in ein temporäres Worktree aus
   (legt ihn beim ersten Mal als leeren Orphan-Branch an)
4. ersetzt dessen Inhalt komplett durch `out/`
5. committet und pusht nach `origin deploy`

Andere Ziele:

```bash
REMOTE=hetzner BRANCH=live npm run deploy
```

---

## Auf dem Server

### Erstmaliges Klonen (nur der Deploy-Branch, ohne History)

```bash
cd /var/www/infinite-sphere            # Web-Root
git clone --branch deploy --single-branch --depth 1 \
  git@github.com:<user>/infinite-sphere-seite.git .
```

Danach liegt `index.html` direkt in `/var/www/infinite-sphere/`.

### Aktualisieren

```bash
cd /var/www/infinite-sphere
git fetch --depth 1 origin deploy
git reset --hard origin/deploy
```

(`reset --hard` statt `pull`, weil der Branch teils neu geschrieben wird.)

### nginx

```nginx
server {
    listen 443 ssl;
    server_name infinite-sphere.de www.infinite-sphere.de;
    root /var/www/infinite-sphere;
    index index.html;

    # next export mit trailingSlash: /impressum -> /impressum/index.html
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    error_page 404 /404.html;

    # optionale Langzeit-Caches fuer versionierte Assets
    location /_next/static/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location /assets/       { expires 30d; add_header Cache-Control "public"; }
}
```

Optional: `www` → nicht-`www` (oder umgekehrt) per 301 vereinheitlichen,
damit die kanonische Domain eindeutig ist.

### Apache (falls kein nginx)

`.htaccess` im Web-Root:

```apache
Options -MultiViews
ErrorDocument 404 /404.html
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+?)/?$ $1.html [L]
```

---

## Lokal prüfen

```bash
npm run build
npm run preview        # serviert out/ unter http://localhost:3000
```

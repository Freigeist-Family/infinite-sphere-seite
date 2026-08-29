# Einbau: Touchpoint-Archiv auf infinite-sphere.de

## Was in diesem Ordner liegt

```
touchpoint-abgrund-voraus/index.html
touchpoint-ertragsvorausschau-quick-win/index.html
touchpoint-liquiditaetsplan/index.html
touchpoint-massnahmen-tracker/index.html
touchpoint-monats-controlling-tool/index.html
touchpoint-sanierungskonzept/index.html
touchpoint-zielsetzungs-workbook/index.html
touchpoint-video-ablenkungen-eliminieren/index.html
touchpoint-video-disziplin-freiheit/index.html
touchpoint-video-verantwortung-uebernehmen/index.html
assets/touchpoint.css
assets/fonts/  (3 × Cormorant Garamond woff2)
downloads/     (5 × .xlsx, unverändert)
```

## Einbau

Den **Inhalt** dieses Ordners in das Web-Root der Website kopieren — nicht den Ordner `site` selbst.
Danach liegen die Seiten unter genau den gedruckten Adressen:

```
https://infinite-sphere.de/touchpoint-abgrund-voraus/
```

usw. Jede Seite ist ein eigener Ordner mit `index.html`, deshalb funktioniert der Slug mit
abschließendem Schrägstrich auf jedem Server, ohne Rewrite-Regeln.

Wenn im Web-Root schon ein `assets/`-Ordner der neuen Website liegt: nur die beiden Dateien/Ordner
`assets/touchpoint.css` und `assets/fonts/` hineinlegen, nichts überschreiben.

- **Netlify / Vercel:** Dateien ins Publish-Verzeichnis (`dist`, `public`, oder das Repo-Root) legen und deployen.
- **Eigener Server:** per FTP/SFTP in das Verzeichnis der Website hochladen.

## Was bewusst nicht drin ist

Keine Übersichtsseite, keine Navigationseinträge, keine Sitemap-Einträge. Die Seiten tragen
`noindex, follow` — sie bleiben über den gedruckten Link erreichbar, tauchen aber nicht in Google auf.
Wenn sie doch indexiert werden sollen, in allen zehn Dateien die Zeile
`<meta name="robots" content="noindex, follow">` entfernen.

## Vor dem Hochladen prüfen

1. **Impressum / Datenschutz** — die Fußzeile verlinkt `/impressum/` und `/datenschutz/`. Falls die
   neue Website andere Pfade nutzt, in allen zehn `index.html` ersetzen.
2. **Liquiditätsplan** — es waren zwei Uploads vorhanden; hier liegt `Liquiditaetsplan_1.xlsx`
   unter dem Namen `Liquiditaetsplan.xlsx`. Bei Bedarf durch die andere Version ersetzen,
   Dateiname unverändert lassen.
3. **Bestehende Seiten** — falls unter diesen Slugs noch die alten Seiten liegen, werden sie ersetzt.
   Vorher sichern.

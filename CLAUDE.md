# Laser-Kalkulation – Projektvorgaben

Lokale/Web-App zur Preiskalkulation von Laser-/Abkantteilen aus TruTops-Plänen (PDF),
STEP- und DXF-Dateien sowie Biegeprogrammen (JUPIDU/HTML). Dateien: `index.html`,
`app.js`, `parser.js`, `lib/` (pdf.js, three.js, occt-import-js, dxf-parser, jszip),
`manifest.webmanifest`, `icon-192/512.png`, `hero.jpg`.

## Schachtelung / Tafel-Optimierung (dauerhafte Vorgaben)

- **Blechtafel:** 3000 × 1500 mm. **Teileabstand = Blechstärke** (min. 1 mm), je Werkstoff+Dicke gruppiert.
- **Packer-Strategie: First-Fit über ALLE Tafeln.** Jedes Teil füllt zuerst die **Lücken bestehender
  Tafeln**, bevor eine neue Tafel aufgemacht wird. Umsetzung: Skyline-Packer (bottom-left) je Tafel +
  Schleife über alle offenen Tafeln (`packSheets` in `app.js`). Große Teile zuerst, kleine füllen die
  Zwischenräume → Tafeln werden voll gemacht.
- **Loch-Schachtelung:** Passt ein kleineres Teil (inkl. Abstand) in das größte Loch eines größeren
  Teils derselben Gruppe, wird es dort eingeschachtelt (ein Teil pro Loch) statt eigene Fläche zu belegen.
- **Auslastung korrekt (kein >100 % mehr):** Die frühere 108-%-Anzeige war ein Doppelzähl-Fehler
  (genestete Teile). Jetzt: in Löchern geschachtelte Teile **nicht** zur belegten Fläche addieren,
  Ausnutzung auf **100 % gedeckelt**. ~85 % ist nahe dem Maximum bei Rechteck-Packung runder/eckiger Teile.
- **Resttafel-Schalter:** „Resttafel verrechnen" an/aus. Aus = letzte Tafel per Trennschnitt geteilt,
  Rest nicht berechnet (Schnitt in die Richtung mit größerem Rest). Beeinflusst die Materialkosten.
- **Tafel-Detailansicht:** Klick auf eine Tafel öffnet sie groß (`buildSheetSvg`/`openSheetModal`).

## Mengen-/Eingabelogik (große + kleine Teile)

- Jede Position hat eine **Menge**; die Schachtelung expandiert auf Einzel-Instanzen je Menge.
- Gruppierung nach **Werkstoff + Dicke** – nur so geschachtelt; PDF-Planteile bleiben gewichtsbasiert
  (Plan ist bereits geschachtelt).
- **Materialkosten = real benötigte Tafeln × Tafelgewicht × €/kg**, auf die Teile nach Gewicht verteilt
  (inkl. Verschnitt). Große + kleine Teile derselben Gruppe teilen sich also die Tafeln/Kosten.
- Datenquellen je Teil: **TruTops-Plan** → exakte Laserzeit; **STEP** → Kontur/Gewicht/Schneidlänge/
  Dicke (Dicke = Abstand Ober-/Unterseite der Hauptfläche, auch bei Biegeteilen); **Biegeprogramm
  (JUPIDU/HTML)** → exakte Biegungen/Material/Dicke, Zuordnung über die Teile-Nr.

## Deploy-Workflow

- Hosting: **GitHub Pages**, Repo `alzingermaschinenbau/laser-kalkulation`, Branch `main`, Root.
  Live-URL: **https://alzingermaschinenbau.github.io/laser-kalkulation/**
- Veröffentlichen: Änderungen committen und `git push origin main`. GitHub Pages baut automatisch
  (~1–2 min). Danach prüfen, dass die Datei live ist, und im Browser `Strg`+`F5`.
  Alternativ Doppelklick auf `Start_Laser-Kalkulation.bat` (committet + pusht automatisch).
- **Nicht veröffentlichen** (per `.gitignore`): echte Pläne/CAD (`*.pdf`, `*.stp`, `*.step`),
  Biegeprogramme, interne Screenshots, `.claude/`. Nur App-Code + Bibliotheken + Icons werden gepusht.
- Lokales Testen: Preview über `python -m http.server` (`.claude/launch.json`).

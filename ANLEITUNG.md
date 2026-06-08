# Alzinger · Laser- & Abkant-Kalkulation

Browser-Tool zur Angebotskalkulation von Laser-/Abkantteilen aus
TruTops-Boost-Plänen – im Design des Lepton-5100-Konfigurators
(rotes Alzinger-Header, Hero, nummerierte Sektionen, dunkle Fußleiste).

## Starten
- **Lokal:** Doppelklick auf `Start_Laser-Kalkulation.bat` (oder `index.html`).
- **Online (empfohlen):** auf GitHub Pages stellen – siehe unten. Dort läuft
  das PDF-Lesen am zuverlässigsten (echter Worker, kein `file://`-Thema).

## Ablauf
1. **01 · Dokumentdaten** – Angebotsnummer, Datum, Ort, Verkäufer.
2. **02 · Kunde** – Rechnungsanschrift & Ansprechpartner.
3. **03 · Positionen** – Dateien ablegen/wählen (mehrere möglich):
   - **TruTops-Plan (PDF)** → alle Teile werden automatisch ausgelesen.
   - **CAD-Teil (STEP/STP)** → 3D-Körper, Gewicht aus dem Volumen.
   - **CAD-Teil (DXF)** → Flachteil, Gewicht/Schneidlänge/Laserzeit aus der
     Kontur berechnet.
   Pro Zeile **Material, Dicke, Menge, Biegungen** anpassen. Bei CAD-Teilen
   **👁 Ansehen** öffnet den Viewer: **STEP zum Drehen/Zoomen in 3D**, DXF als
   2D-Kontur (drehbar). Dort lassen sich Laserzeit & Biegungen je Teil setzen.
   Bei PDF-Plänen wird darunter der Original-Plan zum Durchblättern gezeigt.
4. **04 · Kalkulation** – Stundensätze, Marge, Rüstkosten, Materialpreise.
5. Unten **Angebot ansehen** → druckfertiges Angebot mit Briefkopf, dunkler
   Auftragsumfang-Box, Positionen und AGB → **Drucken / PDF**. Oder **CSV**.

## Preismodell
```
Materialkosten = Gewicht × €/kg(Material)
Laserkosten    = Laserzeit(min) × Laser-€/h ÷ 60
Abkantkosten   = Biegungen × (Sek/Biegung ÷ 3600) × Abkant-€/h
Rüstanteil     = Rüst-€/Position ÷ Menge
Selbstkosten   = Material + Laser + Abkant + Rüst
VK je Stück    = Selbstkosten ÷ (1 − Marge%)
Position €     = max( VK × Menge , Mindestpositionswert )
```
Standard (TruTops Calculate): Laser **134,17 €/h** (TruLaser 5030) ·
Abkanten 85 €/h · Marge 30 % · Rüst 75 €/Pos · Min. 15 € · 30 s/Biegung.
Materialpreise sind Schätzwerte – bitte mit Einkaufspreisen prüfen.

## Auf GitHub Pages stellen (wie der Konfigurator)
1. Neues Repo anlegen, z. B. `laser-kalkulation`.
2. Inhalt dieses Ordners hochladen (`index.html`, `app.js`, `parser.js`,
   Ordner `lib/`).
3. Repo → Settings → Pages → Branch `main` / Root → Speichern.
4. Aufrufbar unter `https://<dein-name>.github.io/laser-kalkulation/`.

## CAD-Hinweise
- **DXF**: Gewicht = Konturfläche × Dicke × Dichte; Schneidlänge = Summe aller
  Konturen; Laserzeit grob geschätzt (Schneidlänge ÷ 2000 mm/min, im Viewer
  überschreibbar). Dichte automatisch nach Werkstoff (Stahl 7,85 · Edelstahl
  7,9 · Alu 2,7 · Kupfer 8,9 kg/dm³).
- **STEP**: Gewicht = Volumen × Dichte; Dicke = kleinste Bauteilabmessung.
  Laserzeit/Biegungen im Viewer eintragen. Sehr große Baugruppen (zig MB)
  brauchen zum Einlesen etwas – für einzelne Laser-Teile ist es sofort da.

## Dateien
`index.html` (Oberfläche) · `app.js` (Logik/Preise) · `parser.js`
(PDF-Auslesen) · `logo.png` · `lib/` (pdf.js, three.js, dxf-parser,
occt-import-js für STEP). Schriften: Manrope + IBM Plex Mono.
Beispiel `_sample.dxf` zum Ausprobieren liegt bei.

/* TruTops Boost Einrichteplan / Schachtelplan – PDF-Parser (Browser, pdf.js)
   Liefert je Einzelteil: teilenr, abm, auftrag, material, dicke, menge,
   gewicht, flaeche, schnitt, laser_min, einstech.
   Reihenfolge der pdf.js-Textitems entspricht der Vorlage (Labels -> Werte). */

function deNum(s) {
  if (s == null) return 0;
  s = String(s).trim().replace(/\./g, '').replace(',', '.');
  const v = parseFloat(s);
  return isNaN(v) ? 0 : v;
}

const BLOCK_RE = new RegExp(
  'Version:\\s*([\\s\\S]*?)\\s*' +
  'Stk:\\s*Gewicht\\s*Teil:\\s*Bearbeitungszeit\\s*Teil:\\s*' +
  'Bearbeitungszeit\\s*Teil\\s*dez\\.:\\s*Fl\\S*che:\\s*Schneidl\\S*nge:\\s*' +
  'Teilebemerkung:\\s*Einstechpunkte:\\s*([\\s\\S]*?)' +
  '(?=\\s*(?:\\d+\\s*/\\s*\\d+|Teile-Nr:|Fertigungs|Einzelteil|$))',
  'g');

async function extractPdfText(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let full = '';
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const tc = await page.getTextContent();
    full += tc.items.map(i => i.str).join('\n') + '\n';
  }
  return full;
}

function parsePlanText(full) {
  const werks = full.match(/Werkstoff:\s+([0-9A-Za-z.\-]+)/);
  const dickeM = full.match(/\d[\d.,]* x \d[\d.,]* x (\d+,\d+)\s*mm/);
  const werkstoff = werks ? werks[1] : '';
  const dicke = dickeM ? deNum(dickeM[1]) : 0;

  const parts = [];
  let m;
  BLOCK_RE.lastIndex = 0;
  while ((m = BLOCK_RE.exec(full)) !== null) {
    const left = m[1].trim();
    const right = m[2].trim();
    const toks = left.split(/\s+/).filter(Boolean);
    const teilenr = toks.length ? toks[0] : '';

    const abmM = left.match(/([\d.,]+\s*x\s*[\d.,]+)\s*mm/);
    const abm = abmM ? abmM[1] : '';
    const orM = left.match(/OR\d+/);
    const auftrag = orM ? orM[0] : '';
    const tdM = left.match(/t\s*=\s*(\d+[.,]?\d*)\s*mm/);
    const dicke_p = tdM ? deNum(tdM[1]) : dicke;

    const gM = right.match(/([\d.,]+)\s*kg/);
    const gewicht = gM ? deNum(gM[1]) : 0;
    const fM = right.match(/([\d.,]+)\s*m2/);
    const flaeche = fM ? deNum(fM[1]) : 0;
    const sM = right.match(/([\d.,]+)\s*mm/);
    const schnitt = sM ? deNum(sM[1]) : 0;
    const stM = right.match(/^\s*(\d+)/);
    const menge = stM ? parseInt(stM[1], 10) : 1;
    const tM = right.match(/\d{2}:\d{2}:\d{2}\s+(\d+[.,]\d+)/);
    const laser_min = tM ? deNum(tM[1]) : 0;
    const ints = right.match(/(?<![\d.,])\d+(?![\d.,/])/g) || [];
    const einstech = ints.length ? parseInt(ints[ints.length - 1], 10) : 0;

    parts.push({
      teilenr, abm, auftrag, material: werkstoff || '1.4301',
      dicke: dicke_p, menge, gewicht, flaeche, schnitt, laser_min,
      einstech, biegungen: 0
    });
  }
  return { parts, werkstoff, dicke };
}

async function parseEinrichteplan(arrayBuffer) {
  const full = await extractPdfText(arrayBuffer);
  return parsePlanText(full);
}

window.LaserParser = { parseEinrichteplan, parsePlanText, extractPdfText, deNum };

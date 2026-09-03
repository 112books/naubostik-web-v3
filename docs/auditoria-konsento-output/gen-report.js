const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, BorderStyle, WidthType,
        ShadingType, VerticalAlign, TabStopType, PageNumber } = require('docx');
const fs = require('fs');

// ===== paleta =====
const NAVY = '1B2A4A';
const LBLUE = '93C5FD';
const GREEN = '16A34A';
const AMBER = 'D97706';
const RED = 'DC2626';
const ORANGE = 'EA580C';
const GRAY_BG = 'F8F9FA';
const BORDER = 'E2E8F0';
const DARK = '1E293B';
const LIGHT_BG = 'EFF6FF';
const LGREEN_BG = 'F0FDF4';
const WHITE = 'FFFFFF';
const GRAY = '94A3B8';

const SITE = 'konsento.naubostik.com';
const DATE = '3 de setembre de 2026';

const shade = (hex) => ({ type: ShadingType.CLEAR, fill: hex });
const margins = (t = 60, r = 100, b = 60, l = 100) => ({ top: t, right: r, bottom: b, left: l });
const bordersT = { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER }, bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER }, left: { style: BorderStyle.SINGLE, size: 4, color: BORDER }, right: { style: BorderStyle.SINGLE, size: 4, color: BORDER } };

// celda amb propietats
function C(t, o = {}) { return { t, a: o.a, b: o.b, c: o.c, bg: o.bg, h: o.h }; }

function makeTable(rowsArr, widths) {
  const rows = rowsArr.map((cells, ri) => {
    const isHeader = ri === 0;
    return new TableRow({
      children: cells.map((cell, ci) => new TableCell({
        width: { size: widths[ci], type: WidthType.DXA },
        shading: cell.bg ? shade(cell.bg) : (isHeader ? shade(NAVY) : (ri % 2 ? shade(GRAY_BG) : undefined)),
        margins: margins(),
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: cell.a || (isHeader ? AlignmentType.LEFT : AlignmentType.LEFT),
          children: [new TextRun({ text: cell.t, size: 20, bold: cell.b !== undefined ? cell.b : isHeader, color: isHeader ? WHITE : (cell.c || DARK), font: 'Arial' })],
        })],
      })),
    });
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: bordersT, rows });
}

function h1(t) { return new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 48, color: NAVY, font: 'Arial' })], spacing: { before: 320, after: 120 }, pageBreakBefore: true }); }
function h2(t) { return new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 36, color: NAVY, font: 'Arial' })], spacing: { before: 260, after: 80 } }); }
function body(t, o = {}) { return new Paragraph({ children: [new TextRun({ text: t, size: 22, color: DARK, font: 'Arial' })], spacing: { after: o.after ?? 120, before: o.before } }); }
function R(t, o = {}) { return { t, a: o.a, b: o.b, c: o.c, bg: o.bg, h: o.h }; }

// ===== PORTADA =====
const coverChildren = [];
coverChildren.push(new Paragraph({ spacing: { before: 1500 }, children: [new TextRun({ text: ' ', size: 46, color: NAVY })] }));
coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: SITE, bold: true, size: 72, color: WHITE, font: 'Arial' })] }));
coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [new TextRun({ text: 'Auditoria de Seguretat · SEO · IA · Accessibilitat · Rendiment', size: 34, color: LBLUE, font: 'Arial' })] }));
coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'AUDITORIA COMPLETA', bold: true, size: 22, color: WHITE, font: 'Arial' })] }));

const scoreDefs = [
  ['SEGURETAT', '7', 'On Track', AMBER],
  ['SEO', '7', 'On Track', AMBER],
  ['IA / GEO', '7', 'On Track', AMBER],
  ['ACCESSIBILITAT', '8', 'Strong', GREEN],
  ['RENDIMENT', '7', 'On Track', AMBER],
];
const scoreCells0 = scoreDefs.map(([label, score, status, color]) => new TableCell({
  shading: shade(color), margins: margins(120, 80, 120, 80), verticalAlign: VerticalAlign.CENTER,
  children: [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, bold: true, size: 18, color: WHITE, font: 'Arial' })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [new TextRun({ text: score, bold: true, size: 62, color: WHITE, font: 'Arial' })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: status, italics: true, size: 16, color: WHITE, font: 'Arial' })] }),
  ],
}));
coverChildren.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  columnWidths: [1872, 1872, 1872, 1872, 1872],
  rows: [new TableRow({ children: scoreCells0 })],
}));
coverChildren.push(new Paragraph({ spacing: { before: 1500 }, children: [new TextRun({ text: ' ', size: 46, color: NAVY })] }));
coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: DATE, size: 18, color: GRAY, font: 'Arial' })] }));
coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: 'Auditoria generada per a Nau Bostik', size: 18, color: GRAY, font: 'Arial' })] }));

// ===== COS =====
const B = [];
const headerPara = new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY } },
  children: [
    new TextRun({ text: SITE, size: 18, color: DARK, font: 'Arial' }),
    new TextRun({ text: '\t\tAuditoria Web completa', size: 18, color: DARK, font: 'Arial' }),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: 10000 }],
});
const footerPara = new Paragraph({
  border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER } },
  children: [
    new TextRun({ text: 'Nau Bostik · Auditoria administrativa', size: 16, color: GRAY, font: 'Arial' }),
    new TextRun({ text: '\t\tPàgina ', size: 16, color: GRAY, font: 'Arial' }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY, font: 'Arial' }),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: 10000 }],
});

// ---- RESUM EXECUTIU ----
B.push(h1('Resum executiu'));
B.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: bordersT,
  rows: [new TableRow({ children: [new TableCell({
    shading: shade(LIGHT_BG), margins: margins(120, 120, 120, 120),
    children: [new Paragraph({ children: [new TextRun({ text: 'Konsento (konsento.naubostik.com) és la plataforma de governança compartida de la Nau Bostik: assemblees, comissions, protocols i documentació. L\'auditoria troba una base tècnica i editorial excel·lent: capçaleres de seguretat robustes (CSP, HSTS, X-Frame-Options, nosniff, COOP), contingut factual i transparent (humans.txt, protocols, FAQ en llenguatge natural), accessibilitat estructural bona (lang, skip-link, alt, labels) i un rendiment ràpid i lleuger amb gzip. El problema més urgent és de configuració: el canonical i l\'og:url de totes les pàgines apunten a 127.0.0.1:8000 (localhost), cosa que debilita el SEO i l\'ús per motors i IA. La gran oportunitat és afegir schema estructurat (Organization, FAQPage, WebSite) i reforçar la seguretat del login (rate-limit) i de /admin/.', size: 22, color: DARK, font: 'Arial' })] })] })] })],
}));
B.push(new Paragraph({ spacing: { before: 160 }, children: [] }));

const summaryRows = [
  [R('Dimensió', { h: 1 }), R('Puntuació', { a: AlignmentType.CENTER, h: 1 }), R('Estat', { a: AlignmentType.CENTER, h: 1 }), R('Conclusió clau', { h: 1 })],
  [R('Seguretat'), R('7/10', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER }), R('On Track', { a: AlignmentType.CENTER }), R('Headers excel·lents; /admin/ exposat, TLS 1.0/1.1, sense rate-limit clar.')],
  [R('SEO'), R('7/10', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER }), R('On Track', { a: AlignmentType.CENTER }), R('Estructura i sitemap bons; canonical/og:url a localhost (crític), sense schema.')],
  [R('IA / GEO'), R('7/10', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER }), R('On Track', { a: AlignmentType.CENTER }), R('E-E-A-T i contingut factual forts; cap schema semàntic per a motors d\'IA.')],
  [R('Accessibilitat'), R('8/10', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN }), R('Strong', { a: AlignmentType.CENTER }), R('Pràctiques robustes (lang, alt, labels, skip-link); cal contrast via Lighthouse.')],
  [R('Rendiment'), R('7/10', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER }), R('On Track', { a: AlignmentType.CENTER }), R('Ràpid i lleuger amb gzip; cache-control estàtic massa baix (60s).')],
  [R('Global'), R('36/50', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: NAVY }), R('Sòlida', { a: AlignmentType.CENTER }), R('Base madura amb oportunitats clares de consolidació i schema.')],
];
B.push(makeTable(summaryRows, [1800, 1500, 1500, 4560]));

// ---- PÀGINES AUDITADES ----
B.push(h1('Pàgines auditades'));
const pages = [
  ['/', 'Portada', 'Canonical a localhost; h1 únic; headers de seguretat'],
  ['/ca/', 'Portada (ca)', 'Sense schema; contingut factual de comissions'],
  ['/en/', 'Portada (en)', 'Segon idioma present'],
  ['/ca/comissions/economia/', 'Comissió', 'Canonical a localhost; h1/h2 bons'],
  ['/ca/docs/faq/', 'FAQ', 'Preguntes en llenguatge natural; sense schema FAQPage'],
  ['/ca/docs/protocols/espais/normes-espais/', 'Protocol interior', 'h1 únic; lang ca'],
  ['/accounts/login/', 'Login', 'labels + autocomplete bons; s\'ha provat brute-force'],
  ['/admin/', 'Admin Django', 'Exposat públicament (302 a login)'],
  ['Docs legals', 'Privacitat, avís legal, cookies, accessibilitat', 'Totes responen 200'],
];
const pageRows = [
  [R('URL', { h: 1 }), R('Tipus', { h: 1 }), R('Notes', { h: 1 })],
  ...pages.map(([u, t, n]) => [R(u), R(t), R(n)]),
];
B.push(makeTable(pageRows, [3400, 1700, 4260]));

// ---- SEGURETAT ----
const st = (v) => v === 'Good' ? 'Good' : v === 'Need' ? 'Needs Attention' : v === 'Miss' ? 'Missing' : v;
const secRows = [
  [R('Signal', { h: 1 }), R('Troballa', { h: 1 }), R('Estat', { a: AlignmentType.CENTER, h: 1 })],
  [R('HSTS'), R('max-age=31536000; includeSubDomains; preload'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Content-Security-Policy'), R('default-src \'self\'; frame-ancestors \'none\'; form-action \'self\'...'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('X-Frame-Options'), R('DENY'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('X-Content-Type-Options'), R('nosniff'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Referrer-Policy'), R('strict-origin-when-cross-origin'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Cross-Origin-Opener-Policy'), R('same-origin'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Cookies (CSRF)'), R('Secure; SameSite=Lax (sense HttpOnly, esperable al csrftoken)'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('TLS'), R('TLS 1.2 i 1.3 OK, però 1.0/1.1 habilitats (descontinuats)'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('Redirect inicial'), R('302 de / a http://.../ca/ abans de pujar a https'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('/admin/'), R('Admin de Django exposat públicament a /admin/'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('Brute-force login'), R('Cap resposta 429/lockout observada davant intents repetits'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
];
B.push(h1('Anàlisi de seguretat'));
B.push(h2('Capçaleres i transport'));
B.push(makeTable(secRows, [2600, 5260, 1500]));

// ---- SEO ----
B.push(h1('Anàlisi SEO'));
B.push(h2('Troballes tècniques'));
const seoRows = [
  [R('Signal', { h: 1 }), R('Troballa', { h: 1 }), R('Estat', { a: AlignmentType.CENTER, h: 1 })],
  [R('Canonical'), R('rel=canonical apunta a https://127.0.0.1:8000/ca/ a totes les pàgines — CRÍTIC'), R('Critical', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: RED })],
  [R('og:url / meta'), R('og:url també a 127.0.0.1:8000; og:title i og:description correctes'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('Sitemap'), R('Complet i correcte a konsento.naubostik.com, bilingüe ca/en'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('robots.txt'), R('Ben configurat: disallow d\'àrees privades, sitemap assenyalat'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Títols i meta description'), R('Únics i descriptius a cada pàgina'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Estructura de URLs'), R('Neta i llegible (ex. /ca/comissions/economia/)'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Schema estructurat'), R('Cap JSON-LD/microdata (Organization, WebSite, FAQ...)'), R('Missing', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: RED })],
];
B.push(makeTable(seoRows, [2600, 5260, 1500]));

// ---- IA/GEO ----
B.push(h1('Anàlisi IA / GEO'));
B.push(h2('Preparació per a cercadors generatius'));
const geoRows = [
  [R('Signal', { h: 1 }), R('Troballa', { h: 1 }), R('Estat', { a: AlignmentType.CENTER, h: 1 })],
  [R('E-E-A-T'), R('humans.txt detallat, contacte, adreça, autoria clara'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Transparència'), R('privacitat, avís legal, cookies, accessibilitat, estatuts — tot present'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Contingut factual'), R('protocols, assemblees, participació en números, FAQ — dens i citable'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Consistència d\'entitat'), R('nom canònic "Nau Bostik" i enllaços externs coherents'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Crawlability'), R('robots.txt clar, HSTS, gzip; JS mínim (HTML render-it al servidor)'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Schema per a IA'), R('cap Organization/FAQPage/WebSite — els motors d\'IA no tenen entitat semàntica clara'), R('Missing', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: RED })],
];
B.push(makeTable(geoRows, [2600, 5260, 1500]));

// ---- ACCESSIBILITAT ----
B.push(h1('Anàlisi d\'accessibilitat'));
B.push(h2('Estructura i formes'));
const accRows = [
  [R('Signal', { h: 1 }), R('Troballa', { h: 1 }), R('Estat', { a: AlignmentType.CENTER, h: 1 })],
  [R('lang'), R('lang="ca" a totes les pàgines revisades'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Landmarks / skip'), R('skip-link a #main-content, <main id="main-content">'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Alt text'), R('totes les imatges amb alt descriptiu; decoratives amb alt=""'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Forms / labels'), R('login amb <label for> + autocomplete + required correctes'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Dimensions d\'imatge'), R('width/height presents (evita CLS); loading=lazy/decoding=async'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('autofocus al login'), R('autofocus pot desorientar usuaris de lectors de pantalla (lleu)'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('Contrast / CWV'), R('requereix verificació amb eina de navegador (Lighthouse/WAVE)'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
];
B.push(makeTable(accRows, [2600, 5260, 1500]));

// ---- RENDIMENT ----
B.push(h1('Anàlisi de rendiment'));
B.push(h2('Càrrega i caching'));
const perfRows = [
  [R('Signal', { h: 1 }), R('Troballa', { h: 1 }), R('Estat', { a: AlignmentType.CENTER, h: 1 })],
  [R('Temps de resposta'), R('estàtics ~70ms; HTML servit ràpid'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Compressió'), R('gzip habilitat per HTML i estàtics'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Pes de pàgina'), R('home ~98KB d\'estàtics; SVG optimitzats; logo 44KB a revisar'), R('Good', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: GREEN })],
  [R('Cache-Control estàtics'), R('max-age=60 (60s) — massa baix per actius immutables'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('Cache del HTML'), R('Vary: Cookie impedeix caching CDN a la home'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
  [R('Core Web Vitals reals'), R('cal mesurar amb PageSpeed Insights / Lighthouse'), R('Needs Attention', { a: AlignmentType.CENTER, b: true, c: WHITE, bg: AMBER })],
];
B.push(makeTable(perfRows, [2600, 5260, 1500]));

// ---- MATRIU DE PRIORITATS ----
B.push(h1('Matriu de prioritats'));
const prioC = (t) => t.includes('Crític') ? RED : t.includes('Alt') ? ORANGE : t.includes('Mitjà') ? AMBER : GREEN;
const prio = [
  ['🔴 Crític', 'Corregir canonical/og:url que apunten a 127.0.0.1:8000', 'SEO / GEO', 'Baix', 'Molt alt'],
  ['🔴 Crític', 'Restringir / desactivar /admin/ públic (Django)', 'Seguretat', 'Mitjà', 'Alt'],
  ['🟠 Alt', 'Deshabilitar TLS 1.0/1.1 i normalitzar redirect a HTTPS', 'Seguretat', 'Baix', 'Alt'],
  ['🟠 Alt', 'Afegir schema: Organization, WebSite, FAQPage', 'SEO / IA', 'Mitjà', 'Alt'],
  ['🟡 Mitjà', 'Implementar rate-limit / lockout al login (django-axes)', 'Seguretat', 'Mitjà', 'Alt'],
  ['🟡 Mitjà', 'Pujar cache-control d\'estàtics immutables (60s → 1y)', 'Rendiment', 'Baix', 'Mitjà'],
  ['🟢 Quick Win', 'Mesurar Core Web Vitals amb PageSpeed Insights', 'Rendiment', 'Baix', 'Mitjà'],
  ['🟢 Quick Win', 'Revisar contrast i autofocus amb Lighthouse / WAVE', 'Accessibilitat', 'Baix', 'Mitjà'],
];
const prioRows = [
  [R('Prioritat', { h: 1 }), R('Problema', { h: 1 }), R('Dimensió', { h: 1 }), R('Esforç', { h: 1 }), R('Impacte', { h: 1 })],
  ...prio.map(([pr, is, dim, ef, im]) => [
    R(pr, { b: true, c: WHITE, bg: prioC(pr) }), R(is), R(dim), R(ef), R(im),
  ]),
];
B.push(makeTable(prioRows, [1500, 4000, 1500, 1180, 1180]));

// ---- QUÈ FUNCIONA BÉ ----
B.push(h1('Què funciona bé'));
const good = [
  'Headers de seguretat de primer nivell (CSP, HSTS, XFO, nosniff, COOP).',
  'Accessibilitat estructural exemplar: lang, skip-link, alt, labels, dimensions d\'imatge.',
  'Contingut factual i transparent (humans.txt, protocols, FAQ en llenguatge natural) — gran per a GEO i AEO.',
  'URLs netes, sitemap complet i bilingüe, robots.txt ben delimitat.',
  'Rendiment lleuger amb gzip i SVGs optimitzats.',
];
B.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: bordersT,
  rows: good.map((t) => new TableRow({ children: [new TableCell({
    shading: shade(LGREEN_BG), margins: margins(100, 100, 100, 100),
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 20, color: DARK, font: 'Arial' })] })],
  })] })),
}));

// ---- GLOSSARI ----
B.push(h1('Glossari'));
B.push(body('SEO: optimització per a cercadors tradicionals (Google). Aquest informe cobreix títols, meta, heading, canonical, sitemap i schema.'));
B.push(body('GEO / IA: optimització per a cercadors generatius (Perplexity, AI Overviews, ChatGPT Search, Gemini). Recompensa claredat, autoritat i riquesa factual.'));
B.push(body('AEO: optimització per a snippets destacats i resposta directa (preguntes com "Què és...?", "Com puc...?").'));

const sections = [
  {
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
    children: coverChildren,
  },
  {
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1400, right: 1440, bottom: 1400, left: 1440 } } },
    headers: { default: new Header({ children: [headerPara] }) },
    footers: { default: new Footer({ children: [footerPara] }) },
    children: B,
  },
];

const doc = new Document({
  creator: 'Nau Bostik',
  title: `Auditoria completa — ${SITE}`,
  description: 'Auditoria de seguretat, SEO, IA, accessibilitat i rendiment',
  sections,
});

const outdir = '/Volumes/1TbExt/Obsidian/hugo-websites/naubostik/naubostik-web-v3/docs/auditoria-konsento-output';
const fname = `${outdir}/auditoria-konsento-naubostik-2026-09-03.docx`;
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(fname, buffer);
  console.log('DOCX written:', fname, buffer.length, 'bytes');
});

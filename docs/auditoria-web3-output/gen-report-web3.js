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

const SITE = 'naubostik.com';
const DATE = '4 de setembre de 2026';

const shade = (hex) => ({ type: ShadingType.CLEAR, fill: hex });
const margins = (t = 60, r = 100, b = 60, l = 100) => ({ top: t, right: r, bottom: b, left: l });
const bordersT = { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER }, bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER }, left: { style: BorderStyle.SINGLE, size: 4, color: BORDER }, right: { style: BorderStyle.SINGLE, size: 4, color: BORDER } };

function C(t, o = {}) { return { t, a: o.a, b: o.b, c: o.c, bg: o.bg, h: o.h }; }

function scoreColor(s) { return s >= 8 ? GREEN : s >= 5 ? AMBER : RED; }
function scoreStatus(s) { return s >= 8 ? 'Strong' : s >= 5 ? 'On Track' : 'Needs Work'; }

function makeTable(rowsArr, widths) {
  const rows = rowsArr.map((cells, ri) => {
    const isHeader = ri === 0;
    return new TableRow({
      children: cells.map((cell, ci) => {
        const c = typeof cell === 'string' ? { t: cell } : cell;
        return new TableCell({
          width: { size: widths[ci], type: WidthType.DXA },
          shading: c.bg ? shade(c.bg) : (isHeader ? shade(NAVY) : (ri % 2 ? shade(GRAY_BG) : undefined)),
          margins: margins(),
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: c.a || AlignmentType.LEFT,
            children: [new TextRun({ text: c.t, size: 20, bold: c.b !== undefined ? c.b : isHeader, color: isHeader ? WHITE : (c.c || DARK), font: 'Arial' })],
          })],
        });
      }),
    });
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: bordersT, rows });
}

function h1(t) { return new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 48, color: NAVY, font: 'Arial' })], spacing: { before: 320, after: 120 }, pageBreakBefore: true }); }
function h2(t) { return new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 36, color: NAVY, font: 'Arial' })], spacing: { before: 260, after: 80 } }); }
function h3(t) { return new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 28, color: DARK, font: 'Arial' })], spacing: { before: 200, after: 60 } }); }
function body(t, o = {}) { return new Paragraph({ children: [new TextRun({ text: t, size: 22, color: DARK, font: 'Arial' })], spacing: { after: o.after ?? 120, before: o.before } }); }

// ===== seccions de l'informe =====
const SEO_S = 8, GEO_S = 6, AEO_S = 5, PERF_S = 6, SEC_S = 8;

// Exec summary
const execChildren = [];
execChildren.push(h1('Resum executiu'));
const execBox = new TableCell({
  shading: shade(LIGHT_BG), margins: margins(120, 140, 120, 140),
  children: [
    new Paragraph({ children: [new TextRun({ text: 'Nau Bostik — Web 3.0 (Hugo estàtic, tema propi).', bold: true, size: 22, color: NAVY, font: 'Arial' })], spacing: { after: 80 } }),
    new Paragraph({ children: [new TextRun({ text: 'El web té una base tècnica i de seguretat sòlida: canonical, Open Graph, JSON-LD (Organization + Event), sitemap, robots.txt per producció controlat per entorn, i headers de seguretat definits a netlify.toml. El punt més fort és l\'estructura E-E-A-T (equip nominat amb fotos, pàgina "Qui som" completa, adreça física, col·laboracions institucionals). Els principals reptes: (1) desplegament real a naubostik.com encara pendent, de manera que headers i SEO de producció no estan actius al domini públic; (2) manca d\'esquemes complementaris (BreadcrumbList, Article, FAQPage) que limiten els rich results; (3) decisió de bloquejar tots els bots d\'IA a robots.txt. L\'oportunitat clau és completar el desplegament de producció i afegir els esquemes restants.', size: 22, color: DARK, font: 'Arial' }) ] }),
  ],
});
execChildren.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: bordersT,
  rows: [new TableRow({ children: [execBox] })],
}));
execChildren.push(new Paragraph({ children: [], spacing: { after: 200 } }));

const execRows = [
  ['Dimensió', 'Puntuació', 'Estat', 'Conclusió'].map((t) => ({ t })),
  [{ t: 'Seguretat' }, { t: '8/10', b: true, a: AlignmentType.CENTER, bg: GREEN, c: WHITE }, { t: 'Strong', b: true, c: GREEN }, { t: 'Headers excel·lents a Netlify; producció no desplegada' }],
  [{ t: 'SEO' }, { t: '8/10', b: true, a: AlignmentType.CENTER, bg: GREEN, c: WHITE }, { t: 'Strong', b: true, c: GREEN }, { t: 'Canonicals, OG, JSON-LD, sitemap sòlids; falta schema complementari' }],
  [{ t: 'IA / GEO' }, { t: '6/10', b: true, a: AlignmentType.CENTER, bg: AMBER, c: WHITE }, { t: 'On Track', b: true, c: AMBER }, { t: 'E-E-A-T fort; bots d\'IA bloquejats per decisió de producte' }],
  [{ t: 'Accessibilitat' }, { t: '7/10', b: true, a: AlignmentType.CENTER, bg: AMBER, c: WHITE }, { t: 'On Track', b: true, c: AMBER }, { t: 'Alt majoritari; algun alt d\'imatge cru; cal verificar contrast/teclat' }],
  [{ t: 'Rendiment' }, { t: '6/10', b: true, a: AlignmentType.CENTER, bg: AMBER, c: WHITE }, { t: 'On Track', b: true, c: AMBER }, { t: 'Pàgines de llistat pesades (237KB) i CSS de 128KB' }],
  [{ t: 'Global', b: true }, { t: '35/50', b: true, a: AlignmentType.CENTER, bg: NAVY, c: WHITE }, { t: '', c: WHITE }, { t: '', c: WHITE }],
];
execChildren.push(makeTable(execRows, [1800, 1200, 1300, 5060]));

// ===== Pàgines auditades =====
const pagesChildren = [];
pagesChildren.push(h1('Pàgines auditades'));
pagesChildren.push(body('Anàlisi del codi font (Hugo) i del HTML generat amb build de producció (HUGO_PRODUCTION=1, baseURL https://naubostik.com/). El staging a GitHub Pages és no-indexable per disseny, per la qual cosa s\'audita la versió de producció.'));
const pagesRows = [
  ['URL / Pàgina', 'Tipus', 'Notes'],
  ['/ (home)', 'Portada', 'Hero newtro, indicador d\'estat, agenda setmana, JSON-LD Organization amb adreça i geo'],
  ['/activitats/', 'Agenda pública', 'Filtres (tipus/entitat/espai/franja), calendari, 471 fitxers; HTML pesat (237KB)'],
  ['/activitats/[id]', 'Fitxa activitat', 'JSON-LD Event amb startDate i endDate; algun alt d\'imatge cru al cos'],
  ['/activitats-residents/', 'Activitats residents', '31 fitxers, pròpies per secció'],
  ['/tallers/', 'Tallers regulars', '3 fitxers, JSON-LD Event'],
  ['/visita/', 'Visita la Nau', 'Accés, horaris, com arribar, accessibilitat; 5 H2 ben estructurats'],
  ['/qui-som/', 'Qui som / Equip', 'Valors, governança, equip nominat (E-E-A-T fort)'],
  ['/espais/', 'Espais', 'Fitxes 35, imatges amb alt descriptiu'],
  ['/collectius/', 'Col·lectius', '24 col·lectius, xarxa visible'],
  ['/noticies/[id]', 'Notícies', '23 fitxers; sense Article/NewsArticle JSON-LD'],
  ['/contacte/', 'Contacte', 'Formulari (→ Konsento) + secció FAQ en llenguatge natural; sense FAQPage schema'],
  ['/sitemap.xml', 'Sitemap', '611 URLs'],
];
pagesChildren.push(makeTable(pagesRows, [2600, 1800, 4960]));
pagesChildren.push(new Paragraph({ children: [], spacing: { after: 100 } }));
pagesChildren.push(body('Total: 623 pàgines HTML generades. 471 fitxers a activitats + 31 residents + 35 espais + 24 col·lectius + 23 notícies + pàgines estàtiques.'));

// ===== SEO =====
const seoChildren = [];
seoChildren.push(h1('Anàlisi SEO — Puntuació 8/10'));
seoChildren.push(h2('Tècnic On-Page'));
const seoTechRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Title tag' }, { t: 'Present a totes les pàgines amb format "Títol | Nau Bostik"' }, { t: 'Bé' }],
  [{ t: 'Meta description' }, { t: 'Present i truncada a 160; generada per pàgina' }, { t: 'Bé' }],
  [{ t: 'Canonical' }, { t: 'Absolut correcte a totes les pàgines (https://naubostik.com/...)' }, { t: 'Bé' }],
  [{ t: 'H1 singular' }, { t: 'H1 únic a les pàgines clau (Visita, Qui som, Espais...)' }, { t: 'Bé' }],
  [{ t: 'OG / Twitter' }, { t: 'OG complet + twitter:image; imatge per defecte 1200x630 correcta' }, { t: 'Bé' }],
  [{ t: 'robots meta' }, { t: 'Controlat per HUGO_PRODUCTION: producció indexable, staging no' }, { t: 'Bé' }],
  [{ t: 'Robots.txt' }, { t: 'Allow: / + sitemap + bloqueig 22 bots d\'IA a producció' }, { t: 'Bé' }],
  [{ t: 'Sitemap / RSS' }, { t: 'sitemap.xml (611 URLs) + index.xml presents' }, { t: 'Bé' }],
];
seoChildren.push(makeTable(seoTechRows, [1700, 6160, 1200]));

seoChildren.push(h2('Qualitat del contingut'));
const seoContentRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Profunditat' }, { t: 'Home ~820 paraules; activitats amb contingut ric; llindar 500+ global' }, { t: 'Bé' }],
  [{ t: 'Paraules clau' }, { t: 'Temes clars (agenda, espais, col·lectius); relacions semàntiques riques' }, { t: 'Bé' }],
  [{ t: 'Actualització' }, { t: 'Dates visibles a activitats i notícies' }, { t: 'Bé' }],
  [{ t: 'Llegibilitat' }, { t: 'Subcapçaleres, llistes i paràgrafs curts; contingut escanejable' }, { t: 'Bé' }],
];
seoChildren.push(makeTable(seoContentRows, [1700, 6160, 1200]));

seoChildren.push(h2('Dades estructurades'));
const seoStructRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Organization (home)' }, { t: 'Present amb address PostalAddress + geo (lat/long correctes)' }, { t: 'Bé' }],
  [{ t: 'Event (activitats)' }, { t: 'Present a activitats, activitats-residents i tallers; endDate robust' }, { t: 'Bé' }],
  [{ t: 'BreadcrumbList' }, { t: 'Absent a totes les pàgines' }, { t: 'Manca' }],
  [{ t: 'Article/NewsArticle' }, { t: 'Absent a les 23 notícies' }, { t: 'Manca' }],
  [{ t: 'FAQPage (contacte)' }, { t: 'Absent malgrat contingut FAQ clar al contacte' }, { t: 'Manca' }],
  [{ t: 'JSON-LD validació' }, { t: 'Sintaxi OK; però la description de l\'Event no es trunca a 160' }, { t: 'Caution' }],
];
seoChildren.push(makeTable(seoStructRows, [1700, 6160, 1200]));

// ===== GEO =====
const geoChildren = [];
geoChildren.push(h1('Anàlisi IA / GEO — Puntuació 6/10'));
geoChildren.push(body('GEO (Generative Engine Optimization) optimitza per a motors d\'IA com Perplexity, ChatGPT Search o Gemini, que sintetitzen respostes i citen fonts.'));
geoChildren.push(h2('E-E-A-T'));
const geoEeatRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Equip / autors' }, { t: 'Equip nominat (8 treballadors + col·laboradors) amb fotos i rols a data/equip.yaml i qui-som' }, { t: 'Bé' }],
  [{ t: 'Pàgina Qui som' }, { t: 'Explica valors i governança; nomena responsable' }, { t: 'Bé' }],
  [{ t: 'Contacte' }, { t: 'Adreça física, correu, formulari a Konsento' }, { t: 'Bé' }],
  [{ t: 'Confiança' }, { t: 'Col·laboracions institucionals (Generalitat, Diputació, Ajuntament) a activitats' }, { t: 'Bé' }],
  [{ t: 'Organization schema' }, { t: 'Brand entity declarada amb adreça i geo' }, { t: 'Bé' }],
];
geoChildren.push(makeTable(geoEeatRows, [1700, 6160, 1200]));

geoChildren.push(h2('Contingut per a síntesi IA'));
const geoSynthRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Densitat factual' }, { t: 'Dades concretes: 25 col·lectius, 10 naus, horaris, dates, aforaments' }, { t: 'Bé' }],
  [{ t: 'Punt de vista clar' }, { t: 'Value proposition clara a l\'home (newtro: fàbrica → ecosistema autogestionat)' }, { t: 'Bé' }],
  [{ t: 'Citació de fonts' }, { t: 'Limitada; pocs enllaços a fonts externes autoritzades' }, { t: 'Caution' }],
  [{ t: 'Claredat d\'entitat' }, { t: '"Nau Bostik" usat consistentment; adreça canònica estable' }, { t: 'Bé' }],
  [{ t: 'Originalitat' }, { t: 'Història industrial + autogestió = perspectiva única i diferenciadora' }, { t: 'Bé' }],
];
geoChildren.push(makeTable(geoSynthRows, [1700, 6160, 1200]));

geoChildren.push(h2('Tècnic GEO'));
const geoTechRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Schema profund' }, { t: 'Organization+Event, però falta Article/Author per reforçar E-E-A-T a IA' }, { t: 'Caution' }],
  [{ t: 'HTTPS' }, { t: 'Producció Netlify amb HTTPS; staging GH Pages HTTPS' }, { t: 'Bé' }],
  [{ t: 'Crawleabilitat' }, { t: 'HTML estàtic, sense JS-only rendering; rivers accés' }, { t: 'Bé' }],
  [{ t: 'Accés bots d\'IA' }, { t: 'DECISIÓ de producte: robots.txt bloqueja GPTBot, ClaudeBot, PerplexityBot, Google-Extended i 18 més a producció' }, { t: 'Opinió' }],
];
geoChildren.push(makeTable(geoTechRows, [1700, 6160, 1200]));
geoChildren.push(new Paragraph({ children: [], spacing: { after: 60 } }));
geoChildren.push(body('Nota: el bloqueig dels bots d\'IA (22 agents a robots.txt) és una decisió deliberada de l\'equip, no una omissió. Si es vol visibilitat als motors d\'IA, caldrà reconsiderar quins agents bloquejar. Aquesta decisió és el principal motiu de la puntuació 6/10 en GEO.'));

// ===== AEO =====
const aeoChildren = [];
aeoChildren.push(h1('Anàlisi AEO — Puntuació 5/10'));
aeoChildren.push(body('AEO (Answer Engine Optimization) optimitza per a featured snippets, caixes "People Also Ask" i cerca per veu.'));
aeoChildren.push(h2('Elegibilitat per a featured snippets'));
const aeoSnipRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Paràgraf resposta directa' }, { t: 'Contacte té "Com et podem ajudar?" i FAQ amb respostes directes' }, { t: 'Bé' }],
  [{ t: 'Definicions clares' }, { t: '"X és..." present a algunes activitats i explicacions' }, { t: 'Bé' }],
  [{ t: 'Llistes' }, { t: 'Llistats de col·lectius, espais i activitats poden generar list snippets' }, { t: 'Bé' }],
  [{ t: 'Taules' }, { t: 'Poques taules de comparació; limitat per a table snippets' }, { t: 'Caution' }],
  [{ t: 'Headings amb pregunta' }, { t: 'Alguns H2 en forma de pregunta a contacte/visita' }, { t: 'Parcial' }],
];
aeoChildren.push(makeTable(aeoSnipRows, [1700, 6160, 1200]));

aeoChildren.push(h2('Formats d\'resposta estructurats'));
const aeoFmtRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'FAQ schema' }, { t: 'Absent malgrat contingut FAQ clar (contacte)' }, { t: 'Manca' }],
  [{ t: 'HowTo schema' }, { t: 'Absent' }, { t: 'Manca' }],
  [{ t: 'Headings pregunta' }, { t: 'Parcial (FAQ contacte, adhesiós a visita)' }, { t: 'Parcial' }],
  [{ t: 'Speakable schema' }, { t: 'Absent' }, { t: 'Manca' }],
];
aeoChildren.push(makeTable(aeoFmtRows, [1700, 6160, 1200]));

aeoChildren.push(h2('Preparació per a veu'));
const aeoVoiceRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Llenguatge conversacional' }, { t: 'FAQ i textos pràctics en llenguatge natural' }, { t: 'Bé' }],
  [{ t: 'Cobertura long-tail' }, { t: 'Preguntes concretes (horaris, preu, aparcament, ubicació) a visita/contacte' }, { t: 'Parcial' }],
  [{ t: 'Senyals locals (NAP)' }, { t: 'Adreça Ferran Turné, 1-11 · 08027 Barcelona + coordenades a schema; contacte present' }, { t: 'Bé' }],
];
aeoChildren.push(makeTable(aeoVoiceRows, [1700, 6160, 1200]));

// ===== Seguretat =====
const secChildren = [];
secChildren.push(h1('Anàlisi de Seguretat — Puntuació 8/10'));
const secRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'HSTS (Netlify)' }, { t: 'Strict-Transport-Security: max-age=31536000; includeSubDomains' }, { t: 'Bé' }],
  [{ t: 'Headers a netlify.toml' }, { t: 'X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy (camera/mic/geolocation/interest-cohort bloquejats)' }, { t: 'Bé' }],
  [{ t: 'CSP /admin' }, { t: 'frame-ancestors \'none\' a /admin/*' }, { t: 'Bé' }],
  [{ t: 'Staging no-indexable' }, { t: 'Protecció per disseny (noindex + robots Disallow + meta X-Robots-Tag)' }, { t: 'Bé' }],
  [{ t: 'Desplegament producció' }, { t: 'El domini naubostik.com encara apunta al VPS (web antic); els headers no estan actius al domini públic fins que es desplegui a Netlify' }, { t: 'Pendent' }],
  [{ t: 'Dependències' }, { t: 'Zero build JS, cap dependència runtime de tercers al client (CSS/JS vanilla) — superfície mínima' }, { t: 'Bé' }],
];
secChildren.push(makeTable(secRows, [1700, 6160, 1200]));

// ===== Rendiment =====
const perfChildren = [];
perfChildren.push(h1('Anàlisi de Rendiment — Puntuació 6/10'));
const perfRows = [
  ['Senyals', 'Troballa', 'Estat'].map((t) => ({ t })),
  [{ t: 'Pes home' }, { t: '~123KB HTML (minificat)' }, { t: 'Caution' }],
  [{ t: 'Pes agenda' }, { t: '~237KB HTML (minificat); calendari + llistats' }, { t: 'Caution' }],
  [{ t: 'Pes cercar' }, { t: '~231KB HTML' }, { t: 'Caution' }],
  [{ t: 'CSS global' }, { t: '~128KB (single-file, sense code-splitting)' }, { t: 'Caution' }],
  [{ t: 'JS total' }, { t: '~37KB vanilla (main.js), sense framework' }, { t: 'Bé' }],
  [{ t: 'Minificació' }, { t: 'hugo --minify actiu a build de producció' }, { t: 'Bé' }],
  [{ t: 'Core Web Vitals' }, { t: 'No mesurables fins que el site sigui a producció; usar PageSpeed Insights llavors' }, { t: 'Pendent' }],
];
perfChildren.push(makeTable(perfRows, [1700, 6160, 1200]));
perfChildren.push(new Paragraph({ children: [], spacing: { after: 60 } }));
perfChildren.push(body('Recomanació: avaluar si les pàgines de llistat (agenda, cercar) es poden alleugerir (paginació, vist-vagament del calendari) i si el CSS de 128KB es pot dividir per pàgina.'));

// ===== Recomanacions =====
const recChildren = [];
recChildren.push(h1('Recomanacions prioritzades'));
const recRows = [
  ['Prioritat', 'Tema', 'Dimensió', 'Esforç', 'Impacte'],
  [{ t: '🔴 Crítica', bg: RED, c: WHITE, b: true }, 'Completar desplegament a Netlify (naubostik.com)', 'Totes', 'Mitjà', 'Alt'],
  [{ t: '🟠 Alta', bg: ORANGE, c: WHITE, b: true }, 'Afegir FAQPage schema al contacte', 'SEO/AEO', 'Baix', 'Mitjà'],
  [{ t: '🟠 Alta', bg: ORANGE, c: WHITE, b: true }, 'Afegir BreadcrumbList a totes les pàgines', 'SEO', 'Mitjà', 'Mitjà'],
  [{ t: '🟠 Alta', bg: ORANGE, c: WHITE, b: true }, 'Afegir Article/NewsArticle schema a les notícies', 'SEO/GEO', 'Mitjà', 'Mitjà'],
  [{ t: '🟡 Mitjana', bg: AMBER, c: WHITE, b: true }, 'Decidir política d\'accés dels bots d\'IA (reescriure robots.txt)', 'GEO', 'Baix', 'Alt'],
  [{ t: '🟡 Mitjana', bg: AMBER, c: WHITE, b: true }, 'Corregir alt d\'imatge cru a activitat (ex. expo-invisibles)', 'Accessibilitat/SEO', 'Baix', 'Baix'],
  [{ t: '🟡 Mitjana', bg: AMBER, c: WHITE, b: true }, 'Truncar description del JSON-LD Event a ~160 caràcters', 'SEO', 'Baix', 'Baix'],
  [{ t: '🟢 Quick Win', bg: GREEN, c: WHITE, b: true }, 'Optimitzar pes de pàgines de llistat (agenda 237KB, cercar 231KB) i CSS', 'Rendiment', 'Mitjà', 'Mitjà'],
].map((r) => r);
recChildren.push(makeTable(recRows.map((r, ri) => (ri === 0 ? r : r)), [1500, 4560, 900, 900, 1200]));

// ===== Què funciona bé =====
const goodChildren = [];
goodChildren.push(h1('Què funciona bé'));
const goodRows = [
  ['Fortalesa', 'Evidència'],
  ['Estructures de dades robustes', 'JSON-LD Organization amb adreça + geo; Event a totes les activitats amb endDate robust'],
  ['E-E-A-T fort', 'Equip nominat amb fotos i rols (8 treballadors + col·laboradors), pàgina Qui som completa'],
  ['Control d\'indexació per entorn', 'HUGO_PRODUCTION separa staging (no-indexable) de producció (indexable) sense errors'],
  ['Capçaleres de seguretat ben definides', 'netlify.toml amb HSTS, nosniff, XFO, Permissions-Policy i CSP per /admin'],
  ['Textos optimitzats per resposta', 'FAQ en llenguatge natural al contacte (horaris, preu, aparcament, ubicació)'],
  ['Narrativa newtro única', 'Història industrial + autogestió com a diferenciació editorial i SEO'],
].map(([a,b]) => ({a,b}));
goodChildren.push(makeTable(goodRows.map(r => [r.a, r.b]), [2800, 6560]));

// ===== Glossari =====
const glossChildren = [];
glossChildren.push(h1('Glossari'));
glossChildren.push(h3('SEO — Search Engine Optimization'));
glossChildren.push(body('Optimització per a motors de cerca tradicionals (Google, Bing): títols, descriptions, canonical, dades estructurades, estructura d\'URL, sitemap i autoritat.'));
glossChildren.push(h3('GEO — Generative Engine Optimization'));
glossChildren.push(body('Optimització per a motors de cerca d\'IA (Perplexity, ChatGPT Search, Gemini, Google AI Overviews) que sintetitzen respostes i citen fonts. Premia E-E-A-T, claredat d\'entitat i densitat factual.'));
glossChildren.push(h3('AEO — Answer Engine Optimization'));
glossChildren.push(body('Optimització per a featured snippets, caixes "People Also Ask" i cerca per veu: respostes directes, llistes, taules, schema FAQ/HowTo i preguntes al títol de les seccions.'));

// ===== capçalera / peu =====
const header = new Header({ children: [new Paragraph({
  children: [new TextRun({ text: SITE /* domain */, size: 18, color: NAVY, bold: true, font: 'Arial' })],
  tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
})] });
// Nota: el header no té dret a columna 'right' al mateix Paragraph; simplifiquem

const footer = new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Nau Bostik · Auditoria de Seguretat · SEO · IA · Accessibilitat · Rendiment — ' + DATE, size: 16, color: GRAY, font: 'Arial' })],
})] });

const doc = new Document({
  styles: { default: { document: { run: { font: 'Arial', size: 22, color: DARK } } } },
  sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children: [] }],
});

// Reiniciem: construirem amb un sol section amb tots els children + portada
const allChildren = [];
allChildren.push(new Paragraph({ spacing: { before: 1200 }, children: [new TextRun({ text: ' ', size: 46, color: NAVY })] }));
allChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nau Bostik', bold: true, size: 72, color: NAVY, font: 'Arial' })] }));
allChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Web 3.0 — Auditoria de Seguretat · SEO · IA · Accessibilitat · Rendiment', size: 30, color: LBLUE, font: 'Arial' })] }));
allChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: 'AUDITORIA COMPLETA', bold: true, size: 22, color: NAVY, font: 'Arial' })] }));
allChildren.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  columnWidths: [2160, 2160, 2160, 2160, 2160],
  borders: bordersT,
  rows: [
    new TableRow({ children: ['Seguretat', 'SEO', 'IA/GEO', 'Accessibilitat', 'Rendiment'].map((t) => new TableCell({ width: { size: 2160, type: WidthType.DXA }, shading: shade(NAVY), margins: margins(80, 80, 80, 80), children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, bold: true, size: 18, color: WHITE, font: 'Arial' })] })] })) }),
    new TableRow({ children: [SEC_S, SEO_S, GEO_S, 7, PERF_S].map((s) => new TableCell({ width: { size: 2160, type: WidthType.DXA }, shading: shade(scoreColor(s)), margins: margins(80, 80, 80, 80), children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s + '/10', bold: true, size: 40, color: WHITE, font: 'Arial' })] })] })) }),
  ],
}));
allChildren.push(new Paragraph({ spacing: { before: 1200 }, children: [new TextRun({ text: ' ', size: 46, color: NAVY })] }));
allChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: DATE, size: 18, color: GRAY, font: 'Arial' })] }));
allChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Preparat per LinuxBCN.com per a Nau Bostik', size: 16, color: GRAY, font: 'Arial' })] }));

allChildren.push(...execChildren);
allChildren.push(...pagesChildren);
allChildren.push(...seoChildren);
allChildren.push(...geoChildren);
allChildren.push(...aeoChildren);
allChildren.push(...secChildren);
allChildren.push(...perfChildren);
allChildren.push(...recChildren);
allChildren.push(...goodChildren);
allChildren.push(...glossChildren);

const docF = new Document({
  styles: { default: { document: { run: { font: 'Arial', size: 22, color: DARK } } } },
  sections: [{
    properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
    header,
    footer,
    children: allChildren,
  }],
});

Packer.toBuffer(docF).then((buffer) => {
  const out = '/Volumes/1TbExt/Obsidian/hugo-websites/naubostik/naubostik-web-v3/docs/auditoria-web3-output/auditoria-naubostik-web3-2026-09-04.docx';
  fs.writeFileSync(out, buffer);
  console.log('DOCX written:', out);
}).catch((e) => { console.error(e); process.exit(1); });

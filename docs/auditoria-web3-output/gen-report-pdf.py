#!/usr/bin/env python3
"""Genera l'informe d'auditoria del Web 3.0 de Nau Bostik en PDF via WeasyPrint."""
import html as _html
from pathlib import Path

OUT = Path("/Volumes/1TbExt/Obsidian/hugo-websites/naubostik/naubostik-web-v3/docs/auditoria-web3-output")
DATE = "4 de setembre de 2026"
SITE = "naubostik.com"

def esc(t):
    return _html.escape(str(t))

NAVY = "#1B2A4A"; ACCENT = "#2563EB"; GREEN = "#16A34A"; AMBER = "#D97706"
RED = "#DC2626"; ORANGE = "#EA580C"; GRAY_BG = "#F8F9FA"; BORDER = "#E2E8F0"
DARK = "#1E293B"; LIGHT_BG = "#EFF6FF"; LGREEN_BG = "#F0FDF4"; WHITE = "#fff"
LBLUE = "#93C5FD"; GRAY = "#94A3B8"

def score_color(s):
    return GREEN if s >= 8 else (AMBER if s >= 5 else RED)

def status_word(s):
    return "Strong" if s >= 8 else ("On Track" if s >= 5 else "Needs Work")

# Puntuacions
SEC, SEO, GEO, ACC, PERF = 8, 8, 6, 7, 6

CSS = f"""
@page {{
  size: Letter; margin: 1in;
  @top-left {{ content: "{SITE}"; color: {DARK}; font: 9pt Arial; border-bottom: 2px solid {NAVY}; padding-bottom: 4px; }}
  @top-right {{ content: "Auditoria Web 3.0 completa"; color: {DARK}; font: 9pt Arial; border-bottom: 2px solid {NAVY}; padding-bottom: 4px; }}
  @bottom-left {{ content: "Nau Bostik · Auditoria web"; color: {GRAY}; font: 8pt Arial; border-top: 1px solid {BORDER}; padding-top: 4px; }}
  @bottom-right {{ content: "Pàgina " counter(page); color: {GRAY}; font: 8pt Arial; border-top: 1px solid {BORDER}; padding-top: 4px; }}
}}
@page cover {{ margin: 0; @top-left {{ content: none; }} @top-right {{ content: none; }} @bottom-left {{ content: none; }} @bottom-right {{ content: none; }} }}
* {{ box-sizing: border-box; }}
body {{ font-family: Arial, sans-serif; color: {DARK}; font-size: 10.5pt; line-height: 1.5; margin: 0; }}
.cover {{ page: cover; width: 100%; height: 100vh; background: {NAVY}; color: {WHITE}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 1in; }}
.cover .site {{ font-size: 34pt; font-weight: 700; color: {WHITE}; }}
.cover .sub {{ font-size: 13pt; color: {LBLUE}; margin-top: 12px; }}
.cover .type {{ font-size: 10pt; margin-top: 24px; letter-spacing: 1px; }}
.cover .scores {{ display: flex; gap: 10px; margin-top: 40px; width: 100%; justify-content: center; }}
.cover .score {{ flex: 1; padding: 18px 8px; border-radius: 4px; color: {WHITE}; }}
.cover .score .lbl {{ font-size: 8pt; font-weight: 700; }}
.cover .score .num {{ font-size: 26pt; font-weight: 700; margin: 4px 0; }}
.cover .score .st {{ font-size: 8pt; font-style: italic; }}
.cover .foot {{ margin-top: 60px; color: {GRAY}; font-size: 8pt; line-height: 1.8; }}
h1 {{ color: {NAVY}; font-size: 17pt; border-bottom: 2px solid {NAVY}; padding-bottom: 4px; margin-top: 28px; }}
h2 {{ color: {NAVY}; font-size: 13pt; margin-top: 20px; }}
h3 {{ color: {DARK}; font-size: 11pt; margin-top: 16px; }}
p {{ margin: 6px 0; }}
table {{ width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9.5pt; }}
th {{ background: {NAVY}; color: {WHITE}; text-align: left; padding: 6px 8px; font-weight: 700; }}
td {{ border-bottom: 1px solid {BORDER}; padding: 6px 8px; vertical-align: top; }}
tr:nth-child(even) td {{ background: {GRAY_BG}; }}
.exec {{ background: {LIGHT_BG}; padding: 14px 16px; border-left: 4px solid {ACCENT}; margin: 10px 0; }}
.good {{ background: {GREEN}; color: {WHITE}; font-weight: 700; text-align: center; white-space: nowrap; }}
.amber {{ background: {AMBER}; color: {WHITE}; font-weight: 700; text-align: center; white-space: nowrap; }}
.crit {{ background: {RED}; color: {WHITE}; font-weight: 700; text-align: center; white-space: nowrap; }}
.scorecell {{ color: {WHITE}; font-weight: 700; text-align: center; }}
.prio-crit {{ background: {RED}; color: {WHITE}; font-weight: 700; text-align: center; }}
.prio-high {{ background: {ORANGE}; color: {WHITE}; font-weight: 700; text-align: center; }}
.prio-med {{ background: {AMBER}; color: {WHITE}; font-weight: 700; text-align: center; }}
.prio-quick {{ background: {GREEN}; color: {WHITE}; font-weight: 700; text-align: center; }}
"""

# ===== helpers de taula =====
def status_cell(s):
    c = "good" if s == "Bé" else ("amber" if s in ("Caution", "Parcial") else "crit")
    return f'<td class="{c}">{esc(s)}</td>'

def signal_rows(rows):
    out = ['<table><tr><th style="width:24%">Senyals</th><th style="width:62%">Troballa</th><th style="width:14%">Estat</th></tr>']
    for sig, trob, est in rows:
        out.append(f'<tr><td><strong>{esc(sig)}</strong></td><td>{esc(trob)}</td>{status_cell(est)}</tr>')
    out.append('</table>')
    return "".join(out)

def simple_table(headers, rows, widths=None):
    cellw = widths or [f"{100//len(headers)}%" for _ in headers]
    out = ['<table>']
    out.append("<tr>" + "".join(f'<th style="width:{w}">{esc(h)}</th>' for h, w in zip(headers, cellw)) + "</tr>")
    for r in rows:
        out.append("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>")
    out.append("</table>")
    return "".join(out)

T = []

# ===== PORTADA =====
T.append('<div class="cover">')
T.append(f'<div class="site">{esc(SITE)}</div>')
T.append('<div class="sub">Web 3.0 — Auditoria de Seguretat · SEO · IA · Accessibilitat · Rendiment</div>')
T.append('<div class="type">AUDITORIA COMPLETA</div>')
T.append('<div class="scores">')
for lbl, s in [("Seguretat", SEC), ("SEO", SEO), ("IA/GEO", GEO), ("Accessibilitat", ACC), ("Rendiment", PERF)]:
    T.append(f'<div class="score" style="background:{score_color(s)}"><div class="lbl">{lbl}</div><div class="num">{s}/10</div><div class="st">{status_word(s)}</div></div>')
T.append('</div>')
T.append(f'<div class="foot">{DATE}<br>Preparat per LinuxBCN.com per a Nau Bostik</div>')
T.append('</div>')

# ===== RESUM EXECUTIU =====
T.append('<h1>Resum executiu</h1>')
T.append('<div class="exec"><strong>Nau Bostik — Web 3.0 (Hugo estàtic, tema propi).</strong><br>')
T.append('El web té una base tècnica i de seguretat sòlida: canonical, Open Graph, JSON-LD (Organization + Event), sitemap, robots.txt per producció controlat per entorn, i headers de seguretat definits a netlify.toml. El punt més fort és l\'estructura E-E-A-T (equip nominat amb fotos, pàgina "Qui som" completa, adreça física, col·laboracions institucionals). Els principals reptes: (1) desplegament real a naubostik.com encara pendent, de manera que headers i SEO de producció no estan actius al domini públic; (2) manca d\'esquemes complementaris (BreadcrumbList, Article, FAQPage) que limiten els rich results; (3) decisió de bloquejar tots els bots d\'IA a robots.txt. L\'oportunitat clau és completar el desplegament de producció i afegir els esquemes restants.</div>')
T.append(simple_table(
    ["Dimensió", "Puntuació", "Estat", "Conclusió"],
    [
        ["Seguretat", f'<span class="scorecell" style="background:{score_color(SEC)};padding:2px 8px">{SEC}/10</span>', f'<span style="color:{score_color(SEC)};font-weight:700">{status_word(SEC)}</span>', "Headers excel·lents a Netlify; producció no desplegada"],
        ["SEO", f'<span class="scorecell" style="background:{score_color(SEO)};padding:2px 8px">{SEO}/10</span>', f'<span style="color:{score_color(SEO)};font-weight:700">{status_word(SEO)}</span>', "Canonicals, OG, JSON-LD, sitemap sòlids; falta schema complementari"],
        ["IA / GEO", f'<span class="scorecell" style="background:{score_color(GEO)};padding:2px 8px">{GEO}/10</span>', f'<span style="color:{score_color(GEO)};font-weight:700">{status_word(GEO)}</span>', "E-E-A-T fort; bots d'IA bloquejats per decisió de producte"],
        ["Accessibilitat", f'<span class="scorecell" style="background:{score_color(ACC)};padding:2px 8px">{ACC}/10</span>', f'<span style="color:{score_color(ACC)};font-weight:700">{status_word(ACC)}</span>', "Alt majoritari; algun alt d'imatge cru; verificar contrast/teclat"],
        ["Rendiment", f'<span class="scorecell" style="background:{score_color(PERF)};padding:2px 8px">{PERF}/10</span>', f'<span style="color:{score_color(PERF)};font-weight:700">{status_word(PERF)}</span>', "Pàgines de llistat pesades (237KB) i CSS de 128KB"],
        ["Global", '<span class="scorecell" style="background:#1B2A4A;padding:2px 8px">35/50</span>', "", ""],
    ],
    ["16%", "18%", "16%", "50%"],
))

# ===== PÀGINES AUDITADES =====
T.append('<h1>Pàgines auditades</h1>')
T.append('<p>Anàlisi del codi font (Hugo) i del HTML generat amb build de producció (HUGO_PRODUCTION=1, baseURL https://naubostik.com/). El staging a GitHub Pages és no-indexable per disseny, per la qual cosa s\'audita la versió de producció.</p>')
T.append(simple_table(
    ["URL / Pàgina", "Tipus", "Notes"],
    [
        ["/ (home)", "Portada", "Hero newtro, indicador d'estat, agenda setmana, JSON-LD Organization amb adreça i geo"],
        ["/activitats/", "Agenda pública", "Filtres, calendari, 471 fitxers; HTML pesat (237KB)"],
        ["/activitats/[id]", "Fitxa activitat", "JSON-LD Event amb startDate i endDate; algun alt d'imatge cru al cos"],
        ["/activitats-residents/", "Activitats residents", "31 fitxers, pròpies per secció"],
        ["/tallers/", "Tallers regulars", "3 fitxers, JSON-LD Event"],
        ["/visita/", "Visita la Nau", "Accés, horaris, com arribar, accessibilitat; 5 H2 ben estructurats"],
        ["/qui-som/", "Qui som / Equip", "Valors, governança, equip nominat (E-E-A-T fort)"],
        ["/espais/", "Espais", "Fitxes 35, imatges amb alt descriptiu"],
        ["/collectius/", "Col·lectius", "24 col·lectius, xarxa visible"],
        ["/noticies/[id]", "Notícies", "23 fitxers; sense Article/NewsArticle JSON-LD"],
        ["/contacte/", "Contacte", "Formulari (→ Konsento) + secció FAQ; sense FAQPage schema"],
        ["/sitemap.xml", "Sitemap", "611 URLs"],
    ],
    ["24%", "18%", "58%"],
))
T.append('<p><strong>Total:</strong> 623 pàgines HTML generades (471 activitats + 31 residents + 35 espais + 24 col·lectius + 23 notícies + estàtiques).</p>')

# ===== SEO =====
T.append('<h1>Anàlisi SEO — Puntuació 8/10</h1>')
T.append('<h2>Tècnic On-Page</h2>')
T.append(signal_rows([
    ("Title tag", 'Present a totes les pàgines amb format "Títol | Nau Bostik"', "Bé"),
    ("Meta description", "Present i truncada a 160; generada per pàgina", "Bé"),
    ("Canonical", "Absolut correcte a totes les pàgines (https://naubostik.com/...)", "Bé"),
    ("H1 singular", "H1 únic a les pàgines clau (Visita, Qui som, Espais...)", "Bé"),
    ("OG / Twitter", "OG complet + twitter:image; imatge per defecte 1200x630 correcta", "Bé"),
    ("robots meta", "Controlat per HUGO_PRODUCTION: producció indexable, staging no", "Bé"),
    ("Robots.txt", "Allow: / + sitemap + bloqueig 22 bots d'IA a producció", "Bé"),
    ("Sitemap / RSS", "sitemap.xml (611 URLs) + index.xml presents", "Bé"),
]))
T.append('<h2>Qualitat del contingut</h2>')
T.append(signal_rows([
    ("Profunditat", "Home ~820 paraules; activitats amb contingut ric; llindar 500+ global", "Bé"),
    ("Paraules clau", "Temes clars (agenda, espais, col·lectius); relacions semàntiques riques", "Bé"),
    ("Actualització", "Dates visibles a activitats i notícies", "Bé"),
    ("Llegibilitat", "Subcapçaleres, llistes i paràgrafs curts; contingut escanejable", "Bé"),
]))
T.append('<h2>Dades estructurades</h2>')
T.append(signal_rows([
    ("Organization (home)", "Present amb address PostalAddress + geo (lat/long correctes)", "Bé"),
    ("Event (activitats)", "Present a activitats, activitats-residents i tallers; endDate robust", "Bé"),
    ("BreadcrumbList", "Absent a totes les pàgines", "Manca"),
    ("Article/NewsArticle", "Absent a les 23 notícies", "Manca"),
    ("FAQPage (contacte)", "Absent malgrat contingut FAQ clar al contacte", "Manca"),
    ("JSON-LD validació", "Sintaxi OK; però la description de l'Event no es trunca a 160", "Caution"),
]))

# ===== GEO =====
T.append('<h1>Anàlisi IA / GEO — Puntuació 6/10</h1>')
T.append('<p>GEO (Generative Engine Optimization) optimitza per a motors d\'IA com Perplexity, ChatGPT Search o Gemini, que sintetitzen respostes i citen fonts.</p>')
T.append('<h2>E-E-A-T</h2>')
T.append(signal_rows([
    ("Equip / autors", "Equip nominat (8 treballadors + col·laboradors) amb fotos i rols a data/equip.yaml i qui-som", "Bé"),
    ("Pàgina Qui som", "Explica valors i governança; nomena responsable", "Bé"),
    ("Contacte", "Adreça física, correu, formulari a Konsento", "Bé"),
    ("Confiança", "Col·laboracions institucionals (Generalitat, Diputació, Ajuntament) a activitats", "Bé"),
    ("Organization schema", "Brand entity declarada amb adreça i geo", "Bé"),
]))
T.append('<h2>Contingut per a síntesi IA</h2>')
T.append(signal_rows([
    ("Densitat factual", "Dades concretes: 25 col·lectius, 10 naus, horaris, dates, aforaments", "Bé"),
    ("Punt de vista clar", "Value proposition clara a l'home (newtro: fàbrica → ecosistema autogestionat)", "Bé"),
    ("Citació de fonts", "Limitada; pocs enllaços a fonts externes autoritzades", "Caution"),
    ("Claredat d'entitat", '"Nau Bostik" usat consistentment; adreça canònica estable', "Bé"),
    ("Originalitat", "Història industrial + autogestió = perspectiva única i diferenciadora", "Bé"),
]))
T.append('<h2>Tècnic GEO</h2>')
T.append(signal_rows([
    ("Schema profund", "Organization+Event, però falta Article/Author per reforçar E-E-A-T a IA", "Caution"),
    ("HTTPS", "Producció Netlify amb HTTPS; staging GH Pages HTTPS", "Bé"),
    ("Crawleabilitat", "HTML estàtic, sense JS-only rendering; accés fàcil", "Bé"),
    ("Accés bots d'IA", "DECISIÓ de producte: robots.txt bloqueja GPTBot, ClaudeBot, PerplexityBot, Google-Extended i 18 més a producció", "Opinió"),
]))
T.append('<p><em>Nota:</em> el bloqueig dels bots d\'IA (22 agents a robots.txt) és una decisió deliberada de l\'equip, no una omissió. Si es vol visibilitat als motors d\'IA, caldrà reconsiderar quins agents bloquejar. Aquesta decisió és el principal motiu de la puntuació 6/10 en GEO.</p>')

# ===== AEO =====
T.append('<h1>Anàlisi AEO — Puntuació 5/10</h1>')
T.append('<p>AEO (Answer Engine Optimization) optimitza per a featured snippets, caixes "People Also Ask" i cerca per veu.</p>')
T.append('<h2>Elegibilitat per a featured snippets</h2>')
T.append(signal_rows([
    ("Paràgraf resposta directa", 'Contacte té "Com et podem ajudar?" i FAQ amb respostes directes', "Bé"),
    ("Definicions clares", '"X és..." present a algunes activitats i explicacions', "Bé"),
    ("Llistes", "Llistats de col·lectius, espais i activitats poden generar list snippets", "Bé"),
    ("Taules", "Poques taules de comparació; limitat per a table snippets", "Caution"),
    ("Headings amb pregunta", "Alguns H2 en forma de pregunta a contacte/visita", "Parcial"),
]))
T.append('<h2>Formats de resposta estructurats</h2>')
T.append(signal_rows([
    ("FAQ schema", "Absent malgrat contingut FAQ clar (contacte)", "Manca"),
    ("HowTo schema", "Absent", "Manca"),
    ("Headings pregunta", "Parcial (FAQ contacte, adhesius a visita)", "Parcial"),
    ("Speakable schema", "Absent", "Manca"),
]))
T.append('<h2>Preparació per a veu</h2>')
T.append(signal_rows([
    ("Llenguatge conversacional", "FAQ i textos pràctics en llenguatge natural", "Bé"),
    ("Cobertura long-tail", "Preguntes concretes (horaris, preu, aparcament, ubicació) a visita/contacte", "Parcial"),
    ("Senyals locals (NAP)", "Adreça Ferran Turné, 1-11 · 08027 Barcelona + coordenades a schema; contacte present", "Bé"),
]))

# ===== SEGURETAT =====
T.append('<h1>Anàlisi de Seguretat — Puntuació 8/10</h1>')
T.append(signal_rows([
    ("HSTS (Netlify)", "Strict-Transport-Security: max-age=31536000; includeSubDomains", "Bé"),
    ("Headers a netlify.toml", "X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy (camera/mic/geolocation/interest-cohort bloquejats)", "Bé"),
    ("CSP /admin", "frame-ancestors 'none' a /admin/*", "Bé"),
    ("Staging no-indexable", "Protecció per disseny (noindex + robots Disallow + meta X-Robots-Tag)", "Bé"),
    ("Desplegament producció", "El domini naubostik.com encara apunta al VPS (web antic); els headers no estan actius al domini públic fins que es desplegui a Netlify", "Pendent"),
    ("Dependències", "Zero build JS, cap dependència runtime de tercers al client (CSS/JS vanilla) — superfície mínima", "Bé"),
]))

# ===== RENDIMENT =====
T.append('<h1>Anàlisi de Rendiment — Puntuació 6/10</h1>')
T.append(signal_rows([
    ("Pes home", "~123KB HTML (minificat)", "Caution"),
    ("Pes agenda", "~237KB HTML (minificat); calendari + llistats", "Caution"),
    ("Pes cercar", "~231KB HTML", "Caution"),
    ("CSS global", "~128KB (single-file, sense code-splitting)", "Caution"),
    ("JS total", "~37KB vanilla (main.js), sense framework", "Bé"),
    ("Minificació", "hugo --minify actiu a build de producció", "Bé"),
    ("Core Web Vitals", "No mesurables fins que el site sigui a producció; usar PageSpeed Insights llavors", "Pendent"),
]))
T.append('<p><strong>Recomanació:</strong> avaluar si les pàgines de llistat (agenda, cercar) es poden alleugerir (paginació, vista del calendari) i si el CSS de 128KB es pot dividir per pàgina.</p>')

# ===== RECOMANACIONS =====
T.append('<h1>Recomanacions prioritzades</h1>')
T.append(simple_table(
    ["Priority", "Tema", "Dimensió", "Esforç", "Impacte"],
    [
        ['<span class="prio-crit">🔴 Crítica</span>', "Completar desplegament a Netlify (naubostik.com)", "Totes", "Mitjà", "Alt"],
        ['<span class="prio-high">🟠 Alta</span>', "Afegir FAQPage schema al contacte", "SEO/AEO", "Baix", "Mitjà"],
        ['<span class="prio-high">🟠 Alta</span>', "Afegir BreadcrumbList a totes les pàgines", "SEO", "Mitjà", "Mitjà"],
        ['<span class="prio-high">🟠 Alta</span>', "Afegir Article/NewsArticle schema a les notícies", "SEO/GEO", "Mitjà", "Mitjà"],
        ['<span class="prio-med">🟡 Mitjana</span>', "Decidir política d'accés dels bots d'IA (reescriure robots.txt)", "GEO", "Baix", "Alt"],
        ['<span class="prio-med">🟡 Mitjana</span>', "Corregir alt d'imatge cru a activitat (ex. expo-invisibles)", "Acc/SEO", "Baix", "Baix"],
        ['<span class="prio-med">🟡 Mitjana</span>', "Truncar description del JSON-LD Event a ~160 caràcters", "SEO", "Baix", "Baix"],
        ['<span class="prio-quick">🟢 Quick Win</span>', "Optimitzar pes de pàgines de llistat (agenda 237KB, cercar 231KB) i CSS", "Rendiment", "Mitjà", "Mitjà"],
    ],
    ["12%", "48%", "12%", "10%", "18%"],
))

# ===== QUÈ FUNCIONA BÉ =====
T.append('<h1>Què funciona bé</h1>')
T.append(simple_table(
    ["Fortalesa", "Evidència"],
    [
        ["Estructures de dades robustes", "JSON-LD Organization amb adreça + geo; Event a totes les activitats amb endDate robust"],
        ["E-E-A-T fort", "Equip nominat amb fotos i rols (8 treballadors + col·laboradors), pàgina Qui som completa"],
        ["Control d'indexació per entorn", "HUGO_PRODUCTION separa staging (no-indexable) de producció (indexable) sense errors"],
        ["Capçaleres de seguretat ben definides", "netlify.toml amb HSTS, nosniff, XFO, Permissions-Policy i CSP per /admin"],
        ["Textos optimitzats per resposta", "FAQ en llenguatge natural al contacte (horaris, preu, aparcament, ubicació)"],
        ["Narrativa newtro única", "Història industrial + autogestió com a diferenciació editorial i SEO"],
    ],
    ["28%", "72%"],
))

# ===== Glossari =====
T.append('<h1>Glossari</h1>')
T.append('<h3>SEO — Search Engine Optimization</h3>')
T.append('<p>Optimització per a motors de cerca tradicionals (Google, Bing): títols, descriptions, canonical, dades estructurades, estructura d\'URL, sitemap i autoritat.</p>')
T.append('<h3>GEO — Generative Engine Optimization</h3>')
T.append('<p>Optimització per a motors de cerca d\'IA (Perplexity, ChatGPT Search, Gemini, Google AI Overviews) que sintetitzen respostes i citen fonts. Premia E-E-A-T, claredat d\'entitat i densitat factual.</p>')
T.append('<h3>AEO — Answer Engine Optimization</h3>')
T.append('<p>Optimització per a featured snippets, caixes "People Also Ask" i cerca per veu: respostes directes, llistes, taules, schema FAQ/HowTo i preguntes al títol de les seccions.</p>')

html = f"""<!DOCTYPE html>
<html lang="ca"><head><meta charset="utf-8"><style>{CSS}</style></head>
<body>{"".join(T)}</body></html>"""

OUT.mkdir(parents=True, exist_ok=True)
html_path = OUT / f"auditoria-naubostik-web3-2026-09-04.html"
pdf_path = OUT / f"auditoria-naubostik-web3-2026-09-04.pdf"
html_path.write_text(html, encoding="utf-8")

from weasyprint import HTML
HTML(string=html).write_pdf(str(pdf_path))
print("PDF written:", pdf_path)

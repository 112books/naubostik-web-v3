#!/usr/bin/env python3
"""Genera l'informe d'auditoria en PDF via WeasyPrint."""
import html as _html
from pathlib import Path

OUT = Path("/Volumes/1TbExt/Obsidian/hugo-websites/naubostik/naubostik-web-v3/docs/auditoria-konsento-output")
DATE = "3 de setembre de 2026"
SITE = "konsento.naubostik.com"

def esc(t):
    return _html.escape(str(t))

NAVY = "#1B2A4A"; ACCENT = "#2563EB"; GREEN = "#16A34A"; AMBER = "#D97706"
RED = "#DC2626"; ORANGE = "#EA580C"; GRAY_BG = "#F8F9FA"; BORDER = "#E2E8F0"
DARK = "#1E293B"; LIGHT_BG = "#EFF6FF"; LGREEN_BG = "#F0FDF4"; WHITE = "#fff"
LBLUE = "#93C5FD"; GRAY = "#94A3B8"

CSS = f"""
@page {{
  size: Letter; margin: 1in;
  @top-left {{ content: "{SITE}"; color: {DARK}; font: 9pt Arial; border-bottom: 2px solid {NAVY}; padding-bottom: 4px; }}
  @top-right {{ content: "Auditoria Web completa"; color: {DARK}; font: 9pt Arial; border-bottom: 2px solid {NAVY}; padding-bottom: 4px; }}
  @bottom-left {{ content: "Nau Bostik · Auditoria administrativa"; color: {GRAY}; font: 8pt Arial; border-top: 1px solid {BORDER}; padding-top: 4px; }}
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
.cover .score .num {{ font-size: 30pt; font-weight: 700; margin: 4px 0; }}
.cover .score .st {{ font-size: 8pt; font-style: italic; }}
.cover .foot {{ margin-top: 60px; color: {GRAY}; font-size: 8pt; line-height: 1.8; }}
h1 {{ color: {NAVY}; font-size: 17pt; border-bottom: 2px solid {NAVY}; padding-bottom: 4px; margin-top: 28px; }}
h2 {{ color: {NAVY}; font-size: 13pt; margin-top: 20px; }}
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
.prio-crit {{ background: {RED}; color: {WHITE}; font-weight: 700; }}
.prio-high {{ background: {ORANGE}; color: {WHITE}; font-weight: 700; }}
.prio-med {{ background: {AMBER}; color: {WHITE}; font-weight: 700; }}
.prio-quick {{ background: {GREEN}; color: {WHITE}; font-weight: 700; }}
ul.pluses li {{ margin: 4px 0; }}
"""

def table(header, rows, colclass=None):
    th = "".join(f"<th>{esc(h)}</th>" for h in header)
    body = ""
    for r in rows:
        tds = ""
        for i, c in enumerate(r):
            cls = ""
            if colclass and colclass[i]:
                cls = f' class="{colclass[i]}"'
            tds += f"<td{cls}>{c}</td>"
        body += f"<tr>{tds}</tr>"
    return f"<table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>"

def status_badge(s):
    if s == "Good": return '<td class="good">Good</td>'
    if s == "Needs Attention": return '<td class="amber">Needs Attention</td>'
    if s in ("Missing", "Critical"): return '<td class="crit">' + s + "</td>"
    return f"<td>{s}</td>"

# ---------- contingut ----------
scores = [
    ("SEGURETAT", "7", "On Track", AMBER),
    ("SEO", "7", "On Track", AMBER),
    ("IA / GEO", "7", "On Track", AMBER),
    ("ACCESSIBILITAT", "8", "Strong", GREEN),
    ("RENDIMENT", "7", "On Track", AMBER),
]
cover = f"""
<div class="cover">
  <div class="site">{SITE}</div>
  <div class="sub">Auditoria de Seguretat · SEO · IA · Accessibilitat · Rendiment</div>
  <div class="type">AUDITORIA COMPLETA</div>
  <div class="scores">
    {''.join(f'<div class="score" style="background:{col}"><div class="lbl">{lbl}</div><div class="num">{num}</div><div class="st">{st}</div></div>' for lbl, num, st, col in scores)}
  </div>
  <div class="foot">{DATE}<br>Auditoria generada per a Nau Bostik</div>
</div>
"""

exec = """
<div class="exec">
Konsento (konsento.naubostik.com) és la plataforma de governança compartida de la Nau Bostik: assemblees, comissions, protocols i documentació. L'auditoria troba una base tècnica i editorial excel·lent: capçaleres de seguretat robustes (CSP, HSTS, X-Frame-Options, nosniff, COOP), contingut factual i transparent (humans.txt, protocols, FAQ en llenguatge natural), accessibilitat estructural bona (lang, skip-link, alt, labels) i un rendiment ràpid i lleuger amb gzip. El problema més urgent és de configuració: el canonical i l'og:url de totes les pàgines apunten a 127.0.0.1:8000 (localhost), cosa que debilita el SEO i l'ús per motors i IA. La gran oportunitat és afegir schema estructurat (Organization, FAQPage, WebSite) i reforçar la seguretat del login (rate-limit) i de /admin/.
</div>
"""

summary = table(
    ["Dimensió", "Puntuació", "Estat", "Conclusió clau"],
    [
        ["Seguretat", '<span class="scorecell" style="background:%s">7/10</span>' % AMBER, "On Track", "Headers excel·lents; /admin/ exposat, TLS 1.0/1.1, sense rate-limit clar."],
        ["SEO", '<span class="scorecell" style="background:%s">7/10</span>' % AMBER, "On Track", "Estructura i sitemap bons; canonical/og:url a localhost (crític), sense schema."],
        ["IA / GEO", '<span class="scorecell" style="background:%s">7/10</span>' % AMBER, "On Track", "E-E-A-T i contingut factual forts; cap schema semàntic per a motors d'IA."],
        ["Accessibilitat", '<span class="scorecell" style="background:%s">8/10</span>' % GREEN, "Strong", "Pràctiques robustes (lang, alt, labels, skip-link); cal contrast via Lighthouse."],
        ["Rendiment", '<span class="scorecell" style="background:%s">7/10</span>' % AMBER, "On Track", "Ràpid i lleuger amb gzip; cache-control estàtic massa baix (60s)."],
        ["Global", '<span class="scorecell" style="background:%s">36/50</span>' % NAVY, "Sòlida", "Base madura amb oportunitats clares de consolidació i schema."],
    ],
)

pages = table(
    ["URL", "Tipus", "Notes"],
    [
        ["/", "Portada", "Canonical a localhost; h1 únic; headers de seguretat"],
        ["/ca/", "Portada (ca)", "Sense schema; contingut factual de comissions"],
        ["/en/", "Portada (en)", "Segon idioma present"],
        ["/ca/comissions/economia/", "Comissió", "Canonical a localhost; h1/h2 bons"],
        ["/ca/docs/faq/", "FAQ", "Preguntes en llenguatge natural; sense schema FAQPage"],
        ["/ca/docs/protocols/espais/normes-espais/", "Protocol interior", "h1 únic; lang ca"],
        ["/accounts/login/", "Login", "labels + autocomplete bons; s'ha provat brute-force"],
        ["/admin/", "Admin Django", "Exposat públicament (302 a login)"],
        ["Docs legals", "Privacitat, avís legal, cookies, accessibilitat", "Totes responen 200"],
    ],
)

def analysis_table(rows):
    # rows: list of (signal, finding, status_or_None)
    th = "<th>Signal</th><th>Troballa</th><th>Estat</th>"
    body = ""
    for sig, fin, st in rows:
        if st:
            badge = status_badge(st)
        else:
            badge = "<td></td>"
        body += f"<tr><td><b>{esc(sig)}</b></td><td>{fin}</td>{badge}</tr>"
    return f"<table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>"

sec = analysis_table([
    ("HSTS", "max-age=31536000; includeSubDomains; preload", "Good"),
    ("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none'; form-action 'self'...", "Good"),
    ("X-Frame-Options", "DENY", "Good"),
    ("X-Content-Type-Options", "nosniff", "Good"),
    ("Referrer-Policy", "strict-origin-when-cross-origin", "Good"),
    ("Cross-Origin-Opener-Policy", "same-origin", "Good"),
    ("Cookies (CSRF)", "Secure; SameSite=Lax (sense HttpOnly, esperable al csrftoken)", "Good"),
    ("TLS", "TLS 1.2 i 1.3 OK, però 1.0/1.1 habilitats (descontinuats)", "Needs Attention"),
    ("Redirect inicial", "302 de / a http://.../ca/ abans de pujar a https", "Needs Attention"),
    ("/admin/", "Admin de Django exposat públicament a /admin/", "Needs Attention"),
    ("Brute-force login", "Cap resposta 429/lockout observada davant intents repetits", "Needs Attention"),
])

seo = analysis_table([
    ("Canonical", "rel=canonical apunta a <b>https://127.0.0.1:8000/ca/</b> a totes les pàgines — CRÍTIC", "Critical"),
    ("og:url / meta", "og:url també a 127.0.0.1:8000; og:title i og:description correctes", "Needs Attention"),
    ("Sitemap", "Complet i correcte a konsento.naubostik.com, bilingüe ca/en", "Good"),
    ("robots.txt", "Ben configurat: disallow d'àrees privades, sitemap assenyalat", "Good"),
    ("Títols i meta description", "Únics i descriptius a cada pàgina", "Good"),
    ("Estructura de URLs", "Neta i llegible (ex. /ca/comissions/economia/)", "Good"),
    ("Schema estructurat", "Cap JSON-LD/microdata (Organization, WebSite, FAQ...)", "Missing"),
])

geo = analysis_table([
    ("E-E-A-T", "humans.txt detallat, contacte, adreça, autoria clara", "Good"),
    ("Transparència", "privacitat, avís legal, cookies, accessibilitat, estatuts — tot present", "Good"),
    ("Contingut factual", "protocols, assemblees, participació en números, FAQ — dens i citable", "Good"),
    ("Consistència d'entitat", "nom canònic &quot;Nau Bostik&quot; i enllaços externs coherents", "Good"),
    ("Crawlability", "robots.txt clar, HSTS, gzip; JS mínim (HTML render-it al servidor)", "Good"),
    ("Schema per a IA", "cap Organization/FAQPage/WebSite — els motors d'IA no tenen entitat semàntica clara", "Missing"),
])

acc = analysis_table([
    ("lang", "lang=&quot;ca&quot; a totes les pàgines revisades", "Good"),
    ("Landmarks / skip", "skip-link a #main-content, &lt;main id=&quot;main-content&quot;&gt;", "Good"),
    ("Alt text", "totes les imatges amb alt descriptiu; decoratives amb alt=&quot;&quot;", "Good"),
    ("Forms / labels", "login amb &lt;label for&gt; + autocomplete + required correctes", "Good"),
    ("Dimensions d'imatge", "width/height presents (evita CLS); loading=lazy/decoding=async", "Good"),
    ("autofocus al login", "autofocus pot desorientar usuaris de lectors de pantalla (lleu)", "Needs Attention"),
    ("Contrast / CWV", "requereix verificació amb eina de navegador (Lighthouse/WAVE)", "Needs Attention"),
])

perf = analysis_table([
    ("Temps de resposta", "estàtics ~70ms; HTML servit ràpid", "Good"),
    ("Compressió", "gzip habilitat per HTML i estàtics", "Good"),
    ("Pes de pàgina", "home ~98KB d'estàtics; SVG optimitzats; logo 44KB a revisar", "Good"),
    ("Cache-Control estàtics", "max-age=60 (60s) — massa baix per actius immutables", "Needs Attention"),
    ("Cache del HTML", "Vary: Cookie impedeix caching CDN a la home", "Needs Attention"),
    ("Core Web Vitals reals", "cal mesurar amb PageSpeed Insights / Lighthouse", "Needs Attention"),
])

prio = [
    ("🔴 Crític", "Corregir canonical/og:url que apunten a 127.0.0.1:8000", "SEO / GEO", "Baix", "Molt alt", "prio-crit"),
    ("🔴 Crític", "Restringir / desactivar /admin/ públic (Django)", "Seguretat", "Mitjà", "Alt", "prio-crit"),
    ("🟠 Alt", "Deshabilitar TLS 1.0/1.1 i normalitzar redirect a HTTPS", "Seguretat", "Baix", "Alt", "prio-high"),
    ("🟠 Alt", "Afegir schema: Organization, WebSite, FAQPage", "SEO / IA", "Mitjà", "Alt", "prio-high"),
    ("🟡 Mitjà", "Implementar rate-limit / lockout al login (django-axes)", "Seguretat", "Mitjà", "Alt", "prio-med"),
    ("🟡 Mitjà", "Pujar cache-control d'estàtics immutables (60s → 1y)", "Rendiment", "Baix", "Mitjà", "prio-med"),
    ("🟢 Quick Win", "Mesurar Core Web Vitals amb PageSpeed Insights", "Rendiment", "Baix", "Mitjà", "prio-quick"),
    ("🟢 Quick Win", "Revisar contrast i autofocus amb Lighthouse / WAVE", "Accessibilitat", "Baix", "Mitjà", "prio-quick"),
]
# Construïm la taula de prioritats
prio_rows = []
for p, i, d, e, m, cls in prio:
    prio_rows.append([f'<span class="{cls}">{p}</span>', i, d, e, m])
prio_table = table(["Prioritat", "Problema", "Dimensió", "Esforç", "Impacte"], prio_rows,
                   colclass=["prio-crit", None, None, None, None])

pluses = """
<ul class="pluses">
  <li>Headers de seguretat de primer nivell (CSP, HSTS, XFO, nosniff, COOP).</li>
  <li>Accessibilitat estructural exemplar: lang, skip-link, alt, labels, dimensions d'imatge.</li>
  <li>Contingut factual i transparent (humans.txt, protocols, FAQ en llenguatge natural) — gran per a GEO i AEO.</li>
  <li>URLs netes, sitemap complet i bilingüe, robots.txt ben delimitat.</li>
  <li>Rendiment lleuger amb gzip i SVGs optimitzats.</li>
</ul>
"""

html_doc = f"""<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
{cover}
<h1>Resum executiu</h1>
{exec}
{summary}
<h1>Pàgines auditades</h1>
{pages}
<h1>Anàlisi de seguretat</h1>
<h2>Capçaleres i transport</h2>
{sec}
<h1>Anàlisi SEO</h1>
<h2>Troballes tècniques</h2>
{seo}
<h1>Anàlisi IA / GEO</h1>
<h2>Preparació per a cercadors generatius</h2>
{geo}
<h1>Anàlisi d'accessibilitat</h1>
<h2>Estructura i formes</h2>
{acc}
<h1>Anàlisi de rendiment</h1>
<h2>Càrrega i caching</h2>
{perf}
<h1>Matriu de prioritats</h1>
{prio_table}
<h1>Què funciona bé</h1>
{pluses}
<h1>Glossari</h1>
<p><b>SEO:</b> optimització per a cercadors tradicionals (Google). Aquest informe cobreix títols, meta, heading, canonical, sitemap i schema.</p>
<p><b>GEO / IA:</b> optimització per a cercadors generatius (Perplexity, AI Overviews, ChatGPT Search, Gemini). Recompensa claredat, autoritat i riquesa factual.</p>
<p><b>AEO:</b> optimització per a snippets destacats i resposta directa (preguntes com &quot;Què és...?&quot;, &quot;Com puc...?&quot;).</p>
</body></html>"""

html_path = OUT / "auditoria-konsento-naubostik-2026-09-03.html"
html_path.write_text(html_doc, encoding="utf-8")
print("HTML written:", html_path)

from weasyprint import HTML
pdf_path = OUT / "auditoria-konsento-naubostik-2026-09-03.pdf"
HTML(string=html_doc, base_url=str(OUT)).write_pdf(str(pdf_path))
print("PDF written:", pdf_path)

# CLAUDE.md — Nau Bostik · Web 3.0

Aquest fitxer fa doble funció:
1. **Instruccions operatives** per a qualsevol model d'IA / agent que treballi al repositori.
2. **Document estratègic** de la Web 3.0: visió, arquitectura, fases i tasques.

---

## 0. Context: d'on venim

Aquest repositori (`naubostik-web-v3`) és el punt de partida de la **Web 3.0** de Nau Bostik.

- **Web 1** — Site anterior en producció a `naubostik.com` (WordPress, contingut importat).
- **Web 2** — `github.com/112books/naubostik-web` · Reimplementació en Hugo amb tema propi, agenda millorada, importació de tot el contingut. Funcional i desplegat a Netlify. Base de partida d'aquest repo.
- **Web 3** — **Aquest repositori.** Redisseny conceptual i estructural. No és "un web més bonic", és un sistema amb múltiples capes: pública, editorial, de serveis, comunitària, de governança i operativa.

> **Premissa central (document estratègic, abril 2026):**
> Nau Bostik no és un espai cultural qualsevol. És un **ecosistema comunitari, territorial i de governança compartida**. El web ha de fer-ho visible.

---

## 1. Identitat editorial

### Marc transversal: "Conviure, crear i cuidar"
Tots els textos, seccions i funcionalitats s'han de poder llegir des d'aquest triple eix.

### Narrativa newtro
La tensió entre el **passat industrial** (fàbrica Bostik, anys 60) i el **present cultural autogestionat** (segle XXI) és la identitat diferenciadora. No cal amagar-la — cal activar-la editorial i visualment: hero amb fotografies de tensió, textos que nominin la història de l'edifici, seccions de memòria com a contingut de primer nivell.

### Nom canònic
Sempre **Nau Bostik**, mai "la Nau" ni "Bostik" sols.

---

## 2. Arquitectura d'informació (Web 3)

### 2.1 Capes del sistema

| Capa | Descripció | Fase |
|------|-----------|------|
| **Pública** | Web de visita, agenda, continguts | MVP |
| **Editorial** | Articles, observatori, territori, memòria | Fase 1–2 |
| **Serveis i espais** | Fitxes, mapa, formularis | MVP–Fase 1 |
| **Comunitària** | Residents, àmbits, col·lectius, xarxa | Fase 1 |
| **Governança** | Com funciona, recursos, transparència | Fase 1–2 |
| **Operativa interna** | Eines d'autogestió, seguiment | Fase 3 |
| **Automatització / IA** | Agent virtual, fluxos | Fase 3 |

### 2.2 Seccions principals

**Visita Nau Bostik** (nova, MVP): horaris d'obertura, com arribar (transport públic, bicicleta — cotxes i motos fora progressivament), accessibilitat, mapa del recinte per plantes. **Indicador de temperatura del recinte** (MVP simple): quins espais oberts avui, quins tancats. Editable des del CMS. Assignar rol responsable obligatòriament abans de publicar.

**Agenda** (renovada, MVP): separació important: Agenda pública (el que el públic veu) ≠ Calendari viu del recinte (eina de l'equip, Fase 3). Filtres MVP: per tipus · per entitat · per espai/planta · per franja horària. Seguiment post-activitat (Fase 2).

**Espais** (millorada, MVP): fitxes completes (superfície, aforament, equipament tècnic, disponibilitat), mapa navegable, indicador d'accés motoritzat, portada aleatòria d'espais especials.

**Col·lectius i residents** (renovada, Fase 1): no un llistat de logos — una **xarxa visible**. Inspiració machizukuri japonès. Mapa de sinèrgies anual (Fase 1–2). Banc de recursos i capacitats (Fase 2).

**Proposa una activitat** (nova, MVP–Fase 1): formulari central. Camps MVP: info general + material per l'agenda + material operatiu. Fase 1: documentació i compliment (assegurança, drets d'imatge, normativa).

**Art, murals i cultura** (nova, Fase 1): exposicions en curs · ruta de murals · **històric de murals** (memòria visual i patrimonial: no només "què hi ha ara" sinó "què hi havia") · fotografia resident · Pinhole Day · àudio-guies / QR.

**Territori i transformació urbana** (nova, Fase 1–2): entorn veïnal (AVV Sagrera, Escola 100 Passes...) · context urbà (La Llotja, Parc Pegaso, Pont del Treball) · connectivitat metropolitana (nus de La Sagrera, metro, Rodalies, futura AVE). Memòria de barri com a contingut editorial (Fase 2–3).

**Transparència i governança** (nova, Fase 1–2): qui hi participa · com es prenen decisions (assemblees, consens) · d'on surten els recursos. **Registre públic d'assemblees** (MVP–Fase 1, inspiració Canòdrom): pàgina simple amb darrera assemblea, temes, acords, propera data. Molt potent políticament, cost tècnic baix. **Transparència econòmica** (Fase 1–2): gràfic de finançament + text honest.

**Agent IA** (Fase 3): només té sentit si l'arquitectura d'informació està ben resolta. Mai al MVP.

---

## 3. Fases i tasques

### MVP — Fonaments imprescindibles

- [ ] **Home v3** nova — hero newtro, indicador d'estat, agenda setmana, CTAs (veure §4)
- [ ] **Agenda pública filtrable** — per tipus, entitat, espai, franja horària
- [ ] **Visita Nau Bostik** — nova secció: com arribar, horaris, accessibilitat, mapa per plantes
- [ ] **Indicador d'estat del recinte** — camp editable des del CMS, visible a home i Visita
- [ ] **Fitxes d'espais** completes (equipament tècnic, disponibilitat, aforament)
- [ ] **Formulari "Proposa una activitat"** — camps bàsics (info + agenda + operatiu)
- [ ] **Registre públic d'assemblees** — pàgina simple: data, temes, acords, propera conv.
- [ ] **GH Pages** funcionant a `https://112books.github.io/naubostik-web-v3/`
- [ ] Narrativa newtro aplicada al hero i textos principals

### Fase 1 — Profunditat i diferenciació

- [ ] Formulari d'activitat: ampliació amb camps de compliment i documentació
- [ ] **Art, murals i cultura** — secció amb històric de murals (base de dades YAML/frontmatter)
- [ ] **Col·lectius com a xarxa** — visualització de relacions, no graella de logos
- [ ] Mapa de xarxes de col·laboració (versió editorial estàtica primer)
- [ ] **Transparència i governança** — pàgina "Com funcionem" + qui hi participa
- [ ] **Secció Territori** — context urbà, mobilitat, entorn veïnal
- [ ] Seguiment post-activitat integrat a l'agenda (camps addicionals al CMS)
- [ ] Indicador d'accés motoritzat per espai (camp al frontmatter)

### Fase 2 — Contingut editorial i memòria

- [ ] Observatori del barri (articles sobre La Sagrera i l'entorn)
- [ ] Memòria de barri (entrevistes, fotografies de la fàbrica original)
- [ ] Banc de recursos i capacitats del recinte
- [ ] Mapa de sinèrgies anual entre residents (informe publicable)
- [ ] Transparència econòmica (gràfic de finançament + dades)
- [ ] Àudio-guies / QR / recorreguts autoguiats
- [ ] Portada aleatòria d'espais especials

### Fase 3 — Eines avançades (condicional a pressupost i rols)

- [ ] Calendari viu intern del recinte (eina de l'equip, no pública)
- [ ] Eines d'autogestió: actes, convocatòries, seguiment d'incidències
- [ ] Agent IA per a visitants (base de coneixement estructurada primer)
- [ ] Automatitzacions (formulari → agenda → comunicació → arxiu)
- [ ] Participació ciutadana: formulari de propostes de millora

---

## 4. Nova home (Web 3) — especificació MVP

La home ha de comunicar tres coses des del primer scroll:
1. **Qui som** — identitat newtro: fàbrica → ecosistema cultural autogestionat
2. **Que passa** — agenda de la setmana, indicador d'estat del recinte
3. **Com participar** — CTAs per a visitants, organitzadors i possibles residents

### Estructura proposada

```
[HERO]
  Eslògan: "Conviure, crear i cuidar"
  Indicador d'estat del recinte (obert / tancat / parcial)
  CTAs: Visita · Agenda · Proposa una activitat

[AGENDA DE LA SETMANA]
  Destacats dia/setmana (filtres: tipus · entitat)
  → Veure agenda completa

[ECOSISTEMA — Col·lectius i espais]
  Visualització de l'ecosistema (xarxa, no logos)
  Mapa esquemàtic per plantes
  → Coneix els col·lectius · Espais disponibles

[TRANSPARÈNCIA teaser]
  Última assemblea: data + 3 punts tractats
  → Com funcionem

[FOOTER]
  Adreça · Com arribar · Accessibilitat
  Xarxes socials · Legal / Privacitat
```

### Decisions pendents (cal validació amb l'equip)

- Indicador d'estat: semàfor visual o text descriptiu?
- Col·lectius: visualització de graf (JS) o editorial estàtica?
- Hero: fotografia fixa newtro o carrusel de tensió passat/present?
- Registre d'assemblees: secció pròpia o dins Transparència?

---

## 5. Stack tècnic

Idèntic a la Web 2 com a base. Cap canvi de stack sense validació explícita.

- **Generador:** Hugo v0.159.0 (extended). Cap build step JS.
- **Tema:** `themes/NauBostik/` — tema propi.
- **Estils:** CSS vanilla, variables CSS + utility-ish. Sense preprocessador.
  - `--color-primary: #1a1a1a` · `--color-secondary: #666` · `--color-accent: #c41e3a` · `--color-surface: #f8f8f8`
  - Tipografia: **DM Sans** via Google Fonts
- **JS:** vanilla. Sense framework.
- **CMS:** Decap CMS v3 via git-gateway + Netlify Identity.
- **Staging Web 3:** GH Pages públic → `https://112books.github.io/naubostik-web-v3/`
- **Producció (futur):** Netlify → `naubostik.com`

### 5.1 Backend i arquitectura de dades (JAMstack)

No hi ha servidor d'aplicació ni base de dades en runtime. La base de dades és **el repositori Git** i la web és 100% estàtica a l'edge. Les quatre capes:

1. **Contingut editorial** — frontmatter TOML + markdown a `content/` (notícies, activitats, espais, col·lectius), gestionat pel CMS.
2. **Dades estructurades** — `data/*.yaml` (`recinte`, `assemblees`, `equip`, `comissions`, `entitats-logos`, `slogans`, `hero-slideshow`, `portada`, `noticies-territori`). Continguts que no són "posts" es modelen com a dades i es renderitzen des de les plantilles.
3. **Automatització / ingesta** — GitHub Actions. `hugo.yml` construeix i desplega a GH Pages a cada push a `main`. `fetch-territori.yml` és el primer agent d'ingesta: cada dilluns `scripts/fetch-territori.py` consulta RSS externs (La Sagrerina, AVV La Sagrera, Betevé), escriu `data/noticies-territori.yaml`, commiteja i redeploya.
4. **Servei** — CDN estàtic (GH Pages staging / Netlify producció), autenticació i edició via Decap CMS (git-gateway + Netlify Identity).

**Incoherències detectades (agost 2026), pendents de resoldre:**
- Versions de Hugo divergents: `netlify.toml` (0.147.0) vs `.github/workflows/hugo.yml` (0.159.0). Unificar.
- `fetch-territori.yml` desplega a `https://112books.github.io/naubostik-web/` (baseURL Web 2), no al de Web 3 (`/naubostik-web-v3/`). Corregir perquè el cron no sobrescrigui el staging correcte.

---

## 6. Adreça i dades canòniques

```
Nau Bostik · Ferran Turné, 1-11 · 08027 Barcelona · Barri de la Sagrera
```
Coordenades: 41.424277, 2.192917

---

## 7. Instruccions operatives per a l'agent

### 7.1 Prioritats

1. Llegeix aquest fitxer complet abans de tocar res.
2. Comprova `git status` i `git log --oneline -10`.
3. Treballa sempre per fases. No implementar Fase 2 mentre el MVP no estigui validat.
4. Cada nova secció requereix validació del disseny **abans** de codificar.

### 7.2 Convencions

- **Llengua:** català. Codis i noms tècnics en anglès.
- **CSS:** variables CSS, classes BEM-lleuger. Sense Tailwind ni preprocessador.
- **Plantilles Hugo:** `partial`, `block`, `define`, `relLangURL` per als enllaços interns.
- **Frontmatter:** TOML (`+++ ... +++`).
- **Imatges:** TOTES locals sota `static/img/...`. Mai URLs externes. Sempre `{{ .Params.logo | strings.TrimPrefix "/" | relURL }}`. Mai `{{ .Params.logo }}` directament.
- **No comentaris** al codi llevat que el WHY sigui no-obvi.
- **No commitar** sense instrucció explícita de l'usuari.
- **No pujar a producció** (`naubostik.com`) sense avís explícit.

### 7.3 Lliçons crítiques (Web 2 → evitar a Web 3)

- `where Pages "Params.boolField" true` no és fiable en col·leccions Hugo Pages. Construir slice via `range`+`if`+`append`, llavors `where` sobre el slice funciona.
- `where Pages "Params.field" "!=" nil` no exclou strings buides. Encadenar amb `"!=" ""`.
- Partial Hugo: `{{ end }}` seguit de newline retorna `"\n"` (truthy, URL contaminada). Usar `{{ end -}}`.
- GH Pages subpath: comparar URLs amb `Permalink` vs `absLangURL`. `RelPermalink` no inclou `/naubostik-web-v3/`.
- Logos: sempre `| strings.TrimPrefix "/" | relURL`.

### 7.4 Riscos

- **Excés d'amplitud** — risc principal. Selecció dura per fases.
- **Manteniment editorial** — observatori, murals, territori requereixen rols assignats.
- **Indicador de temperatura** — assignar responsable abans de publicar.

### 7.5 Comandes

```bash
hugo server --bind 0.0.0.0 --baseURL http://localhost:1313/ --buildDrafts
hugo --minify --baseURL https://112books.github.io/naubostik-web-v3/
hugo --minify --baseURL https://naubostik.com/
```

### 7.6 Verificació

- `hugo --minify` sense errors ni warnings nous.
- Cap URL externa a camps `imatge`/`logo` del content (`grep -r "http" content/`).
- Comprovat a 360px, 768px, >=1100px.
- `HISTORIA.md` actualitzat.

---

## 8. CMS Wagtail (producció, al VPS)

### 8.1 Estat actual (agost 2026)

**Desplegat i funcionant al VPS:**
- Wagtail 6.4.2 + Django 5.2 + MariaDB (`naubo_naubostik_web`)
- Gunicorn a `127.0.0.1:8001` (3 workers sync, timeout 120s)
- Subdomini `cms.naubostik.com` amb SSL (Let's Encrypt)
- Superusuari: `naubostik` / `joan@linuxbcn.com`
- Deploy script: `web-cms/deploy/deploy.sh`

**Bloqueig: reverse proxy PHP no funciona correctament**
- `proxy.php` al docroot `~/www/cms-nb3/` fa de proxy amb curl intern
- El login funciona (GET + POST), però les peticions POST de gestió (desar perfil, crear pàgines) retornen 403 CSRF o timeout
- Causa: PHP proxy no maneja correctament cookies Django, Content-Length, i CSRF tokens

**Solució demanada a Dinahosting:**
- Mail enviat 2026-08-20 demanant `mod_proxy` + `mod_proxy_http` al vhost
- Amb aquests mòduls, el `.htaccess` pot usar `[P]` directament (proxy natiu Apache)
- Pendent de resposta

### 8.2 Quan mod_proxy estigui habilitat

Canviar el `.htaccess` de `cms.naubostik.com`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/\.well-known/ [NC]
RewriteRule ^ - [L]
RewriteRule ^$ /admin/ [R=302,L]
RewriteCond %{REQUEST_URI} !^/static/
RewriteRule ^(.*)$ http://127.0.0.1:8001/$1 [P,L]
```

IEliminar `proxy.php` del docroot.

### 8.3 Pendents després del proxy

- [ ] Logo Nau Bostik al login de Wagtail
- [ ] Signatura LinuxBCN al peu de l'admin
- [ ] `makemigrations` + `migrate` dels models propis
- [ ] Crear pàgines inicials (Home, Qui som, Contacte)
- [ ] Importar contingut (activitats, espais, col·lectius, notícies)
- [ ] Gunicorn com a servei persistent

### 8.4 Credencials i configuració

- **Servidor:** `naubostik@vl28359` (sense root/sudo)
- **BBDD:** MariaDB 11.8.8, DB `naubo_naubostik_web`, user `naubostik_web`, pass `NauBostik2025%`
- **Gunicorn:** port 8001, config `web-cms/gunicorn_config.py`
- **Django settings:** `web-cms/webcms/settings.py`
- **.env al servidor:** `~/web-repo/web-cms/.env` (SECRET_KEY, DB, ALLOWED_HOSTS)
- **Docroot Apache:** `~/www/cms-nb3/`
- **Repo GitHub:** `112books/naubostik-web-v3` (branca `main`, carpeta `web-cms/`)

---

## 9. Privacitat i indexació

El staging és **públic** però no-indexable:
- `static/robots.txt` amb `Disallow: /` per a tots els crawlers
- Meta `noindex, nofollow, noarchive` al `<head>` de `baseof.html`
- `disableKinds = ["sitemap", "RSS"]` a `hugo.toml`

Quan es passi a producció, revertir totes aquestes proteccions explícitament.

---

*Document generat per LinuxBCN.com per a Nau Bostik · Agost 2026*  
*Basat en el document estratègic d'abril 2026*  
*Document viu — s'actualitza cada sessió de treball*

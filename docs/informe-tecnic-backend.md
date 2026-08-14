# Informe tècnic — Estat i futur del backend de Nau Bostik

**Data:** 14 d'agost de 2026
**Àmbit:** Backend, CMS, automatització i desplegament de naubostik-web-v3
**Objectiu:** Estat actual verificat, problemàtiques, recomanacions i decisions a prendre.
**Preàmbul tècnic:** Tota la informació de l'apartat 1 ha estat verificada directament sobre el codi del repositori durant la sessió del 14-08-2026.

---

## 1. Estat actual i problemàtiques

### 1.1 Arquitectura

La web és **JAMstack pur**: sense servidor d'aplicació ni base de dades en runtime. La base de dades és el repositori Git i la web es serveix 100% estàtica a l'edge. Quatre capes:

| Capa | Descripció | Estat verificat |
|---|---|---|
| Contingut editorial | Frontmatter TOML + markdown a `content/` | 503 activitats · 23 notícies · 24 col·lectius · 35 espais |
| Dades estructurades | `data/*.yaml` | `recinte`, `assemblees`, `slogans`, `hero-slideshow`, `equip`, `comissions`, `entitats-logos`, `noticies-territori` |
| Automatització / ingesta | GitHub Actions | `hugo.yml` (deploy) · `fetch-territori.yml` (cron dilluns, RSS → YAML → commit → deploy) |
| Servei | CDN estàtic | Staging: GH Pages (noindex). Producció futura: Netlify |

**CMS:** Decap CMS v3 (`static/admin/config.yml` + `index.html`) amb backend `git-gateway` + Netlify Identity, `publish_mode: editorial_workflow`. Col·leccions: noticies, activitats, espais, collectius i pàgines fixes.

### 1.2 Problemàtiques

Classificades per severitat. Les P1–P3 poden **trencar el desplegament**; les P4–P6 incompleixen requisits del MVP; P7–P10 són dependències arquitecturals.

#### Crítiques (poden trencar el desplegament)

| ID | Problema | Evidència |
|---|---|---|
| **P1** | El cron de territori desplega a la **Web 2**. Cada dilluns `fetch-territori` construeix amb baseURL `naubostik-web` i sobrescriu el staging de la Web 2 | `.github/workflows/fetch-territori.yml:50` |
| **P2** | **3 versions de Hugo** en joc + deprecacions pendents de migrar | `netlify.toml` 0.147.0 · workflow 0.159.0 · local 0.164.0. Deprecats: `languageCode` → `locale`, `.Site.Data` → `hugo.Data` |
| **P3** | `sync-naubostik.sh` és una relíquia de la Web 2 (baseURL, `REPO_STAGING` i enllaços a `112books/naubostik-web`) | `sync-naubostik.sh:13,70,110,134` |

#### Funcionals (MVP incomplert)

| ID | Problema | Evidència |
|---|---|---|
| **P4** | L'**indicador d'estat del recinte no és editable des del CMS**, tot i ser requisit MVP del CLAUDE.md ("camp editable des del CMS") | Cap col·lecció Decap per `data/*.yaml` |
| **P5** | El **registre d'assemblees** (`assemblees.yaml`) tampoc és editable via CMS | Idem |
| **P6** | El CMS de notícies no té els camps `imatge`, `destacada`, `territori` que usa la portada → l'equip no pot alimentar la portada des del CMS | `static/admin/config.yml:18-28` |

#### Tècniques / dependències

| ID | Problema | Evidència |
|---|---|---|
| **P7** | El CMS (`git-gateway` + Netlify Identity) **només funciona a Netlify**; a GH Pages el `/admin/` és mort | `static/admin/index.html`, `site_url: naubostik.netlify.app` |
| **P8** | El formulari "Proposa activitat" usa **Netlify Forms** → no envia res al staging GH Pages | `proposa-activitat.html:78` |
| **P9** | `static/_headers` (noindex) és **Netlify-only**; a GH Pages el noindex depèn de la meta del `<head>` (ja correcta) | `static/_headers` |
| **P10** | El "calendari viu" intern (Fase 3) no té on viure sense un servei o BBDD; ara tot depèn de fitxers al repo | — |

---

## 2. Recomanacions per fer-ho òptimament

Principi: **mantenir l'estàtic com a cara pública** (ràpid, barat, segur, a l'edge) i resoldre els punts febles amb serveis mínims, mai canviant de stack sense validació explícita (CLAUDE.md §5).

### Fase 0 — Correccions immediates (una sessió)

- **R1.** Unificar Hugo a una sola versió (0.164.0 o la darrera estable) a `netlify.toml`, `.github/workflows/*` i documentació.
- **R2.** Migrar deprecacions: `languageCode` → `locale`, `languageName` → `label` (a `hugo.toml`), eliminar l'ús de `.Language.LanguageCode` de `baseof.html`.
- **R3.** Corregir `fetch-territori.yml` per desplegar al baseURL correcte (`naubostik-web-v3`) o delegar la ingesta a un servei propi (vegeu §3).
- **R4.** Actualitzar o retirar `sync-naubostik.sh`: un sol camí de desplegament (GitHub Actions). Un script local que apunta a la Web 2 és un risc latent.

### Fase 1 — El CMS que compleix el MVP

- **R5.** Afegir col·leccions Decap de tipus `files` per als `data/*.yaml` editables: `recinte` (estat + avisos), `assemblees`, `slogans`, `equip`, `comissions`, `entitats-logos`. Resol P4 i P5 i habilita la gestió editorial sense tocar git.
- **R6.** Ampliar la col·lecció `noticies` del CMS amb els camps `imatge`, `destacada`, `territori`. Resol P6.

### Fase 2 — Decisions d'arquitectura (abans de continuar construint sobre el CMS)

- **R7.** Decidir on viu el CMS:
  - (A) **Netlify com a casa del CMS** (git-gateway funciona directe) i GH Pages com a demo. Manté el vendor lock-in lleu.
  - (B) **Desacoblar del vendor**: backend GitHub del Decap + proxy OAuth propi. Permet tenir el CMS a GH Pages o al VPS. (Vegeu §3.)
- **R8.** Formularis: substituir Netlify Forms per un handler estàtic (Web3Forms) o un endpoint propi al VPS. Resol P8.
- **R9.** Estandarditzar la ingesta com a **pipes** reutilitzables (fetchers → YAML → commit/deploy) perquè afegir una font sigui barat (agenda de producció, mobilitat, observatori).

### Fase 3 — Funcionalitats avançades (condicional a rols i pressupost)

- **R10.** BBDD lleugera (Postgres/SQLite) **només** per al calendari viu intern i eines d'autogestió.
- **R11.** Motor de cerca (Meilisearch) i agent IA sobre base de coneixement estructurada — **mai abans que l'arquitectura d'informació estigui resolta** (CLAUDE.md §2).

---

## 3. El servidor virtual de naubostik.com — oportunitat

**Disponible:** servidor virtual amb possibilitat de PHP, Python i base de dades. Avui la web és estàtica i **no el fa servir**. Això obre una tercera via que resol exactament els punts febles del JAMstack actual sense canviar el stack.

### 3.1 Opció recomanada: arquitectura híbrida "estàtic + serveis"

La web pública **segueix sent Hugo estàtic** (GH Pages, Netlify o el mateix VPS amb Nginx). El VPS hosteja serveis lleugers i aïllats (Docker), cadascun amb una feina:

| Servei al VPS | Resol | Detall |
|---|---|---|
| **Proxy OAuth per al Decap** | P7 | El CMS passa a backend GitHub + OAuth propi → deixa de dependre de Netlify. Pot servir-se des de GH Pages, Netlify o el VPS |
| **Endpoint de formularis** (Node/Python) | P8 | Rep "Proposa activitat", Contacte, Cessió d'espais → escriu a un arxiu/proposta o notifica per correu/Telegram. També pot desar respostes com a issues de GitHub (manté Git com a font de veritat) |
| **Cron d'ingesta** (o n8n) | P1 | Substitueix/relliga `fetch-territori` des de GH Actions: més fonts, millor control, sense dependre del calendari de GitHub |
| **BBDD lleugera** (Postgres/SQLite) | P10 | Calendari viu intern (Fase 3), eines d'autogestió, seguiment post-activitat |
| **Cerca** (Meilisearch) | — | Base per a l'agent IA i el cercador amb rellevància (Fase 3) |
| **Servei web** (Nginx/Caddy + HTTPS automàtic) | — | Permet servir la web estàtica des del VPS si en algun moment es vol sortir de GH Pages/Netlify |

**Avantatges:** manté la velocitat i seguretat de l'estàtic, desacobla del vendor (Netlify), i obre el camí a Fase 2/3 amb un cost de manteniment controlat i incremental (s'hi afegeixen serveis quan calen, no tots a la vegada).

### 3.2 Opció alternativa: CMS amb base de dades (WordPress / Strapi / Payload)

**Es descarta com a opció immediata**: suposa canvi de stack complet (contra CLAUDE.md §5), cost de manteniment i seguretat superiors, i la web actual ja funciona. Només es reconsideraria si l'equip necessités edició complexa, rols molt granulars o un back-office que el Decap no cobreix.

### 3.3 Què NO fer

- **No duplicar el contingut** entre repo i BBDD. El repositori Git es manté com a **única font de veritat** del contingut públic; la BBDD és per a dades operatives internes (calendari viu, seguiment, formularis).
- **No substituir el CDN per dinàmic al VPS** si l'estàtic ja funciona. El VPS és per a serveis, no per fer la web més lenta.
- **No crear l'agent IA abans d'hora**: sense arquitectura d'informació resolta, és una eina morta.

---

## 4. Conclusions

1. El backend està **ben plantejat** (JAMstack, Git com a font de veritat, capa d'ingesta automatitzada) i la part que ja funciona ho fa bé: deploy GH Pages correcte, templates migrades a `hugo.Data`.
2. Però hi ha **3 incoherències que poden trencar deploys** (P1–P3) i un **MVP incomplert en edició** (P4–P6). Cap d'aquestes no és difícil de corregir.
3. La **decisió clau** és on viu el CMS (Netlify vs desacoblat amb proxy OAuth propi). És una decisió que cal prendre abans de continuar construint sobre el CMS.
4. Amb el **servidor virtual disponible**, la recomanació és l'arquitectura híbrida: **web estàtica + serveis al VPS** (autenticació del CMS, formularis, ingesta i, més endavant, BBDD + cerca per a l'agent IA). Maximitza el que ja es té i resol els punts febles del JAMstack pur sense canviar de stack.
5. **Full de ruta proposat:**
   - **Fase 0 (ara):** R1–R4 — versions unificades, deprecacions, `fetch-territori` correcte, retirar `sync-naubostik.sh`.
   - **Fase 1 (MVP):** R5–R6 — CMS editiu de `data/*.yaml` + camps de notícies.
   - **Fase 2 (decisió):** R7–R9 — plataforma del CMS, formularis, framework d'ingesta. Punt de decisió de l'ús del VPS.
   - **Fase 3 (condicional):** R10–R11 — BBDD interna, cerca, agent IA.

---

*Informe generat per a la presa de decisions sobre el backend de Nau Bostik · 14 d'agost de 2026*

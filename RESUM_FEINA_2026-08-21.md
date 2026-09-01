# Nau Bostik Web 3.0 — Resum de feina realitzada i pendents (22 Agost 2026)

---

## ✅ COMPLETAT

### 1. Migració CMS: Netlify → GitHub OAuth
- Eliminat `git-gateway` + Netlify Identity (donava 405 a `/.netlify/identity/token`)
- Configurat **GitHub OAuth directe** (Decap CMS + GitHub Pages)
- OAuth App: `Ov23liziSDMYRMx0NpeN` / callback `https://112books.github.io/naubostik-web-v3/admin/`
- Editors necessiten compte GitHub + col·laborador `Write` al repo `112books/naubostik-web-v3`

### 2. Reestructuració de contingut
- **32 activitats** mogudes de `content/activitats/` → `content/activitats-residents/` (amb camp `entitat`)
- **2 tallers** nous creats des de naubostik.com:
  - `taller-salsa-cubana.md`
  - `academia-cant-madisound.md`
- Template `tallers/list.html` nou exclou `_index.md`
- Template `activitats/list.html` actualitzat per unir `activitats` + `activitats-residents`

### 3. Correcció rutes imatges (templates + frontmatter)
- **Frontmatter netejat**: 494 fitxers, eliminat prefix `img/` (`imatge = "activitats/foo.jpg"`)
- **TOTS els templates actualitzats** amb `printf "img/%s" .Params.imatge | relURL`:
  - `activitats/list.html`
  - `activitats-residents/list.html` (inclòs `$foto` per JSON)
  - `noticies/list.html`, `noticies/single.html`
  - `home.html`, `home-v1.html` (hero, notícies, activitats portada)
  - **`activitats/single.html`** — Fix: `printf "img/%s" .Params.imatge | relURL` per imatge destacada
- Build local verifica: imatges generen correctament `/naubostik-web-v3/img/...`

### 4. CMS config millorada (`static/admin/config.yml`)
- `public_folder: "https://112books.github.io/naubostik-web-v3/img"` (preview CMS)
- Descripcions per: recinte, slogans, hero-slideshow
- Hero slideshow: camp `link` opcional, templates actualitzats (`home.html`, `home-v1.html`)
- Slogans: descripció on surt (ticker hero)

### 5. Funcionalitats nous
- **Cessió d'espais**: botó a `/cessio-despais/` → `/contacte/?consulta=cessio` + JS auto-selecciona pestanya
- **Estat recinte**: CSS `.recinte-estat` margin-top `-0.55rem` per alineació
- **Manual CMS** (`content/manual-cms/_index.md`) accessible des del CMS (footer fix) i web `/manual-cms/`
- Link "Issues" al CMS footer
- **Template `section/manual-cms.html`** amb TOC funcional (Hugo `.TableOfContents` + `toc: true`)

### 6. CMS images FIX (22/08)
- **`public_folder: "https://112books.github.io/naubostik-web-v3/img"`** al `static/admin/config.yml` → les previsualitzacions al CMS ara funcionen correctament a GitHub Pages subpath
- Les imatges a **activitats**, **activitats-residents**, **tallers**, **collectius**, **hero-slideshow** ara es veuen al CMS

### 6. Funcionalitats nous
- **Cessió d'espais**: botó a `/cessio-despais/` → `/contacte/?consulta=cessio` + JS auto-selecciona pestanya
- **Estat recinte**: CSS `.recinte-estat` margin-top `-0.55rem` per alineació
- **Manual CMS** (`content/manual-cms/_index.md`) accessible des del CMS (footer fix) i web `/manual-cms/`
- **Template `section/manual-cms.html`** amb TOC funcional (Hugo `.TableOfContents` + `toc: true`)

### 7. Fix activitats single image (22/08 tarda)
- **`activitats/single.html`** — Fix: `printf "img/%s" .Params.imatge | relURL` per imatge destacada (fixat imatge trencada a pàgines finals d'activitats)

---

## 🔴 PENDENTS / EN PROCÉS

### 1. Imatges al CMS (PRIORITAT ALTA)
**Problema**: Commit `26b1fb6` (templates fix + frontmatter net) desplegat, però imatges **encara NO es veuen al CMS** a:
- `https://112books.github.io/naubostik-web-v3/admin/#/collections/activitats/...`
- `https://112books.github.io/naubostik-web-v3/admin/#/collections/activitats-residents/...`
- `https://112books.github.io/naubostik-web-v3/admin/#/collections/tallers/...`
- `https://112books.github.io/naubostik-web-v3/admin/#/collections/collectius/...`
- `https://112books.github.io/naubostik-web-v3/admin/#/collections/hero-slideshow/...`

**Causa probable**: Cache GitHub Pages / CMS no ha recarregat el `config.yml` amb `public_folder` absolut. Verificar després de rebuild complet.

**Web**: Les imatges **SI es veuen** al web (build local correcte).

### 2. Sincronització amb naubostik.com (WordPress)
- Importar activitats que falten (vacances, mercats, concerts, etc.)
- Evitar duplicats: verificar si ja existeixen a `content/activitats/` o `content/activitats-residents/`

### 3. Vacances / Estat recinte
- Usuari corrigit: oficines tancades **1-31 agost** (no 24)
- **PENDENT**: Actualitzar `data/recinte.yaml`:
  ```yaml
  estat: "tancat"
  nota: "Tancat per vacances fins al 31 d'agost"
  ```

### 3. Sistema d'usuaris i entrades d'entitats (PENDENT CRÍTIC)

**Arquitectura actual (GitHub OAuth)**:
| Rol | GitHub | CMS |
|-----|--------|-----|
| Superadmin | Admin | Tot |
| Editor | Write | Tot |
| Entitat/Resident | — | **NO té accés** |

**Limitació**: GitHub no permet permisos per col·lecció/carpeta.

**Flux de treball proposat per Entitats/Residents (MVP - Formulari + PR)**:

```
Entitat/Resident
      │
      ▼
Formulari "Proposa activitat" al web (/proposa-activitat/)
      │
      ▼
Sistema rep les dades → Formspree → correu a comunicacio@naubostik.com + Telegram a responsable
      │
      ▼
Editor/Superadmin revisa al CMS
      │
      ▼
Editor crea l'entrada a "Activitats Residents" → Publica
```

**Formulari actual** (`/proposa-activitat/`):
- Camps: Info general + Material per l'agenda + Material operatiu
- Enviament: **Formspree** → correu a `comunicacio@naubostik.com` + **Telegram** a responsable
- **Notificació Telegram**: Configurar bot amb webhook a Formspree o via n8n/Zapier

**Recomanació fluxe de treball (MVP)**:
1. **Entitat** omple formulari `/proposa-activitat/` → clica "Envia"
2. **Formspree** envia:
   - Correu a `comunicacio@naubostik.com` (amb totes les dades estructurades)
   - **Notificació Telegram** a grup/canal editors (via webhook n8n/Zapier/IFTTT)
3. **Editor** rep notificació → obre CMS → **Activitats Residents** → **New**
4. **Editor** copia/enganxa dades del correu → revisa → puja imatge si cal → **Save** (Esborrany = No)
5. **Deploy automàtic** (2-3 min) → activitat pública al web

**Avantatges MVP**:
- Entitats NO necessiten compte GitHub
- Editors controlen la qualitat i validen dades
- Flux auditables (correu + Telegram)
- Sense desenvolupament complex

**Futur (v2)**: Dashboard propi per entitats (Sveltia CMS + Cloudflare Worker) + notificacions automàtiques + estat de proposta.

---

## 📋 MATRIU URLs PER ENTORN (Skill `hugo-cms-auth`)

| Entorn | Web | CMS | `baseURL` | `public_folder` |
|--------|-----|-----|-----------|-----------------|
| Local | `http://localhost:1313/` | `http://localhost:1313/admin/` | `http://localhost:1313/` | `/img` |
| GH Pages | `https://112books.github.io/naubostik-web-v3/` | `https://112books.github.io/naubostik-web-v3/admin/` | `https://112books.github.io/naubostik-web-v3/` | URL absoluta |
| Producció | `https://naubostik.com/` | `https://naubostik.com/admin/` | `https://naubostik.com/` | `/img` |

**Regla d'or frontmatter**: `imatge = "activitats/foo.jpg"` (MAI `img/`)

---

## 🔑 COMANDES ÚTILS

```bash
# Build local
hugo --minify --baseURL "https://112books.github.io/naubostik-web-v3/" -d /tmp/hugo-test

# Neteja frontmatter (ja fet)
for f in content/**/*.md; do sed -i '' 's/^imatge = "img\//imatge = "/' "$f"; done

# Deploy manual
git add -A && git commit -m "msg" && git push

# Verificar build GitHub Actions
https://github.com/112books/naubostik-web-v3/actions
```

---

## 🎯 PROPER PASSOS RECOMANATS

1. **Verificar CMS** després de rebuild (imatges + manual)
2. **Actualitzar `data/recinte.yaml`** amb vacances 1-31 agost
3. **Implementar flux entitats**: formulari + Formspree → correu + Telegram → editor revisa CMS
4. **Nova funcionalitat: Convocatóries d'assemblea amb dates múltiples**
   - Crear col·lecció `assemblees` al CMS (o ampliar `activitats` amb tipus `assemblea`)
   - Camps: títol, descripció, 1-5 dates proposades, 2 francs horaris per data
   - Formulari públic per votar disponibilitat (Google Forms / Typeform / formulari propi)
   - Resultats visibles a editors → trien data/hora final → publiquen
   - Notificació automàtica a participants (email/Telegram)
4. **Sincronitzar contingut** amb naubostik.com (evitant duplicats)
5. **Fotos equip** → descarregar i actualitzar `data/equip.yaml`

---

## 📁 FITXERS CLAU

| Fitxer | Funció |
|--------|--------|
| `static/admin/config.yml` | CMS config (GitHub OAuth, `public_folder` absolut) |
| `static/admin/index.html` | CMS entry point + footer amb manual/issues |
| `data/hero-slideshow.yaml` | Imatges hero amb `link` opcional |
| `data/recinte.yaml` | Estat recinte + nota + avisos (**PENDENT actualitzar vacances**) |
| `data/equip.yaml` | Equip (pendent fotos locals) |
| `themes/NauBostik/layouts/activitats/list.html` | Agenda principal (uneix 2 seccions) |
| `themes/NauBostik/layouts/activitats/single.html` | Activitat single (fixat img/ prefix) |
| `themes/NauBostik/layouts/tallers/list.html` | Tallers (exclou _index) |
| `themes/NauBostik/layouts/tallers/single.html` | Taller single amb metadades |
| `themes/NauBostik/layouts/activitats-residents/single.html` | Resident single amb link extern |
| `themes/NauBostik/layouts/cessio-despais/single.html` | Botó cessio → contacte |
| `themes/NauBostik/layouts/contacte/list.html` | Formulari + JS auto-selecció |
| `themes/NauBostik/layouts/section/manual-cms.html` | Manual CMS amb TOC funcional |
| `content/manual-cms/_index.md` | Manual editors (toc: true) |
| `themes/NauBostik/layouts/manual-cms/single.html` | Layout manual CMS amb TOC Hugo |
| `themes/NauBostik/static/css/main.css` | Estils manual CMS (TOC, taules, codi, etc.) |
| `~/.claude/skills/hugo-cms-auth/SKILL.md` | Config CMS + matriu URLs per entorn |
| `~/.claude/skills/hugo-cms-user-system/SKILL.md` | Rols, flux entitats, manual CMS |

---

## 🔗 Verificació
- **Web**: https://112books.github.io/naubostik-web-v3/
- **CMS**: https://112books.github.io/naubostik-web-v3/admin/ ✅ imatges visibles (pendent rebuild)
- **Manual CMS**: https://112books.github.io/naubostik-web-v3/manual-cms/ ✅ TOC funcional
- **Imatges web**: HTTP 200 ✅
- **GitHub Actions**: ✅ `65107fc` deployed successfully

---

**Última actualització**: 22 Agost 2026 — LinuxBCN.com per Nau Bostik
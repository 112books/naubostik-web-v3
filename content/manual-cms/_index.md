+++
title = "Manual d'Editors CMS"
description = "Guia completa per gestionar continguts a la Nau Bostik"
draft = false
menu = "footer"
weight = 10
toc = true
+++

# Manual d'Editors — CMS Nau Bostik

Benvinguda al manual de referència per als editors del CMS de la Nau Bostik. Aquest document explica pas a pas com gestionar tots els continguts del web: activitats, notícies, tallers, espais, col·lectius, l'estat del recinte, el slideshow de portada i més.

---

## 1. Accés al CMS

### 1.1 URL d'accés
**URL principal**: https://112books.github.io/naubostik-web-v3/admin/

### 1.2 Com fer login (pas a pas)

1. Obre el navegador i ves a la URL de dalt
2. Clica el botó **Login with GitHub**
3. Si no has entrat prèviament a GitHub, introdueix les teves credencials (usuari/contrassenya)
4. GitHub et demanarà autoritzar l'aplicació **"Nau Bostik CMS"** — clica **Authorize nau-bostik-cms**
5. Tornaràs automàticament al CMS amb la sessió iniciada

> **Important**: Necessites un compte GitHub i ser **col·laborador del repositori** amb rol **Write** (vegeu apartat 13. Gestió d'usuaris).

### 1.3 Primer accés / Invitació
Si és la primera vegada que entres:
1. El Superadmin (webmaster@naubostik.com) t'hauria d'haver enviat una invitació per correu electrònic des de GitHub
2. Obre el correu i clica **Accept invitation**
3. Accepta els permisos demanats
4. Torna al CMS i fes login com s'explica a dalt

---

## 2. Estructura general del CMS

El CMS s'organitza en **col·leccions** (llistes d'entrades) i **fitxers de dades** (configuracions úniques). A la barra lateral esquerra veuràs:

### 2.1 Col·leccions principals (llistes d'entrades)

| Col·lecció | Què gestiona | On apareix al web | Qui pot crear/editar |
|------------|--------------|-------------------|---------------------|
| **Activitats** | Esdeveniments propis de la Nau Bostik (mercats, concerts, festivals, etc.) | Agenda principal, Portada (secció "Aquesta setmana") | Editors + Superadmin |
| **Activitats Residents** | Esdeveniments organitzats per entitats/col·lectius residents | Agenda principal, Portada, pàgina /activitats-residents/ | Editors + Superadmin |
| **Tallers** | Tallers i activitats regulars setmanals (salsa, cant, etc.) | Pàgina /tallers/, Portada (columna "Tallers i activitats regulars") | Editors + Superadmin |
| **Notícies** | Articles, comunicats, entrades de blog | Portada (secció "Notícies"), pàgina /noticies/ | Editors + Superadmin |
| **Espais** | Fitxes descriptives de cada nau/sala | Pàgina /espais/, formulari cessió | Editors + Superadmin |
| **Col·lectius** | Fitxes de cada entitat/col·lectiu resident | Pàgina /collectius/, secció "Ecosistema" portada | Editors + Superadmin |
| **Fonts RSS** | Syndicació de notícies del territori (AVV, La Sagrerina, etc.) | Secció "Del territori" a Notícies | Superadmin |

### 2.2 Fitxers de dades (configuracions úniques)

| Fitxer | Què configura | On apareix |
|--------|---------------|------------|
| **Estat de la Nau** | Estat del recinte (obert/tancat/parcial), nota visible al hero, avisos | Hero portada, pàgina inici |
| **Slogans** | Frases que roten al ticker del hero | Hero portada (ticker) |
| **Hero Slideshow** | Imatges del carrusel principal de portada | Hero principal (carrusel) |
| **Portada** | Recursos/CTAs que apareixen a la portada | Secció "Recursos" portada |
| **Equip** | Membres de l'equip gestor i colaboradors | Pàgina /qui-som/ |
| **Sessió** | Configuració de la sessió (només Superadmin) | — |

---

## 3. Operacions bàsiques amb entrades

### 3.1 Crear una nova entrada
1. A la barra lateral, clica el nom de la col·lecció (ex: **Activitats**)
2. Clica el botó **New Activitat** (o **New Notícia**, **New Taller**, etc.) a dalt a la dreta
3. Omple els camps (vegeu apartats específics per cada tipus)
4. Desmarca **Esborrany** (vegeu 3.3) quan estigui llesta
5. Clica **Save** (desa) → l'entrada es crea i apareix a la llista

### 3.2 Editar una entrada existent
1. A la llista de la col·lecció, clica sobre el títol de l'entrada
2. Modifica els camps necessaris
3. Clica **Save**

### 3.3 Estat: Esborrany vs Publicat
- **Esborrany = Sí** (marcat): L'entrada **NO es publica** al web. Només es veu al CMS (mode previsualització).
- **Esborrany = No** (desmarcat): L'entrada **es publica** al proper deploy automàtic (2-3 minuts després de guardar).

> **Consell**: Tria **Esborrany = Sí** mentre estiguis redactant. Només desmarca quan l'entrada estigui completa i revisada.

### 3.4 Eliminar una entrada
1. Obre l'entrada
2. Clica el menú de tres punts (⋮) a dalt a la dreta
3. Tria **Delete** → confirma

> **Atenció**: L'eliminació és irreversible. Si cal, fes una còpia dels textos abans.

---

## 4. Guia per tipus d'entrada

### 4.1 Activitats i Activitats Residents

**Diferència clau**:
- **Activitats**: Esdeveniments propis de la Nau Bostik (organitzats per l'equip gestor)
- **Activitats Residents**: Esdeveniments organitzats per entitats/col·lectius residents

**Camps obligatoris**:
| Camp | Què posar | Exemple |
|------|-----------|---------|
| **Titol** | Nom de l'esdeveniment | "Festa Major La Sagrera" |
| **Data** | Data d'inici (YYYY-MM-DD) | 2026-08-15 |
| **Data fi** | Si dura més d'un dia (YYYY-MM-DD) | 2026-08-17 |
| **Hora** | Hora d'inici (HH:MM) | 18:30 |
| **Hora fi** | Hora de fi (opcional) | 22:00 |
| **Imatge** | Pujar fitxer (vegeu apartat 6) | — |
| **Entitat** | Nom de l'entitat/col·lectiu (només Activitats Residents) | "Associació Veïnal La Sagrera" |

**Camps opcionals**:
| Camp | Què posar | Exemple |
|------|-----------|---------|
| **Preu** | Cost de l'entrada | "Gratuït", "15€", "Lliure" |
| **Planta** | On es fa (selector) | "Planta Baixa", "Primera planta" |
| **Enllaç extern** | URL si la inscripció és fora | "https://entrades.exemple.com" |
| **Col·lectiu** | Nom intern del col·lectiu | "avv-sagrera" |
| **Taller fix** | Marca si és taller regular | Sí/No |
| **Assemblea / Comissió** | Marca si n'és una | Sí/No |
| **Avis** | Tipus d'avís especial | "tancament", "canvi", "important" |
| **Descripció** | Text curt per llistes i targetes (Markdown) | Vegeu apartat 5 |
| **Cos** | Contingut complet de la pàgina de detall (Markdown) | Vegeu apartat 5 |

**Diferència camps Descripció vs Cos**:
- **Descripció**: Text curt per llistes i targetes (apareix a l'agenda, portada)
- **Cos**: Contingut complet de la pàgina de detall de l'activitat

### 4.2 Tallers

Els tallers són activitats regulars setmanals (salsa, cant, etc.).

**Camps específics**:
| Camp | Què posar |
|------|-----------|
| **Titol** | Nom del taller ("Salsa Cubana") |
| **Data** | Data d'inici del curs |
| **Imatge principal** | Foto representativa |
| **Més imatges** | Galeria addicional (llista) |
| **Espai** | On es fa ("Nau KM14", "Sala Gandul") |
| **Responsable** | Qui l'organitza ("Properess") |
| **Horari** | Text lliure ("Dimarts 20-21h iniciació / 21-22h mitjà") |
| **Més informació (URL externa)** | Link a web/formulari d'inscripció |
| **Descripció / Cos** | Detalls complets (Markdown) |

### 4.3 Notícies

Articles, comunicats, entrades de blog.

**Camps**:
| Camp | Què posar |
|------|-----------|
| **Titol** | Títol de la notícia |
| **Data** | Data publicació |
| **Imatge** | Foto principal |
| **Destacada** | Marca si ha d'aparèixer com a hero a portada |
| **Descripció / Cos** | Text complet (Markdown) |

### 4.4 Espais

Fitxes de cada nau, sala o espai ceditible.

**Camps**:
| Camp | Què posar |
|------|-----------|
| **Titol** | Nom de l'espai ("Nau Andy Warhol") |
| **Ubicació** | On és (selector: Planta Baixa, Primera planta, etc.) |
| **Cedible** | Sí/No (si apareix al formulari de cessió) |
| **Fotografies** | Galeria de fotos de l'espai |
| **Plànol** | Planta de l'espai (imatge) |
| **Logo** | Logotip de l'espai (si en té) |
| **Col·lectiu** | Entitat responsable |
| **Mail / Web / Xarxes** | Contacte de l'espai |

### 4.5 Col·lectius

Fitxa de cada entitat/col·lectiu resident.

**Camps**:
| Camp | Què posar |
|------|-----------|
| **Titol** | Nom de l'entitat |
| **Logo** | Logotip |
| **Àmbit** | Categories (selector múltiple: tecnologia, art, música, etc.) |
| **Web / Email / Instagram** | Contacte |
| **Descripció / Cos** | Qui són, què fan |

---

## 5. Redacció de textos (Markdown)

El CMS usa **Markdown** per als camps **Descripció** i **Cos**. Aquí tens els elements bàsics:

### 5.1 Títols
```markdown
# Títol principal (H1)
## Subtítol (H2)
### Sub-subtítol (H3)
```

### 5.2 Text
- **Negreta**: `**text**` → **text**
- *Cursiva*: `*text*` → *text*
- `Codi en línia`: `` `codi` `` → `codi`

### 5.3 Llistes
```markdown
- Element 1
- Element 2
  - Subelement
  - Subelement

1. Primer
2. Segon
3. Tercer
```

### 5.4 Enllaços i imatges
```markdown
[Text de l'enllaç](https://exemple.com)
![Text alternatiu](/img/activitats/imatge.jpg)
```

### 5.4 Taules
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Valor A  | Valor B  |
| Valor C  | Valor D  |
```

### 5.5 Citats i blocs
```markdown
> Citació important
> Una altra línia
```

### 5.5 Separador horitzontal
```markdown
---
```

> **Consell**: Previsualitza sempre amb l'ull a la previsualització lateral del CMS (si l'actives) abans de guardar.

---

## 6. Imatges — REGLA FONDAMENTAL

### 6.1 Com pujar una imatge
1. Al camp **Imatge**, clica **Choose file** / **Browse**
2. Selecciona el fitxer del teu ordinador
3. El CMS la puja automàticament a `static/img/[col·lecció]/`
4. El camp es farà amb la ruta relativa (ex: `activitats/la-meva-foto.jpg`)

### 6.2 REGLA D'OR — MOLT IMPORTANT
> **MAI escriguis `img/` manualment al camp del frontmatter.**

| Correcte | Incorrecte |
|----------|------------|
| `imatge = "activitats/festa.jpg"` | `imatge = "img/activitats/festa.jpg"` |

**Per què?** El CMS ja afegeix `img/` automàticament per les previsualitzacions. Si ho poses tu, es duplica i la imatge es trenca al CMS (encara que al web pugui funcionar).

### 6.3 Especificacions recomanades
| Tipus | Mides | Pes màxim | Format |
|-------|-------|-----------|--------|
| Activitats/Notícies | 1200×800px | 500 KB | JPG / WebP |
| Hero Slideshow | 1920×1080px | 800 KB | JPG / WebP |
| Logos col·lectius/espais | 400×400px | 200 KB | PNG (fons transparent) / SVG |
| Fotos equip | 600×600px | 300 KB | JPG |

> **Consell**: Abans de pujar, redueix la mida amb eines com [squoosh.app](https://squoosh.app) o [tinyjpg.com](https://tinyjpg.com).

---

## 7. Hero Slideshow (Portada)

El carrusel principal de la pàgina d'inici.

### 7.1 Com configurar-lo
1. Ves a **Hero Slideshow** a la barra lateral
2. Clica l'única entrada existent (o crea-ne una si no n'hi ha)
4. Al camp **Imatges del carrusel**, clica **Add** per cada imatge:
   - **Imatge**: Pujar (1920×1080px recomanat)
   - **Text alternatiu**: Descripció per accessibilitat (ex: "Nau Bostik vista aeris")
   - **Enllaç opcional**: URL absoluta si vols que la imatge sigui clicable (ex: `https://naubostik.com/activitats/`)

### 7.2 Ordre i funcions
- **Ordre de la llista** = ordre visual del carrusel (arrossega per reordenar)
- La primera imatge és la que es mostra inicialment
- Les fletges laterals permeten navegar
- Si afegis **Enllaç**, la imatge esdevé un enllaç (s'obre en nova pestanya)

---

## 8. Estat de la Nau (Hero + Portada)

Controla l'indicador visible al hero de la portada i a la pàgina d'inici.

### 8.1 Com configurar-lo
1. Ves a **Estat de la Nau Bostik**
2. Omple:
   - **Estat**: `obert` / `tancat` / `parcial` (selector)
   - **Nota**: Text curt visible al hero (ex: "Tancat per vacances fins al 31 d'agost")
   - **Avisos**: Llista d'avisos (opcional):
     - **Text**: Missatge de l'avís
     - **Tipus**: `tancament` (vermell), `campanya` (blau), `info` (gris)

### 8.2 On apareix
- Al **hero de la portada** (just sota el títol principal)
- A la pàgina **/inici/** com a banner superior

---

## 9. Slogans (Ticker del Hero)

Frases curtes que roten automàticament al ticker del hero.

### 9.1 Com configurar
1. Ves a **Slogans / Frases del ticker**
2. Al camp **Slogans**, afegeix una frase per línia (clica **Add** per cada una)
3. L'ordre de la llista = ordre de rotació

Exemples:
- "Conviure, crear i cuidar"
- "Fàbrica Bostik → Ecosistema cultural"
- "Autogestió comunitària a La Sagrera"

---

## 10. Portada (Recursos/CTAs)

Recursos que apareixen a la secció "Recursos" de la portada.

### 10.1 Com configurar
1. Ves a **Portada** → **Recursos de portada**
2. Per cada recurs:
   - **Titol**: Nom del recurs
   - **Descripció**: Text breu
   - **URL**: Enllaç absolut (ex: `/proposa-activitat/`)
   - **Tipus**: Categoria (ex: "formulari", "enllaç", "document")

---

## 11. Estat de la Nau (Oficines) — Vacances

Per indicar tancament per vacances d'oficines:

1. Ves a **Estat de la Nau Bostik**
2. **Estat**: `tancat`
3. **Nota**: `Tancat per vacances fins al 31 d'agost`
4. Desmarca **Esborrany** → guarda

> **Nota**: El període oficial d'oficines és **1 al 31 d'agost** (no el 24).

---

## 12. Gestió d'usuaris i rols

### 12.1 Rols actuals (GitHub OAuth)

| Rol al CMS | Permís GitHub | Què pot fer |
|------------|---------------|-------------|
| **Superadmin** | Admin al repo / Owner org | Tot: configurar CMS, afegir usuaris, tot el contingut |
| **Editor** | Write (col·laborador) | Crear/editar/esborrar tot el contingut |
| **Entitat/Resident** | — (sense accés GitHub) | **No té accés directe al CMS** |

### 12.2 Com afegir un nou Editor (pas a pas — Part Superadmin)

**Només Superadmin pot fer-ho:**

1. Ves a GitHub: https://github.com/112books/naubostik-web-v3/settings/access
2. Clica **Invite teams or people**
3. Escriu el **nom d'usuari GitHub** de la persona
4. Selecciona rol **Write**
5. Clica **Add [usuari] to this repository**
6. La persona rep un correu de GitHub → ha d'acceptar la invitació
7. Un cop acceptada, la persona pot fer login al CMS amb el seu compte GitHub

> **Nota**: Tots els editors tenen accés a **tot** el contingut (no hi ha permisos per col·lecció).

### 12.3 Com crear-se compte i accedir com a Editor (part Usuari Editor)

Si ets un nou editor convidat:

1. **Revisa el correu electrònic**: Hauries de rebre un correu de GitHub amb l'assumpte *"Invitation to collaborate on 112books/naubostik-web-v3"*
2. **Clica "Accept invitation"**: S'obrirà GitHub
5. **Inicia sessió a GitHub** (si no ho estàs): Introdueix el teu usuari/contrassenya GitHub
6. **Accepta la invitació**: Clica **Accept invitation** a la pàgina de GitHub
7. **Ves al CMS**: https://112books.github.io/naubostik-web-v3/admin/
8. **Clica "Login with GitHub"**: Autoritza l'aplicació "Nau Bostik CMS" si és la primera vegada
9. **Ja estàs dins**: Ja pots crear i editar continguts

> **Important**: Si no tens compte GitHub, has de crear-ne un primer a https://github.com/join (és gratuït). Un cop tinguis compte, diu al Superadmin el teu nom d'usuari GitHub per convidar-te.

### 12.4 Sistema per Entitats/Residents ("bostikians", sense accés CMS)

Les entitats i residents **NO tenen accés directe al CMS** (no tenen compte GitHub). Envien les seves activitats amb el **formulari públic**, i un editor les revisa i publica.

**Flux actual (Capa A): Formulari web → Konsento → Revisió editorial**

```
Entitat/Resident (bostikià)
       │
       ▼
Formulari "Proposa una activitat" (/proposa-activitat/)
       │
       ▼
POST a Konsento (konsento.naubostik.com, app "propostes")
       │  · desa la proposta (no es perd res)
       │  · avisa TOTS els editors per email + Telegram
       ▼
Un editor obre Konsento → /admin/ → Propostes
       │
       ▼
Crea l'entrada a "Activitats Residents" al CMS → Publica
```

**Formulari** (`/proposa-activitat/`): camps d'info general + agenda + material operatiu. En enviar, el proposant torna a la pàgina amb un avís d'èxit o error.

**Futur (Capa B)**: el bostikià entra amb el seu compte de Konsento i la proposta crea directament un esborrany al CMS, sense transcripció manual. Vegeu `docs/superpowers/specs/`.

---

## 13. GitHub Issues — Què són i per què serveixen?

### 13.1 Què són?
Els **Issues** (incidències) són el sistema de seguiment de tasques, errors i millores del repositori GitHub. Funcionen com un "tauler de tasques" públic.

### 13.2 Per què serveixen al projecte Nau Bostik?

| Ús | Exemple |
|------|---------|
| **Reportar errors** | "La imatge no es veu a l'activitat X" |
| **Sol·licitar canvis** | "Afegir camp nou a tallers" |
| **Proposar millores** | "Redissenyar la pàgina d'inici" |
| **Coordinar tasques** | "Importar activitats de juny de WordPress" |
| **Discutir decisions** | "Canviar colors del tema" |

### 13.3 Com crear un Issue (pas a pas)

1. Ves a: https://github.com/112books/naubostik-web-v3/issues
2. Clica **New issue** (botó verd a la dreta)
3. Tria plantilla si n'hi ha (Bug report, Feature request, etc.) o **Blank issue**
4. Omple:
   - **Title**: Descripció curta i clara (ex: "Imatge trencada a activitat 10è aniversari")
   - **Description**: Detalls, passos per reproduir, captures de pantalla
   - **Labels**: Tria etiquetes (bug, enhancement, documentation, etc.)
   - **Assignees**: Assignar a qui ho ha de fer (opcional)
   - **Milestone**: Si forma part d'un objectiu més gran (opcional)
5. Clica **Submit new issue**

### 13.4 Com seguir un Issue
- Subscriu-te (botó **Subscribe** a la dreta) per rebre notificacions per correu
- Comenta amb `@usuari` per notificar algú específic
- Tanca l'issue quan estigui resolt (botó **Close issue**)

---

## 14. Flux de publicació i deploy

### 14.1 Quan es publica el que fas al CMS?
1. Guardes una entrada amb **Esborrany = No**
2. GitHub Actions detecta el commit al branch `main`
3. S'executa el workflow `Deploy Hugo site to Pages` (vegeu `.github/workflows/hugo.yml`)
4. Hugo genera el web estàtic a la carpeta `public/`
5. Es desplega automàticament a GitHub Pages
6. **Temps total**: 2-3 minuts després de guardar

### 14.2 Com verificar que s'ha publicat
1. Espera 3 minuts després de guardar
2. Recarrega la pàgina amb **Ctrl+Shift+R** (força neteja de caché)
3. Verifica a la URL pública: `https://112books.github.io/naubostik-web-v3/`

### 14.3 Si no apareix
- Verifica que l'entrada té **Esborrany = No**
- Comprova que el workflow ha acabat amb èxit (verd) a: https://github.com/112books/naubostik-web-v3/actions
- Neteja caché del navegador (Ctrl+Shift+R) o obre en mode incògnit

---

## 15. Problemes freqüents i solucions

| Problema | Causa probable | Solució |
|----------|----------------|---------|
| **Imatge no es veu al CMS** | Frontmatter amb `img/` prefix | Treu `img/` del frontmatter (ha de ser `activitats/foto.jpg`) |
| **Imatge no es veu al web** | Ruta incorrecta / fitxer no pujat | Verifica que la imatge està a `static/img/[col·lecció]/` i el frontmatter és correcte |
| **Canvis no apareixen al web** | Caché / deploy no acabat | Espera 3 min + **Ctrl+Shift+R** |
| **Error "YAMLSemanticError"** | Duplicats al `config.yml` | Revisa `static/admin/config.yml` (només un bloc `backend:`) |
| **No puc fer login** | Sense compte GitHub / no col·laborador | Verifica: compte GitHub + invitació acceptada + rol Write al repo |
| **Error 404 a manual CMS** | URL incorrecta | Usa `/naubostik-web-v3/manual-cms/` (amb subpath) |
| **Imatges trencades al hero** | Mida massa gran / format | Redueix a 1920×1080px, <800KB, JPG/WebP |

---

## 16. Contacte i suport

### 16.1 Equip tècnic
- **Superadmin / Desenvolupament**: `webmaster@naubostik.com` (LinuxBCN.com)
- **Repositori GitHub**: https://github.com/112books/naubostik-web-v3

### 16.2 On reportar problemes
- **Issues GitHub** (recomanat): https://github.com/112books/naubostik-web-v3/issues
- **Correu directe**: `webmaster@naubostik.com` (per urgències/seguretat)

### 16.3 Recursos addicionals
- **Repositori**: https://github.com/112books/naubostik-web-v3
- **Deploy GitHub Actions**: https://github.com/112books/naubostik-web-v3/actions
- **CMS (admin)**: https://112books.github.io/naubostik-web-v3/admin/
- **Web pública**: https://112books.github.io/naubostik-web-v3/
- **Manual CMS**: https://112books.github.io/naubostik-web-v3/manual-cms/

---

## 17. Annex: Sistema de propostes d'entitats/residents (Detall tècnic)

### 17.1 Formulari públic (`/proposa-activitat/`)
- Accessible des del menú principal i des de la pàgina d'activitats
- Camps estructurats en 3 blocs:
  1. **Informació general** (títol, dates, horari, preu, imatge)
  2. **Material per l'agenda** (descripció curta, títol públic, enllaç extern)
  3. **Material operatiu** (espai demanat, necessitats tècniques, contacte responsable, observacions internes)

### 17.2 Processament (Capa A)
1. El proposant omple el formulari i clica **Envia**
2. El navegador fa `POST` a `https://konsento.naubostik.com/proposta-activitat/` (app `propostes` de Konsento)
3. Konsento **desa la proposta** (model `Proposta`) i **avisa tots els editors** per email i Telegram
4. El proposant torna a `/proposa-activitat/` amb un avís d'èxit (`?enviat=1`) o error (`?error=1`)
5. Un editor obre Konsento → **`/admin/` → Propostes**, revisa les dades
6. Al CMS del web → **Activitats Residents** → **New**, hi passa les dades
7. Revisa, completa camps opcionals, puja imatge si cal
8. Desmarca **Esborrany** → **Save** → publica al proper deploy
9. (Opcional) A Konsento, marca la proposta com a **Publicada**

> Configuració tècnica: `konsento/propostes/`, secrets al `.env` del servidor
> (`PROPOSTES_NOTIFY_EMAILS`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).

### 17.3 Millores futures (Capa B — roadmap)
- [ ] El bostikià entra amb el seu compte de Konsento (no cal GitHub)
- [ ] La proposta crea directament un esborrany a "Activitats Residents"
- [ ] Estat de la proposta visible per al proposant (pendent / en revisió / publicada / rebutjada)
- [ ] Històric de propostes per entitat
- [ ] Notificació automàtica a l'entitat quan es publica

---

---

*Manual actualitzat: 1 Setembre 2026*  
*Versió: 3.1*  
*Mantenit per: LinuxBCN.com per a Nau Bostik*  
*Repositori: https://github.com/112books/naubostik-web-v3*
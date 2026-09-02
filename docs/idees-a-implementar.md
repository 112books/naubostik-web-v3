# Idees a implementar

Recull de funcionalitats i millores pendents per a naubostik.com. Document viu — s'actualitza a cada sessió.

---

## Portada

### Secció "Aquesta setmana" — activitats
**Implementat (2026-08-13):** 4 columnes — 3 cards de les pròximes activitats de la Nau Bostik + columna dreta amb llista d'activitats de les entitats residents (data · hora · títol).

**Pendent:**
- Adaptar el nombre de cards (2–4) segons quants events destacats hi hagi
- Afegir camp `destacat = true` a les activitats per controlar quines apareixen a portada

### Secció "Notícies"
**Implementat (2026-08-13):** 3 columnes — notícia destacada gran (col 1), 3 darreres notícies normals (col 2), llista "Del territori" (col 3). Camps frontmatter disponibles: `destacada = true`, `territori = true`.

**Pendent:**
- Afegir camp `imatge` al frontmatter de notícies i al CMS (Decap config)
- Importar notícies reals des de naubostik.com i classificar-les

### Secció "La Nau" — pestanyes
**Implementat (2026-08-13):** Pestanyes Espais / Equip humà.

**Pendent:**
- Afegir membres reals de l'equip a `data/equip.yaml` (nom, foto, rol, correu corporatiu)
- Afegir col·laboradors amb camp `tipus: colaborador` al YAML

---

## Pàgines de secció

### /activitats/
**Implementat (2026-08-13):** 3 columnes — Activitats NB / Entitats residents / Tallers fixes + botó "Proposa la teva activitat". Pàgina individual amb meta completa, foto, afegir a calendari (Google / iCal / Outlook).

**Camps frontmatter disponibles:**
`hora`, `hora_fi`, `planta`, `preu`, `entitat`, `organitzador`, `taller_fix`, `imatge`, `link_extern`, `descripcio`, `data_fi`

**Pendent:**
- Importar tots els events de naubostik.com producció (script a `docs/superpowers/import-activitats-produccio.md`)
- Revisar que el formulari "Proposa la teva activitat" arriba al correu de gestió (Netlify Forms)
- **[PENDENT D'ESTUDIAR] Modelatge de l'origen de cada activitat** — Cal definir clarament què és una activitat *pròpia* (totes menys les que venen de residents/entitats) i què és una activitat *d'entitat/resident* (les que envien ells i s'aproven). Estudiar la millor forma de representar-ho (camp `origen`/`tipus` explícit al frontmatter vs. inferir-ho del camp `entitat`), i com gestionar-ho des del CMS i el flux de proposta → aprovació. (2026-09-02)

### /noticies/
**Implementat (2026-08-13):** Pàgina llista amb cards (foto · títol · data · resum · "Llegir més") i paginador numèric. Totes les **23 notícies de producció importades** amb imatges del cos a `static/img/noticies/` (figures amb peu, galeries, vídeo YouTube a "Hem fet els deures"), portades 100% locals (les 10 que usaven URL del WP s'han localitzat). Enllaços interns morts (naubostik.com) convertits a text pla.

**Pendent:**
- Classificar `destacada = true` / `territori = true` a les notícies actuals per alimentar la portada
- El vídeo de YouTube de "Hem fet els deures!" és l'únic element extern que queda (iframe embed)

### /qui-som/
**Implementat (2026-08-13):**
- Secció "Història" — 6 capítols importats de naubostik.com, cadascun en pàgina pròpia amb paginador numèric (1–6) i galeries amb lightbox. Pestanya al /qui-som/ amb resum + botó "Llegeix la història completa →".

**Pendent:**
- Resum i motivació (com al web actual de producció)
- Equip gestor amb fitxes: fotografia, nom complet, funció, correu corporatiu
- Col·laboradors: mateixa estructura, camp `tipus: colaborador`
- Secció "Transparència" — cards amb memòria de cada any
- Identitat visual — importar de naubostik.com/identitat-visual-de-la-nau-bostik/

### /contacte/
**Pendent:**
- Dades de contacte clares: adreça, telèfon, Telegram, correu electrònic
- Horaris d'oficina i horaris d'accés al recinte
- Mapa sobri estil llumatics.com (transports públics)
- Iconografia de distàncies: metro, bus, tren, bicing, aparcament bicicletes
- Política d'aparcament de cotxes (zona càrrega/descàrrega, horaris, demanar permís)

### /cercar/
**Pendent:** Afegir el sitemap del web a sota del cercador per facilitar la navegació

---

## Funcionalitats transversals

### Gestió d'usuaris (CMS)
- Rols: admin, editor de notícies, editor d'entitat
- Manual d'ús per a editors no tècnics
- Publicació de notícies de territori amb aprovació prèvia

### Formularis
- **Contacte general** — guiat, acompanyat de FAQ
- **Cessió d'espais** — guiat (selecció d'espai amb fitxa), condicions legals + FAQ
- **Proposta d'activitats** — FAQ + camps: qui, què, tipologia, antelació, necessitats tècniques (aigua, llum, potència, catering, neteja, foto/vídeo) — prioritzar serveis interns

### Contingut pendent d'importar
- Entitats residents de naubostik.com/entitats-residents/ → `/collectius/` **(fet 2026-08-13, 22 entitats)**
- Events passats i futurs del web de producció → `/activitats/`
- Notícies del web de producció → `/noticies/` **(fet 2026-08-13, 23/23)**
- Història de la Nau → `/qui-som/` **(fet 2026-08-13, 6 capítols)**
- Fotografies reals dels espais → `static/img/espais/`


## Errades a corregir:
Sembla que ara a portada han canviat les activitats propies a mostrar. Harien de sortir només les destacades i haurien de councidir amb les qeu ara hi ha a naubostik.com en producció..

cal a aquest segon blog tal vegada dividir-lo en properes activitats i un trecer blic amb les passades.

I també cal Revisar les imatges dels logos dels colectius a la pestanya del blic La Nau Bostik de la portada.

A història penso qeu caldria posar els videos d'avans // després d'en David Sunyol.
També veure on posar els vídeos nous que s'han fet, però en trocets promocionals. Tal vegada a entitats.

Cal que a les pàgines finals de cada colectiu, a la columna dreta, al final, es llistin les activitats propies si estan actives encara. 

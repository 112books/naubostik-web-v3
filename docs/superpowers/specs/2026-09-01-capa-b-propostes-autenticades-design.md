# Capa B — Propostes autenticades des de Konsento

> **DESCARTAT.** Escrit sobre el fork mort `github.com/112books/konsento`
> (app `propostes`, model `Entitat`). El Konsento real és
> `codeberg.org/linuxbcn/konsento` (model `Peticio`, sense `Entitat`).
> Substituït per `2026-09-01-capa-b-agenda-sync-design.md`. Es manté només
> com a referència d'idees (§1 objectiu, §3.1 decisions obertes de B2 hi
> encaixen), no com a pla d'implementació.

**Estat:** SPEC per implementar més endavant. Capa A (formulari públic →
Konsento → avís editors → publicació manual) ja està feta i desplegada.
Aquest document és per continuar el treball en una sessió futura.

Data: 2026-09-01.

---

## 1. Objectiu

Que un **bostikià** (entitat o resident amb compte a Konsento) pugui enviar
una activitat a l'agenda d'entitats del web **des del seu compte**, i que la
proposta:

- quedi vinculada a la seva `Entitat` (no cal reescriure el nom cada cop),
- generi **directament un esborrany** a `content/activitats-residents/` del
  repo del web (`draft: true`), no només un avís per email,
- tingui un **estat visible** per al proposant (pendent / en revisió /
  publicada / rebutjada),
- segueixi avisant els editors per email + Telegram (reutilitza Capa A).

La revisió i publicació final continua sent **manual** per un editor (treure
`draft`). Capa B automatitza l'entrada de dades, no la decisió editorial.

## 2. Peces que ja existeixen (no refer)

- `konsento/propostes/` — model `Proposta`, endpoints públics, `notifica()`
  (email + Telegram). Capa B afegeix un camí autenticat que reusa `Proposta`
  i `notifica()`.
- `assemblees.User.entitat` (FK), `User.pot_proposar_agenda` (bool),
  helpers de rol. Vegeu `konsento/docs/roles-i-permisos.md`.
- Login / logout / sessió de Konsento (subsistema A).
- Model de persones i permisos: `docs/usuaris-i-grups.md`.

## 3. Abast de Capa B

### 3.1 Konsento
- Vista autenticada `propostes/nova/` (formulari), només per `request.user`
  amb `entitat` assignada i `pot_proposar_agenda = True`.
- En desar: crea `Proposta` (com Capa A) + dispara la creació de contingut
  al repo del web (§3.2).
- Camp `Proposta.estat` ja existeix; afegir transicions i una vista
  `propostes/meves/` perquè el proposant vegi l'estat.
- `Proposta` guanya FK opcional a `Entitat` i a `User` (proposant).

### 3.2 Pont amb el repo del web (GitHub)
- Konsento escriu un fitxer nou a `content/activitats-residents/<slug>.md`
  amb `draft = true` via l'API de GitHub (Contents API, `PUT`).
- Autenticació: **GitHub App** dedicada (instal·lada al repo
  `112books/naubostik-web-v3`) o un fine-grained PAT amb permís `contents:write`
  només a aquest repo. El secret va al `.env` del servidor de Konsento.
- Frontmatter mínim a generar: `title`, `date`, `entitat`, `descripcio`,
  `planta`/`espai`, `hora`, `draft = true`, i un comentari amb l'`id` de la
  `Proposta` per traçar-ho.
- L'`Action` `hugo.yml` del web publica l'esborrany (invisible al públic
  perquè `draft`), i l'editor el fa visible quan el revisa.

### 3.3 Web (Hugo)
- El formulari públic `/proposa-activitat/` es queda (Capa A) per a qui no té
  compte. S'hi afegeix un enllaç "Ets una entitat resident? Entra a Konsento"
  cap a `propostes/nova/`.
- Opcional: quan l'editor treu `draft`, un pas manual o un webhook marca la
  `Proposta` com a `publicada` a Konsento.

## 4. Decisions obertes

- **GitHub App vs PAT**: App és més neta (permisos per repo, rotació), PAT és
  més ràpid de muntar. Recomanació: App.
- **Slug del fitxer**: `YYYY-MM-DD-<slug-del-titol>` per evitar col·lisions.
- **Imatges**: Capa B pot pujar la imatge al repo (`static/img/activitats/`)
  via la mateixa API, o deixar que l'editor la pugi al CMS. MVP: la posa
  l'editor.
- **Rebuig**: en rebutjar, esborrar el fitxer draft del repo o deixar-lo?
  Recomanació: esborrar-lo (Contents API `DELETE`) i posar motiu a `Proposta`.

## 5. Fora d'abast de Capa B (per si es vol Capa C)

- Autoservei d'alta d'`Entitat` (registre + aprovació).
- Pont d'autenticació perquè els **editors** entrin al CMS via Konsento
  (`is_editor_web`) — això és el **subsistema B** de `roles-i-permisos.md`,
  independent d'aquesta Capa B de propostes. No confondre els noms.

## 6. Test plan (quan s'implementi)

- Bostikià sense `entitat` / sense `pot_proposar_agenda` → 403 a `propostes/nova/`.
- Enviament OK → `Proposta` creada amb FK a user/entitat + crida a l'API de
  GitHub mockejada amb el path i frontmatter correctes + `notifica()` cridat.
- Fallada de l'API de GitHub → la `Proposta` es desa igualment i es registra
  l'error (no es perd la proposta).
- `propostes/meves/` només mostra les del `request.user`.

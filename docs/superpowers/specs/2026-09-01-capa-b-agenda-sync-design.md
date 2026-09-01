# Capa B — sincronització automàtica de l'agenda d'entitats

**Estat:** SPEC per implementar. Escrita perquè una altra sessió/agent la pugui
acabar sense context previ. Substitueix
`2026-09-01-capa-b-propostes-autenticades-design.md` (escrita sobre el fork
mort de GitHub — descartada, vegeu `docs/ESTAT-konsento-i-formularis.md`).

Data: 2026-09-01. Depèn de **Capa A** (feta, desplegada, verificada — vegeu
`docs/ESTAT-konsento-i-formularis.md`).

---

## 0. Arquitectura ja decidida (no redebatre)

`konsento-codeberg/docs/prototip.md §7` fixa el pont Konsento↔web:

> **Una sola via: governança → web. Res bidireccional.**
> Konsento exposa JSON de lectura → una GitHub Action del repo web el
> consumeix, genera contingut, fa commit i desplega.

El mateix patró que `naubostik-web-v3/scripts/fetch-territori.py` +
`.github/workflows/fetch-territori.yml` ja fan per a notícies RSS. Capa B és
aquest mateix patró aplicat a les activitats aprovades.

**Konsento MAI escriu al repo del web.** Cap GitHub App, cap Contents API des
de Django. (L'spec anterior, descartada, proposava això — no fer-ho.)

---

## 1. B1 — Auto-publicació de propostes aprovades (fer primer)

Objectiu: quan un editor aprova una `Peticio` d'activitat (Capa A) a l'admin
de Konsento, que aparegui al web **sense retranscriure-la a mà**.

### 1.1 Konsento (`codeberg.org/linuxbcn/konsento`)

**Migració** a `assemblees/models.py`, camps nous a `Peticio` (tots
`blank=True`, només s'omplen quan `tipus == ACTIVITAT_WEB`):

```python
agenda_publicada = models.BooleanField(
    _("aprovada per l'agenda del web"), default=False,
    help_text=_("Marca-ho quan la proposta estigui llesta per aparèixer al web."),
)
agenda_titol = models.CharField(_("títol"), max_length=150, blank=True)
agenda_data = models.CharField(_("data"), max_length=20, blank=True)   # YYYY-MM-DD
agenda_hora = models.CharField(_("hora"), max_length=10, blank=True)
agenda_espai = models.CharField(_("espai"), max_length=120, blank=True)
agenda_entitat = models.CharField(_("entitat"), max_length=120, blank=True)
agenda_descripcio = models.TextField(_("descripció"), blank=True)
```

**Per què camps estructurats i no parsejar `missatge`:** `missatge` és text
lliure pensat per llegir-lo una persona (ja funciona, no tocar). Parsejar-lo
amb regex per treure'n JSON és fràgil. Millor que `formulari_web` (Capa A)
ompli **els dos** en crear la `Peticio`.

**`assemblees/views.py` → `formulari_web`:** quan `mena == "activitat"`, a
més de `missatge` (com ara), passar els camps estructurats a
`Peticio.objects.create(...)`:

```python
agenda_titol=titol, agenda_data=request.POST.get("data", "").strip()[:20],
agenda_hora=request.POST.get("hora", "").strip()[:10],
agenda_espai=request.POST.get("espai", "").strip()[:120],
agenda_entitat=request.POST.get("entitat", "").strip()[:120],
agenda_descripcio=request.POST.get("descripcio", "").strip()[:5000],
```

**Admin** (`assemblees/admin.py`, `PeticioAdmin`): afegir `agenda_publicada`
a `list_editable` (o un botó d'acció "Aprova per l'agenda") perquè l'editor
ho marqui sense obrir cada fitxa.

**Endpoint públic nou**, patró `api_propera_assemblea`/`api_comissions`
(`assemblees/views.py`, GET, `_api_rate_limit`, JSON):

```
GET /api/activitats-agenda/
```

Retorna només `tipus=ACTIVITAT_WEB, agenda_publicada=True`, **sense dades de
contacte** (nom/email són privats — l'API és pública sense auth):

```json
{"activitats": [
  {"id": 42, "titol": "...", "data": "2026-10-04", "hora": "19:00",
   "espai": "Nau Andy Warhol", "entitat": "Cor de la Nau", "descripcio": "..."}
]}
```

`id` = `Peticio.pk`. Imprescindible: el web l'usa per no duplicar en
re-sincronitzar.

**URL**: afegir a `konsento/urls.py` arrel (com `api_propera_assemblea`).

**Tests** (`assemblees/tests_web.py` o nou `tests_api_agenda.py`):
- `formulari_web` amb `mena=activitat` omple els camps `agenda_*`.
- `GET /api/activitats-agenda/` només retorna `agenda_publicada=True`.
- La resposta NO conté `contacte_nom`/`contacte_email`.
- Rate-limit actiu (patró `_api_rate_limit` ja existent).

### 1.2 Web (`github.com/112books/naubostik-web-v3` — o Codeberg si ja migrat)

**Script** `scripts/fetch-agenda-web.py`, calcat de
`scripts/fetch-territori.py` (llegir-lo abans d'escriure aquest):
1. `GET https://konsento.naubostik.com/api/activitats-agenda/`
2. Per cada item: si NO existeix ja un fitxer a
   `content/activitats-residents/` amb `konsento_id = <id>` al frontmatter
   (`grep`/parseig TOML), crea'n un de nou.
3. Frontmatter generat (TOML, coherent amb la col·lecció existent —
   comprovar camps exactes a `static/admin/config.yml` secció
   `activitats-residents`):
   ```toml
   +++
   title = "<agenda_titol>"
   date = "<agenda_data>T<agenda_hora>:00"
   entitat = "<agenda_entitat>"
   descripcio = "<agenda_descripcio>"
   konsento_id = <id>
   draft = true
   +++
   ```
4. `draft = true` **sempre**: l'aprovació de l'editor a Konsento confirma el
   contingut, però no hi ha imatge (el formulari del web no en demana) ni
   assignació de planta/col·lectiu intern — un editor fa el darrer pas al
   CMS (puja imatge, revisa, desmarca `draft`). Si en el futur es vol
   `draft = false` directe, cal abans decidir què fer amb la imatge.

**Workflow** `.github/workflows/sync-agenda-web.yml`, calcat de
`fetch-territori.yml`: cron (p. ex. diari) + `workflow_dispatch` manual,
`git commit` + push si hi ha fitxers nous.

> ⚠️ **Gotxa ja detectada** (CLAUDE.md §5.1): `fetch-territori.yml` desplega
> amb el `baseURL` de la Web 2 (`naubostik-web`), no el de Web 3
> (`naubostik-web-v3`). **No repetir l'error** en aquest workflow nou —
> verificar el `baseURL`/repo abans de fer-lo servir.

### 1.3 Ordre d'implementació recomanat (TDD)

1. Migració + camps `agenda_*` a `Peticio` (Konsento).
2. `formulari_web` omple els camps nous — test.
3. Endpoint `/api/activitats-agenda/` — test (inclou test de privacitat: no
   contacte).
4. `list_editable` a l'admin.
5. Desplegar Konsento (migrate + restart, com Capa A).
6. Script `fetch-agenda-web.py` + workflow al repo web — provar amb
   `workflow_dispatch` manual abans de fiar-se del cron.

---

## 2. B2 — Bostikià autenticat (després de B1, no abans)

Objectiu original de l'usuari: que un bostikià entri amb compte propi i la
proposta es faci amb el seu perfil (sense repetir dades cada cop).

**No dissenyat en detall** — decisions obertes que calen abans de tocar codi:

- **Model `Entitat`**: no existeix a Konsento real. Cal decidir si és un
  model nou (com proposava l'spec descartada) o s'aprofita algun concepte
  existent (`rols.py` té "Usuaris de la Nau" però és individual, no
  d'entitat). Probablement cal `Entitat` nou + `User.entitat` FK — igual que
  l'spec vella, però migrat a `assemblees/models.py` real.
- **Alta d'entitats**: qui l'aprova? Konsento ja té `demana_acces` +
  `benvinguda` (flux d'alta d'usuari individual) — reutilitzar-lo o fer-ne
  un de paral·lel per entitats?
- **Formulari autenticat**: reutilitza `formulari_web`? o una vista nova amb
  `@login_required` que pre-omple `contacte_nom`/`entitat` del `request.user`?
- **Relació amb B1**: un cop fet B1, el formulari autenticat pot seguir
  creant una `Peticio` amb `agenda_*` — B1 el reutilitza sencer, només canvia
  qui l'envia i com s'omple `contacte_*`.

Recomanació per a qui reprengui: **no dissenyar B2 del tot fins que B1 sigui
a producció i s'hagi vist com el fan servir els editors realment.** Amb B1 ja
es resol el dolor principal (retranscripció manual); B2 és una millora
d'ergonomia per als bostikians, no un bloqueig.

---

## 3. Fitxers a tocar (resum ràpid per a qui continuï)

| Repo | Fitxer | Canvi |
|---|---|---|
| Codeberg konsento | `assemblees/models.py` | camps `agenda_*` + migració |
| Codeberg konsento | `assemblees/views.py` | `formulari_web` omple camps + `api_activitats_agenda` |
| Codeberg konsento | `assemblees/admin.py` | `agenda_publicada` a `list_editable` |
| Codeberg konsento | `konsento/urls.py` | ruta `/api/activitats-agenda/` |
| Codeberg konsento | `assemblees/tests_web.py` | tests dels 2 punts anteriors |
| Web naubostik-web-v3 | `scripts/fetch-agenda-web.py` | nou, calcat de `fetch-territori.py` |
| Web naubostik-web-v3 | `.github/workflows/sync-agenda-web.yml` | nou, calcat de `fetch-territori.yml`, **baseURL correcte** |

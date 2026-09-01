# Estat: Konsento, forks i formularis del web (2026-09-01)

Document de traspàs. Sessió aturada per tokens. Llegir abans de continuar.

## 1. Hi ha DOS forks de Konsento — no confondre'ls

| | Fork MORT | **Canònic / producció** |
|---|---|---|
| Remot | `github.com/112books/konsento` | `codeberg.org/linuxbcn/konsento` |
| Checkout local | `naubostik-web-v3/konsento/` (aquest) | *cap encara — cal clonar-lo* |
| Servidor | — | `naubostik@vl28359.dinaserver.com:~/konsento` (SSH per clau, ja afegida) |
| URL | — | https://konsento.naubostik.com |
| Migracions `assemblees` | 3 | 21 |
| Rols | `roles-i-permisos` (grups `editors_web`, `equip_gestio`, model `Entitat`) | `assemblees/rols.py`: Administradors · Personal de la Nau · Usuaris de la Nau · Responsables de comissió · Control usuaris web. Comanda `seed_rols`. |
| Formularis públics | app `propostes` (feta aquesta sessió) | `assemblees/views.py`: `proposa`, `fes_pregunta` → model `Peticio` (honeypot `_spam_detectat`, `_valida_email`, avís Telegram) |
| Telegram | `propostes/notificacions.py` (nou) | `assemblees/telegram.py` + `notifications.py` + webhook + botons Accepta/Rebutja |
| Extres | — | allauth, admin custom, protocols wizard, InfoPractica, ServeiTerritorial, meteo, sitemaps, llms.txt |

Divergiren cap a la migració `0002`. **Decisió (2026-09-01): tot va a Codeberg. GitHub `112books/konsento` queda abandonat.**

## 2. Feina d'aquesta sessió que ha anat al lloc equivocat

- `github.com/112books/konsento` commits `c31053f` (app `propostes`) i `3480dec` (docs) — **sobre el fork mort**. No desplegable. Reaprofitar el disseny, no el codi.
- `roles-i-permisos` (sessió anterior, mateix fork mort) — **mai desplegat**. Producció té `rols.py` propi.

Res s'ha tocat a producció (`git pull`/`migrate` NO fets).

## 3. Capa A — formularis del web → Konsento

### Fet i correcte (commit web `94f3cb7`)
- Fix enllaços TOC del manual (`getElementById`, CSS `#TableOfContents`, toggle mòbil, `<script>` tret de `main.css`, `scroll-margin-top`).
- Docs: `CLAUDE.md` §8 (backend real CMS), `docs/usuaris-i-grups.md` (PROPOSTA, per revisar), manual-cms §12.4/§17, spec Capa B.

### Capa A — FETA (2026-09-01)

**Codeberg** (`assemblees/`, commit `a9db195`, push `6147a20..a9db195`):
- `Peticio.Tipus.ACTIVITAT_WEB` nou (migració `0022_alter_peticio_tipus`).
- Vista `formulari_web` (`@csrf_exempt @require_POST`) a `assemblees/views.py` →
  endpoint **`POST /web/formulari/`** (a `konsento/urls.py` arrel, fora i18n).
  Camp `mena` = `activitat` | `contacte`. Reusa `_spam_detectat` (honeypot
  **`nb_url`**), `_valida_email`. Redirect a `next` validat (`?enviat=1`/`?error=1`,
  hosts `112books.github.io` / `naubostik.com`).
- `telegram.py` `notifica_activitat_web` + branca al signal `notifica_telegram_peticio`.
  Email als responsables d'`equip-gestor` via el signal existent.
- 8 tests a `assemblees/tests_web.py`; suite 22/22 OK.

**Web** (commit següent): `action=` dels 2 formularis → `{{ site.Params.konsento_url }}/web/formulari/`,
camp `mena`, honeypot renombrat `bot-field`→`nb_url`.

### Pendent al servidor (usuari)
```
ssh naubostik@vl28359.dinaserver.com
cd ~/konsento && git pull            # remot = codeberg
set -a && source .env && set +a && .venv/bin/python manage.py migrate assemblees
```
Reiniciar gunicorn. `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` ja hi són (Telegram ja
funciona a producció). Provar: omplir el formulari del web un cop desplegat.
Editor revisa a `/ca/revisio/` i publica manual a "Activitats Residents" del CMS.

### Pendent — Capa B
Spec (2a versió, sobre el repo real): `docs/superpowers/specs/2026-09-01-capa-b-agenda-sync-design.md`. B1 (auto-publicació via JSON + GitHub Action, patró `fetch-territori.py`) dissenyat i llest per implementar. B2 (bostikià autenticat) només esbossat.

## 4. Model de persones (per revisar amb l'equip)

`docs/usuaris-i-grups.md` és una PROPOSTA. Cal reconciliar-la amb `rols.py`
de producció (5 grups reals) abans de donar-la per bona. Pregunta oberta:
mapar "editor de continguts web" i "equip de gestió" als grups existents
(`Control usuaris web`, `Personal de la Nau`).

## 5. Accés servidor

```
ssh naubostik@vl28359.dinaserver.com     # clau ed25519 de joan ja autoritzada
cd ~/konsento                             # remot = codeberg.org/linuxbcn/konsento
```

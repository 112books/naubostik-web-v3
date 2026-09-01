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

### Revertit (opció A, commit següent)
- L'`action=` dels formularis `/proposa-activitat/` i `/contacte/` apuntava a `konsento.naubostik.com/proposta-activitat/` i `/missatge-contacte/` → **no existeixen a producció, 404**. Tret l'`action` (tornen a enviar a la mateixa pàgina, noop, sense 404). Bàners + honeypot es queden (inerts).
- `hugo.toml`: `params.konsento_url` es manté (l'usarà la Capa A definitiva).

### Pendent — Capa A definitiva (fer al repo Codeberg)
Afegir a `assemblees/` (repo Codeberg) una vista pública tipus `fes_pregunta`:
- Endpoint p. ex. `/activitat-agenda/` (fora `i18n_patterns` o dins, decidir).
- Crea una `Peticio` amb un `Tipus` nou (p. ex. `ACTIVITAT_WEB`) o reutilitza `PROPOSTA` amb marca.
- Reutilitza `_spam_detectat` + `notifications.py` + `telegram.py` (ja avisen l'equip).
- Camps del formulari `/proposa-activitat/`: nom, email, entitat, titol, tipus, espai, data, hora, descripcio, observacions.
- Redirect amb `?enviat=1` / `?error=1` de tornada al web (validar `next` contra open-redirect; hosts permesos `112books.github.io`, `naubostik.com`).
- Un editor revisa a l'admin (`/revisio/` ja existeix) i publica manualment a "Activitats Residents" del CMS.
- Llavors: canviar l'`action` dels 2 formularis del web a l'endpoint real i redeploy.

### Pendent — Capa B
Spec a `docs/superpowers/specs/2026-09-01-capa-b-propostes-autenticades-design.md` (adaptar a l'arquitectura real de Codeberg: `Peticio`, no l'app `propostes`).

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

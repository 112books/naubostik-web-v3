# Usuaris i grups — Web + Konsento

**Estat:** PROPOSTA per revisar (2026-09-01). Un cop validat, aquest document
és la referència canònica del model de persones i permisos dels dos entorns
de Nau Bostik. La implementació tècnica a Konsento es descriu a
`konsento/docs/roles-i-permisos.md` (subsistema A).

---

## 1. Els dos entorns

| Entorn | Què és | URL | Auth |
|---|---|---|---|
| **Web pública** | Web de visita + CMS d'edició (Decap CMS) | `112books.github.io/naubostik-web-v3/` · `/admin/` | GitHub OAuth (worker Cloudflare) |
| **Konsento** | Eina de governança: assemblees, comissions, actes, acords | `konsento.naubostik.com` | Compte propi (email + contrasenya, Django) |

Són **dos sistemes separats amb comptes separats**. Una mateixa persona pot
tenir accés als dos, però amb credencials independents (a la web entra amb
GitHub; a Konsento amb email + contrasenya). El pont que unirà els dos
(subsistema B: els editors del web autenticats via Konsento) encara no està
fet.

---

## 2. Principis

- **Una persona, un compte** a cada entorn. Mai logins compartits, ni tan
  sols dins d'una entitat: cada persona té el seu.
- **Alta per invitació** (invite only) als dos entorns. Ningú s'auto-registra
  amb privilegis.
- **Rols per grup, no per persona.** Els permisos s'assignen afegint la
  persona a un grup, no configurant permisos individuals.
- **Mínim privilegi.** Es demana el rol més baix que permet fer la feina.

---

## 3. Taula mestra de rols

| Rol | Web | Konsento | Qui són | Qui el concedeix |
|---|---|---|---|---|
| **Superusuari** | Admin del repo GitHub | `is_superuser` | Joan (LinuxBCN) + 1 persona de back de Nau Bostik | Entre superusuaris |
| **Editor de continguts** | Col·laborador `Write` al repo | grup `editors_web` | Equip de gestió | Superusuari |
| **Equip de gestió** | — | grup `equip_gestio` | Equip de gestió (nucli operatiu) | Superusuari |
| **Bostikià** | Sense compte propi al web (formulari) | `User` normal, opcional `User.entitat` | Entitats i residents | Equip de gestió (aprova l'alta) |
| **Bostikià que pot enviar a l'agenda del web** | Pot proposar activitats a l'agenda d'entitats del web (formulari o, amb Capa B, contingut) — sempre pendent d'aprovació d'un editor | `User.pot_proposar_agenda = True` (el flag viu a Konsento però és un permís del **web**; a Konsento no és cap rol especial) | Bostikians autoritzats | Equip de gestió |
| **Responsable de comissió** | — | `Comissio.responsables` | Un o més bostikians per comissió | Equip de gestió (crea la comissió i nomena el 1r responsable) |
| **Membre de comissió** | — | `Comissio.membres` | Bostikians que hi participen | Responsable de la comissió |

---

## 4. Web pública — detall

### 4.1 Superusuari
Permís **Admin** al repo `112books/naubostik-web-v3`. Pot: configurar el CMS
(`static/admin/config.yml`), afegir i treure col·laboradors, gestionar les
fonts RSS del territori, tocar workflows i desplegament. Dues persones:
Joan + una de back.

### 4.2 Editor de continguts
Col·laborador amb rol **Write** al repo. Entra al CMS amb el seu compte
GitHub. Pot crear, editar i esborrar **tot** el contingut "normal":
activitats, activitats de residents, tallers, notícies, espais, col·lectius,
estat del recinte, slideshow, slogans, portada, equip.

Són **sempre persones de l'equip de gestió**.

També són qui **aprova i publica** les propostes d'activitat que arriben dels
bostikians (avui via formulari; en el futur via proposta autenticada).

> Nota: el backend GitHub de Decap **no** distingeix permisos per col·lecció.
> Qualsevol editor pot tocar qualsevol contingut. La separació
> "continguts normals" vs "configuració" és de fet la que hi ha entre
> **Write** (editor) i **Admin** (superusuari) al repo.

### 4.3 Bostikià (entitat o resident)
**No té compte al web.** És una entitat o un resident individual del recinte.
Pot pertànyer a una entitat o no (resident individual).

Interacció amb el web, avui:
1. Omple el formulari públic `/proposa-activitat/`.
2. La proposta arriba per correu a l'equip d'editors.
3. Un editor la revisa, la transcriu a "Activitats Residents" i la publica.

En el futur (subsistema C): el bostikià amb `pot_proposar_agenda` entra amb
el seu compte Konsento i la proposta va directa a la cua de revisió dels
editors, sense transcripció manual.

---

## 5. Konsento — detall

### 5.1 Superusuari (`is_superuser`)
Accés total, inclòs l'admin de Django. Mateixes dues persones que a la web.

### 5.2 Equip de gestió (grup `equip_gestio`)
Nucli operatiu de Nau Bostik. Pot administrar:
- **Assemblees**: convocar, editar, gestionar ordre del dia i actes.
- **Usuaris**: aprovar altes de bostikians, assignar `entitat`, activar
  `pot_proposar_agenda`.
- **Comissions**: crear-les, nomenar el primer responsable, arxivar-les.

No cal `is_superuser` per a res d'això.

### 5.3 Editor de continguts web (grup `editors_web`)
Grup que marca qui pot publicar al CMS del web públic. Avui és **informatiu**
(l'accés real al CMS el dona el rol Write a GitHub); quan el subsistema B
estigui fet, aquest grup serà el que autoritzi l'entrada al CMS via Konsento.

A la pràctica, les mateixes persones són a `equip_gestio` i a `editors_web`.

### 5.4 Bostikià (`User` normal)
Usuari amb compte a Konsento, opcionalment vinculat a una `Entitat`
(`User.entitat`). A Konsento **no hi ha subtipus de bostikià**: és un usuari
amb accés que pot o no ser membre o responsable d'una comissió. Pot:
- Apuntar-se a assemblees (RSVP) i consultar-ne actes i acords.
- Demanar pertànyer a una comissió.
- Accedir a l'espai de les comissions de què és membre.
- Interactuar amb altres bostikians (directori, comunicació interna).

`User.pot_proposar_agenda` (bool) es desa aquí però **és un permís del web**:
autoritza el bostikià a enviar activitats a l'agenda d'entitats del web
(avui pel formulari públic; amb Capa B, creant contingut directament). Sempre
pendent que un editor ho revisi i publiqui. L'activa l'equip de gestió i
només té sentit amb `entitat` assignada.

---

## 6. Comissions

- Cada comissió té **almenys un responsable** i pot tenir-ne **més d'un**
  (`Comissio.responsables`, M2M).
- El responsable és **sempre un bostikià**.
- El responsable gestiona la seva comissió: **dona i treu accés** als
  usuaris que ho sol·liciten (`Comissio.membres`), i gestiona fitxers,
  reunions i comunicació de la comissió.
- Els **membres** (`Comissio.membres`) veuen i interactuen només amb el
  contingut de les seves comissions.
- L'equip de gestió i els superusuaris tenen accés a **totes** les
  comissions sense ser-ne membres.

Flux d'alta d'una comissió:
1. L'equip de gestió crea la comissió i nomena el/s primer/s responsable/s.
2. A partir d'aquí, els responsables admeten membres a petició.

---

## 7. A qui es demana cada accés

| Vull... | Ho demano a... | Requisit previ |
|---|---|---|
| Ser editor del web | `webmaster@naubostik.com` (+ vist-i-plau de l'equip de gestió) | Compte GitHub gratuït · ser de l'equip de gestió |
| Ser superusuari (web o Konsento) | Un superusuari actual + acord de l'equip | Ser de l'equip de back |
| Compte de bostikià a Konsento | Equip de gestió de Nau Bostik | Ser entitat o resident del recinte |
| Poder proposar activitats a l'agenda | Equip de gestió | Tenir compte de bostikià amb entitat |
| Entrar en una comissió | El responsable d'aquella comissió | Tenir compte de bostikià |
| Crear una comissió nova | Equip de gestió | — |

---

## 8. Estat d'implementació (2026-09-01)

| Peça | Estat |
|---|---|
| Konsento: model `Entitat`, `User.entitat`, `User.pot_proposar_agenda` | ✅ Fet (migració 0003) |
| Konsento: grups `editors_web`, `equip_gestio` (`crea_grups_inicials`) | ✅ Fet (falta executar al servidor) |
| Konsento: helpers `is_editor_web`, `is_equip_gestio`, `es_membre_comissio()` | ✅ Fet |
| Konsento: login / logout / recuperació de contrasenya | ✅ Fet (falta contrasenya SMTP al servidor) |
| Konsento: `Comissio.membres` / `.responsables` | ✅ Ja existia |
| Konsento: vistes de bostikià (auto-alta a assemblees, demanar comissió) | ❌ Pendent (subsistema C) |
| Web: alta d'editors via col·laboradors GitHub | ✅ Funciona |
| Web: pont d'auth CMS ↔ Konsento (`is_editor_web`) | ❌ Pendent (subsistema B) |
| Web: formulari proposta/contacte → Konsento + avís email/Telegram (Capa A) | ✅ Fet (app `propostes`; falta `.env` + bot al servidor) |
| Web: proposta d'activitat autenticada que crea contingut (Capa B) | ❌ Pendent — spec a `docs/superpowers/specs/2026-09-01-capa-b-*` |

---

## 9. Mapatge tècnic ràpid

```
SUPERUSUARI
  web       → GitHub: repo role = Admin
  konsento  → User.is_superuser = True

EDITOR DE CONTINGUTS
  web       → GitHub: repo role = Write (col·laborador)
  konsento  → Group "editors_web"

EQUIP DE GESTIÓ
  konsento  → Group "equip_gestio"

BOSTIKIÀ
  konsento  → User (sense grup), User.entitat = FK opcional a Entitat
  agenda    → User.pot_proposar_agenda = True

COMISSIÓ
  responsable → Comissio.responsables (M2M, ≥1)
  membre      → Comissio.membres (M2M)
```

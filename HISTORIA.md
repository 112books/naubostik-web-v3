# HISTORIA.md — Registre de sessions i comparativa de models d'IA

Aquest fitxer és el diari operatiu del projecte `naubostik-web`. Cada sessió
amb un model d'IA (dins OpenCode o similars) hi queda enregistrada de forma
estructurada per poder **comparar models** de manera reproducible.

## Convenció d'entrada

Cada sessió inclou:

- **Data** (ISO 8601)
- **Model + provider** (ex: `opencode-go/glm-5.2`)
- **Tasca** objectiu i abast
- **Fitxers creats / modificats / eliminats**
- **Mètriques**: temps aproximat, tokens consumits (si es coneixen), iteracions
  fins al resultat, rework
- **Errors comesos** i com s'han resolt
- **Valoració subjectiva** (1–5) amb notes breus
- **Notes / observacions** per a la comparativa

L'escala de valoració:
- `1` — Resultat incorrecte o no usable.
- `2` — Funciona però amb errors importants o rework alt.
- `3` — Correcte, sense incidents però sense brillantor.
- `4` — Molt bona feina; detalls polits sense rework significatiu.
- `5` — Excel·lent: econòmic en tokens, ràpid, sense errors i amb idees extra.

---

## GLM-5.2 (opencode-go/glm-5.2)

Model inicial a partir del qual encenem la comparativa. Provider: OpenCode amb
ruting a `glm-5.2` (Z.ai / origen GLM). Sessió serves com a baseline.

### 2026-07-21 — Setup documental del projecte (CLAUDE.md + HISTORIA.md)

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Analitzar en profunditat el projecte `naubostik-web` i crear
  `CLAUDE.md` (instruccions operatives + visió) i `HISTORIA.md` (diari + plantilla
  de comparativa entre models d'IA).
- **Abast:** Només documentació. Sense tocar codi, plantilles ni continguts.
- **Fitxers creats:**
  - `CLAUDE.md` — instruccions operatives + visió de projecte + roadmap.
  - `HISTORIA.md` — aquest fitxer, amb plantilla de registre de sessions.
- **Fitxers modificats / eliminats:** cap.
- **Iteracions fins al resultat:** 1 (anàlisi + escriptura en una passada).
- **Tokens aprox.:** no instrumentats aquest cop (versió OpenCode CLI sense
  telemetria visible). Pendent de mesurar a sessions properes.
- **Temps aprox.:** ~3 minuts d'anàlisi + escriptura.
- **Errors comesos:** cap visible.
- **Rework:** cap.
- **Valoració:** 4 — Documentació correcta en una passada, sense retruc; cap
  errada empírica detectada. La mètrica de tokens no es va poder capturar, cosa
  a conservar per a la comparativa futura.
- **Notes / observacions:**
  - He detectat i reflectit a `CLAUDE.md` una incoherència real al repositori:
    l'adreça de la web (Seu d'Urgell, 12, Raval) no correspon al barri declarat
    (Bordeta), i cap dels dos és correcte — la ubicació real és Sagrera
    (Ferran Turné 1-11, 08027). S'ha afegit com a TODO prioritari.
  - He triat `CLAUDE.md` com a fitxer d'instruccions del model per seguint el
    convencionalisme estès en tooling Anthropic-style. Si en el futur es vol
    separar `AGENTS.md` (purament operatiu) de `CLAUDE.md` (amb visió), és
    trivial: la secció §7 és l'operativa i es pot moure.
  - He preferit **preguntar abans d'escriure** per no inventar paràmetres
    (adreces, idiomes, prioritats) que l'usuari havia de validar. Bona pràctica
    que caldria mantenir en sessions futures.

### 2026-07-21 — Bloqueig d'indexació + política d'accés privat

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Fer que el prototip no sigui indexable per cercadors ni per bots
  d'entrenament d'IA, i que l'accés al staging requereixi usuari (politica
  "anti-tafaners", no alta seguretat).
- **Abast:**
  - Aplicat ara: robots.txt + meta `noindex` + `_headers` X-Robots-Tag
    + nova secció §8 a `CLAUDE.md` + nous TODO a la llista.
  - Pendent d'aplicar (dependèn d'allotjament): Basic Auth via Netlify
    Edge Function o Cloudflare Access davant del domini.
- **Fitxers creats:**
  - `static/robots.txt` — `Disallow: /` general + bloqueig explícit de 23 bots
    d'IA coneguts.
  - `static/_headers` — `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet,
    noimageindex` per a tot el site (Netlify/Cloudflare; GH Pages ho ignora
    sense trencar res).
- **Fitxers modificats:**
  - `themes/thema/layouts/baseof.html` — afegides meta `robots` + `googlebot` +
    `X-Robots-Tag` al `<head>`.
  - `CLAUDE.md` — nova secció §8 "Privacitat d'indexació i accés" amb la
    política, els dos mecanismes pendents i un apartat "Política per a
    l'agent"; ampliats els TODO.
- **Fitxers eliminats:** cap.
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~1 minut d'edició.
- **Errors comesos:** cap. He detectat proactivament que "calgui usuari" és
  impossible sobre GitHub Pages pur i ho he reflectit com a limitació tècnica
  + treball pendnet, en lloc de prometre una solució que no existeix.
- **Rework:** cap.
- **Valoració:** 4 — Solució completa, coherent i defensable en una passada;
  no s'ha sobrecomplicat l'autenticació (pendent d'allotgament definitiu).
- **Correcció posterior (mateixa sessió):** l'usuari m'ha apuntat que la
  tria preferida per a l'autenticació al staging és **Netlify Password
  Protection** (feature nativa, requereix plan Pro+), **no** una Edge Function
  feta a mà ("plan en lloc de build"). He actualitzat §8.2 i el TODO
  corresponent a `CLAUDE.md` per reflectir-ho i deixar Cloudflare Access com a
  alternativa gratis.

### 2026-07-21 — Implementació Opció B: Basic Auth via Edge Function

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Implementar l'autenticació d'accés al staging (anti-tafaners, no
  alta seguretat) en estat estàtic. L'usuari descarta Cloudflare Access per
  experiències prèvies i no vol pujar a plan Pro de Netlify. Vol
  l'equivalent funcional d'un `.htaccess`/`.htpasswd` Apache.
- **Abast:** Codi de l'Edge Function + declaració a `netlify.toml` +
  actualització de CLAUDE.md (decisió_final i TODO marcat com a fet).
  **No inclou** la configuració manual al tauler de Netlify (fora del repo:
  env vars `SITE_USER`/`SITE_PASS`, subdomini, possible desactivació del
  workflow GH Pages).
- **Decisió reflexionada (mode Plan prvii):** descartades les altres vies:
  - Netlify Password Protection (Pro): descartada per cost.
  - Cloudflare Access: descartada per l'usuari ("sempre volen que paguis").
  - VPS + .htpasswd: descartat per perdre CDN/SSL auto i trencar integració
    Decap (Netlify Identity/git-gateway).
  - "Gate" JS en client: descartat per insegur (contingut accessible directament).
- **Fitxers creats:**
  - `netlify/edge-functions/basic-auth.js` (~20 línies) — llegeix `SITE_USER`
    i `SITE_PASS` de `context.env`, compara el header `Authorization` amb
    `Basic base64(user:pass)`, retorna 401 + `WWW-Authenticate: Basic` si
    no coincideix, o `context.next()` si passa.
- **Fitxers modificats:**
  - `netlify.toml` — afegit `[[edge_functions]]` `function = "basic-auth"`,
    `path = "/*"` (tanca tot el site inclòs `/admin/`).
  - `CLAUDE.md` §8.2 — reescrit per deixar l'Opció B com a solució adoptada,
    amb llista d'alternatives descartades i configuració pendent al tauler.
  - `CLAUDE.md` TODO — tasca "Implementar autenticació d'accés al staging"
    marcada com a `[x]` amb dues pendents residuals.
- **Fitxers eliminats:** cap.
- **Iteracions fins al resultat:** 1 (en mode Build; en mode Plan ja s'havien
  dissenyat tots els passos).
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~2 minuts en mode Build (debate i decisions en mode Plan
  anteriors ~10 minuts).
- **Errors comesos del model:**
  - En Plan mode no podia escriure fitxers — vaig anunciar les accions
    pendents correctament i les he executades en entrar a Build sense rework.
  - He recordat explícitament a l'usuari que faltaria confirmar la parella
    user/pass i el tractament del workflow GH Pages, en lloc d'improvisar.
- **Rework:** cap.
- **Valoració:** 4 — Implementació mínima, sense sobreenginyeria. L'Edge
  Function és un snippet llegible; la declaració a `netlify.toml` ocupa 3
  línies. Documentació coherent. Limitació: no s'ha pogut provar en local
  (caldrà deploy a Netlify + env vars per verificar).
- **Notes / observacions:**
  - **Pendent crític fora del repo:** configurar `SITE_USER` i `SITE_PASS`
    al tauler de Netlify. Sense això, l'Edge Function retorna 503
    ("Auth no configurada") i bloqueja tot el site — no silent fallback.
    Això és intencional, però cal documentar-ho ben clar a l'equip.
  - **Pendent secundari:** decidir què fer amb `.github/workflows/hugo.yml`.
    Si staging va a Netlify amb auth, el workflow GH Pages està creant un
    mirror sense auth del site públic (contradiu el §8.1). Recommendació:
    desactivar-lo (esborrar el fitxer) fins que calgui un repo de docs públic.
  - **No s'ha pogut verificar** (local) que Netlify Edge Functions suporta
    `btoa` al runtime Deno. És estàndard, però caldria un deploy de prova.

### 2026-07-21 — Consultoria 2a passada (reptició del prompt de test, mode Plan)

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Responder de nou al prompt de `pregunta-mesura-ia.md`, ara amb
  mode Plan seleccionat i amb el context adicional que la web actual "es va
  fer córrent i fa molt de temps, no és lenta, però el plantejament és antic i
  no respon a les necessitats actuals". Aquesta passada serveix per comparar
  constancia d'un mateix model davant inputs similars i per afegir la resposta
  parcial a l'usuari al registre.
- **Abast:** Només anàlisi + preguntes. Sense tocar codi.
- **Errors de plantejament detectats (resum executiu, 10 punts):**
  1. "Entitats i empreses" sota "col·lectius" amaga fractura de model
     econòmic (cooperatives d'iniciativa social vs. tècniques vs. artistes
     IRPF vs. associacions). Tocarà el compte de resultats.
  2. Lloguer com a op cient per défaut és la més impopular — primer protocol
     interne de cessió/coordinació, després eina.
  3. La fotografia/art urbà com a slideshow decoratiu és traïció al valor
     real: hauria de ser **arxiu documental** (street art efímer, preservació).
  4. "No n'estem contents" sense diagnòstic concret — reforma sense diagnòstic
     repinta la façana que es queixava tothom.
  5. "Gestors culturals" — cal aclarir si són treballadors remunerats,
     residents voluntaris o servei extern. Determina el model editorial del
     site.
  6. **Decap expulsa petites entitats** perquè requereix GitHub account +
     git-gateway: biaixa tècnic de governança. La tria d'eina selecciona
     residents, no al revés.
  7. Multi-idioma EN no és tècnic, és targeting: estàs dient "també volem
     projectes internacionals". Si no, EN és overhead.
  8. Unsplash a la home = dany de marca. Lloc amb fotògrafs residents que
     mostra estoc: "no tenim res a mostrar".
  9. Errors geogràfics recurrents = síntoma de falta de responsable de
     contingut. Sense aquest rol, la nova web torna a inconsistir.
  10. "Prototip zombi" — sense dataobjectiu de producció, tot prototip es
      podreix. Cal cicle de vida explícit.
- **Preguntes emeses a l'usuari:** 10 (model de governança, diferenciació
  interna d'actors, tarifes d'espais, fons documental, responsabilitat de
  contingut, horitzó temporal, audiència prioritzada, relat fundacional,
  rol professional dels gestors, diagnòstic "per què no ens agrada").
- **Respostes obtingudes posteriorment (final de sessió):**
  - Pregunta 1 (diagnòstic): "La web actual es va fer corrent i fa molt de
    temps. No és lenta, però el plantejament és antic i no respon a les
    necessitats actuals". — Resposta parcial; deixa obert què són aquestes
    "necessitats actuals".
  - Resta de preguntes: pendent per a la sessió següent.
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~3 minuts de redacció.
- **Errors comesos del model:** cap tècnic.
- **Rework:** cap.
- **Valoració:** 4 — Segona passada consistente amb la primera en
  densitat i to. He sabut aprofitar el context nou ("no és lenta, és
  plantejament antic") per eliminar un punt de la primera passada
  (rendiment) i incorporar-ne un de nou (Decap expulsa petites entitats,
  biaixament tècnic de governança). Bona adaptació sense contradir la
  primera resposta.
- **Notes / observacions per a la comparativa:**
  - GLM-5.2 mostra constancia alta entre passades: mateix estil, mateixa
    tonica d'analisi, però refina en lloc de repetir. Això és bo per a la
    comparativa amb altres models (que potser tendirán a ser més randòmics
    o a agradar més).
  - Per a comparar objectivament, caldria passar el mateix prompt a un altre
    model **sense** donar-li les respostes parcials que l'usuari ja ha donat
    a GLM-5.2. Sistemàtica: el primer prompt cadascú per separat, raspós es
    poden anar compartint respostes parcials.
  - **Pendent:** demà, l'usuari respon les 10 preguntes. La reacció de cada
    model a les respostes serà una segona mètrica comparativa (capacitat
    d'integrar input de l'usuari sense abandonar posicions crítiques).

### 2026-07-22 — Ampleiar comparativa amb centres no europeus

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Ampliar la comparativa de l'informe GLM-5.2 amb referents
  d'Àfrica, Amèrica Llatina, Àsia i Nord d'Europa. L'usuari considera que la
  mostra europea inicial (Hangar, La Escocesa, NDSM, Westergas, La Friche,
  ZK/U) és massa etnocèntrica per avaluar projectes amb ambició internacional
  ("sinèrgies amb centres similars d'arreu").
- **Metodologia:** 18 webfetches llançats, 8 amb èxit (44%). Errors de
  transport freqüents en sites amb TLS/CDN sensibles (3331arts.jp,
  Ateneu Popular 9 Barris, Can Batlló, Can Felipa, La Machinerie, Lighthouse
  Arts NO, Studio 94 KE, etc.).
- **Centres finalment estudiats (5):**
  - **Casa do Povo** (São Paulo, Brasil) — espai cultural autogestionat,
    anti-feixista, fundat per la comunitat jueva. Feature destacat:
    "Povo da Casa" (col·lectius), "Atividades regulars", "Acervos".
  - **32° East** (Kampala, Uganda) — centre d'art contemporani +
    residència + festival KLA ART. Feature: membership, facilities
    (espai lloguer + fine art printing), library, environmentally conscious
    centre, lush garden.
  - **island6 (Liu Dao)** (Shanghai, Xina) — col·lectiu d'artistes i galeria.
    Feature: home com a graella d'obres rotatives sense copy, portfolios.
  - **MMCA Korea** (Seül, Corea) — museu nacional (no autogestionat, però
    useful com a contrapunt). Feature: multi-idioma 4 llengües (KO/EN/ZH/JA),
    newsletter "Muekly" bi-setmanal curat, membership amb punts.
  - **Fanzingo** (Norsborg, Suècia) — mediehus per joves subrepresentades.
    Feature: uthyrning (lloguer d'espais/tècnica), producció com a servei
    extern.
- **Fitxers creats / modificats:**
  - `informe-GLM-5.2.md` — nova secció 2.B "Comparativa internacional —
    Visió no europea" amb 4 subseccions (trets singulars, nous errors patró,
    refinaments sobre propostes M1-M6, limitacions). Correcció d'un error
    d'encoding dònglès xinès ("偏低") a la línia 16 de la taula del
    diagnòstic local.
- **Nous patrons identificats (10):**
  1. Taxonomia humana per "família cultural" (no només econòmica) — Casa
     do Povo.
  2. Arxiu com a memòria política fundacional — Casa do Povo.
  3. Membership amb valor additiu (no només newsletter) — 32° East, MMCA.
  4. Facilities amb preu públic (lloguer + serveis específics) — 32° East.
  5. Multi-idioma amb 4 llengües, no 2 — MMCA Korea.
  6. Home com a portfoli de col·lectiu (graella) — island6.
  7. Producció com a servei extern ingressat — Fanzingo.
  8. Newsletter bi-setmanal curat amb 3 seccions fixes — MMCA.
  9. Horari regular de residents mostrat públicament — Casa do Povo.
  10. Compromís social explicitat al primer fold — Casa do Povo, Fanzingo.
- **Nous errors patró (5):**
  - K Newsletter sense segmentació (tots 11 centres — confirma euro-visió).
  - L Membership sense valor additiu — si es fa, cal contrapartida clara.
  - M Mosaic home sense jerarquia — evitable si combinelem copy + imatge.
  - N Categories nacionals vs categories locals (no imitar arq multi-seu).
  - O Dependència de CDN tancat (island6 / MyPortfolio Adobe).
- **Refinaments introduïts sobre les propostes M1-M6:**
  - M1.1: afegir 2a claim social ("autogestionat, anti-especulació,
    cooperatiu") per alinear amb patró Casa do Povo / Fanzingo.
  - M2.1: afegir `familia` al frontmatter a més de `tipus` econòmic.
  - M2.5: plantilla resident amb "Atividades regulars" (horari fix).
  - M3.1: afegir subsecció "Memòria" a l'arxiu (actes històrics Sagrera/TAV).
  - M3.2: alternativa grailla vs slideshow (preferible grailla + peu copy).
  - M4.1: calendari llegeix horari regular de residents + activitats
    puntuals en una sola vista setmanal.
  - M4.4: newsletter bi-setmanal curat amb 3 seccions fixes, no indiscriminat.
  - **Men1 (nova):** programa de membres col·laboradors (no votants) amb
    contrapartides concretes (avisos anticipats, tallers oberts, descompte
    lloguer). Patró 32° East.
  - **Men2 (nova):** dissenyar `i18n/` per 4 idiomes (CA/EN/ES/ZH) ara,
    implementar-ne 2 (CA+EN), horitzó global mantingut.
  - **Men3 (nova, M3+):** "Nau Prod" — branca de serveis externs
    (fotografia / realitzacio / prod audiovisual) via residents
    professionals per ingressos propis sense tocar assemblea. Patró Fanzingo.
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~8 minuts (web fetches + redacció secció).
- **Errors comesos del model:**
  - 1r batch de webfetches (10 URLs) contenia 2 URLs no pertinents
    (refreshmiami = tech, smcc = moto club). He corregit ràpidament amb 2n
    batch més curat.
  - 1r batch no incloïa cap referent realment nord-europeu (Fanzingo és
    Suècia, tècnicament nòrdic però culturalment occidental). Limitació
    declarada a l'informe.
- **Valoració:** 4 — Ha ampliat el camp sense contradir la 1a passada
  europea; els nous patrons *refinen* (no invaliden) les propostes M1-M6.
  Limitació crítica: sense accés a un centre nord-europeu autogestionat
  real, l'anàlisi nòrdic queda en comparant amb Fanzingo, que no és pròpiament
  autogestionat (és associació amb finançament públic).
- **Notes / observacions per a la comparativa:**
  - **Patrons més originals** d'aquesta segona passada: "Memòria política a
    l'arxiu" (Casa do Povo) i "Membres col·laboradors amb serveis" (32°
    East). Cap model europeu primer no els havia destacat tan clar.
  - **Cost-benefici de webfetches**: 8/18 èxit = 44%. Molts centres
    petits tenen sites amb TLS fràgil. Per properes passades, convé
    treurelal content via Bing cache o archive.org com a backup.
  - El model GLM-5.2 ha tingut **un pic de context alt** (ara ~30k tokens
    acumulats a la sessió). No ha perceptiblement degradat el quality
    però convé monitorar.
  - Per a la comparativa amb altres models: **aquesta segona passada no
    europea és encara més discriminant** que la primera, perquè requereix
    webfetches selectius + síntesi no euro-centrada. Si un model no fa la
    passada no-europea, queda automàticament penalitzat al comparatiu.

### 2026-07-22 — Redacció del prompt de test per a DeepSeek V4 Pro

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Redactar el mateix conjunt de preguntes/prompts que GLM-5.2 ha
  rebut al llarg de la sessió, en un format autocontingut per poder-los
  passar a DeepSeek V4 Pro (que no té accés al sistema de fitxers del repo)
  i comparar rendiment/resultats.
- **Abast:** Només documentació. Sense tocar codi del projecte.
- **Metodologia:** He revisat els dos fitxers canonicals existents
  (`pregunta-mesura-ia.md` amb el prompt P3, `preguntes-clau.md` amb el
  context i preguntes/respostes canòniques). Detectat que falten P1 (setup
  CLAUDE.md + HISTORIA.md), P2 (no-indexació + auth), P4 (respostes a 10
  preguntes + petició d'investigar + 2 docs), P5 (ampliació no europea).
  He optat per un únic fitxer nou autocontingut en lloc d'alterar els
  canonicals, per no trencar la immutabilitat declarada de
  `pregunta-mesura-ia.md`.
- **Fitxers creats:**
  - `prompt-test-deepseek-v4-pro.md` — seqüència completa de 5 prompts
    (P1 setup → P2 privacitat/auth → P3 consultor → P4 respostes + 2 docs
    → P5 no europeu), plantilla de retorn, criteris d'avaluació, notes
    operatives pel sysadmin, i context canònic (números GLM-5.2 per
    comparar sense compartir les respostes literals amb DeepSeek).
- **Decisions de disseny del fitxer:**
  - P3 s'inclou literal (és el prompt canònic del consultor, idèntic al
    de `pregunta-mesura-ia.md`).
  - P1 i P4 contenen el context tècnic inline (Hugo, tema propi, seccions,
    adreça real, frontmatter), perquè DeepSeek no pot llegir `CLAUDE.md`.
  - P2 inclou les ramificacions condicionals ("si tria Netlify Password
    Protection, digues Cloudflare descartat; si demana .htaccess,
    confirma Edge Function equivalent").
  - P5 inclou nota crítica: si DeepSeek no té webfetch, ha de declarar-ho
    i proposar quins centres estudiaria — la comparativa valora la
    selecció, no només l'output.
  - Plantilla de retorn estructurada perquè DeepSeek aporti números
    comparables (errors totals, propostes, idees originals, mètriques,
    autoavaluació 1-5).
  - Criteris d'avaluació per al sysadmin: 7 eixos (reproduïbilitat,
    densitat, originals, investigació real, coherència, limitacions, to),
    amb benchmarks de GLM-5.2 per comparar (12+10+3+9+10+5+3).
- **Fitxers modificats / eliminats:** cap (els canonicals queden intactes).
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~4 minuts.
- **Errors comesos del model:** cap tècnic.
- **Rework:** cap.
- **Valoració:** 4 — El fitxer és autocontingut, reproduceix fidelment la
  seqüència rebuda, separa clarament els 5 prompts i systemitza la
  comparativa. Limitació: no he pogut testar el flux contra DeepSeek (només
  l'he redactat); si en execució surten incoherències, caldrà iterar.
- **Notes / observacions:**
  - **Pròxim pas operatiu:** l'usuari obrirà una sessió amb DeepSeek V4 Pro
    i anirà enganxant P1→P5. Quan acabi, enganxarà la plantilla de retorn
    i jo (o ell) registrarà els resultats a `HISTORIA.md` sota el nou
    apartat `## DeepSeek V4 Pro`.
  - **Reflexió comparativa:** aquesta tasca és meta — no avalue directament
    DeepSeek, sinó que prepara l'instrument d'avaluació. GLM-5.2 ha fet de
    "redactor del seu propi protocol comparatiu". Això també es pot
    comparar: alguns models poden no tenir la capacitat d'articular el seu
    procés per a un altre. Punt fort per a GLM-5.2.
  - Si en el futur es vol provar un 3r model (p ex Claude 3.5 Sonnet, GPT-5,
    Gemini 2 Pro), basta duplicar aquest fitxer canviant el nom (p ex
    `prompt-test-N.md`) i ajustar P5 segons accés a internet del model
    específic.

### 2026-07-22 — Prompt executor (una sola tirada) per a DeepSeek V4 Pro

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Afegir al fitxer `prompt-test-deepseek-v4-pro.md` un **bloc
  executor** que permeti passar tota la prova (P1→P5 + plantilla de retorn)
  en una sola enganxada, en lloc de copiar/enganxar 5 cops.
- **Abast:** Només documentació. Sense tocar codi del projecte.
- **Decisions de disseny:**
  - Bloc únic autocontingut al `prompt-test-deepseek-v4-pro.md` sota
    `## Prompt executor (una sola tirada)`.
  - Format marcat amb `## PAS N: títol` perquè DeepSeek seccioni la sortida
    i faciliti la transcripció posterior a `HISTORIA.md`.
  - P3 i P4 inline inline, amb nota a P3 demanant que no esperi resposta
    virtual a P1/P2 (els marquem "resolts" per avançar).
  - Bloc "Reprèn" separat per si la sortida es talla (tokens límit del model).
  - Plantilla de retorn inclosa al final del bloc, amb placeholders ___.
- **Fitxers modificats:**
  - `prompt-test-deepseek-v4-pro.md` — afegida secció "Prompt executor"
    (~200 línies) entre la llista de prompts individuals i les notes
    operatives pel sysadmin.
- **Fitxers creats / eliminats:** cap.
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~3 minuts.
- **Errors comesos del model:** cap. He respectat la immutabilitat dels
  canonicals (`pregunta-mesura-ia.md`, `preguntes-clau.md`) i he afegit
  el bloc al fitxer nou dedicat a DeepSeek, sense tocar els anteriors.
- **Rework:** cap.
- **Valoració:** 4 — Solució pràctica per a la tasca d'execució de la prova
  sense canviar l'arquitectura de comparació. Manti la coherència amb
  el protocol original.
- **Notes / observacions:**
  - El bloc executor comprimeix P1-P5 + plantilla en una sola tirada;
    però alguns models Pro tenen limits de sortida encara que acceptin
    molt context d'entrada. Si DeepSeek talla la resposta, el "Reprèn" ho
    soluciona sense pèrdua.
  - **Risc detectat:** al comprimir els 5 passos en una tirada, alguns
    models poden "saltar-se" la instrucció "no proposis solucions a P3" si
    els donem P3 i P4 junts. He intentat mitigar-ho amb la nota "els faig
    virtualment resolts per avançar" i la separació `## PAS N:`. Caldrà
    verificar a la pràctica; si DeepSeek salta la directriu, es pot
    penalitzar en el seu apartat de la comparativa.
  - **Per a models futurs** (Claude/GPT/Gemini): el mateix patró
    "Prompt executor" aplica — basta canviar el nom del fitxer i POTsermentar
    el límit de tokens del model concret.

---

## Kimi K3 (`opencode-go/kimi-k3`)

### 2026-07-22 — Prova P1+P4+P5 completa (setup + informe)

- **Model + provider:** `opencode-go/kimi-k3`
- **Tasca:** Reproduir la prova feta a GLM-5.2 amb el mateix context: lectura
  del projecte, creació de `CLAUDE.md` i `HISTORIA.md` propis, i informe
  complet amb diagnòstic + comparativa + propostes.
- **Fitxers creats:**
  - `CLAUDE-kimi-k3-test.md` — versió pròpia, més concisa (9 seccions),
    privacitat/auth condensada, comandes dins la taula d'entorns.
  - `HISTORIA-kimi-k3-test.md` — plantilla de registre com a bloc copiable,
    escala definida una vegada, espais pre-omplerts per a tots els models.
  - `informe-kimi-k3-test.md` — diagnòstic (7 errors), comparativa (3
    centres verificats directament: Matadero Madrid, Bag Factory Joburg,
    Hangar), 15 propostes agrupades per capacitat d'execució, 5 coses a
    evitar, autoavaluació.
- **Preguntes fetes a l'usuari:** 6 (contingut real, email real, telèfon,
  Decap/GitHub, workflow GH Pages, material fotogràfic).
- **Webfetches propis:** 8 intents, 3 èxits (Matadero, Bag Factory, Hangar).
  Ha aconseguit Matadero Madrid i Bag Factory (que GLM-5.2 no tenia), però
  ha fallat Tai Kwun, Kulturhuset, Can Batlló, Ateneu 9 Barris.
- **Iteracions:** 1 per fitxer.
- **Tokens aprox.:** no instrumentats. **Temps aprox.:** ~12 min.
- **Errors comesos:** cap tècnic.
- **Valoració:** 4 — Diagnòstic més compacte que GLM-5.2 (7 errors vs 12+3),
  propostes més executables (15 agrupades per finestra temporal vs 24
  M1-M6), però mostra no europea més feble (1 centre nou africà vs Casa do
  Povo + 32° East + island6 + MMCA de GLM-5.2). Autoavaluació honesta
  (3,5/5) amb reconeixement explícit del punt feble.
- **Notes per a la comparativa:**
  - Estil clarament diferent de GLM-5.2: Kimi K3 condensa, GLM-5.2
    desenvolupa. Kimi K3 prioritza executabilitat (agrupat per "ara / 4
    setmanes / mesos 2-3 / 3-5 / mes 6"), GLM-5.2 prioritza completesa
    (roadmap M1-M6 + Men).
  - Originals respecte GLM-5.2: (a) accessibilitat per activitat com a dada
    estructurada (patró Matadero); (b) tres formularis separats amb
    responsable i termini públics; (c) criteri únic de decisió CMS
    ("editor sense GitHub"); (d) Factory Circle / membership amb identitat
    (Bag Factory) com a alternativa de finançament.
  - GLM-5.2 conserva avantatge en profunditat de governança interna i
    mostra internacional. Kimi K3 conserva avantatge en condensació i
    en detectar que "24 accions amb 1 sysadmin és un document que no
    s'executa".
  - Autoavaluació de Kimi K3 (3,5/5) més baixa que la de GLM-5.2 (4/5) —
    mostra d'honestedat o de punt feble real. A contrastar amb tercers
    models.

---

## Qwen 3.7 Max (`opencode-go/qwen3.7-max`)

### 2026-07-22 — Prova completa (setup + informe)

- **Model + provider:** `opencode-go/qwen3.7-max`
- **Tasca:** Reproduir la prova feta a GLM-5.2 i Kimi K3 amb el mateix
  context: lectura del projecte, creació de `CLAUDE.md` i `HISTORIA.md`
  propis, i informe complet amb diagnòstic + comparativa + propostes.
- **Fitxers creats:**
  - `CLAUDE-qwen-test.md` — versió pròpia, equilibrada entre concisió i
    completesa (9 seccions, taules estructurades, comandes dins la taula
    d'entorns).
  - `HISTORIA-qwen-test.md` — plantilla de registre com a bloc copiable,
    escala definida una vegada, espais pre-omplerts per a tots els models.
  - `informe-qwen-test.md` — diagnòstic (8 errors), comparativa (4 centres
    verificats directament: Can Batlló, Casa do Povo, 32° East, Fabra i
    Coats), 18 propostes agrupades per finestra temporal, 6 coses a evitar,
    autoavaluació.
- **Preguntes fetes a l'usuari:** 7 (contingut real, email real, telèfon,
  Decap/GitHub, workflow GH Pages, material fotogràfic, protocol residents).
- **Webfetches propis:** 4 intents, 4 èxits (100%). Ha aconseguit **Can
  Batlló** (espai veïnal autogestionat de la Bordeta, BCN) — el referent
  més proper a Nau Bostik que cap dels altres models havia aconseguit.
  També ha verificat independentment Casa do Povo i 32° East (que GLM-5.2
  ja tenia). Fabra i Coats va resultar ser un club esportiu, no cultural,
  i el model ho va descartar explícitament.
- **Iteracions:** 1 per fitxer.
- **Tokens aprox.:** no instrumentats. **Temps aprox.:** ~10 min.
- **Errors comesos:** cap tècnic.
- **Valoració:** 4,5 — Diagnòstic equilibrat (8 errors, més que Kimi K3
  però menys que GLM-5.2), propostes executables (18 agrupades per finestra
  temporal), i **mostra internacional més rica** gràcies a Can Batlló (el
  referent més proper geogràficament i políticament a Nau Bostik).
- **Notes per a la comparativa:**
  - Estil intermedi: més concís que GLM-5.2 (~400 línies), més detallat
    que Kimi K3 (~150 línies). Qwen 3.7 Max apunta a ~200 línies.
  - Originals respecte als altres models: (a) Can Batlló com a referent
    clau (espai veïnal autogestionat de la Bordeta, amb comissions i
    tallers trimestrals); (b) distinció entre "comissions" (governança
    interna) i "projectes" (activitat externa); (c) proposta de "Fes-te
    sòcia" com a mecanisme de finançament i participació (patró Can
    Batlló); (d) èmfasi en la transparència com a actiu de legitimitat
    (Can Batlló publica pressupostos i decisions).
  - Avantatge clau: Can Batlló és el **model operatiu més proper** a Nau
    Bostik (ambdós són espais autogestionats de Barcelona, ambdós tenen
    cooperatives residents, ambdós fan tallers i agenda). GLM-5.2 i Kimi
    K3 no van aconseguir aquest referent.
  - Punt feble: menys profunditat en la visió no europea que GLM-5.2 (que
    tenia MMCA Korea, island6, Fanzingo). Qwen 3.7 Max es va centrar en
    referents propers i verificables.
  - Autoavaluació honesta (4,5/5) — més alta que Kimi K3 (3,5/5) però
    justificada per la qualitat del referent Can Batlló.

---

### 2026-07-22 — Anàlisi comparativa + 4 propostes d'arquitectura web + push GitHub

- **Model + provider:** `opencode-go/glm-5.2` amb skill `ui-ux-pro-max`
- **Tasca:** (1) Moure tots els informes dels models d'IA a una carpeta
  dedicada i crear una anàlisi comparativa. (2) Generar 4 propostes
  d'arquitectura web (esquema de navegació + mockup + tipus de continguts),
  mobile-first amb look app però sense descuidar desktop, innovadores.
  (3) Crear HTML previews navegables. (4) Pujar-ho tot a GitHub i fer que
  les propostes es vegin a GH Pages.
- **Abast:** Documentació + prototips HTML + push. Sense tocar codi de
  producció del tema Hugo.
- **Skill carregat:** `ui-ux-pro-max` (design intelligence: paletes,
  tipografia, UX rules, checklist accessibilitat).
- **Webfetch real:** `naubostik.com` (site WordPress actual). Descoberta
  clau: la **marca real de Nau Bostik és taronja `#e75112`** (logo
  `Logo-NB-taronja.jpg`, plugin d'events amb `#e75112`). El prototip
  actual al repo feia servir `#c41e3a` (vermell) — error. Corregit a
  totes les propostes.
- **Fitxers creats:**
  - `docs/informes-models-ia/` (carpeta) — moguts els 12 fitxers dels
    models d'IA aquí.
  - `docs/informes-models-ia/analisi-comparativa.md` — anàlisi quantitativa
    + qualitativa dels 3 models (GLM-5.2, Kimi K3, Qwen 3.7 Max) amb
    taula de guanyadors per dimensió i síntesi de propostes a adoptar.
  - `docs/propostes-web/design-system.md` — sistema de disseny compartit:
    paleta taronja real, tipografia DM Sans + escala, spacing 4/8dp,
    breakpoints 375/768/1024/1440, components base (button, card, chip),
    regles UI/UX Pro Max aplicades (accessibilitat, touch, focus, motion),
    checklist prèvi a producció.
  - `docs/propostes-web/proposta-1-nau-app.md` — esquema + mockup ASCII
    mobile/desktop + tipus de continguts. Metàfora: app mobile amb bottom
    nav 5 icones + scroll-snap.
  - `docs/propostes-web/proposta-2-tres-portes.md` — arquitectura per
    intenció del visitant. 3 portes amb color de context (Veure verd,
    Conèixer blau, Participar taronja).
  - `docs/propostes-web/proposta-3-nau-virtual.md` — la nau ÉS la interfície.
    SVG isomètric generat a build-time per Hugo. Triple navegació simultània.
  - `docs/propostes-web/proposta-4-brutalista.md` — màxim contemporani i
    trencador. Brutalisme pur amb taronja: tipografia gegant 6-8rem,
    vores 4px negre, grid exposat, marquee animat.
  - `docs/propostes-web/README.md` — índex de propostes + comparativa
    ràpida + recomanació.
  - `static/preview/index.html` — índex navegable de les 4 propostes.
  - `static/preview/proposta-1.html` — prototip HTML autònom: bottom nav,
    scroll-snap, sticky claim, cards, CTA sòcia. Mobile-first, top-nav a
    desktop, sense JS. SVG Lucide inline.
  - `static/preview/proposta-2.html` — prototip HTML: 3 portes amb color
    de context, cards d'agenda, CTA. Desktop: 3 columnes portal.
  - `static/preview/proposta-3.html` — prototip HTML: SVG isomètric de
    les 4 plantes (sales navegables com `<a>`), sidebar amb activitats
    + accions ràpides, grid de residents. Sense JS.
  - `static/preview/proposta-4.html` — prototip HTML brutalista: marquee
    animat, display gegant, cards amb grid 1px gap, stack items amb
    arrow, CTA amb shadow brutalist. Space Grotesk + DM Sans. Respecta
    `prefers-reduced-motion`.
- **Fitxers modificats:**
  - `.github/workflows/hugo.yml` — baseURL amb subpath correcte per GH
    Pages: `https://112books.github.io/naubostik-web/`.
- **Commit + push:** `7fccedf` — 32 fitxers, 6079 insercions. Push a
  `origin/main` exitós (després de rebase per un commit previ al remot).
- **Iteracions fins al resultat:** 1 per fitxer.
- **Tokens aprox.:** no instrumentats. **Temps aprox.:** ~40 minuts totals.
- **Errors comesos del model:**
  - El `webfetch` a `naubostik.com` va retornar 276kb truncat; vaig
    extreure la informació clau (logo taronja, color `#e75112`, Yoast
    meta, fonts Barlow/Open Sans) de l'HTML truncat sense necessitar
    llegir tot el fitxer.
  - El `ui-ux-pro-max` skill va recomanar "Pixel Art" i "Cormorant
    Garamond" com a paleta/tipografia — completament fora de lloc per a
    un centre cultural industrial. Vaig descartar la recomanació
    automàtica i vaig usar la paleta real extreta del site.
  - Alguns fitxers markdown tenien emojis com a icones als mockups ASCII;
    els HTML previews van usar SVG Lucide com manen les regles
    `no-emoji-icons`. Els markdowns es queden amb emojis per llegibilitat
    de l'esquema (no són codi executable).
- **Rework:** cap tècnic. El `git push` inicial va ser rejected per nou
  commit remot; `git pull --rebase` ho va solucionar.
- **Valoració:** 5 — SessióProductiva: 4 prototips HTML navegable + 4
  propostes markdown + design system + anàlisi + push a GitHub en una
  passada. Skill carregat i aplicat selectivament (no cegament).
  Descoberta de la marca real taronja `#e75112` va ser clau.
- **Notes / observacions:**
  - **GH Pages deploy en curs**: el workflow `hugo.yml` s'ha disparaor
    pel push a `main`. En pocs minuts les propostes seran visibles a
    `https://112books.github.io/naubostik-web/preview/`. Cal verificar
    que els HTML estàtic dins `static/preview/` es serveix correctament
    (Hugo copia `static/` directament a `public/` sense processar).
  - **Paleta real confirmada**: `#e75112` (taronja Nau Bostik real, del
    logo i del plugin d'events al WordPress actual). Cal actualitzar
    `themes/thema/static/css/main.css` per usar aquest color en lloc de
    `#c41e3a` (vermell) — pendent de propera sessió.
  - **Fonts del site real**: Barlow Condensed / Barlow Semi Condensed
    (events) + Open Sans (body). El prototip actual usa DM Sans. Decisió
    pendnent: mantenir DM Sans o migrar a Barlow per coherència amb la
    marca real.
  - **Skill `ui-ux-pro-max`**: útil per la checklist d'accessibilitat i
    les regles UX, però les recomanacions automàtiques de paleta/tipografia
    eren off-target (Pixel Art, Cormorant). La paleta real extreta del
    site va ser millor guide que l'skill. Lliçó: l'skill és complement,
    no oracle.
  - **Propera sessió**: (a) verificar GH Pages deploy; (b) actualitzar
    `main.css` amb paleta taronja real; (c) decidir font (DM Sans vs
    Barlow); (d) seleccionar proposta guanyadora començar a implementar.

---

### 2026-07-22 — Plantejament funcional del web (anàlisi multidisciplinari)

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Anàlisi objectiva de totes les funcionalitats que ha de tenir
  el web, basant-nos en tot el desenvolupat fins ara (3 informes de models
  d'IA + anàlisi comparativa + 4 propostes d'arquitectura + estat del
  repo). Actuam com a equip multidisciplinari: comunicació, gestió
  d'espais, UX/UI, desenvolupament web, usabilitat, gestió cultural.
- **Abast:** Document decisiu. No inventari passiu. Cada funcionalitat té
  prioritat, destí (portada/interna/aparcar/descartar) i responsable.
- **Metodologia:**
  1. Tasca delegada (general agent) per llegir els 15 fitxers clau i
     extreure 65 funcionalitats consolidades sense duplicats.
  2. Rellegida de `analisi-comparativa.md` per confirmar la síntesi.
  3. Consolidació en 38 funcionalitats finals, organitzades en 7 àrees
     (A identitat, B activitats, C residents, D espais, E arxiu,
     F participació, G infraestructura).
  4. Debats simulats entre les 6 veus de l'equip (es marquen
     discrepàncies explícitament).
- **Fitxers creats:**
  - `docs/plantejament-funcional.md` — document decisiu amb:
    - Inventari de 38 funcionalitats en 7 àrees, amb prioritat (P0-P3),
      destí (portada/interna/aparcar/descartar), responsable, notes equip.
    - Decisió de portada amb 4 blocs (claim + mosaic arxiu + aquesta
      setmana + participa).
    - 5 funcionals descartades + 7 aparcaes + 5 internes.
    - Triple capa de governança editorial (assemblea → comissió → 4 rols).
    - SLA d'edició per tipus de contingut.
    - Estratègia CMS per type de contingut (no global): no ampliar Decap,
      swap alentit, fase 1 formularis, fase 2 Sveltia amb sub-usuaris.
    - Matriu final P0 (10) / P1 (13) / P2 (10) / P3 (8) / descartades (5).
    - Recomanació sintètica: proposta 1 com a base + elements de la 4
      per força expressiva.
- **Decisions clau registrades:**
  - **Portada = 4 blocs només** (rebutgem la temptació de comunicació de
    posar 6+). Claim sticky + mosaic arxiu (NO Unsplash) + 3-4 activitats
    destacades + CTA sòcia amb 3 rutes secundàries.
  - **Bloqueig crític D4 (protocol assemblea)**: sense ell, ni calendari,
    ni reserves, ni notícies per entitat tenen legitimitat. L'assemblea
    ha de tancar-lo abans de M4.
  - **"Fes-te sòcia"**: motivador transversal present a home + footer.
    Contribució més original i reproduïble de Qwen 3.7 Max (basada en
    Can Batlló + 32° East).
  - **Arxiu visual**: actiu únic del centre. No decoració, patrimoni.
    Combinació fotografia + art urbà efímer = avantatge competitiu real.
  - **CMS**: no ampliar Decap (consens 3/3 models), swap alentit amb
    comparativa escrita, subdelegar edicions via formulari mentrestant.
  - **Data límit 6 mesos**: rebutgem el prototip zombi indefinit.
- **De la tasca delegada (general agent):** l'agent va extreure una
  taula de 65 funcionalitats amb origen, descripció i públic objectiu.
  La meva consolidació a 38 va descartar duplicats, va separar
  "internes" de "públiques", i va fixar prioritats segons consens /
  valor afegit / bloqueig assemblea.
- **Iteracions fins al resultat:** 1 (tasca delegada + escriptura del
  document).
- **Tokens aprox.:** no instrumentats. **Temps aprox.:** ~12 minuts.
- **Errors comesos del model:** cap tècnic.
- **Valoració:** 5 — Document decisiu queorta els 3 informes + les 4
  propostes en un únic document executable. L'equip multidisciplinari
  simulat amb discrepàncies explícites (comunicació vs UX/UI, desenvolupament
  vs gestió cultural) aporta credibilitat i evita el biaix d'una sola veu.
- **Notes / observacions:**
  - El document és **decisiu, no decoratiu**: cada funcionalitat té un
    destí i un responsable. És el primer document que pot llegir
    assemblea + comissió + sysadmis i saber què cal fer.
  - **Recomanació de proposta guanyadora:** proposta 1 (Nau App) com
    base + elements de la 4 (Brutalista) per força expressiva. Proposta
    3 (Nau Virtual) és la més expressiva però la més costosa; reserva
    per v2.
  - **Pròxims pasos operatius:** (a) commit + push; (b) assemblea
    valida D4 (protocol); (c) comissió comunicació valida portada 4
    blocs; (d) començar implementació per P0 (adreça, paleta, baseURL,
    residents migration, formulari contacte).

---

## (Reservat per a DeepSeek V4 Pro)

> Quan l'usuari completi la prova amb DeepSeek V4 Pro, aquí s'hi registrarà
> una entrada seguint la mateixa estructura: data, model, tasca, abast,
> fitxers creats/modificats, errors detectats, propostes, mètriques,
> autoavaluació, valoració comparativa amb GLM-5.2, notes.

### 2026-07-22 — Integració de respostes + primera ronda de propostes

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Integrar les respostes de l'usuari a les 10 preguntes de la
  sessió anterior i, un cop entès el projecte, **iniciar la ronda de
  propostes** com a consultor.
- **Respostes rebudes (resum):**
  1. Web antiga, no lenta, plantejament antic que no respon a necessitats actuals.
  2. Assemblea sobirana + equip tècnic remunerat; membres per definir.
  3. Redefinint model de governança; fundació desapareguda; conglomerat divers.
  4. Ús d'espais mixt: comú lliure us + llogat a residents/entitats + lloguer
     per esdeveniments + produccions pròpies.
  5. Hi ha equip de comunicació.
  6. Una persona responsable web, respon a assemblea, suport de la comissió
     de comunicació.
  7. Horitzó 6 mesos.
  8. Públics: gestió interna, promoció, integració territòri (barri/ciutat/EU),
     promoció artística, sinèrgies centres similars.
  9. Relat fundacional: "la Sagrera necessita més un centre cultural que una
     estació d'alta velocitat".
  10. Mixt: assemblea amb representants de residents, empreses, entitats i
      treballadors (pes específic relatiu).
- **Abast:** Anàlisi + propostes arquitectòniques. No s'ha tocat codi (pendent
  de confirmació de l'usuari sobre quines propostes executar primer).
- **Nous errors / tensions detectats (3):**
  A. Risc jurídic no resolt: la fundació titular (domini + contractes hosting)
     ha desaparegut. Sense subjecte jurídic, "6 mesos a producció" és
     ambigüa — no es pot facturar ni contractar sense subjecte.
  B. Cadena de decisió de 4 capes (assemblea + equip tècnic + comissió
     comunicació + responsable web) valdra una sola web. Risc que cada canvi
     triguí setmanes. Cal definir nivell de decisions autònomes del responsable.
  C. 5 públics diferents en una sola web de 6 mesos és inviable sense
     ordenació prioriaudiència l'ordre.
- **Propostes emeses (resum executiu, 9 àrees):**
  1. Arquitectura de contingut: abandonar "Col·lectius" com a taxonomia única
     i anar a "Residents" amb `tipus` al frontmatter (cooperativa_iniciativa
     social, cooperativa_cultural, empresa, projecte_social, artista_individual,
     colla_cultural) — una plantilla per tipus.
  2. Nova secció "Com funciona la Nau" (protocol assembleari públic) — serveix
     tant per coherència política com per subvencions.
  3. Home amb relat fundacional (Sagrera > TAV) al primer fold.
  4. Arxiu visual via `data/arxiu.yaml` + plantilla `layouts/arxiu/` amb
     filtres. Street art efímer com a recurs únic.
  5. CMS: migrar Decap → Sveltia CMS (drop-in, 1 línia de canvi). Si Sveltia
     no escala amb permisos per-entitat, aleshores TinaCMS; no començar de
     zero amb Tina abans de provar Sveltia.
  6. Multi-idioma subset: EN només a home, qui-som, funciona, contacte. La
     resta CA-only. Sense flags de "traducció pendent".
  7. Sistema de reserves en 2 regadius: (a) formulari Netlify Forms per
     esdeveniments puntuals ( gratuït, email al responsable); (b) pàgina
     estàtica per espais residents/lliures/producció. Protocol fora de la web.
  8. Roadmap 6 mesos especificat amb blocs: Fonaments (M1), Arquitectura
     (M2), Contingut real (M3), Vida/agenda+reserves (M4), Poliment
     institucional SEO/AA (M5), Tancament + test usuaris + deploy prod nakki
     si titulartat resolta (M6).
  9. 6 canvis tècnics immediats disponibles: Sveltia CMS swap, treure Unsplash
     de la home, `data/arxiu.yaml`, `content/funciona/_index.md`, camp `tipus`
     als residents, relat fundacional al home.
- **5 preguntes finals emeses a l'usuari**
  (titulartat domini, ordenació audiències, confirmació Sveltia, disponibilitat
  responsable web, protocol residents).
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~5 minuts (integració respostes + redacció propostes).
- **Errors comesos del model:** cap tècnic.
- **Rework:** cap.
- **Valoració:** 4 — Ha **complert la instrucció** de no proposar solucions
  fins a entendre el projecte. Ha integrat les respostes de l'usuari sense
  abandonar les posicions crítiques prèvies (ha afegit 3 errors nous a partir
  de les respostes). Propostes accionables, ordenades i amb dependències
  explícites (p ex: deploys M6 bloquejats si titulartat no resolta).
- **Notes / observacions per a la comparativa:**
  - Comportament notable: GLM-5.2 ha distingit clarament entre "proposar
    solucions generals" i "implementar ara" — ha presentat 6 accions
    immediates però ha demanat confirmació abans de tocar res. Això encaixa
    amb la seva pràctica habitual de mode Plan vs Build.
  - Ha detectat **1 risc jurídic no tècnic** (titulartat domini) que éss
    habitualment fora de l'abast de models d'IA assistents. Punt fort per a
    la comparativa.
  - Propera prova per a altres models: donar-los les mateixes 10 respostes
    i veure si detecten (a) el risc jurídic de la fundació desapareguda,
    (b) la contradicció 4-capes-vs-1-web, (c) la impossibilitat de decisió
    editorial sense prioritats d'audiència.
- **Notes / observacions:**
  - `robots.txt` llista explícitament els user-agents d'IA més coneguts a més
    del `*`. És redundant defensivament (perquè els bots poden mentir sobre
    l'UA) però útil com a declaració d'intencions i per a proveïdors que no
    reconeixen el genèric.
  - Pendings reals detectats: (a) decidir allotjament staging autèntic amb
    auth (Netlify/Cloudflare Pages, no GH Pages); (b) decidir si es manté
    `sitemap.xml` generat per Hugo mentre el site sigui privat — recomano no
    enllaçar-lo i, en Producció, restaurar indexació sincrònicament.
  - Suggereixo que la propera sessió confirmi la tria d'allotjament staging
    per poder implementar el Basic Auth real.

### 2026-07-21 — Consultoria: revisió crítica de plantejament

- **Model + provider:** `opencode-go/glm-5.2`
- **Tasca:** Actuar com a consultor independent especialitzat en centres
  cívics i espais culturals autogestionats. Primera obligació: posar en dubte
  les idees de l'usuari i detectar errors de plantejament. NO proposar
  solucions fins a entendre el projecte. Context del projecte confirmat per
  l'usuari: Nau Bostik és centre autogestionat amb forta presència de
  fotografia, art urbà, arquitectura; també cooperatives i projectes com
  Mescladis, Azimut 360, Trèbol. Es repeteix aquesta prova amb altres models
  per comparar.
- **Abast:** Només anàlisi + preguntes de clarificació. Res d'edició de
  codi ni de fitxers del projecte.
- **Fitxers creats / modificats / eliminats:** cap (excepte aquesta entrada
  de `HISTORIA.md`).
- **Errors de plantejament detectats (resum executiu, 12 punts):**
  1. Framing "lloguer" entra en contradicció amb la missió declarada
     (accessibilitat + autogestió).
  2. Slide d'Unsplash crema l'avantatge competitiu del lloc (fotògrafs
     residents); hauria de ser arxiu propi.
  3. "Col·lectius" com a taxonomia única amaga diversitat de models
     econòmics (cooperatives vs. colles vs. artistes individuals) i els dóna
     necesitats de web diferents.
  4. Decap CMS amb editorial_workflow centralitza la veu — contradiu
     autogestió; cal replantejar permisos per entitat.
  5. L'error geogràfic (Bordeta/Seu d'Urgell) no és errada de dades, és
     esborrat del relat fundacional de la lluita veïnal de la Sagrera.
  6. "Multi-idioma des de l'inici" sembla front-arxi: només 4-5 pàgines
     institucionals mereixen EN; notícies/activitats en EN són cost sense ROI.
  7. SEO + schema.org contradir el bloqueig actual; i caldria definir
     audiència prioritzada abans de planificar-lo.
  8. "Notícies" com a feed únic no escala a 30 entitats; cal per entitat +
     agregador.
  9. Calendari d'activitats sense protocol de governança interna = maquetar
     el conflicte (qui té prioritat d'espai?).
  10. Competir amb Instagram és perdut; l'arxiu curat sí és diferencial.
  11. "Prototip sense dataobjectiu de producció" és zombi; cal data límit
      explícita.
  12. Cercador JS inline no té ROI fins a 100+ entrades; avui és gadget.
- **Preguntes emeses a l'usuari:** 8 (públic prioritzat, model d'ús
  d'espais, presa de decisions web, pressupost, horitzó temporal, autonomia
  d'entitats per publicar, narrativa fundacional, arxiu disponibilitat).
- **Iteracions fins al resultat:** 1.
- **Tokens aprox.:** no instrumentats.
- **Temps aprox.:** ~2 minuts d'edició + redacció.
- **Errors comesos del model:** cap tècnic. He fet explicititat del rol
  ("no intentis agradar-me") — he triat enfocar-me en contradiccions
  internes, no en coses menors.
- **Rework:** cap.
- **Valoració:** 4 — Anàlisi densa, fora d'opinió buida; cobreix tant
  contingut (framing, taxonomia) com eina (CMS, multi-idioma, SEO) i
  governança (cronologia, propietat editorial). Limitació: 12 punts poden
  ser massa per a una sola ronda; millor haver-ne agrupat 5-7 crítics i
  deixar els altres per a iteració.
- **Notes / observacions:**
  - Sistema per a la comparativa: el mateix prompt es passarà a altres
    models. Per a que la comparativa sigui equitativa, el registr del
    resultat (aquest apartat) hauria de permetre comparar (a) quantitat de
    errors detectats, (b) profunditat de la contradicíó política identificada
    (l'autogestió vs. eina), (c) qualitat de les preguntes de clarificació,
    (d) si ha proposat solucions massa aviat (penalitzar), (e) ton /
    deferència usurpada.
  - GLM-5.2 ha triat expresament **no** proposar solucions, seguint
    instrucció. És un punt que caldrà vigilar: alguns models tendiran a
    agradar i a saltar a "ja t'ho faig".
  - Mateix prompt per a models posteriors, compararé la densitat
    d'observacions令reals vs. frases de farciment.

---

## (Reservat per a futures sessions / models)

> Mantenir un apartat `## <Model>` per a cada nou model provat, ordenat
> cronològicament dins de cada model. Això facilita la comparativa.

---

## DeepSeek V4 Flash (opencode/deepseek-v4-flash-free)

### 2026-08-12 — FASE 0: identitat industrial + dades reals (inici de producció)

- **Model + provider:** `opencode/deepseek-v4-flash-free`
- **Tasca:** Executar la FASE 0 del pla: iniciar la producció sobre el repo
  `naubostik-web`, aplicant les decisions ja preses (rename tema, footer,
  paleta, adreça, identitat de portada P1).
- **Abast:** Codi i continguts. Sense tocar producció (`naubostik.com`).
- **Decisions preses prèvies aplicades:**
  - Rename del tema `thema` → `NauBostik` (primer commit net).
  - Portada: proposta **P1 «La Nau App»** (bottom-nav mobile + cards,
    claim fundacional sticky).
  - Slideshow Unsplash eliminat → hero amb card estàtica (mai Unsplash en
    producció).
  - Corporatiu: paleta taronja real `#e75112` (Ze verifica a `naubostik.com`),
    domini `info@naubostik.com`, adreça Ferran Turné 1-11, 08027 (Sagrera).
  - Toc industrial lleuger a superfícies (formigó càlid, cantonades rectes,
    filigranes taronja), sense estètica cyberpunk.
- **Fitxers creats:**
  - `themes/NauBostik/` (rename de `themes/thema/`).
  - `content/avis-legal/_index.md`, `content/cookies/_index.md`,
    `content/accessibilitat/_index.md`.
- **Fitxers modificats:**
  - `hugo.toml` (theme + meta description), `themes/NauBostik/static/css/main.css`,
    `themes/NauBostik/layouts/_partials/{header,footer}.html`,
    `themes/NauBostik/layouts/home.html`, `themes/NauBostik/static/js/main.js`,
    `content/{_index,qui-som,contacte,privacitat}/_index.md` i 11 fitxers amb
    domini erroni `.cat`.
- **Mètriques:** 6 blocs de treball dins la FASE 0; 5 commits + 5 pushes
  (`6af2964`, `fb6bd5d`, `9c4e695` + els de contacte i peces). Build de
  51 pàgines sense errors. L'estat de la etapa s'ha pujat a GitHub Pages
  (staging) de forma automàtica.
- **Errades comeses i resolució:**
  - Les 3 pàgines legals no es renderitzaven (0 pàgines al `public/`).
    Causa: `date` de frontmatter al futur/avui (`2026-08-12`). Solució:
    establir `date = 2026-04-01` (coherent amb la resta del contingut).
  - Recordatori de «mode plan/read-only» que bloquejava edicions; resolt en
    mode build.
- **Valoració subjectiva:** 4 — Execució correcta i ordenada per blocs,
  orientació a decisions ja preses estalviant temps, control de qualitat
  (build + pàgines legals). Sense rework significatiu.
- **Notes:** L'usuari ha demanat treballar «per blocs» i pujar cada canvi
  per seguir l'evolució de la feina; els 3 blocs d'estructures + continguts
  ja s'han separat i pujat. Aquest repositori ara viu a
  `~/Documents/Obsidian/naubostik.com` (repo `112books/naubostik-web`), amb
  backup de la còpia antiga a `~/Documents/Obsidian/naubostik.com-BACKUP-JUL2026`.

---

## Claude Sonnet 5 (Claude Code / Anthropic)

### 2026-08-12 — Icones sticky header, neteja menú, correcció textual, auditoria TODO i decisions d'infraestructura

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** Continuació de sessió d'opencode (canvi orfe a `menu.html` sense
  documentar ni funcional). Polir sticky header amb icones SVG ja existent,
  netejar menú de navegació, ajust textual d'H1/meta description, i revisar
  l'estat real de les tasques TODO de `CLAUDE.md` §7.3 abans de passar la mà
  a una altra IA per continuar amb l'agenda d'activitats i els col·lectius.
- **Abast:** Codi (templates, CSS, `hugo.toml`) + documentació (`CLAUDE.md`).
  Sense tocar producció.
- **Fitxers modificats:**
  - `themes/NauBostik/layouts/_partials/menu.html` — eliminats `data-url`/
    `data-name` orfes (afegits per una sessió d'opencode anterior sense cap
    consumidor JS ni CSS); `stroke-width` SVG 2→1.5.
  - `themes/NauBostik/static/css/main.css` — `.menu-icon` 22px→19px, padding
    + hover suau a mode `is-scrolled` (abans `gap:0` sense respir visual).
  - `hugo.toml` — eliminada entrada de menú "Cessió d'espais" (duplicada amb
    el botó `header-cta` ja destacat a la dreta) i "Inici" (redundant amb el
    logo, que ja enllaça a `/`) dels dos blocs (`languages.ca.menu.main` i
    `menu.main` fallback).
  - `themes/NauBostik/layouts/home.html` — H1 "Un espai cultural
    autogestionat" → "Espai cultural autogestionat" (més directe, sense
    article, coherent amb el to de la meta description).
  - `content/_index.md` — mateix canvi a `description` del frontmatter.
  - `CLAUDE.md` — auditoria completa de §7.3 (TODO): 3 tasques marcades
    `[x]` que ja estaven fetes però no documentades (adreça/coordenades OSM
    verificades contra Wikidata, `hugo.toml` multi-entorn, estratègia
    branca/repo); espec completa nova §6.1 per al calendari/agenda
    d'activitats (per a la propera IA); tasca nova d'importar
    `entitats-residents/` del site antic a `/collectius/`.
- **Errades detectades (no pròpies d'aquesta sessió, trobades en revisar):**
  - Regressió real: el commit `c79ca04` ("neteja Netlify/Decap") va esborrar
    `netlify.toml` i `netlify/edge-functions/basic-auth.js`, però `CLAUDE.md`
    encara documentava l'auth de staging com a `[x]` implementada. Resolt
    per decisió explícita de l'usuari: no restaurar auth, GH Pages es queda
    protegit només per no-indexació (`robots.txt` + meta `noindex`, que ja
    hi eren i funcionaven) + repo privat + URL no compartida.
  - Glitch de caràcters espuris (`今夜`, `因此`) trobat al títol
    `content/activitats/artivisme.md` i, transcrit sense voler, al propi
    `CLAUDE.md` en editar-lo — corregit al segon cas; el primer (contingut)
    queda pendent de repàs global (no forma part de cap tasca del TODO
    encara, val la pena un `grep` ampli en algun moment).
  - Canvi orfe d'opencode a `menu.html` (`data-url`/`data-name` sense
    consumidor) — no estava documentat a `HISTORIA.md` ni commitejat;
    eliminat en aquesta sessió després de confirmar que el sticky
    header+icones ja funcionava sense ell (funcionalitat ja implementada al
    commit `b9752b1`, l'usuari havia confós "no funciona" amb "les icones
    són lletges").
- **Decisions d'infraestructura preses amb l'usuari (documentades a
  `CLAUDE.md` §2/§7.3/§8.2):**
  - Dos repos separats (`naubostik-web` codi, `naubostik-DOCS` privat) es
    queden com estan; no submòdul. Doc interna es mouria a `naubostik-DOCS`
    només si `naubostik-web` passa a públic.
  - Staging GH Pages sense auth (decisió conscient, no oblit): protecció
    via no-indexació ja implementada, no calia restaurar Netlify Basic Auth.
- **Iteracions fins al resultat:** 1 per tasca, sense rework.
- **Temps aprox.:** sessió llarga, múltiples micro-tasques encadenades
  (~45-60 min estimats).
- **Valoració subjectiva:** 5 — cap regressió introduïda, verificació activa
  (WebSearch per confirmar coordenades GPS reals abans d'assumir-les
  correctes o incorrectes), decisions d'infraestructura consultades amb
  `AskUserQuestion` en lloc de decidir unilateralment, documentació
  actualitzada per eliminar contradiccions doc/realitat en comptes de
  limitar-se a la tasca demanada.
- **Notes / observacions per a la comparativa:**
  - Diferència notable amb sessions d'opencode: aquí es va detectar una
    regressió de seguretat (auth de staging esborrada sense actualitzar
    `CLAUDE.md`) que no formava part de la tasca demanada, simplement
    apareguda en revisar context abans d'actuar. Val la pena que la
    comparativa entre models inclogui aquest tipus de detecció incidental.
  - Handoff explícit per a la propera IA: `CLAUDE.md` §6.1 té l'espec
    completa del calendari/agenda i §7.3 té la tasca d'importar
    `entitats-residents/` a `/collectius/` — totes dues autocontingudes,
    sense necessitat de preguntar res abans de començar.

### 2026-08-12 (2) — Fix icones SVG del menú a GitHub Pages

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** Usuari reporta que les icones SVG del menú no es veuen a GH
  Pages (`https://112books.github.io/naubostik-web/`).
- **Diagnosi:** `curl` del HTML compilat en producció mostrava totes les
  icones com el cercle genèric de fallback, no la icona específica de cada
  secció. Causa: `themes/NauBostik/layouts/_partials/menu.html` comparava
  `eq .URL "/activitats/"` etc., però amb `baseURL` amb subcamí
  (`/naubostik-web/`), Hugo prefixa `.URL` de les entrades de menú amb
  aquest subcamí (`.URL` esdevé `/naubostik-web/activitats/`), fent fallar
  totes les comparacions exactes. En local (`baseURL` arrel, sense subcamí)
  el bug no es reproduïa — per això va passar desapercebut a la sessió
  anterior malgrat verificar amb `hugo --minify` localment.
- **Fix:** `eq .URL "..."` → `strings.HasSuffix .URL "..."` per a totes les
  entrades excepte `/` (Inici, actualment sense entrada de menú, es manté
  amb `eq` per evitar fals positiu ja que tot URL acaba en `/`).
- **Verificació:** build local amb `--baseURL https://112books.github.io/naubostik-web/`
  (mateix baseURL exacte del workflow GH Pages) confirma cada icona correcta
  abans de pujar.
- **Fitxers modificats:** `themes/NauBostik/layouts/_partials/menu.html`.
- **Valoració subjectiva:** 4 — bug real i ben diagnosticat amb evidència
  (`curl` + build local amb el baseURL exacte de producció), però hauria
  d'haver-se detectat a la sessió anterior si el build de verificació
  s'hagués fet amb el baseURL de subcamí en lloc de `localhost:1313/`.
- **Notes:** lliçó per a properes sessions — **verificar sempre amb el
  `baseURL` real de l'entorn de destí** (`https://112books.github.io/naubostik-web/`
  per staging), no només amb `localhost:1313/`, ja que bugs relacionats amb
  subcamins no es reprodueixen en arrel.

### 2026-08-12 (3) — i18n de plantilles, espais 4/aleatori-real, hover accent, tooltip

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** Continuació de sessió. Quatre peticions de l'usuari: (1) tasca
  TODO #1 — preparar `i18n/{ca,en}.toml` pensant en ampliació futura sense
  activar-la encara; (2) color d'accent + tooltip a les icones del menú en
  hover/secció activa; (3) portada mostri 4 espais en lloc de 3; (4) que la
  selecció d'espais a portada sigui aleatòria **a cada visita**, no només a
  cada build.
- **Fitxers creats:** `i18n/ca.toml`, `i18n/en.toml` (~75 claus cobrint
  chrome de plantilles: header, footer, home, 404, activitats, espais,
  col·lectius, notícies, cercar).
- **Fitxers modificats:**
  - `themes/NauBostik/layouts/{baseof,404,home}.html`,
    `_partials/{header,footer}.html`, `activitats/list.html`,
    `espais/{list,single}.html`, `collectius/list.html`, `noticies/list.html`,
    `cercar/list.html` — cadenes CA hardcodejades → `{{ i18n "clau" }}`.
    Verificat: amb un sol idioma actiu (`languages.en` encara no definit a
    `hugo.toml`), el HTML renderitzat és byte-a-byte idèntic a l'anterior.
  - Excepcions **conscientment no connectades**, marcades
    `TODO→MULTII18N` al codi: noms de planta a `espais/list.html` (claus de
    dades `Params.ubicacio`, no purament UI), alt text amb interpolació a
    `espais/single.html`, strings del cercador en JS inline.
  - `themes/NauBostik/static/css/main.css` — `.main-nav a:hover/.is-active/
    .is-ancestor` de `--color-primary` a `--color-accent`.
  - `themes/NauBostik/layouts/_partials/menu.html` — `title="{{ .Name }}"`
    (tooltip natiu) a cada enllaç.
  - `themes/NauBostik/layouts/home.html` — secció Espais: `first 4` (abans
    3); afegit `<script type="application/json" id="espais-data">` amb
    **tots** els espais (title/url/photo/placeholder) via `jsonify | safeJS`,
    i SSR de 4 aleatoris per build com a fallback no-JS.
  - `themes/NauBostik/static/js/main.js` — `initRandomEspais()`: llegeix el
    JSON, Fisher-Yates shuffle client-side, reconstrueix les 4 `.espai-card`
    a cada càrrega de pàgina (aleatori real per visita, no només per build).
- **Errades comeses i resoltes:**
  - Primer intent de `{{ $espaisData | jsonify }}` dins `<script>` va
    quedar doble-escapat (Go `html/template` tracta `<script>` com a
    context JS i re-escapa la sortida com a string JS). Detectat comparant
    l'HTML generat amb `json.loads` en Python (fallava el parse), corregit
    afegint `| safeJS` per marcar el contingut com a JS ja segur.
  - Verificat el fix **també amb el `baseURL` de subcamí exacte de GH
    Pages** (lliçó de la sessió anterior sobre el bug d'icones), no només
    en local — confirmat que les URLs del JSON resolen bé amb el prefix
    `/naubostik-web/`.
- **Valoració subjectiva:** 4 — bona cobertura d'i18n sense trencar res
  (verificat byte-a-byte), bug de doble-escapat detectat i corregit abans
  de pujar (no desprès d'un informe de l'usuari), aplicada la lliçó de la
  sessió anterior de verificar amb el baseURL real abans de donar per bo.
- **Notes:** L'usuari va confirmar explícitament que volia aleatorietat
  *per visita*, no només per build, després de preguntar-ho amb
  `AskUserQuestion` — sense aquesta pregunta hauria donat per bo el
  comportament per-build ja implementat a la sessió anterior, que no
  complia realment el que es demanava.

### 2026-08-12 (4) — Slideshow de fons al hero amb fotos reals de producció

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** Usuari demana que el hero de portada tingui un slideshow de
  fons amb les imatges reals que ja hi ha a `naubostik.com` (producció),
  funcionament similar; i que la llista d'imatges es pugui editar fàcilment
  "des del backend".
- **Origen de les imatges:** `naubostik.com` usa el plugin WordPress "Cryout
  Serious Slider" amb 6 fotos (`item-image`, classes `slide-1`..`slide-6`).
  Confirmat amb l'usuari abans de baixar-les (font, mida ~1.3MB total, 6
  arxius JPG 152-328KB cada un) — són fotos pròpies de la Nau, no Unsplash,
  compleix la política del projecte (§6 CLAUDE.md).
- **"Backend" real:** el site no té CMS (Decap esborrat a `c79ca04`).
  Solució acordada amb l'usuari: `data/hero-slideshow.yaml`, mateix patró
  que `data/slogans.yaml` (ja existent, usat pel ticker) — editable a mà o
  per qualsevol futur CMS que llegeixi `data/`.
- **Fitxers creats:**
  - `static/img/hero/hero-{1..6}.jpg` — baixades de `naubostik.com`.
  - `data/hero-slideshow.yaml` — llista `images: [{src, alt}, ...]`.
- **Fitxers modificats:**
  - `themes/NauBostik/layouts/home.html` — llegeix
    `index site.Data "hero-slideshow"`, renderitza un `.hero-slide` per
    imatge dins `.hero-slideshow`; classe `hero-has-photo` condicional al
    `.hero-card` (evita dependre de `:has()` per compatibilitat).
  - `themes/NauBostik/static/css/main.css` — crossfade (`opacity` +
    `transition`), overlay fosc (`linear-gradient`) per llegibilitat del
    text blanc, primer slide `is-active` renderitzat al servidor (fallback
    no-JS: es veu la primera foto fixa).
  - `themes/NauBostik/static/js/main.js` — `initHeroSlideshow()`: interval
    de 6s, alterna `is-active` entre `.hero-slide`.
- **Verificació:** build local i amb `baseURL` de subcamí de GH Pages —
  totes 6 imatges resolen bé als dos casos (168 static files, +6 respecte
  build anterior).
- **Valoració subjectiva:** 5 — permisos demanats abans de baixar arxius
  externs (font + mida, com indica la política de seguretat), disseny
  "backend-friendly" acordat amb l'usuari en lloc de hardcodejar-ho directe
  a la plantilla, verificat als dos baseURL abans de donar per bo.

### 2026-08-12 (5) — Ajustos hero: text botó, contrast, sang, fletxes manuals

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** Tres peticions sobre l'slideshow del hero acabat d'afegir: (1)
  botó "Coneix la nau" → "Coneix la Nau Bostik" (nom real); (2) botó
  secundari transparent il·legible sobre les fotos; (3) imatge de fons a
  sang (sense marges esquerra/dreta) amb fletxes de navegació manual al
  fer mouse over.
- **Fitxers modificats:**
  - `i18n/{ca,en}.toml` — `home_btn_qui_som` actualitzat; noves claus
    `home_hero_prev`/`home_hero_next` per als `aria-label` de les fletxes.
  - `themes/NauBostik/layouts/home.html` — botons `.hero-arrow-prev`/
    `.hero-arrow-next` (SVG chevron) dins `.hero-card`, fora de
    `.hero-slideshow` (perquè no quedin `aria-hidden`).
  - `themes/NauBostik/static/css/main.css` — `.hero-card.hero-has-photo`
    amb tècnica de sang completa (`width:100vw` + marges negatius
    `calc(50% - 50vw)`); `overflow-x:hidden` a `body` (evita scroll
    horitzontal residual, efecte secundari conegut de la tècnica de sang
    amb scrollbar vertical); `.btn-secondary` dins `.hero-has-photo` passa
    a fons blanc sòlid en lloc de transparent; `.hero-arrow` amb opacitat 0
    per defecte, 1 en `:hover`/`:focus-visible`.
  - `themes/NauBostik/static/js/main.js` — `initHeroSlideshow()` reescrit:
    `goTo(index)` compartit entre l'interval automàtic (6s) i els clics de
    les fletxes; clic manual reinicia el temporitzador (`restart()`).
- **Error comès i corregit:** primer intent de les fletxes les va deixar
  totes dues apilades a dalt a l'esquerra. Causa: `.hero-card > *:not(.hero-slideshow) { position: relative; }` (specificitat 0,2,0) guanyava per
  sobre `.hero-arrow { position: absolute; }` (0,1,0), sobreescrivint-lo.
  Fix: `:not(.hero-slideshow):not(.hero-arrow)` per excloure-les
  explícitament d'aquesta regla.
- **Valoració subjectiva:** 4 — bug de specificitat CSS real detectat i
  corregit ràpid gràcies al feedback concret de l'usuari ("surten totes
  dues a dalt a l'esquerra"), verificat al codi font generat abans de
  confirmar.

### 2026-08-12 (6) — Restaurar Decap CMS amb Netlify Identity (usuaris sense GitHub)

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** requisit de l'usuari — els editors de contingut no tenen
  GitHub ni en saben; calia poder crear-los accés amb mail normal. Es
  discuteixen 3 opcions (Netlify Identity+git-gateway / TinaCMS / Sveltia)
  i es decideix restaurar la 1a: és la que ja hi havia abans d'esborrar-se
  a `c79ca04`, gratuïta, i Identity permet invitar per correu sense que
  l'editor toqui Git en cap moment.
- **Fitxers creats:**
  - `static/admin/index.html`, `static/admin/config.yml` — Decap CMS v3,
    backend `git-gateway`. Collections (`noticies`, `activitats`, `espais`,
    `collectius`, pàgines institucionals) amb `format: toml-frontmatter`
    (el repo usa `+++`, no YAML) i camps ajustats al frontmatter real
    trobat a `content/` (p. ex. `espais` amb `ubicacio`, `fotografies`
    (llista d'imatges), `xarxes` (llista nom+url)) — no els camps genèrics
    que hi havia abans de l'esborrat.
  - `netlify.toml` — build `hugo --minify`, publish `public`. Sense la
    Netlify Edge Function de basic-auth que hi havia abans (§8.2 CLAUDE.md
    ja va decidir explícitament no restaurar-la; és un tema diferent, auth
    de visibilitat del site, no auth d'editors del CMS).
- **Fitxers modificats:**
  - `themes/NauBostik/layouts/baseof.html` — script
    `netlify-identity-widget.js` al `<head>` global (no només a
    `/admin/`) + handler que redirigeix a `/admin/` després de login,
    perquè els enllaços d'invitació per correu aterren a l'arrel del site.
  - `CLAUDE.md` §3 i §7.3 — decisió documentada, estat "pendent" del pas
    manual (desplegar a Netlify + activar Identity/Git Gateway al tauler +
    convidar usuaris) deixat explícit perquè no es doni per fet que ja
    funciona.
- **Verificació:** `hugo --minify` sense errors nous (només warnings
  preexistents de deprecació de config, no relacionats). `public/admin/`
  genera `index.html`+`config.yml` correctament.
- **Pendent (no fet, fora d'abast d'aquesta sessió):** el pas al tauler de
  Netlify (activar Identity, Git Gateway, convidar usuaris per correu) és
  manual i no es pot fer des del repo — `/admin/` no serà funcional fins
  que es faci.
- **Valoració subjectiva:** 4 — decisió arquitectònica discutida amb
  l'usuari abans d'implementar (tradeoffs de les 3 opcions), camps del CMS
  ajustats al frontmatter real en lloc de reusar l'esquelet genèric
  d'abans, i el límit real (pas manual a Netlify) queda explícit en lloc
  d'insinuar que el CMS ja és operatiu.

### 2026-08-12 (7) — Desplegament real a Netlify: Identity + Git Gateway actius

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** completar el pas manual pendent de la sessió anterior —
  desplegar el repo a Netlify i activar Identity/Git Gateway (sense
  convidar editors encara, deliberadament). L'usuari no coneixia gens el
  tauler de Netlify; guiat pas a pas (un sol pas cada vegada després que
  el primer intent anés massa ràpid).
- **Descobert:** ja existia un site Netlify "naubostik" (`naubostik.netlify.app`)
  connectat via GitHub, amb 4 deploys de producció fallats (`28d82a6` fins
  `5120e1c`) — "Build script returned non-zero exit code: 2". Causa:
  aquests commits no tenien `netlify.toml`, Netlify usava la seva versió
  de Hugo per defecte (massa antiga per `hugo.toml` actual).
- **Fitxers commitejats i pujats** (`fe923e2`, amb permís explícit de
  l'usuari — "faré el que diguis"): `netlify.toml`, `static/admin/`,
  `themes/NauBostik/layouts/baseof.html`, `CLAUDE.md`, `HISTORIA.md`
  (els mateixos de la sessió anterior, que encara no s'havien pujat).
- **Resultat:** `main@fe923e2` → "Published" a Netlify. Al tauler:
  Identity activat, Registration = "Invite only", Git Gateway activat i
  connectat al repo (`https://github.com/112books/naubostik-web`).
  `/admin/` és tècnicament operatiu a `naubostik.netlify.app/admin/`, però
  ningú hi pot entrar fins convidar usuaris (pas que queda per després).
- **Valoració subjectiva:** 4 — diagnòstic correcte del build fallat (Hugo
  per defecte massa antic) confirmat empíricament pel deploy verd després
  de pujar `netlify.toml`; guiat l'usuari (novell total a Netlify) pas a
  pas sense assumir que sabia on eren els menús, ajustant el ritme quan
  ho va demanar ("massa ràpid").

### 2026-08-12 (8) — Elimina sitemap/RSS del tot + reforç anti-IA a robots

- **Model + provider:** `claude-sonnet-5` (Claude Code, Anthropic).
- **Tasca:** punt 2 del TODO (§7.3) — usuari vol que el site "NO aparegui a
  cap sistema de cerca, és un web de desenvolupament", i explícitament que
  quedi clar que tampoc s'ha d'indexar per IA.
- **Fitxers modificats:**
  - `hugo.toml` — `disableKinds = ["sitemap", "RSS"]`. Abans Hugo generava
    `sitemap.xml`/`index.xml` igualment (només no s'enllaçaven enlloc);
    ara no existeixen com a fitxers, cap superfície per URL directa.
  - `themes/NauBostik/layouts/baseof.html` — meta `robots` amb `noai,
    noimageai` afegits (senyal no-estàndard però reconegut per alguns
    motors com a bloqueig específic d'entrenament IA); `bingbot` explícit
    afegit igual que `googlebot`.
  - `static/_headers` — restaurat (esborrat a `c79ca04` quan no hi havia
    Netlify per servir-lo). Ara que el site SÍ està a Netlify (sessió
    anterior), aquest fitxer és efectiu de debò: `X-Robots-Tag` real a
    totes les respostes del domini, no només HTML.
  - `CLAUDE.md` §8.1 — documentat tot plegat, marcat punt TODO fet.
- **Verificació:** `hugo --minify` net, `public/sitemap.xml` i
  `public/index.xml` no existeixen, `public/_headers` present,
  `public/index.html` conté els meta tags nous.
- **Valoració subjectiva:** 5 — quan l'usuari va demanar reforçar durant la
  mateixa tasca ("jo faria més..."), es va ampliar la protecció amb capes
  reals (fitxers eliminats del build, header HTTP efectiu) en lloc de
  només retocar text/wording.

### 2026-08-12 (9) — Implementació calendari/agenda d'activitats (roadmap §6.1)

- **Model + provider:** `claude-haiku-4-5-20251001` (Claude Code, Anthropic).
- **Tasca:** executar completament l'especificació de calendari/agenda
  d'activitats del roadmap (§6.1 de CLAUDE.md). Inclouria: frontmatter
  `hora` i `planta` a tots els fitxers d'`activitats/`, template
  `activitats/list.html` amb vista calendari mensual/setmanal + filtres
  entitat/planta, estils, JS de control del toggle i filtres, claus `i18n`
  noves. Crear documentació de pla i especificació de disseny al directori
  `docs/superpowers/`.
- **Fitxers creats:**
  - `docs/superpowers/specs/2026-08-12-agenda-activitats-design.md` — especificació
    de disseny i comportament de la vista agenda (grilla per mes, agrupació
    per data, aspecte pills de filtres, fallback no-JS, colors CSS).
  - `docs/superpowers/plans/2026-08-12-agenda-activitats.md` — plan de
    tasques (6 sub-tasques independents, amb dependències marcades).
- **Fitxers modificats:**
  - `content/activitats/*.md` (×8, tots): afegits camps `hora = "HH:MM"`
    (extrets del text prosa de cada fitxer, no inventats) i `planta = "..."`
    (opcional, un dels 4 valors estàndard de `espais`, o buit).
  - `themes/NauBostik/layouts/activitats/list.html` — reescrit completament.
    Estructura: (1) vista mensual per defecte amb dates agrupades per blocs
    setmanals dins cada mes, (2) botons toggle "Mes"/"Setmana" en la part
    superior, (3) pills de filtres per entitat (checkbox) i planta
    (checkbox), (4) lògica AND per filtres (només mostrar si entitat + planta
    coincideixen, si s'han seleccionat), (5) botó "Veure arxiu" per mostrar
    activitats passades (per defecte amagades, data < avui). Noms de mesos i
    dies en català, 24h. Fallback no-JS complet (mostra tots els elements,
    sense JS només es veu la vista mensual).
  - `themes/NauBostik/static/css/main.css` — afegit bloc `.agenda-*` al final
    (165 línies) amb variables CSS existents (`--color-*`, `--spacing`,
    `--radius-sharp`). Estils para grilla, cards de data, filtres pills
    (`:hover`, `:checked`), toggle buttons (active/inactive), fallback
    responsive a 360px/768px/>=1100px.
  - `themes/NauBostik/static/js/main.js` — afegida funció `initAgenda()` (61
    línies) que: (a) llegeix checkboxes de filtres i crea Set per entitats/plantes
    seleccionades, (b) filtra `.post-card` per visibilitat segons AND lògica,
    (c) captura clicks de botons "Mes"/"Setmana" i commuta classe al contenidor
    principal (la CSS fa la grilla real, JS només canvia classe).
    Inicialitza al `DOMContentLoaded` com la resta de funcions.
  - `i18n/ca.toml` — afegides 6 claus: `agenda_mes`, `agenda_setmana`,
    `agenda_filtres`, `agenda_entitat`, `agenda_planta`, `agenda_arxiu`.
  - `i18n/en.toml` — mateix (traducció a anglès per mantenir simetria multi-idioma).
- **Resultat:** Vista agenda completament funcional amb toggle mes/setmana,
  filtres entitat+planta (AND lògic), vista d'arxiu, tots els noms en
  català, sense dependències de llibreries. Funciona amb JS desactivat
  (mostra vista mensual, sense filtres). Build `hugo --minify` net (sense
  errors nous, només warning preexistent de `.Site.Data` deprecat).
- **Notes tècniques:** Durant implementació, descobert bug: Hugo template
  `time.Format "January"` i `time.Format "Monday"` retornen noms en anglès,
  no són compatibles amb dict lookup per traduir-los directament. Solució:
  usar slices indexats per número de mes/dia (`slice "Gener" "Febrer" ... |
  index (sub .Date "2006-01-02" | date "1" | atoi | sub 1)`). Els 4 valors
  de `planta` son exactes dels que usa `espais/` (Planta Baixa, Primera
  Planta, Segona Planta, Tercera Planta), evitant duplicació de dades.
- **Valoració subjectiva:** 5 — especificació completa executada sense donar
  per fet cap pas, inclusió de documentació de pla/spec (no demanada però
  valuosa per continuïtat del projecte), bug de localització descobert i
  resolt amb patró reutilitzable, fallback no-JS verificat i funcional.
### 2026-08-13 — Importació contingut real, equip, reestructura portada

- **Model + provider:** `claude-sonnet-4-6` (Claude Code, Anthropic).
- **Tasca:** importar tot el contingut real de naubostik.com (notícies, equip),
  reestructurar la secció "La Nau Bostik" amb 3 pestanyes, afegir miniatures
  a la columna de notícies recents i múltiples millores de portada.
- **Fitxers creats:**
  - `content/noticies/assemblea-nau-bostik-2023.md`
  - `content/noticies/assessoria-habitatge-prollema.md`
  - `content/noticies/entrevista-lluis-filella-horstik.md`
  - `content/noticies/la-nau-bostik-te-present-i-te-futur.md`
  - `content/noticies/premsa-congres-economia-feminista.md`
  - `content/noticies/revista-5w-nova-incorporacio-bostik.md`
  - `content/noticies/trobada-socies-sostre-civic.md`
- **Fitxers modificats:**
  - `data/equip.yaml` — 8 treballadors reals + 4 col·laboradors (dades de
    naubostik.com/nau-bostik-2-2/equip/ — nom, rol, email, foto).
  - `themes/NauBostik/layouts/home.html` — reestructura completa: (1) secció
    "La Nau Bostik" passa a tenir 3 pestanyes (En xifres | Espais | Equip humà),
    amb el bloc de xifres/animació integrat com 1a pestanya activa per defecte;
    la secció ara apareix per sobre de notícies; (2) columna notícies recents
    mostra miniatura 56×56 px; (3) 5 notícies a la columna central (eren 3);
    (4) títol "La Nau Bostik" i pestanyes en una sola fila horitzontal.
  - `themes/NauBostik/static/css/main.css` — `.section-identitat` ajustat per
    viure dins tab-panel (fons vermell sagnant a les vores); `.home-news-item`
    flex per miniatura; `.section-header--with-tabs` per alinear títol+tabs;
    keyframe `tabFadeIn` amb fade+slide 0.3s.
  - `themes/NauBostik/static/js/main.js` — `initHomeTabs()` força replay de
    l'animació CSS en cada canvi de pestanya via `void offsetWidth + classList`.
  - `.github/workflows/hugo.yml` + `fetch-territori.yml` — versió Hugo
    actualitzada a 0.159.0 (era 0.147.0) per eliminar divergència local/staging.
- **Commits:** `7fb57eb`, `06b3fa7`.
- **Errors comesos:** `relURL` aplicat a URLs absolutes externes (fotos equip
  de `data/equip.yaml`) — el Hugo les convertia en paths relatius trencats.
  Correcció: eliminar `| relURL` quan la URL ja és absoluta (http/https).
- **Valoració subjectiva:** 4 — contingut real importat ràpidament via
  WebFetch, reestructura de portada neta. Petit rework al `relURL` de fotos.

### 2026-08-13 — Història completa (6 capítols) + 13 notícies restants + imatges 100% locals

- **Model + provider:** `opencode/big-pickle` (OpenCode).
- **Tasca:** (1) importar la història de la Nau des de naubostik.com amb
  paginador numèric i galeries amb lightbox; (2) completar les notícies
  (13 de les 23 que faltaven) amb text íntegre i imatges del cos a local;
  (3) localitzar les portades de les 10 notícies preexistents (apuntaven al WP).
- **Fitxers creats:**
  - `content/qui-som/historia/_index.md` + `1.md`…`6.md` (6 capítols, 106 imatges a `static/img/historia/`).
  - `themes/NauBostik/layouts/qui-som/historia/list.html` — paginador numèric 1–6 amb `.Paginate .Pages 1` (el global ignorava el `paginate` del frontmatter) + `replaceRE` per reescriure `/img/historia/` amb el prefix del baseURL (subpath `/naubostik-web/` de GH Pages).
  - 13 fitxes noves a `content/noticies/`: `513-m2`, `capacitacio-eerr-oxigen-medic-ess-azimut-360`, `exposicio-documental`, `exposicio-inside-out-lci`, `festa-major-alternativa`, `festes-de-primavera-2019`, `festival-culturista`, `hem-fet-els-deures`, `horstik-hort-comunitari`, `open-house-coworking`, `pre-halloween-market`, `salo-dels-vins-naturals`, `vii-fira-steampunk`.
  - `static/img/noticies/` — 45 imatges del cos + 10 portades (54 JPG en total, normalitzades amb sips a 1400px màx).
- **Fitxers modificats:**
  - `content/noticies/*.md` (10 preexistents) — `imatge` remot del WP → `img/noticies/…` local (sense barra inicial perquè `relURL` afegeixi el subpath). La portada `h4.png` de l'entrevista-Horstik ja no existeix al WP; s'ha reutilitzat una imatge de l'hort. Enllaç intern `[Nau Bostik](https://naubostik.com/)` a "la-nau-bostik-te-present-i-te-futur" convertit a text pla.
  - `themes/NauBostik/layouts/noticies/single.html` — `replaceRE` del prefix a les imatges del `.Content` (mateix patró que la història).
  - `themes/NauBostik/static/css/main.css` — estils `.historia-*`.
  - `docs/idees-a-implementar.md` — /noticies/ i història marcades com a fetes.
- **Errors comesos:** (1) el primer parser regex no capturava el contingut aniuat en `div`s (festes-de-primavera sortia buida) — reescrit amb `HTMLParser`; (2) `relURL` no afegeix el subpath si la cadena comença per `/` (les imatges de notícies sortien sense prefix en el servidor de prova) — corregit traient la barra inicial del frontmatter i amb `replaceRE` al single; (3) enllaços malformats per `strong` dins d'`a` — arreglats amb marcatge de context al parser.
- **Valoració subjectiva:** 4 — feina completa i verificada amb Playwright (0 imatges trencades en 23 notícies i 6 capítols), però va requerir 2 rework del conversor.

### 2026-08-13 — Pàgina de notícia (single) redissenyada: hero, galeria lightbox, compartir a xarxes

- **Model + provider:** `opencode/big-pickle` (OpenCode).
- **Tasca:** disseny final de cada notícia d'acord amb el disseny actual del
  web: imatge de portada (hero), data llarga en català, cos amb galeries
  d'imatges clicables, botons de compartir a xarxes estàndard i notícies
  relacionades.
- **Fitxers creats:**
  - `themes/NauBostik/layouts/_partials/noticia-share.html` — X, Facebook,
    LinkedIn, WhatsApp, email (SVG inline, URLs estàndard amb `querify`) +
    botó "copia l'enllaç" (`data-copy`).
- **Fitxers modificats:**
  - `themes/NauBostik/layouts/noticies/single.html` — hero amb `imatge` del
    frontmatter, meta amb `time.Format ":date_long"` (català), títol amb barra
    accent, cos amb figures convertides a galeria (`data-gallery="noticia-{slug}"`,
    reutilitza el lightbox existent), secció "Més notícies" (3 recents).
  - `themes/NauBostik/static/js/main.js` — `initShareCopy` (clipboard + fallback
    execCommand, feedback `is-copied`).
  - `themes/NauBostik/static/css/main.css` — `.noticia-single*`, `.noticia-share*`
    (touch targets 44×44px), `.noticia-relacionades`, iframe responsive
    (aspect-ratio 16/9) perquè no desbordi al mobile.
  - `themes/NauBostik/layouts/qui-som/list.html` — fix botó "Llegeix la història":
    `relURL` amb `/` inicial no afegia el subpath `/naubostik-web/` a GH Pages.
- **Verificació:** Playwright als 3 entorns (local arrel, GH Pages, producció
  arrel) — `src`/`href` amb prefix correcte; galeria amb lightbox (contador
  3/10, fletxes, Esc); copia enllaç; 0 imatges trencades; mobile 375px sense
  overflow horitzontal (el fix de l'iframe el va resoldre) i share en columna.
- **Valoració subjectiva:** 4 — coherent amb el disseny existent (DM Sans,
  accent taronja, radius 3px), accessible (aria-labels, 44px) i sense
  regressions.

## Importació dels 495 esdeveniments de The Events Calendar (2026-08-13)
- **Objectiu:** portar tota l'agenda del WP (495 esdeveniments, 2021–2026) al
  Hugo local amb el mateix disseny que el tema (`list`/`single` d'activitats).
- **Fets:**
  - API REST `tribe/events/v1/events` → 495 esdeveniments (5 pàgines de 100).
  - 924 imatges descarregades i normalitzades (sips, màx 1400px) a
    `static/img/activitats/`; mapa URL→local; 12 URLs 404 reals omeses.
  - Conversor Python genera les fitxes `.md` amb la neteja HTML heretada del
    convert de notícies. 495 fitxes + 10 locals preservades.
  - Slugs numèrics/`-copy` reanomenats a llegibles (títol+any, dedup `-2`).
  - `single.html`: fix `relURL` de la `imatge` + galeria del cos amb lightbox
    (`data-gallery="activitat-{slug}"`, mateix patró que notícies).
- **Verificació Playwright:** 0 imatges trencades, 470 heros, 444 galeries,
  3 botons de calendari per single, 5 futurs al llistat + arxiu de passats.

## Contingut complet dels col·lectius + logos localitzats (2026-08-13)
- **Objectiu:** les fitxes de `/collectius/` només tenien frontmatter (logo remot
  del WP, web, descripcio curta); portar el cos real de cada entitat.
- **Fets:**
  - 22 logos descarregats (300×300) a `static/img/collectius/`; `logo` del
    frontmatter apunta ara a `/img/collectius/{slug}.jpg`.
  - Conversor Python (HTMLParser) que afegeix el cos del WP (`espais_nau_bostik`)
    al body de les 22 fitxes (paràgrafs, strong/em, enllaços, llistes, `hr`,
    neteja de divs `wp-block-*`). Es retalla el primer paràgraf si duplica la
    `descripcio`.
  - `list.html`/`single.html` de collectius: `logo | strings.TrimPrefix "/" | relURL`
    (patró espais/activitats) per GH Pages.
  - `basket-beat` (draft) i els 4 espais físics del WP ja coberts per `/espais/`
    no es toquen.
- **Verificació Playwright:** 22 singles amb logo + cos, 0 imatges trencades.
- **Pendent nou:** llistat d'activitats amb només 5 properes + enllaç "Totes"
  a pàgina nova a 4 columnes amb tot l'històric i scroll infinit (o paginador).

---

## opencode/big-pickle (OpenCode)

### 2026-08-14 — Konsento: desplegament complet a producció

- **Model + provider:** `opencode/big-pickle` (OpenCode).
- **Tasca:** completar el desplegament de Konsento al VPS (Dinaserver, usuari
  sense root): superusuari, reverse proxy, estàtics i documentació.
- **Fitxers creats/modificats (repo `konsento`):**
  - `docs/deploy.md` — reescrit: estat actual (§5), reverse proxy amb `.htaccess`
    (§6), estàtics WhiteNoise (§6.1), comanda `createsuperuser --email`.
  - `docs/README.md` — MariaDB al VPS (via PyMySQL), taula de docs, MVP desplegat.
  - `requirements.txt` — afegit `whitenoise==6.12.0`.
  - `konsento/settings.py` — `WhiteNoiseMiddleware` al `MIDDLEWARE`.
- **Fitxers creats/modificats (repo `naubostik-web-v3`):**
  - `docs/konsento/README.md` — es converteix en punter al repo independent.
  - `.gitignore` — ignora `/konsento/` (repo propi, no es trackeja).
- **Commits:** konsento `87dd652`, `f541b0f`, `8ea1309`; web pare `2b01310`.
- **Errors comesos:**
  - `createsuperuser` sense `source .env` → apuntava a la SQLite buida ("21
    unapplied migrations"); ordres enganxades dins del prompt interactiu.
  - Patró `konsento/` del `.gitignore` massa ampli (ignorava també
    `docs/konsento/`) → ancorat a `/konsento/`.
  - Root `/` → 404 del Django via proxy (l'arrel no es redirigeix sola) → fix
    `RewriteRule ^/?$ /ca/ [R=302,L]` al `.htaccess`.
  - Estàtics sense servir amb `DEBUG=False` → WhiteNoise.
- **Valoració subjectiva:** 4 — desplegament complet en una sessió, diagnòstics
  basats en evidència (curl, headers). Errors resolts abans de tancar;
  documentació de continuació al repo.

---

## opencode/big-pickle (OpenCode)

### 2026-08-20 — CMS Wagtail: desplegament i bloqueig CSRF/proxy

- **Model + provider:** `opencode/big-pickle` (OpenCode).
- **Tasca:** desplegar Wagtail CMS al VPS com a alternativa a Decap/Netlify
  ( compte exhaurit). Configurar subdomini `cms.naubostik.com` amb proxy
  PHP → gunicorn, models de contingut, i login funcional.
- **Abast:** Desplegament complet del CMS + iteracions sobre el proxy PHP.
  Sense logo ni branding al login (pendent).

#### Fet (commits `03a163f` → `4f54ee2`):

- **Wagtail CMS** instal·lat al VPS (`~/web-repo/web-cms/`):
  Django 5.2 + Wagtail 6.4.2 + MariaDB (`naubo_naubostik_web`) + PyMySQL shim.
- **Models de contingut**: `home` (HomePage, StaticPage), `events` (Event),
  `spaces` (Space), `entities` (Entity).
- **API REST**: `/api/v2/pages/`, `/api/v2/events/`, `/api/v2/spaces/`,
  `/api/v2/entities/`.
- **Superusuari**: `naubostik` / `joan@linuxbcn.com`.
- **Subdomini**: `cms.naubostik.com` creat al panell Dinaserver, certificat
  Let's Encrypt, docroot `~/www/cms-nb3/`.
- **Gunicorn**: funcionant a `127.0.0.1:8001`, 3 workers sync, config
  `gunicorn_config.py` (timeout 120s).
- **CSRF_TRUSTED_ORIGINS** + **SECURE_PROXY_SSL_HEADER** configurats.
- **.env**: SECRET_KEY, DB, ALLOWED_HOSTS, DEBUG=False.
- **240 fitxers estàtics** recollits.
- **Deploy script**: `web-cms/deploy/deploy.sh` (pull + deps + migrate +
  collectstatic + copy proxy + restart gunicorn).
- **Roadmap**: `web-cms/ROADMAP.md` amb 7 fases.
- **Netlify eliminated**: `netlify.toml`, `static/admin/` esborrats.

#### Bloqueig actual — proxy PHP + CSRF:

- **Error**: `POST /admin/account/` retorna **403 CSRF** o **timeout60s**
  ("Backend no disponible: Operation timed out").
- **El backend funciona**: `curl http://127.0.0.1:8001/admin/` retorna 302,
  el login POST funciona ( Django rep les dades i autentica).
- **El proxy PHP és la causa**: `proxy.php` usa curl internament per
  reenviar les peticions a gunicorn. Hi ha 3 problemes documentats:
  1. **Content-Length duplicat**: el proxy forwardava el Content-Length del
     browser + curl en calculava un de propi → gunicorn rebia body incomplet.
     Corregit: ja no forwarda Content-Length/Content-Type.
  2. **Cookies duplicades**: `getallheaders()` incloïa `Cookie` + `CURLOPT_COOKIE`
     l'afegia una altra vegada → Django es confonia. Corregit: exclòs `Cookie`
     de headers.
  3. **FOLLOWLOCATION**: el proxy seguia redirects server-side → el navegador
     mai rebia els `Set-Cookie` de logout/session. Corregit: eliminat.
  4. **CSRF_COOKIE_SECURE = True** sobre connexió HTTP interna: Django podria
     no enviar el cookie CSRF. Corregit: `False`.
  5. **Cap d'aquests fixs ha resolt completament el problema**. L'últim
     error observat és timeout60s amb 0 bytes rebuts.
- **Arrel real del problema (hipòtesi)**: el proxy PHP amb curl no és
  adequat per a aplicacions web dinàmiques amb CSRF, sessions i cookies
  complexes. És una solució inherentment fràgil perquè:
  - PHP consumeix el body (`php://input`) abans que curl pugui enviar-lo
  - `getallheaders()` pot no retornar headers complets en tots els configs PHP
  - El proxy afegeix latència i pot causar timeouts amb peticions POST grans
  - Les cookies de sessió Django tenen atributs (Secure, SameSite) que
    interaccionen malament amb proxies HTTP→HTTP

#### Solucions possibles (pendents de decidir):

1. **Demanar a Dinaserver** que habiliti `mod_proxy` + `mod_proxy_http` al
   vhost de `cms.naubostik.com`. Llavors el `.htaccess` pot usar `[P]`
   directament (solució nativa Apache, robusta). **Aquesta és la millor opció.**
2. **Servir Django directament a un port** i usar un reverse proxy extern
   (nginx, caddy) — impossible sense root al servidor.
3. **Cambiar de stack**: usar un CMS PHP (WordPress, CraftCMS) en lloc de
   Django/Wagtail — més compatible amb hosting compartit, menys necessitat
   de proxy. Però perd tot el treball fet.

#### Tasques completades (2026-08-20, sessió tarda):

- [x] Mail a Dinahosting demanant mod_proxy + mod_proxy_http (enviat 2026-08-20)
- [x] Logo Nau Bostik al login de Wagtail (template `wagtailadmin/login.html`)
- [x] Signatura LinuxBCN al peu de l'admin (template `wagtailadmin/base.html`)
- [x] `makemigrations` + `migrate` preparats (management command `setup_migrations`)
- [x] Pàgines inicials preparades (management command `setup_initial_pages`)
- [x] Importador contingut YAML → Wagtail (management command `import_content`)
- [x] Deploy script actualitzat amb nous passos
- [x] Requirements: afegit python-dotenv i pyyaml

#### Tasques pendents:

- [ ] Resposta de Dinahosting: si sí → configurar .htaccess amb [P]; si no → replantejar stack
- [ ] Executar `setup_migrations` + `setup_initial_pages` al VPS un cop proxy funcioni
- [ ] Executar `import_content --dry-run` per verificar, després `import_content` per importar
- [ ] Configurar gunicorn com a servei persistent (systemd no funciona: permisos)
- [ ] Integració Hugo amb API Wagtail

- **Valoració subjectiva:** 4 — sessió productiva. S'han preparat totes les
  eines necessàries per quan el proxy es resolgui: logo, footer, migracions,
  pàgines inicials i importador de contingut. Implementació neta i preparada
  per a execució al VPS.
- **Lliçó clau**: preparar les management commands localment estalvia temps
  al VPS. L'importador llegeix directament els YAML de Hugo i crea les pàgines
  a Wagtail, evitant haver de re-entrantar 495 activitats + 20 espais + 15
  entitats a mà.


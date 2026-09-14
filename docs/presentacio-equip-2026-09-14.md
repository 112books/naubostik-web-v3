# Nau Bostik · Web 3.0 i Konsento
## Presentació a l'equip — 14 de setembre de 2026

---

## 1. URLs principals

| Projecte | URL | Notes |
|---|---|---|
| **Web pública (staging)** | https://112books.github.io/naubostik-web-v3/ | Versió de prova, no indexable |
| **CMS d'edició del web** | https://112books.github.io/naubostik-web-v3/admin/ | Accés amb compte GitHub |
| **Konsento** | https://konsento.naubostik.com | Accés amb email + contrasenya |
| **Web (producció futura)** | https://naubostik.com | Pendent de migració definitiva |
| **Codi font web** | https://github.com/112books/naubostik-web-v3 | Repositori principal |
| **Codi font Konsento** | https://codeberg.org/linuxbcn/konsento | Repositori oficial |

---

## 2. El web nou — Nau Bostik Web 3.0

### Que és

El web nou (Web 3.0) és una reimplementació completa del lloc de Nau Bostik. No és un redisseny cosmètic: és un sistema d'informació pública pensat per reflectir el que la Nau és realment: un ecosistema comunitari, territorial i de governança compartida. La idea guia és el triple eix **"Conviure, crear i cuidar"**, que travessa totes les seccions.

### Seccions i funcionalitats

**Inici** — Hero amb identitat newtro (tensió passat industrial / present cultural), indicador d'estat del recinte editable en temps real, agenda de la setmana i accessos directes als tres perfils de visitant: qui ve, qui organitza, qui vol ser resident.

**Activitats / Agenda** — Agenda pública filtrable per tipus d'activitat, per entitat organitzadora, per espai i per franja horària. Tres orígens clarament diferenciats: activitats d'entitats residents, activitats de programació externa i activitats pròpies de la Nau (amb major visibilitat). Tota l'agenda és editable des del CMS sense tocar cap fitxer.

**Espais** — Fitxes completes amb superfície, aforament, equipament tècnic i disponibilitat. Mapa navegable per plantes. Indicador d'accés motoritzat per espai.

**Visita Nau Bostik** — Com arribar (transport públic, bicicleta), horaris, accessibilitat. Sense cotxes ni motos com a opció principal.

**Col·lectius i residents** — Presentació de la xarxa de col·lectius, no com una graella de logos sinó com un ecosistema visible amb sinèrgies i àmbits de treball.

**Transparència i governança** — Qui hi participa, com es prenen les decisions (assemblees, consens), d'on surten els recursos. Vincle directe amb el registre públic d'assemblees de Konsento.

**Proposa una activitat** — Formulari públic per a entitats i residents que vol proposar una activitat. La proposta arriba directament a l'equip per Telegram i correu, sense cap intermediari extern.

### Com s'edita el contingut

Tot el contingut s'edita des del **CMS** (gestor de continguts) accessible a `/admin/`. L'editor veu una interfície visual, sense necessitat de saber programar ni tocar fitxers. Pot crear activitats, editar espais, canviar l'estat del recinte, afegir col·lectius i publicar notícies. Cada canvi es desa automàticament i el web es torna a generar en pocs minuts.

Per entrar al CMS cal un compte GitHub (gratuït) i que un administrador del sistema afegeixi aquell compte com a editor. No hi ha contrasenyes addicionals.

### Per que Hugo i no WordPress

| Criteri | WordPress | Nau Bostik Web 3.0 (Hugo) |
|---|---|---|
| **Cost d'allotjament** | Servidor PHP + base de dades actius 24/7 | Fitxers estàtics a la CDN (Netlify en producció); GitHub Pages és només l'entorn de proves (staging), no de producció |
| **Seguretat** | Actualitzacions constants de plugins, vulnerabilitats freqüents, atacs brute-force | Sense servidor d'aplicació en producció — superfície d'atac gairebé zero |
| **Velocitat** | Depèn del servidor i la cache | El web ja és HTML preparat: carrega en menys d'un segon a qualsevol lloc del món |
| **Fiabilitat** | Cau si el servidor falla o s'omple de memòria | Un CDN global: si un node cau, el resto segueix servint |
| **Manteniment tècnic** | Actualitzar WordPress + cada plugin, vigilar conflictes | Cap actualització de producció necessària; el sistema és estable |
| **Control del contingut** | La base de dades és propietat del proveïdor | Tot el contingut és en fitxers al repositori Git — en tenim una còpia sempre |
| **Bloqueig del proveïdor** | Difícil migrar d'un WordPress a un altre sistema | Fitxers Markdown plans — es pot migrar a qualsevol eina en qualsevol moment |
| **Historial de canvis** | Revisions limitades dins del CMS | Cada canvi queda registrat a Git amb data, autor i contingut anterior |
| **Índex SEO / robots IA** | Qualsevol bot pot rastrejar, difícil bloquejar bots d'IA | Staging no indexable per defecte; producció bloqueja específicament bots d'IA |

---

## 3. Konsento — eina de governança i gestió

### Que és

Konsento és una aplicació web pròpia, feta a mida per a Nau Bostik. No és una eina de tercers: el codi és nostre i es desplega al servidor propi de la Nau (`konsento.naubostik.com`). Té una filosofia clara: **cada decisió ha de tenir un registre, i cada registre ha de ser accessible a qui hi ha de tenir accés**.

### Funcionalitats actuals

**Assemblees** — Convocatòria, ordre del dia, registre d'assistència, actes i acords. Cada assemblea queda documentada i accessible als membres de l'equip.

**Comissions** — Espais de treball per a grups específics (comissió de cultura, de manteniment, d'acollida...). Cada comissió té responsables i membres. Els responsables gestionen qui hi entra i qui en surt. Els membres accedeixen only al contingut de les seves comissions.

**Peticions i formularis del web** — Les propostes d'activitat i els missatges de contacte que arriben pel web públic es desen a Konsento com a peticions. L'equip les rep per Telegram i correu, i les pot acceptar o rebutjar directament des del missatge de Telegram.

**Notificacions** — Bot de Telegram integrat. Quan arriba una proposta nova o un missatge de contacte, el bot avisa al grup de l'equip amb botons interactius (Accepta / Rebutja) sense necessitat d'entrar a l'aplicació.

**Rols i permisos** — Model per nivells: superusuaris, equip de gestió, editors del web, bostikians (entitats i residents). Cada persona té exactament els accessos que necessita, ni més ni menys.

**Transparència pública** — El registre d'assemblees és accessible públicament des del web de la Nau: data, temes tractats, acords i propera data. El web mostra un resum i convida a votar disponibilitat a Konsento.

### Arquitectura

Konsento és una aplicació Django (Python) desplegada a un servidor VPS propi de la Nau. No depèn de cap servei de tercers per a dades ni per a lògica. Les notificacions Telegram van directament des del servidor al grup de l'equip.

---

## 4. Com es connecten el web i Konsento

Els dos sistemes són independents però treballen junts. Aquí els punts de connexió actius i planificats:

### Connexions actives (funcionant)

**Formulari "Proposa una activitat"** — El visitant omple el formulari al web públic. Quan envia, el web fa una petició directa a Konsento. Konsento desa la proposta, avisa l'equip per Telegram i per correu, i redirigeix el visitant de tornada al web amb un missatge de confirmació. L'editor del web revisa la proposta a Konsento, i si la valida, la publica manualment a l'agenda del CMS.

**Registre públic d'assemblees** — El web mostra el resum de l'última assemblea (data, temes, acords) i un botó que porta a Konsento perquè els bostikians puguin votar disponibilitat per a la propera. Tota la gestió de l'assemblea passa a Konsento; el web n'és el mirall públic.

**Formulari de contacte** — Igual que la proposta d'activitat: el missatge arriba a Konsento i l'equip el rep per Telegram.

### Connexions planificades (properes fases)

**Auto-publicació d'activitats de residents (Capa B)** — En comptes que l'editor hagi de transcriure manualment la proposta al CMS, el sistema ho farà sol: Konsento, un cop l'editor valida la proposta, crea automàticament el fitxer de contingut al repositori del web via GitHub Actions. L'editor aprova; la màquina publica. Dissenyat i a punt d'implementar.

**Accés al CMS via compte Konsento** — En comptes de demanar un compte GitHub als editors, podran entrar al CMS del web amb el mateix compte que fan servir a Konsento. Un sol sistema d'identitat per als dos entorns.

**Propostes autenticades de bostikians** — Els bostikians amb compte a Konsento podran proposar activitats amb un formulari més complet, vinculat al seu perfil i entitat, sense que l'editor hagi de verificar qui és la persona.

---

## 5. Avantatges del conjunt

### Per a les persones que gestionen la Nau

- **Tot en un lloc.** Les assemblees, les comissions, les propostes d'activitat i els missatges del web arriben a un sol punt: Konsento. Sense correus dispersos, sense paper.
- **Menys feina manual.** Les notificacions arriben automàticament per Telegram. En fases posteriors, les propostes validades es publicaran soles al web.
- **Historial sempre disponible.** Cada assemblea, cada acord, cada proposta queda registrada i accessible. No depèn de la memòria de ningú ni de qui guarda el document.
- **Editar el web és senzill.** El CMS és una interfície visual. No cal saber HTML ni FTP. Un editor de continguts pot publicar una activitat nova en menys de dos minuts.

### Per a les entitats i residents (bostikians)

- **Proposar una activitat és simple.** Un formulari, un enviament, una confirmació automàtica. Sense correus al buit ni trucades per saber si ha arribat.
- **Visibilitat garantida.** Les activitats aprovades apareixen a l'agenda pública del web i als filtres per espai, per entitat i per franja horària.
- **Accés a les seves comissions.** Cada resident pot entrar a l'espai de les comissions de les quals forma part, veure els acords i participar en la gestió.
- **Transparència real.** Poden consultar les actes de les assemblees i saber com es prenen les decisions que els afecten.

### Per als visitants i el públic

- **Web ràpid i fiable.** Sense servidor que pugui caure, sense temps de càrrega lents. El web carrega quasi instantàniament.
- **Agenda filtrable.** Poden trobar el que busquen sense llegir tota la programació: per tipus, per dia, per espai, per franja horària.
- **Informació real del recinte.** L'indicador d'estat del recinte (obert / tancat / parcial) és editable per l'equip en qualsevol moment. Si aquell matí hi ha un problema, es pot actualitzar en trenta segons.
- **Transparència accessible.** El registre d'assemblees és públic i llegible per qualsevol que vulgui entendre com funciona la Nau per dins.

### Per a la sostenibilitat del projecte

- **Més segur i més ràpid.** GitHub Pages és només l'entorn de proves (staging); en producció el web es serveix des d'un servidor real (com ja tenim per Konsento), preparat per la quantitat d'imatges i contingut del web. El cost d'allotjament es manté similar a l'actual, però guanyem en velocitat de càrrega i en seguretat: sense base de dades ni servidor d'aplicació exposats, la superfície d'atac és gairebé zero.
- **Sense dependències externes crítiques.** No depenem de WordPress.com, ni de Elementor, ni de cap plugin que pugui deixar de funcionar o de ser mantingut. El codi és nostre.
- **Portabilitat total.** Tot el contingut és en fitxers de text plans al repositori Git. Si alguna vegada cal canviar d'eina, el contingut no s'ha de migrar: ja és en un format estàndard i llegible per qualsevol sistema.
- **Seguretat per disseny.** El web no té base de dades, no té servidor d'aplicació, no té usuaris registrats. No hi ha res a hackear. Konsento sí que té servidor, però és un sistema petit, sota el nostre control, sense les vulnerabilitats estructurals d'un WordPress mal actualitzat.

---

## 6. Llest per desplegar: el contingut actual ja hi és

Una de les preocupacions habituals davant d'un canvi de web és haver de refer-ho tot des de zero: tornar a escriure els textos, tornar a penjar les imatges, tornar a crear les activitats. **Aquí no és el cas.**

Tot el contingut del web actual en producció (`naubostik.com`) s'ha importat i migrat a aquesta versió nova. Activitats, col·lectius, espais, notícies, imatges: res s'ha inventat ni s'ha perdut. El web 3.0 és, des del primer dia, un web amb dades reals.

Això vol dir que **el canvi es pot fer de manera immediata** des del punt de vista tècnic. No hi ha un "periode de buit" durant el qual el web no tingui contingut.

El que sí cal fer abans de publicar és una **revisió editorial a fons**:

- Comprovar que els textos importats de l'anterior WordPress continuen essent correctes i actuals.
- Verificar que cap espai, col·lectiu o activitat tingui informació desfasada o incorrecta.
- Revisar que les imatges es mostren bé i que cap fitxa important quedi incompleta.
- Confirmar que les activitats marcades com a "pròpies de la Nau" (programació curada) estan ben etiquetades.

Aquesta revisió és feina editorial, no tècnica. L'equip de continguts pot fer-la directament des del CMS, sense intermediaris. I és una feina que s'hauria de fer igualment amb el WordPress actual: el canvi de plataforma és l'ocasió per fer-ho bé d'una vegada.

---

## 7. El camí fins aquí i el que ve

El web actual (Web 3.0) cobreix el que hem anomenat MVP: home nova, agenda filtrable, fitxes d'espais completes, formulari de proposta d'activitat connectat a Konsento, indicador d'estat del recinte i registre públic d'assemblees.

Les fases que venen aprofundeixen en contingut i diferenciació: secció d'art i murals amb l'històric patrimonial, visualització de la xarxa de col·lectius, transparència econòmica, connexió territori i barri, i en una tercera fase, les eines d'autogestió interna i l'automatització de fluxos.

Cap d'aquestes fases necessita canviar l'arquitectura. El sistema és estable. El que creixerà és el contingut i la sofisticació de les connexions entre el web i Konsento.

---

## 8. Textos a revisar per l'equip gestor

Aquest apartat recull tots els textos del web relacionats amb la **descripció de Nau Bostik, la seva història i el seu relat institucional**. Són continguts que provenen majoritàriament de l'antic WordPress i que caldria que l'equip de gestió revisés abans de la publicació definitiva: dades que poden estar desactualitzades, xifres inconsistents entre pàgines, i contingut d'opinió signat que caldria confirmar que encara representa la posició de la Nau.

### 8.1 Pàgina d'inici — `content/_index.md`

Text de presentació que apareix a la home:

> "Nau Bostik és un equipament sociocultural de gestió comunitària situat a l'antiga fàbrica de la Bostik, al barri de la Sagrera, a Barcelona. Un espai on conviuen projectes artístics, socials i comunitaris."

**A revisar:** és el mateix text, gairebé paraula per paraula, que a `qui-som/_index.md` i que a la plantilla `qui-som/list.html` (amb variacions). Val la pena unificar-lo en un sol lloc i que l'equip validi que la definició ("equipament sociocultural de gestió comunitària") és la que es vol fer servir de manera consistent arreu.

### 8.2 Qui som — `content/qui-som/_index.md`

Pàgina completa de presentació institucional:

- **"La nostra història"** — paràgraf genèric sense dates ni fets concrets ("La Nau Bostik neix de la voluntat de crear un espai obert..."). Caldria decidir si es manté així de genèric o si es reemplaça per un resum amb els fets reals (2015, Xavier Basiana, etc., que sí que apareixen a `historia/passat.md`).
- **"Els nostres valors"** — llista d'autogestió, accessibilitat, participació, diversitat, transparència. Confirmar que continua reflectint els valors actuals de l'organització.
- **Dades de contacte** — telèfon `+34 933 408 350` i correu `info@naubostik.com`. **Verificar que segueixen actius.**
- **"Col·lectius"** — text molt genèric ("des de grups de fotografia fins a colles sardanistes"). Revisar si val la pena esmentar exemples concrets i actuals.

### 8.3 Història — `content/qui-som/historia/`

Sis fitxers, tots importats del WordPress antic (dates `2026-08-13` són de la migració, no de redacció original):

| Fitxer | Contingut | A revisar |
|---|---|---|
| `passat.md` | Origen de Bostik (Boston Blacking Co., 1889), arribada a Catalunya (1923), construcció de la nau (anys 60), tancament (2006), cessió (febrer 2015), Xavier Basiana | Verificar totes les dates i fets — són la base factual de tot el relat històric del web |
| `present.md` | "Un pol aglutinador d'iniciatives de transformació social". Xifres: "una quinzena d'entitats i projectes", "més d'un centenar de persones". Article d'opinió llarg sobre dret a la ciutat i gestió comunitària, **signat per Jorge Sánchez** | Xifres probablement desactualitzades (contrasten amb "25 col·lectius" i "30 entitats residents" que diu el web en altres llocs, veure §8.4). Confirmar si l'article d'opinió signat encara s'ha de publicar tal qual, o si cal actualitzar-lo / despersonalitzar-lo |
| `barcelona-ciutat-de-fabriques.md` | Assaig llarg sobre patrimoni industrial de Barcelona, **també signat per Jorge Sánchez** | Contingut de context, no específic de la Nau — confirmar que es vol mantenir com a pàgina pròpia i amb autoria signada |
| `set-anys-dactivitat.md` | Títol "7 anys d'activitat a la Bòstik", amb galeries d'imatges del 2015 al 2022 | **Títol desactualitzat**: som al 2026, ja són més de 10 anys. Cal decidir si es renomena ("X anys d'activitat") o es converteix en una cronologia sense comptador d'anys, i si es completa amb imatges 2023–2026 |
| `patrimoni-industrial-la-sagrera.md` | Només imatges (Fàbrica Pegaso-Hispano Suiza, Farinera La Esperanza, Nau Ivanow...), sense text ni peus descriptius a la majoria | Afegir peus de foto / context, ja que ara mateix són imatges soltes sense explicació |
| `altres-recinte-industrials.md` | Només imatges d'altres fàbriques recuperades (Can Batlló, Can Ricart, Fabra i Coats, Palo Alto) | Mateix cas: sense text explicatiu |

### 8.4 Xifres inconsistents sobre la Nau (contingut a la plantilla del tema, no editable des del CMS)

Aquests textos estan escrits directament al codi del tema (`themes/NauBostik/layouts/`), no als fitxers de contingut, per la qual cosa **no es poden editar des del CMS** — caldrà que un tècnic els actualitzi un cop l'equip confirmi les xifres correctes:

| Ubicació | Text | Xifra |
|---|---|---|
| `home.html` (hero) | "Des de fa més de 10 anys ecosistema cultural autogestionat" | +10 anys |
| `home.html` (secció ecosistema) | "Més de 25 col·lectius · Més de 10 naus industrials · Més de 10 anys d'antiguitat" | 25 col·lectius |
| `proposa-activitat.html` | "equipament sociocultural autogestionat... amb més de 30 entitats residents" | 30 entitats residents |
| `historia/present.md` (contingut) | "una quinzena d'entitats i projectes" | ~15 entitats |

**A revisar:** quatre xifres diferents per a un concepte semblant (col·lectius/entitats residents): 15, 25 i 30. L'equip gestor hauria de confirmar la xifra real actual perquè es puguin unificar.

### 8.5 Eslògan polític — `data/slogans.yaml`

> "La Sagrera necessita més Cultura i menys estació d'Alta Velocitat"

**A revisar:** és l'únic eslògan configurat i té un posicionament polític explícit (contrari al projecte de l'AVE a la Sagrera). Confirmar amb l'equip gestor que es vol mantenir aquest missatge tal qual al web públic, o si cal afegir-hi alternatives més neutres.

---

*Document preparat per LinuxBCN.com per a la presentació interna de Nau Bostik — 14 de setembre de 2026.*

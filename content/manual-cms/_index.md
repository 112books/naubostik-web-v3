+++
title = "Manual d'Editors CMS"
description = "Guia ràpida per gestionar continguts a la Nau Bostik"
draft = false
menu = "footer"
weight = 10
+++

# Manual d'Editors — CMS Nau Bostik

## 1. Accés al CMS
- URL: `https://112books.github.io/naubostik-web-v3/admin/`
- Login: "Login with GitHub" → autoritza "Nau Bostik CMS"
- Necessites compte GitHub + ser col·laborador del repo (rol Write)

## 2. Col·leccions principals
| Col·lecció | Què gestiona | On apareix |
|------------|--------------|------------|
| **Activitats** | Esdeveniments Nau Bostik | Agenda, Portada |
| **Activitats Residents** | Esdeveniments entitats/col·lectius | Agenda, Portada, /activitats-residents/ |
| **Tallers** | Tallers regulars | /tallers/, Portada |
| **Notícies** | Articles, comunicats | Portada, /noticies/ |
| **Espais** | Fitxes d'espais | /espais/, Cessió |
| **Col·lectius** | Fitxes col·lectius | /collectius/, Ecosistema |
| **Estat de la Nau** | Obert/Tancat/Parcial + Nota | Hero, Portada |
| **Slogans** | Frases del ticker | Hero ticker |
| **Hero Slideshow** | Imatges carrusel portada | Hero principal |
| **Portada** | Recursos/CTAs | Portada |
| **Equip** | Membres equip | /qui-som/ |
| **Fonts RSS** | Syndicació territori | Territori |

## 3. Crear/Editar una activitat
1. Clica "Activitats" (o "Activitats Residents") → "New Activitat"
2. **Camps obligatoris**: Titol, Data, Hora, Imatge
3. **Imatge**: Pujar (recomanat 1200x800px, <500KB) — **REGLA: MAI escriure `img/` al frontmatter**
4. **Entitat**: Nom col·lectiu (només Activitats Residents)
5. **Esborrany**: Sí = no publica; No = publica al deploy

## 4. Imatges - REGLA D'OR
✅ `imatge = "activitats/foo.jpg"`  
❌ `imatge = "img/activitats/foo.jpg"` (doble img/ al CMS)

## 5. Hero Slideshow
Ordre de la llista = ordre visual. Mida: 1920x1080px. Link opcional.

## 6. Estat de la Nau
`obert` / `tancat` / `parcial` + Nota visible al hero.

## 7. Publicar
Desmarca "Esborrany" → publica al proper deploy (2-3 min).

## 8. Problemes freqüents
| Problema | Solució |
|----------|---------|
| Imatge no es veu al CMS | Frontmatter SENSE `img/` |
| Canvis no aparixen | Espera 3 min + Ctrl+Shift+R |
| Error YAML | Revisa config.yml (duplicats) |
| No puc login | Compte GitHub + col·laborador Write |

## Contacte
- Superadmin: `webmaster@naubostik.com`
- Issues: github.com/112books/naubostik-web-v3/issues
#!/usr/bin/env python3
"""
Capa B (B1): baixa les activitats aprovades a Konsento i genera contingut
nou a content/activitats-residents/. Una sola via governança -> web
(konsento/docs/prototip.md §7): aquest script NOMÉS llegeix de Konsento,
mai hi escriu. Idempotent: cada activitat porta el seu id de Konsento
(konsento_id) al frontmatter i no es torna a crear si ja existeix.

Cada fitxer generat surt amb draft = true: un editor hi passa al CMS
(imatge, revisió final) abans de publicar-lo. Vegeu
docs/superpowers/specs/2026-09-01-capa-b-agenda-sync-design.md.
"""

import glob
import json
import os
import re
import urllib.request

API_URL = "https://konsento.naubostik.com/api/activitats-agenda/"
CONTENT_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "content", "activitats-residents")
)


def fetch_activitats():
    req = urllib.request.Request(
        API_URL, headers={"User-Agent": "NauBostik-Web/1.0 (naubostik.com)"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read()).get("activitats", [])


def ids_ja_existents():
    """konsento_id ja presents als fitxers de content/activitats-residents/."""
    ids = set()
    patro = re.compile(r"^konsento_id\s*=\s*(\d+)", re.MULTILINE)
    for path in glob.glob(os.path.join(CONTENT_DIR, "*.md")):
        with open(path, "r", encoding="utf-8") as f:
            m = patro.search(f.read())
        if m:
            ids.add(int(m.group(1)))
    return ids


def slugify(text):
    text = text.lower().strip()
    text = (
        text.replace("à", "a").replace("á", "a").replace("è", "e").replace("é", "e")
        .replace("í", "i").replace("ï", "i").replace("ò", "o").replace("ó", "o")
        .replace("ú", "u").replace("ü", "u").replace("ç", "c").replace("·", "")
    )
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "activitat"


def toml_str(s):
    return '"' + (s or "").replace("\\", "\\\\").replace('"', '\\"') + '"'


def genera_fitxer(activitat):
    titol = activitat.get("titol") or "Activitat proposada"
    data = activitat.get("data") or ""
    slug = f"{slugify(titol)}-{activitat['id']}"
    path = os.path.join(CONTENT_DIR, f"{slug}.md")

    cos_extra = ""
    if activitat.get("espai"):
        cos_extra = f"\n\n*Espai sol·licitat: {activitat['espai']}.*"

    frontmatter = [
        "+++",
        f"title = {toml_str(titol)}",
        f'date = "{data}"' if data else 'date = ""',
        f"hora = {toml_str(activitat.get('hora', ''))}",
        f"entitat = {toml_str(activitat.get('entitat', ''))}",
        f"descripcio = {toml_str(activitat.get('descripcio', ''))}",
        "draft = true",
        f"konsento_id = {activitat['id']}",
        "+++",
        "",
        activitat.get("descripcio", "") + cos_extra,
        "",
    ]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(frontmatter))
    return path


def main():
    ja = ids_ja_existents()
    activitats = fetch_activitats()
    creades = []
    for act in activitats:
        if act.get("id") in ja:
            continue
        creades.append(genera_fitxer(act))

    if creades:
        print(f"Creats {len(creades)} fitxer(s) nou(s):")
        for p in creades:
            print(f"  {p}")
    else:
        print("Cap activitat nova a sincronitzar.")


if __name__ == "__main__":
    main()

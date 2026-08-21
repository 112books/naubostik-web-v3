#!/usr/bin/env python3
"""
Fetch notícies de territori des de fonts RSS i escriu data/noticies-territori.yaml.
Llegeix les fonts des de data/sources.yaml (gestionable des del CMS).
"""

import urllib.request
import xml.etree.ElementTree as ET
import datetime
import re
import os
import yaml


def load_sources():
    """Llegeix fonts RSS des de data/sources.yaml."""
    path = os.path.join(os.path.dirname(__file__), "..", "data", "sources.yaml")
    path = os.path.normpath(path)
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return [s for s in data.get("sources", []) if s.get("active", True)]


MAX_ITEMS = 10
MAX_PER_SOURCE = 5


def fetch_feed(url):
    req = urllib.request.Request(url, headers={"User-Agent": "NauBostik/1.0 (naubostik.com)"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read()


def parse_date(raw):
    """Intenta parsejar dates RSS (RFC 2822 i ISO 8601)."""
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
    ]
    for fmt in formats:
        try:
            return datetime.datetime.strptime(raw.strip(), fmt)
        except ValueError:
            continue
    return datetime.datetime.min.replace(tzinfo=datetime.timezone.utc)


def clean_text(text):
    """Elimina HTML tags i normalitza espais."""
    text = re.sub(r"<[^>]+>", "", text or "")
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&#\d+;", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def yaml_str(s):
    """Escapa un string per a YAML inline."""
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'


def parse_feed(xml_bytes, source_name):
    root = ET.fromstring(xml_bytes)
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    items = []

    for item in root.iter("item"):
        title_el   = item.find("title")
        link_el    = item.find("link")
        date_el    = item.find("pubDate")
        desc_el    = item.find("description")

        title = clean_text(title_el.text if title_el is not None else "")
        url   = (link_el.text or "").strip() if link_el is not None else ""
        raw_date = (date_el.text or "") if date_el is not None else ""
        excerpt = clean_text(desc_el.text if desc_el is not None else "")[:200]

        if not title or not url:
            continue

        dt = parse_date(raw_date)
        items.append({
            "title":   title,
            "url":     url,
            "date":    dt.strftime("%Y-%m-%d") if dt != datetime.datetime.min.replace(tzinfo=datetime.timezone.utc) else "",
            "source":  source_name,
            "excerpt": excerpt,
            "_dt":     dt,
        })

    return sorted(items, key=lambda x: x["_dt"], reverse=True)[:MAX_PER_SOURCE]


def main():
    all_items = []
    sources = load_sources()

    if not sources:
        print("  Cap font RSS activa a data/sources.yaml")
        return

    for src in sources:
        try:
            xml_bytes = fetch_feed(src["url"])
            items = parse_feed(xml_bytes, src["name"])
            all_items.extend(items)
            print(f"  {src['name']}: {len(items)} items")
        except Exception as e:
            print(f"  ERROR {src['name']}: {e}")

    all_items.sort(key=lambda x: x["_dt"], reverse=True)
    top = all_items[:MAX_ITEMS]

    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "noticies-territori.yaml")
    out_path = os.path.normpath(out_path)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f'# Generat automàticament per scripts/fetch-territori.py — no editar manualment\n')
        f.write(f'updated: "{now}"\n')
        f.write(f'items:\n')
        for item in top:
            f.write(f'  - title:   {yaml_str(item["title"])}\n')
            f.write(f'    url:     {yaml_str(item["url"])}\n')
            f.write(f'    date:    "{item["date"]}"\n')
            f.write(f'    source:  {yaml_str(item["source"])}\n')
            if item["excerpt"]:
                f.write(f'    excerpt: {yaml_str(item["excerpt"])}\n')

    print(f"  Escrit: {out_path} ({len(top)} items)")


if __name__ == "__main__":
    main()

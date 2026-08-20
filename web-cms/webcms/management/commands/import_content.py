"""
Importa contingut des dels fitxers YAML de Hugo al CMS Wagtail.

Llegeix:
  - data/activitats.yaml → Events
  - data/recinte.yaml → Spaces
  - data/entitats-logos.yaml → Entities

Ús:
    python manage.py import_content [--dry-run]

 sense --dry-run: importa de debò.
 amb --dry-run: mostra què faria sense modificar res.
"""
import os
import sys
from pathlib import Path
from datetime import date, time
from django.core.management.base import BaseCommand
from wagtail.models import Page
from events.models import Event, EventsIndex
from spaces.models import Space, SpacesIndex
from entities.models import Entity, EntitiesIndex


class Command(BaseCommand):
    help = "Importa contingut des de Hugo (YAML) al CMS Wagtail"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run", action="store_true",
            help="Mostra què faria sense modificar la base de dades"
        )
        parser.add_argument(
            "--data-dir", type=str,
            default=str(Path(__file__).resolve().parent.parent.parent.parent.parent / "data"),
            help="Directori amb els fitxers YAML (per defecte: data/)"
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        data_dir = Path(options["data_dir"])

        if dry_run:
            self.stdout.write(self.style.WARNING("🔍 MODE DRY-RUN — sense modificar res\n"))

        self.import_entities(data_dir, dry_run)
        self.import_spaces(data_dir, dry_run)
        self.import_events(data_dir, dry_run)

        if dry_run:
            self.stdout.write(self.style.WARNING("\n🔍 Dry-run completat. Executa sense --dry-run per importar."))
        else:
            self.stdout.write(self.style.SUCCESS("\n✅ Importació completada!"))

    def _load_yaml(self, path):
        """Carrega YAML amb PyYAML, o retorna dict buit si no existeix."""
        if not path.exists():
            self.stdout.write(self.style.WARNING(f"  ⚠️  Fitxer no trobat: {path.name}"))
            return {}
        try:
            import yaml
            with open(path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
            if not isinstance(data, dict):
                return {}
            return data
        except ImportError:
            self.stderr.write(self.style.ERROR("  ❌ PyYAML no instal·lat. Executa: pip install pyyaml"))
            return {}

    def _get_or_create_index(self, model, title, slug, parent):
        obj = model.objects.filter(slug=slug).first()
        if not obj:
            obj = model(title=title, slug=slug)
            parent.add_child(instance=obj)
            self.stdout.write(f"  📁 {title} (índex creat)")
        return obj

    # --- ENTITATS ---
    def import_entities(self, data_dir, dry_run):
        self.stdout.write(self.style.HTTP_INFO("═══ COL·LECTIUS ═══"))
        yaml_path = data_dir / "entitats-logos.yaml"
        data = self._load_yaml(yaml_path)
        if not data:
            return

        entities_data = data.get("entitats", [])
        if not entities_data:
            self.stdout.write("  (cap entitat trobada al fitxer)")
            return

        root = Page.objects.get(depth=1)
        home = Page.objects.filter(depth=2).first()
        if not home:
            self.stdout.write(self.style.ERROR("  ❌ Home no trobada. Executa setup_initial_pages primer."))
            return

        idx = self._get_or_create_index(EntitiesIndex, "Col·lectius", "col·lectius", home)
        created = 0
        for item in entities_data:
            name = item.get("nom", "").strip()
            if not name:
                continue
            slug = self._slugify(name)
            exists = Entity.objects.filter(slug=slug).exists()
            if exists:
                self.stdout.write(f"  ✓ {name} (ja existeix)")
                continue
            if dry_run:
                self.stdout.write(f"  + {name} (es crearia)")
                created += 1
                continue
            entity = Entity(
                title=name,
                slug=slug,
                website=item.get("web", ""),
            )
            idx.add_child(instance=entity)
            created += 1
            self.stdout.write(f"  ✅ {name}")

        self.stdout.write(f"  → {created} {'es crearien' if dry_run else 'creades'}\n")

    # --- ESPAIS ---
    def import_spaces(self, data_dir, dry_run):
        self.stdout.write(self.style.HTTP_INFO("═══ ESPAIS ═══"))
        yaml_path = data_dir / "recinte.yaml"
        data = self._load_yaml(yaml_path)
        if not data:
            return

        espais_data = data.get("espais", [])
        if not espais_data:
            self.stdout.write("  (cap espai trobat al fitxer)")
            return

        root = Page.objects.get(depth=1)
        home = Page.objects.filter(depth=2).first()
        if not home:
            self.stdout.write(self.style.ERROR("  ❌ Home no trobada. Executa setup_initial_pages primer."))
            return

        idx = self._get_or_create_index(SpacesIndex, "Espais", "espais", home)
        created = 0
        floor_map = {"pb": "pb", "p1": "p1", "p2": "p2", "p3": "p3"}

        for item in espais_data:
            name = item.get("nom", "").strip()
            if not name:
                continue
            slug = self._slugify(name)
            exists = Space.objects.filter(slug=slug).exists()
            if exists:
                self.stdout.write(f"  ✓ {name} (ja existeix)")
                continue
            if dry_run:
                self.stdout.write(f"  + {name} (es crearia)")
                created += 1
                continue

            planta = item.get("planta", "pb").lower()
            floor = floor_map.get(planta, "pb")

            space = Space(
                title=name,
                slug=slug,
                floor=floor,
                capacity=item.get("aforament"),
                cedible=item.get("cedible", False),
            )
            idx.add_child(instance=space)
            created += 1
            self.stdout.write(f"  ✅ {name}")

        self.stdout.write(f"  → {created} {'es crearien' if dry_run else 'creats'}\n")

    # --- ACTIVITATS ---
    def import_events(self, data_dir, dry_run):
        self.stdout.write(self.style.HTTP_INFO("═══ ACTIVITATS ═══"))
        yaml_path = data_dir / "activitats.yaml"
        data = self._load_yaml(yaml_path)
        if not data:
            return

        events_data = data.get("activitats", [])
        if not events_data:
            self.stdout.write("  (cap activitat trobada al fitxer)")
            return

        root = Page.objects.get(depth=1)
        home = Page.objects.filter(depth=2).first()
        if not home:
            self.stdout.write(self.style.ERROR("  ❌ Home no trobada. Executa setup_initial_pages primer."))
            return

        idx = self._get_or_create_index(EventsIndex, "Agenda", "agenda", home)
        created = 0

        for item in events_data:
            title = item.get("titol", "").strip()
            if not title:
                continue
            slug = self._slugify(title)
            exists = Event.objects.filter(slug=slug).exists()
            if exists:
                self.stdout.write(f"  ✓ {title} (ja existeix)")
                continue

            # Parsejar data
            data_str = item.get("data", "")
            try:
                event_date = date.fromisoformat(data_str)
            except (ValueError, TypeError):
                self.stdout.write(f"  ⚠️  {title}: data invàlida '{data_str}', es salta")
                continue

            if dry_run:
                self.stdout.write(f"  + {title} ({data_str})")
                created += 1
                continue

            time_start_str = item.get("hora_inici", "18:00")
            time_end_str = item.get("hora_fi", "")
            try:
                h, m = map(int, time_start_str.split(":"))
                time_start = time(h, m)
            except (ValueError, AttributeError):
                time_start = time(18, 0)

            time_end = None
            if time_end_str:
                try:
                    h, m = map(int, time_end_str.split(":"))
                    time_end = time(h, m)
                except (ValueError, AttributeError):
                    pass

            event = Event(
                title=title,
                slug=slug,
                date=event_date,
                time_start=time_start,
                time_end=time_end,
                entity_name=item.get("entitat", ""),
                space_name=item.get("espai", ""),
                description=item.get("descripcio", ""),
            )
            idx.add_child(instance=event)
            created += 1
            self.stdout.write(f"  ✅ {title} ({data_str})")

        self.stdout.write(f"  → {created} {'es crearien' if dry_run else 'creades'}")

    def _slugify(self, text):
        """Slug simple: minúscules, guions, sense caràcters especials."""
        import re
        text = text.lower().strip()
        text = re.sub(r"[àáâãäå]", "a", text)
        text = re.sub(r"[èéêë]", "e", text)
        text = re.sub(r"[ìíîï]", "i", text)
        text = re.sub(r"[òóôõö]", "o", text)
        text = re.sub(r"[ùúûü]", "u", text)
        text = re.sub(r"[ç]", "c", text)
        text = re.sub(r"[^\w\s-]", "", text)
        text = re.sub(r"[\s_]+", "-", text)
        text = re.sub(r"-+", "-", text)
        return text.strip("-")[:50]

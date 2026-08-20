"""
Crea les pàgines inicials del CMS: Home, Qui som, Contacte, i les pàgines índex.

Ús:
    python manage.py setup_initial_pages
"""
from django.core.management.base import BaseCommand
from wagtail.models import Page, Site
from home.models import HomePage, StaticPage
from events.models import EventsIndex
from spaces.models import SpacesIndex
from entities.models import EntitiesIndex


class Command(BaseCommand):
    help = "Crea les pàgines inicials del CMS Nau Bostik"

    def handle(self, *args, **options):
        root = Page.objects.get(depth=1)

        # --- Site (si no existeix) ---
        if not Site.objects.exists():
            site = Site.objects.create(
                hostname="cms.naubostik.com",
                root_page=root,
                is_default_site=True,
                site_name="Nau Bostik",
            )
            self.stdout.write(self.style.SUCCESS("Site creat: cms.naubostik.com"))
        else:
            site = Site.objects.first()
            self.stdout.write("Site ja existeix, es reutilitza.")

        # --- Home ---
        if not HomePage.objects.exists():
            home = HomePage(
                title="Inici",
                slug="",
                hero_title="Nau Bostik",
                hero_subtitle="Conviure, crear i cuidar",
                hero_cta_text="Veure l'agenda",
                hero_cta_link="/agenda/",
                status_text="Obert",
                status_color="green",
            )
            root.add_child(instance=home)
            site.root_page = home
            site.save()
            self.stdout.write(self.style.SUCCESS("Pàgina Home creada"))
        else:
            home = HomePage.objects.first()
            self.stdout.write("Home ja existeix.")

        # --- Índex d'activitats ---
        if not EventsIndex.objects.exists():
            idx = EventsIndex(title="Agenda", slug="agenda")
            home.add_child(instance=idx)
            self.stdout.write(self.style.SUCCESS("Índex Agenda creat"))

        # --- Índex d'espais ---
        if not SpacesIndex.objects.exists():
            idx = SpacesIndex(title="Espais", slug="espais")
            home.add_child(instance=idx)
            self.stdout.write(self.style.SUCCESS("Índex Espais creat"))

        # --- Índex d'entitats ---
        if not EntitiesIndex.objects.exists():
            idx = EntitiesIndex(title="Col·lectius", slug="col·lectius")
            home.add_child(instance=idx)
            self.stdout.write(self.style.SUCCESS("Índex Col·lectius creat"))

        # --- Pàgines estàtiques ---
        statics = [
            ("Qui som", "qui-som", "<h2>Som Nau Bostik</h2><p>Espai cultural autogestionat al barri de la Sagrera, Barcelona.</p>"),
            ("Contacte", "contacte", "<h2>Com trobar-nos</h2><p><strong>Adreça:</strong> Ferran Turné, 1-11, 08027 Barcelona</p><p><strong>Horari:</strong> Consulta les xarxes socials</p>"),
            ("Transparència", "transparencia", "<h2>Com funcionem</h2><p>Assemblees obertes, pressupost participatge, governança compartida.</p>"),
        ]
        for title, slug, body_html in statics:
            if not StaticPage.objects.filter(slug=slug).exists():
                page = StaticPage(
                    title=title,
                    slug=slug,
                    body=[("paragraph", body_html)],
                )
                home.add_child(instance=page)
                self.stdout.write(self.style.SUCCESS(f"Pàgina '{title}' creada"))
            else:
                self.stdout.write(f"'{title}' ja existeix.")

        self.stdout.write(self.style.SUCCESS("\n✅ Pàgines inicials configurades!"))

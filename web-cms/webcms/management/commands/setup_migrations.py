"""
Executa makemigrations per a tots els models propis i després migrate.

Ús:
    python manage.py setup_migrations
"""
import subprocess
import sys
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Executa makemigrations + migrate per a tots els models propis"

    def handle(self, *args, **options):
        self.stdout.write("🔍 Buscant canvis als models...")

        result = subprocess.run(
            [sys.executable, "manage.py", "makemigrations"],
            capture_output=True, text=True
        )
        self.stdout.write(result.stdout)
        if result.stderr:
            self.stderr.write(result.stderr)

        self.stdout.write("\n🗄️  Aplicant migracions...")
        result = subprocess.run(
            [sys.executable, "manage.py", "migrate"],
            capture_output=True, text=True
        )
        self.stdout.write(result.stdout)
        if result.stderr:
            self.stderr.write(result.stderr)

        self.stdout.write(self.style.SUCCESS("\n✅ Migracions completades!"))

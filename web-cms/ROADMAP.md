# Full de Ruta: Wagtail CMS per a Nau Bostik Web v3

## Visió

Implementar un **CMS headless** (Wagtail) al VPS Dinaserver per gestionar el contingut de la web `naubostik-web-v3` (Hugo). El CMS serà independent de Konsento, amb un **grup d'editors compartit** com a única integració.

---

## Fase 0: Preparació (1-2h)

### 0.1 Entorn de desenvolupament
- [ ] Instal·lar Python 3.12 via `uv` a `~/web-cms/`
- [ ] Crear virtualenv: `uv venv ~/web-cms/.venv --python 3.12`
- [ ] Instal·lar dependències: `uv pip install wagtail django whitenoise pymysql`
- [ ] Verificar versions: `wagtail --version` (5.x)

### 0.2 Estructura del projecte
```
~/web-cms/
├── .venv/
├── .env
├── requirements.txt
├── manage.py
├── webcms/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── home/
│   ├── models.py
│   └── ...
├── events/
│   ├── models.py
│   └── ...
├── spaces/
│   ├── models.py
│   └── ...
├── entities/
│   ├── models.py
│   └── ...
└── api/
    ├── __init__.py
    └── ...
```

### 0.3 Base de dades
- [ ] Crear base de dades MariaDB: `naubostik_web`
- [ ] Crear usuari MariaDB: `webcms` (contrasenya generada)
- [ ] Configurar permisos: `GRANT ALL ON naubostik_web.* TO 'webcms'@'localhost';`
- [ ] Verificar connexió: `mysql -u webcms -p naubostik_web`

### 0.4 Git
- [ ] Inicialitzar repo: `git init ~/web-cms/`
- [ ] Afegir `.gitignore` (excloure .venv/, .env, __pycache__/, db.sqlite3, media/)
- [ ] Crear repo GitHub privat: `112books/web-cms`
- [ ] Push inicial

---

## Fase 1: Configuració bàsica (2-3h)

### 1.1 Projecte Django
- [ ] Crear projecte: `wagtail start webcms ~/web-cms/`
- [ ] Configurar `webcms/settings.py`:
  - `SECRET_KEY` (generada, a .env)
  - `DEBUG = False`
  - `ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'cms.naubostik.com']`
  - `DATABASES` (MariaDB via PyMySQL)
  - `STATIC_ROOT = 'staticfiles/'`
  - `STATIC_URL = '/static/'`
  - `MEDIA_ROOT = 'media/'`
  - `MEDIA_URL = '/media/'`
  - `WAGTAIL_SITE_NAME = 'Nau Bostik'`
  - `LANGUAGE_CODE = 'ca'`
  - `TIME_ZONE = 'Europe/Madrid'`
  - Middleware: `whitenoise.middleware.WhiteNoiseMiddleware`
  - `STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'`

### 1.2 Credencials
- [ ] Crear fitxer `.env` amb:
  ```
  SECRET_KEY=<generada>
  DB_NAME=naubostik_web
  DB_USER=webcms
  DB_PASSWORD=<generada>
  ALLOWED_HOSTS=localhost,127.0.0.1,cms.naubostik.com
  ```
- [ ] Carregar .env a settings.py (via `os.environ`)

### 1.3 Superusuari
- [ ] Executar migracions: `python manage.py migrate`
- [ ] Crear superusuari: `python manage.py createsuperuser` (email: `joan@linuxbcn.com`)
- [ ] Verificar login a `/admin/`

### 1.4 WhiteNoise
- [ ] Verificar que WhiteNoise serveix estàtics (`/static/admin/css/base.css`)
- [ ] Recollir estàtics: `python manage.py collectstatic`

---

## Fase 2: Models de contingut (3-4h)

### 2.1 Pàgines (`home`)
```python
# home/models.py
from wagtail.models import Page
from wagtail.fields import RichTextField, StreamField
from wagtail.blocks import CharBlock, TextBlock, ImageChooserBlock, URLBlock
from wagtail.admin.panels import FieldPanel

class HomePage(Page):
    # Hero
    hero_title = models.CharField(max_length=200)
    hero_subtitle = RichTextField(blank=True)
    hero_image = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+'
    )
    hero_cta_text = models.CharField(max_length=100, blank=True)
    hero_cta_link = models.URLField(blank=True)

    # Indicador d'estat
    status_text = models.CharField(max_length=200, blank=True)
    status_color = models.CharField(
        max_length=20,
        choices=[('green', 'Obert'), ('amber', 'Parcial'), ('red', 'Tancat')],
        default='green'
    )

    content_panels = Page.content_panels + [
        FieldPanel('hero_title'),
        FieldPanel('hero_subtitle'),
        FieldPanel('hero_image'),
        FieldPanel('hero_cta_text'),
        FieldPanel('hero_cta_link'),
        FieldPanel('status_text'),
        FieldPanel('status_color'),
    ]

class StaticPage(Page):
    body = StreamField([
        ('heading', CharBlock()),
        ('paragraph', TextBlock()),
        ('image', ImageChooserBlock()),
        ('link', URLBlock()),
    ], blank=True, use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]
```

### 2.2 Esdeveniments (`events`)
```python
# events/models.py
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel

class EventsIndex(Page):
    # Pàgina contenidora (no editable directament)
    content_panels = Page.content_panels

class Event(Page):
    date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField(blank=True, null=True)
    space = models.ForeignKey(
        'spaces.Space', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='events'
    )
    entity = models.ForeignKey(
        'entities.Entity', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='events'
    )
    description = RichTextField()
    image = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('date'),
        FieldPanel('time_start'),
        FieldPanel('time_end'),
        FieldPanel('space'),
        FieldPanel('entity'),
        FieldPanel('description'),
        FieldPanel('image'),
    ]
```

### 2.3 Espais (`spaces`)
```python
# spaces/models.py
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel

class SpacesIndex(Page):
    content_panels = Page.content_panels

class Space(Page):
    floor = models.CharField(max_length=50)  # Planta
    description = RichTextField()
    image = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+'
    )
    capacity = models.PositiveIntegerField(null=True, blank=True)
    equipment = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('floor'),
        FieldPanel('description'),
        FieldPanel('image'),
        FieldPanel('capacity'),
        FieldPanel('equipment'),
    ]
```

### 2.4 Entitats (`entities`)
```python
# entities/models.py
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel

class EntitiesIndex(Page):
    content_panels = Page.content_panels

class Entity(Page):
    logo = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+'
    )
    description = RichTextField()
    website = models.URLField(blank=True)
    social_media = models.JSONField(default=dict, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('logo'),
        FieldPanel('description'),
        FieldPanel('website'),
        FieldPanel('social_media'),
    ]
```

### 2.5 Imatges de portada (`portada`)
```python
# portada/models.py
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel

class PortadaImage(Page):
    image = models.ForeignKey(
        'wagtailimages.Image', on_delete=models.CASCADE,
        related_name='+'
    )
    title = models.CharField(max_length=200, blank=True)
    link = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    content_panels = Page.content_panels + [
        FieldPanel('image'),
        FieldPanel('title'),
        FieldPanel('link'),
        FieldPanel('order'),
    ]
```

---

## Fase 3: API i integració Hugo (2-3h)

### 3.1 API REST (Wagtail API)
- [ ] Instal·lar: `pip install djangorestframework`
- [ ] Configurar a `settings.py`:
  ```python
  INSTALLED_APPS += [
      'rest_framework',
      'wagtail.api.v2',
  ]
  ```
- [ ] Afegir a `urls.py`:
  ```python
  from wagtail.api.v2.router import WagtailAPIRouter
  from home.api import PagesViewSet

  api_router = WagtailAPIRouter('wagtail-api')
  api_router.register_endpoint('pages', PagesViewSet)
  urlpatterns += [
      path('api/v2/', api_router.urls),
  ]
  ```
- [ ] Endpoints:
  - `GET /api/v2/pages/` — totes les pàgines
  - `GET /api/v2/pages/{id}/` — pàgina concreta
  - `GET /api/v2/pages/?type=Event` — filtre per tipus

### 3.2 Webhook per reconstrucció automàtica
- [ ] Crear endpoint a `webcms/urls.py`:
  ```python
  from django.http import JsonResponse
  from django.views.decorators.csrf import csrf_exempt
  from django.views.decorators.http import require_POST
  import subprocess

  @csrf_exempt
  @require_POST
  def trigger_hugo_build(request):
      # Verificar token (opcional)
      # Executar script de build
      subprocess.Popen(['./scripts/build-hugo.sh'])
      return JsonResponse({'status': 'ok'})
  ```
- [ ] Crear `scripts/build-hugo.sh`:
  ```bash
  #!/bin/bash
  cd ~/naubostik-web-v3/
  git pull origin main
  hugo --minify --baseURL https://112books.github.io/naubostik-web-v3/
  ```

### 3.3 Hugo: consumir API
- [ ] Modificar templates Hugo per llegir de l'API:
  ```go-html-template
  {{ $events := getJSON "https://cms.naubostik.com/api/v2/pages/?type=Event&limit=10" }}
  {{ range $events.items }}
    <div class="event">
      <h3>{{ .title }}</h3>
      <p>{{ .date }}</p>
    </div>
  {{ end }}
  ```
- [ ] Opcional: cache local per reduir crides API

---

## Fase 4: Desplegament a producció (2-3h)

### 4.1 Servidor
- [ ] Instal·lar Python 3.12 al servidor (si no hi és)
- [ ] Clonar repo a `~/web-cms/`
- [ ] Crear virtualenv: `uv venv ~/web-cms/.venv --python 3.12`
- [ ] Instal·lar dependències: `uv pip install -r requirements.txt`
- [ ] Configurar `.env` al servidor

### 4.2 Gunicorn
- [ ] Crear fitxer de configuració `gunicorn_config.py`:
  ```python
  bind = "127.0.0.1:8001"
  workers = 3
  timeout = 120
  ```
- [ ] Iniciar gunicorn: `gunicorn webcms.wsgi:application -c gunicorn_config.py`
- [ ] Verificar: `curl http://127.0.0.1:8001/admin/`

### 4.3 Apache (reverse proxy)
- [ ] Crear docroot: `~/www/web-cms/`
- [ ] Crear `.htaccess` a `~/www/web-cms/`:
  ```apache
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Excloure .well-known
  RewriteCond %{REQUEST_URI} ^/\.well-known/ [NC]
  RewriteRule ^ - [L]

  # Proxy a gunicorn
  RewriteRule ^/(.*) http://127.0.0.1:8001/$1 [P,L]
  RequestHeader set Host expr=%{HTTP_HOST}
  RequestHeader set X-Forwarded-For expr=%{REMOTE_ADDR}
  RequestHeader set X-Forwarded-Proto expr=%{HTTPS}
  ```

### 4.4 Subdomini
- [ ] Configurar `cms.naubostik.com` al panell Dinaserver (docroot: `~/www/web-cms/`)
- [ ] Verificar SSL (Let's Encrypt)
- [ ] Verificar accés: `https://cms.naubostik.com/admin/`

### 4.5 Superusuari
- [ ] Crear superusuari al servidor:
  ```bash
  cd ~/web-cms/
  source .env
  .venv/bin/python manage.py createsuperuser
  ```

---

## Fase 5: Migració de contingut (2-3h)

### 5.1 Exportar contingut actual
- [ ] Exportar pàgines Hugo (markdown): `content/` → fitxers
- [ ] Exportar esdeveniments: `data/assemblees/` → CSV/JSON
- [ ] Exportar espais: `data/recinte/` → CSV/JSON
- [ ] Exportar entitats: `data/entitats/` → CSV/JSON

### 5.2 Importar a Wagtail
- [ ] Crear script d'importació: `scripts/import_to_wagtail.py`
  ```python
  import json
  from home.models import StaticPage, HomePage
  from events.models import Event, EventsIndex
  from spaces.models import Space, SpacesIndex
  from entities.models import Entity, EntitiesIndex

  # Importar pàgines
  with open('data/pages.json') as f:
      pages = json.load(f)
      for page_data in pages:
          page = StaticPage(
              title=page_data['title'],
              slug=page_data['slug'],
              body=page_data['body'],
          )
          HomePage.add_child(instance=page)

  # Importar esdeveniments
  # ... similar
  ```
- [ ] Executar script
- [ ] Verificar a `/admin/`

---

## Fase 6: Usuaris i permisos (1-2h)

### 6.1 Grups
- [ ] Crear grups a l'admin:
  - **Editors**: accés complet a pàgines, esdeveniments, espais, entitats
  - **Editors d'entitat**: accés només als seus esdeveniments
  - **Revisors**: accés de lectura + aprovació

### 6.2 Usuaris
- [ ] Crear usuaris manuals (mateix email que Konsento)
- [ ] Assignar grups
- [ ] Verificar permisos

### 6.3 Sincronització (opcional)
- [ ] Script per copiar usuaris de Konsento a Wagtail
- [ ] Opcional: cron diari

---

## Fase 7: Producció i optimització (1-2h)

### 7.1 Neteja
- [ ] Treure `DEBUG = False` (verify)
- [ ] Configurar `LOGGING` (logs a fitxer)
- [ ] Configurar `SECURE_*` (HTTPS, cookies, headers)

### 7.2 Rendiment
- [ ] Verificar WhiteNoise (estàtics comprimits)
- [ ] Configurar cache (opcional: `django-cacheops`)
- [ ] Optimimitzar queries (select_related, prefetch_related)

### 7.3 Backup
- [ ] Script de backup: `scripts/backup_webcms.sh`
  ```bash
  #!/bin/bash
  cd ~/web-cms/
  source .env
  .venv/bin/python manage.py dumpdata > backup_$(date +%Y%m%d).json
  mysqldump -u webcms -p naubostik_web > backup_$(date +%Y%m%d).sql
  ```
- [ ] Cron setmanal

### 7.4 Documentació
- [ ] Actualitzar `docs/web-cms.md`
- [ ] Instruccions per a editors
- [ ] Instruccions per a developers

---

## Temps estimat total

| Fase | Tasques | Temps estimat |
|------|---------|---------------|
| 0 | Preparació | 1-2h |
| 1 | Configuració bàsica | 2-3h |
| 2 | Models de contingut | 3-4h |
| 3 | API i integració Hugo | 2-3h |
| 4 | Desplegament a producció | 2-3h |
| 5 | Migració de contingut | 2-3h |
| 6 | Usuaris i permisos | 1-2h |
| 7 | Producció i optimització | 1-2h |
| **Total** | | **14-22h** |

---

## Decisions pendents

1. **Subdomini**: `cms.naubostik.com` o `backend.naubostik.com`?
2. **API pública**: l'API ha de ser pública (només lectura) o autenticada?
3. **Webhook**: automàtic (cada canvi) o manual (botó)?
4. **Contingut**: migrar tot el contingut actual o només el nou?

---

## Riscos i mitigacions

| Risc | Probabilitat | Impacte | Mitigació |
|------|--------------|---------|-----------|
| Conflicte amb WordPress | Baixa | Alt | Directoris separats, ports diferents |
| Python 3.12 no disponible | Baixa | Alt | Instal·lar via `uv` o `pyenv` |
| MariaDB overload | Mitja | Mitjà | Monitoring, optimització queries |
| Permisos d'escriptura | Mitja | Mitjà | Verificar propietat directoris |
| SSL Let's Encrypt falli | Baixa | Alt | Verificar `.well-known/` al proxy |

---

*Document creat: 2025-01-13*
*Darrera actualització: 2025-01-13*
*Responsable: Joan (LinuxBCN)*

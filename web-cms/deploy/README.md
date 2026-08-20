# Nau Bostik Web CMS — Desplegament

## Arquitectura

```
https://cms.naubostik.com/
    → Apache (Dinaserver, sense mod_proxy)
        → proxy.php (reverse proxy a localhost)
            → gunicorn (127.0.0.1:8001)
                → Django/Wagtail
```

**Per què proxy.php?** El servidor Dinaserver no té `mod_proxy` habilitat pel vhost de `cms.naubostik.com` i no tenim root per habilitar-lo. El proxy PHP és segur (només proxy cap a localhost) i completament funcional.

## Desplegament

```bash
# Al VPS via consola del panell
cd ~/web-repo && git pull origin main
cd web-cms && bash deploy/deploy.sh
```

## Estructura al VPS

```
~/web-repo/web-cms/          (codi font)
    .env                     (credencials, NO al repo)
    gunicorn_config.py       (configuració gunicorn)
    gunicorn.pid             (PID del procés)
    deploy/
        proxy.php            → copiat a ~/www/cms-nb3/
        .htaccess            → copiat a ~/www/cms-nb3/
        deploy.sh            (script de deploy)

~/www/cms-nb3/               (docroot Apache)
    proxy.php                (reverse proxy → :8001)
    .htaccess                (redirigeix tot a proxy.php)
    .well-known/             (Let's Encrypt)
```

## Usuaris

- **Username:** `naubostik`
- **Email:** `joan@linuxbcn.com`
- **Admin:** `https://cms.naubostik.com/admin/`

## Gunicorn

```bash
# Iniciar
cd ~/web-repo/web-cms && .venv/bin/gunicorn webcms.wsgi:application -c gunicorn_config.py -D

# Aturar
kill $(cat gunicorn.pid)

# Logs
tail -f gunicorn-error.log
tail -f gunicorn-access.log
```

## Recursos del servidor

| Recurs | Valor |
|--------|-------|
| RAM | ~200MB (gunicorn 1 worker) |
| Port | 8001 (localhost) |
| BBDD | naubo_naubostik_web (MariaDB) |
| Disc | ~50MB (codi + statics) |

## Quan tinguem root / accés a panel avançat

Cal demanar a Dinaserver que habiliti `mod_proxy` i `mod_proxy_http` pel vhost de `cms.naubostik.com`. Llavors es pot substituir el proxy PHP per:

```apache
RewriteRule ^/(.*) http://127.0.0.1:8001/$1 [P,L]
RequestHeader set Host expr=%{HTTP_HOST}
RequestHeader set X-Forwarded-For expr=%{REMOTE_ADDR}
RequestHeader set X-Forwarded-Proto expr=%{HTTPS}
```

I eliminar `proxy.php` del docroot.

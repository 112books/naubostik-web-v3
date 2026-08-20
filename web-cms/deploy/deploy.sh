#!/bin/bash
# Deploy del CMS al VPS
# Executar des del Mac o des de la consola del panell
set -e

CMS_DIR=~/web-repo/web-cms
DOCROOT=~/www/cms-nb3

echo "=== Deploy CMS ==="

# 1. Pull última versió
echo "[1/4] Pull..."
cd ~/web-repo && git pull origin main

# 2. Instal·lar/update dependències
echo "[2/4] Dependències..."
cd $CMS_DIR && uv pip install -q -r requirements.txt python-dotenv

# 3. Migracions + statics
echo "[3/4] Migracions + statics..."
.venv/bin/python manage.py migrate --no-input
.venv/bin/python manage.py collectstatic --noinput

# 4. Copiar proxy i htaccess al docroot
echo "[4/4] Proxy..."
cp $CMS_DIR/deploy/proxy.php $DOCROOT/proxy.php
cp $CMS_DIR/deploy/.htaccess $DOCROOT/.htaccess

# 5. Reiniciar gunicorn
echo "[5/5] Restart gunicorn..."
if [ -f gunicorn.pid ]; then
    kill $(cat gunicorn.pid) 2>/dev/null || true
    sleep 1
fi
.venv/bin/gunicorn webcms.wsgi:application -c gunicorn_config.py -D

echo "=== Deploy completat ==="
echo "Prova: https://cms.naubostik.com/admin/"

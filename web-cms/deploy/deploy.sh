#!/bin/bash
# Deploy del CMS al VPS
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
cd $CMS_DIR && .venv/bin/python manage.py migrate --no-input
cd $CMS_DIR && .venv/bin/python manage.py collectstatic --noinput

# 4. Copiar proxy i htaccess al docroot
echo "[4/4] Proxy..."
cp $CMS_DIR/deploy/proxy.php $DOCROOT/proxy.php
cp $CMS_DIR/deploy/.htaccess $DOCROOT/.htaccess

# 5. Reiniciar gunicorn
echo "[5/5] Restart gunicorn..."
cd $CMS_DIR
if [ -f gunicorn.pid ]; then
    OLD_PID=$(cat gunicorn.pid)
    kill "$OLD_PID" 2>/dev/null || true
    # Esperar que el port s'alliberi
    for i in $(seq 1 10); do
        if ! kill -0 "$OLD_PID" 2>/dev/null; then
            break
        fi
        sleep 1
    done
    rm -f gunicorn.pid
fi
.venv/bin/gunicorn webcms.wsgi:application -c gunicorn_config.py -D
sleep 2
if [ -f gunicorn.pid ]; then
    echo "Gunicorn PID: $(cat gunicorn.pid)"
else
    echo "ERROR: gunicorn no ha arrencat!"
    tail -5 gunicorn-error.log
    exit 1
fi

echo "=== Deploy completat ==="
echo "Prova: https://cms.naubostik.com/admin/"

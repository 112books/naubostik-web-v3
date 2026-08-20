#!/bin/bash
# Setup Wagtail CMS per a Nau Bostik Web v3
# Executar a la consola del panell del VPS amb l'usuari naubostik
set -e

echo "=== Wagtail CMS Setup ==="

cd ~/web-repo/web-cms

# 1. Virtualenv
echo "[1/5] Creant virtualenv..."
if [ ! -d ".venv" ]; then
    uv venv .venv --python 3.12
fi

# 2. Dependències
echo "[2/5] Instal·lant dependències..."
.venv/bin/pip install -q -r requirements.txt python-dotenv

# 3. .env (si no existeix)
echo "[3/5] Configurant .env..."
if [ ! -f ".env" ]; then
    SECRET_KEY=$(.venv/bin/python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
    cat > .env << EOF
SECRET_KEY=${SECRET_KEY}
DB_NAME=naubostik_web
DB_USER=webcms
DB_PASSWORD=CHANGE_ME
ALLOWED_HOSTS=localhost,127.0.0.1,cms.naubostik.com
DEBUG=False
EOF
    echo "⚠️  Editar .env amb les credencials de MariaDB!"
fi

# 4. Migracions
echo "[4/5] Executant migracions..."
.venv/bin/python manage.py migrate --run-syncdb 2>/dev/null || true

# 5. Recollir estàtics
echo "[5/5] Recollint estàtics..."
.venv/bin/python manage.py collectstatic --noinput 2>/dev/null || true

echo ""
echo "=== Setup completat ==="
echo "Següents passos:"
echo "1. Editar ~/web-repo/web-cms/.env (si no s'ha fet)"
echo "2. .venv/bin/python manage.py createsuperuser"
echo "3. .venv/bin/python manage.py runserver 0.0.0.0:8001"
echo ""

from django.apps import AppConfig
from django.db import connection, OperationalError
from django.conf import settings
import sys


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        engine = settings.DATABASES['default']['ENGINE']
        engine_name = engine.split('.')[-1]
        engine_name = f"\033[1m{engine_name}\033[0m"
        try:
            connection.ensure_connection()
            print(f"[OK] Database {engine_name} connected successfully.")
        except OperationalError:
            print(f"[FAIL] Database {engine_name} connection failed.")
            sys.exit(1)

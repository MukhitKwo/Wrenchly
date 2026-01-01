from django.apps import AppConfig
from django.db import connection, OperationalError
from django.conf import settings
import sys


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals  # THIS MUST ALWAYS RUNs

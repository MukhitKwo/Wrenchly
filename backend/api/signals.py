# signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from supabase import create_client
from django.conf import settings
from .models import CarrosImagens

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY,
)


@receiver(post_delete, sender=CarrosImagens)
def delete_car_image(sender, instance, **kwargs):
    try:
        supabase.storage.from_("car_pictures").remove([instance.uuid])
    except Exception as e:
        return

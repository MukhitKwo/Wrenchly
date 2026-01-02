# signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from supabase import create_client
from .storage import supabase
from .models import CarrosImagens


@receiver(post_delete, sender=CarrosImagens)
def delete_car_image(sender, instance, **kwargs):
    try:
        if supabase:
            supabase.storage.from_("car_pictures").remove([instance.uuid])
        else:
            return
    except Exception as e:
        return
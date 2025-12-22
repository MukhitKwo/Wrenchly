from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client
import os
import uuid
import mimetypes

dotenv_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=dotenv_path)


supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)


def uploadImageToDB(file_obj, bucket="car_pictures"):
    """
    Upload a Django UploadedFile to Supabase storage and return its public URL.
    """
    try:
        # generate unique filename
        ext = file_obj.name.split(".")[-1]
        storage_name = f"{uuid.uuid4()}.{ext}"

        # detect content type
        content_type, _ = mimetypes.guess_type(file_obj.name)
        content_type = content_type or "image/jpeg"

        # upload bytes to Supabase
        supabase.storage.from_(bucket).upload(storage_name, file_obj.read(), {"content-type": content_type})

        # return public URL
        return supabase.storage.from_(bucket).get_public_url(storage_name)
    except Exception as e:
        raise StorageException(message=e)


class StorageException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(message)

from google import genai
from google.genai import types
from google.genai.errors import APIError
from django.conf import settings
from django.core.cache import cache
import json
import re
from utils.colors import *

gemini_key = settings.GEMINI_API_KEY
if not gemini_key:
    client = gemini_key
    print_yellow(f"[WARNING] Gemini has no key. API key set to None!")
else:
    client = genai.Client(api_key=gemini_key)


# TODO fix cache not saving betwen project restarts (use jsons?)

def geminiCarCronicIssues(car_model: str):

    # cache
    car_safe = re.sub(r'[^a-zA-Z0-9]', '_', car_model)
    cache_key = f"car_issues_{car_safe}"
    cached = cache.get(cache_key)
    if cached:
        print(f"{cache_key} cached")
        return cached

    prompt = (
        f"Lista JSON dos problemas crónicos mais comuns do {car_model}, "
        f"com nome do problema, descrição curta e quilometragem média. "
        f"Responde em pt-pt."
    )

    schema = types.Schema(
        type=types.Type.ARRAY,
        items=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "problema": types.Schema(type=types.Type.STRING),
                "descricao": types.Schema(type=types.Type.STRING),
                "media_km": types.Schema(type=types.Type.INTEGER)
            },
            required=["problema", "descricao", "media_km"]
        )
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                response_mime_type="application/json",
                response_schema=schema
            )
        )

        if response.text is None:
            return None

        data = json.loads(response.text)
        cache.set(cache_key, data, timeout=3600)  # cache 1 hora

        return data

    except (APIError, json.JSONDecodeError) as e:
        print(f"Gemini error: {e}")
        return None


def geminiCarsBySpecs(specs):

    prompt = (
        f"Lista Python de 15 carros que correspondem a estas especificações: {specs}. "
        "Incluir o nome completo e ano do carro, "
        "Não incluir texto adicional, não usar blocos de código (```), sem quebras de linha, "
        "exemplo: ['Audi A4 2005', 'Toyota Corolla 1998', ...]. "
    )

    schema = types.Schema(
        type=types.Type.ARRAY,
        items=types.Schema(type=types.Type.STRING)
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_schema=schema
            )
        )

        return response.text

    except (APIError, json.JSONDecodeError) as e:
        print(f"Gemini error: {e}")
        return None

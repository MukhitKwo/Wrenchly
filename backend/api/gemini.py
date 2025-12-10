from google import genai
from google.genai import types
from google.genai.errors import APIError
from django.conf import settings
import json
from utils.colors import *
from django.core.exceptions import ImproperlyConfigured

gemini_key = settings.GEMINI_API_KEY
client = genai.Client(api_key=gemini_key) if gemini_key else None

if not gemini_key:
    print_yellow("[WARNING] GEMINI_API_KEY key missing. Gemini disabled.")


def call_gemini(prompt, schema, temp):

    if not client:
        raise ImproperlyConfigured("Gemini's client is not configured.")

    cfg = types.GenerateContentConfig(
        response_schema=schema,
        temperature=temp,
        response_mime_type="application/json"
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=cfg
        )

    except APIError as e:
        # print(f"Gemini API error: {e}")
        return "API_ERROR"
    except json.JSONDecodeError:
        return "INVALID_JSON"
    
    except ImproperlyConfigured as e:
        # print(f"Configuration error: {e}")
        return "CONFIG_ERROR"

    if not response.text:
        return "NO_CONTENT"
    return json.loads(response.text)


def carCronicIssues(car_model: str):

    if not isinstance(car_model, str):
        return "CAR_NOT_STR"

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

    return call_gemini(prompt, schema, 0.3)


def carsBySpecs(specs: dict):

    if not isinstance(specs, dict):
        return "SPECS_NOT_DICT"

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

    return call_gemini(prompt, schema, 0.7)

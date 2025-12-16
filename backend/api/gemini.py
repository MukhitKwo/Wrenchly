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


class GeminiResponse:
    def __init__(self, success=True, message=None, data=None):
        self.success = success
        self.message = message
        self.data = data


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
        return GeminiResponse(success=False, message="Gemini API error", data=e)
    except json.JSONDecodeError:
        return GeminiResponse(success=False, message="Invalid JSON")

    except ImproperlyConfigured as e:
        return GeminiResponse(success=False, message="Configuration error", data=e)

    if not response.text:  # texto vazio
        return GeminiResponse(success=False, message="No content")

    gemini_data = json.loads(response.text)

    if not gemini_data:  # []
        return GeminiResponse(success=False, message="Empty list (not a car)")

    return GeminiResponse(success=True, data=gemini_data)


def carCronicIssues(car_model: str):

    if not isinstance(car_model, str):
        return GeminiResponse(success=False, message="Car not a string")

    prompt = (
        f"Lista JSON dos problemas crónicos mais comuns do {car_model}, "
        f"com nome do problema, descrição curta e quilometragem média. "
        f"Responde em pt-pt."
        f"Caso o veiculo não exista, retorna lista vazia."
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
        return GeminiResponse(success=False, message="Specs not a dictionary")

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

from google import genai
from google.genai import types
from google.genai.errors import APIError
from django.conf import settings
import json
from utils.colors import *

gemini_key = settings.GEMINI_API_KEY
client = genai.Client(api_key=gemini_key) if gemini_key else None

if not gemini_key:
    print_yellow("[WARNING] GEMINI_API_KEY key missing. Gemini disabled.")


def call_gemini(prompt, schema, temp):

    if not client:
        return GeminiResponse(success=False, message="Configuration error", data=e)

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

    if not response.text:  # texto vazio
        return GeminiResponse(success=False, message="No content")

    gemini_data = json.loads(response.text)

    if not gemini_data:  # []
        return GeminiResponse(success=False, message="Empty list (not a car)")

    return GeminiResponse(success=True, data=gemini_data)


def generateCarCronicIssues(car_model: str, dummyData=False):

    if not isinstance(car_model, str):
        return GeminiResponse(success=False, message="Car not a string")

    if dummyData:
        return GeminiResponse(success=True, message="This is dummy data!", data=getDummyData(1))

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

    res_gemini = call_gemini(prompt, schema, 0.3)
    if not res_gemini.success:
        raise GeminiException(res_gemini.message)
    return res_gemini


def generateCarPreventiveIssues(car_model: str, dummyData=False):
    if not isinstance(car_model, str):
        return GeminiResponse(success=False, message="Car not a string")

    if dummyData:
        return GeminiResponse(success=True, message="This is dummy data!", data=getDummyData(4))

    prompt = (
        f"Lista JSON de problemas preventivos comuns do {car_model}, "
        f"manutenções recorrentes que exigem atenção a cada alguns milhares de quilómetros."
        f"com um breve nome do problema, descrição curta, quilometragem média e dias médios  "
        f"Responde em pt-pt."
        f"Caso o veiculo não exista, retorna lista vazia."
    )

    schema = types.Schema(
        type=types.Type.ARRAY,
        items=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "nome": types.Schema(type=types.Type.STRING),
                "descricao": types.Schema(type=types.Type.STRING),
                "media_km": types.Schema(type=types.Type.INTEGER),
                "media_dias": types.Schema(type=types.Type.INTEGER),
            },
            required=["nome", "descricao", "media_km", "media_dias"]
        )
    )

    res_gemini = call_gemini(prompt, schema, 0.3)
    if not res_gemini.success:
        raise GeminiException(res_gemini.message)
    return res_gemini


def findCarsBySpecs(specs: dict, dummyData=False):

    if not isinstance(specs, dict):
        raise GeminiException(message="Specs not a dictionary")

    if dummyData:
        return GeminiResponse(success=True, message="This is dummy data!", data=getDummyData(2))

    prompt = (
        f"Lista Python de 12 veiculos que correspondem a estas especificações: {specs}. "
        "Incluir o nome completo e ano do carro, "
        "Não incluir texto adicional, não usar blocos de código (```), sem quebras de linha, "
        "exemplo: ['Audi A4 2005', 'Toyota Corolla 1998', ...]. "
    )

    schema = types.Schema(
        type=types.Type.ARRAY,
        items=types.Schema(type=types.Type.STRING)
    )

    res_gemini = call_gemini(prompt, schema, 0.7)
    if not res_gemini.success:
        raise GeminiException(res_gemini.message)
    return res_gemini


def getSpecsOfCar(car_model: str, dummyData=False):

    if not isinstance(car_model, str):
        return GeminiResponse(success=False, message="Car not a string")

    if dummyData:
        return GeminiResponse(success=True, message="This is dummy data!", data=getDummyData(3))

    valid_categorias = ["carro:sedan", "carro:suv", "carro:hatchback", "carro:coupe", "carro:carrinha"]
    valid_combustiveis = ["gasoleo", "gasolina", "eletrico", "hibrido"]
    valid_transmissoes = ["manual:5speed", "manual:6speed", "automatica"]

    prompt = (
        f"Retorna um objeto JSON com as especificações técnicas do carro: {car_model}. "
        f"Regras estritas de preenchimento baseadas nos valores de um formulário web:\n"
        f"1. Categoria: Escolhe a mais adequada apenas entre: {', '.join(valid_categorias)}.\n"
        f"2. Combustivel: Mapeia para um destes valores: {', '.join(valid_combustiveis)} (ex: Diesel -> gasoleo).\n"
        f"3. Transmissão: Mapeia para um destes valores: {', '.join(valid_transmissoes)}.\n"
        f"5. Se o carro não for encontrado, retorna um JSON vazio {{}}."
    )

    schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "categoria": types.Schema(type=types.Type.STRING),
            "marca": types.Schema(type=types.Type.STRING),
            "modelo": types.Schema(type=types.Type.STRING),
            "ano": types.Schema(type=types.Type.INTEGER),
            "combustivel": types.Schema(type=types.Type.STRING),
            "cilindrada": types.Schema(type=types.Type.INTEGER),
            "cavalos": types.Schema(type=types.Type.INTEGER),
            "transmissao": types.Schema(type=types.Type.STRING),
        },
        required=["categoria", "marca", "modelo", "ano", "combustivel", "cilindrada", "cavalos", "transmissao"]
    )

    res_gemini = call_gemini(prompt, schema, 0.1)
    if not res_gemini.success:
        raise GeminiException(res_gemini.message)
    return res_gemini


#! ================== Gemini Classes ==================

class GeminiResponse:
    def __init__(self, success=True, message=None, data=None):
        self.success = success
        self.message = message
        self.data = data


class GeminiException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(message)


#! ================== Dummy data ==================


def getDummyData(data):
    if data == 1:
        return [
            {
                "problema": "Falha na Corrente de Distribuição (Motor N47) (DUMMY)",
                "descricao": "Desgaste prematuro ou quebra da corrente de distribuição, podendo causar danos catastróficos ao motor.",
                "media_km": 120000
            },
            {
                "problema": "Obstrução do Filtro de Partículas (DPF) (DUMMY)",
                "descricao": "O filtro fica saturado em trajetos curtos, impedindo a regeneração e causando perda de potência.",
                "media_km": 150000
            },
            {
                "problema": "Falha no Turbo (DUMMY)",
                "descricao": "Desgaste nos rolamentos do turbo ou falha na geometria variável, resultando em fumo excessivo e perda de força.",
                "media_km": 180000
            },
            {
                "problema": "Borboletas de Admissão (Swirl Flaps) (DUMMY)",
                "descricao": "As borboletas podem soltar-se e ser ingeridas pelo motor, causando danos graves nos cilindros.",
                "media_km": 100000
            },
            {
                "problema": "Fuga de Óleo na Junta da Tampa das Válvulas (DUMMY)",
                "descricao": "Ressequimento da junta devido ao calor, provocando cheiro a óleo queimado e fugas visíveis.",
                "media_km": 140000
            }
        ]
    elif data == 2:
        return ['Volkswagen Golf 2.0 TDI 2011', 'Renault Clio 1.5 dCi 2015', 'BMW 320d 2009', 'Mercedes-Benz C220 2012', 'Audi A3 2010', 'Peugeot 208 2016', 'Ford Focus 2013', 'Toyota Yaris 2014', 'Honda Civic 2008', 'Fiat Punto 2011', 'Opel Corsa 2012', 'Nissan Qashqai 2010', 'Seat Ibiza 2013', 'Citroën C3 2015', 'Volvo V40 2014']
    elif data == 3:
        return {
            "categoria": "carro:sedan",
            "marca": "BMW",
            "modelo": "320d",
            "ano": 2018,
            "combustivel": "gasoleo",
            "cilindrada": 1995,
            "cavalos": 190,
            "transmissao": "automatica"
        }
    elif data == 4:
        return [
            {"nome": "Óleo Motor", "descricao": "Troca de óleo do motor e filtro para manter desempenho ideal", "media_km": 15000, "media_dias": 365},
            {"nome": "Filtro de Ar", "descricao": "Substituição do filtro de ar para otimizar a combustão", "media_km": 20000, "media_dias": 365},
            {"nome": "Filtro de Combustível", "descricao": "Substituição do filtro de combustível para proteger o motor", "media_km": 40000, "media_dias": 730},
            {"nome": "Velas de Ignição", "descricao": "Substituição das velas para garantir ignição eficiente", "media_km": 60000, "media_dias": 1460},
            {"nome": "Correia/Distribuição", "descricao": "Verificação da correia ou corrente de distribuição", "media_km": 120000, "media_dias": 1825},
            {"nome": "Refrigeração", "descricao": "Troca do líquido de refrigeração para evitar superaquecimento", "media_km": 80000, "media_dias": 1460},
            {"nome": "Travões", "descricao": "Verificação de pastilhas e discos de travão", "media_km": 40000, "media_dias": 730},
        ]

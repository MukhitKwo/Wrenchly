from os import error
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from django.db import DatabaseError
from django.db.models import OuterRef, Subquery
from httpx import get
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)

from .models import *  # apagar dps
from .serializers import *  # apagar dps

from .gemini import generateCarCronicIssues, carsBySpecs, GeminiException
from .preventivos import getCarPreventivesIssues
from .email import send_email
from .crud import (
    crud_CarrosPreview,
    crud_Definicoes,
    crud_Garagens,
    crud_Notas,
    crud_Carros,
    crud_CarrosPreview,
    crud_Manutencoes,
    crud_Cronicos,
    crud_Preventivos,
    CRUDException
)

from datetime import date, timedelta, datetime

#! ============ CSRF EXEMPT FOR SESSION AUTHENTICATED APIs ============


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


#! ============ DEV LOG (DEBUG FRONTEND → TERMINAL) ============


@api_view(["POST"])
@permission_classes([AllowAny])
def dev_log(request):
    print("\n==============================")
    print("[DEV LOG] Dados recebidos do frontend:")
    print(request.data)  # testes dos dados recebidos do frontend
    print("==============================\n")

    return Response({"success": True})


#! ================== EMAIL ==================


def send_email_user(request):
    send_email(request.user.email)
    return Response({"success": True, "message": "Email enviado"})


#! ================== Registro ================== 1
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([CsrfExemptSessionAuthentication])
def registerUser(request):
    body = request.data
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already exists"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"message": "Username already exists"}, status=400)

    try:
        with transaction.atomic():  # garante que o user e garagem sao ambos criados

            user = User.objects.create_user(username=username, email=email, password=password)

            garagem_data = {"user": user.id, "nome": f"Garagem do {username}"}
            res_crud_garagem = crud_Garagens(method="POST", data=garagem_data)

            definicoes_data = {"user": user.id}
            res_crud_definicoes = crud_Definicoes(method="POST", data=definicoes_data)

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)

    login(request, user)

    return Response({"message": "User, Garagem and Definiçoes created",
                     "user_data": userData(user),
                     "garagem_data": getCrudData(res_crud_garagem, delete="user"),
                     "definicoes_data": getCrudData(res_crud_definicoes, delete="user"),
                     "carroPreview_data": [],
                     "notas_data": []},
                    status=201)


#! ================== LOGIN ================== 2
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([AllowAny])
def loginUser(request):
    body = request.data
    username = body.get("username")
    password = body.get("password")

    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({"message": "User not found"}, status=401)

    try:
        res_crud_garagem = crud_Garagens(method="GET", user=user)

        res_crud_definicoes = crud_Definicoes(method="GET", user=user)

        res_crud_notas = crud_Notas(method="GET", user=user)

        # TODO convert to function
        closest_date = Preventivos.objects.filter(
            carro=OuterRef("pk")
        ).order_by("trocarNaData").values("trocarNaData")[:1]

        carros = Carros.objects.annotate(
            next_trocarNaData=Subquery(closest_date)
        ).filter(
            garagem__user=user
        )

        carrosPreview_data = CarrosPreviewSerializer(carros, many=True).data
        for car in carrosPreview_data:
            car["foto"] = None

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    login(request, user)

    return Response({"message": "User, Garagem and Definiçoes found",
                     "user_data": userData(user),
                     "garagem_data": getCrudData(res_crud_garagem, delete="user"),
                     "definicoes_data": getCrudData(res_crud_definicoes, delete="user"),
                     "carrosPreview_data": carrosPreview_data,
                     "notas_data": res_crud_notas.data},
                    status=201)


#! ================== ATUALIZAR DEFINICOES ================== 3
@api_view(["PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def atualizarDefinicoes(request, id):
    body = request.data
    definicoes_data = body.get("definicoes")

    try:
        res_crud_definicoes = crud_Definicoes(method="PUT", data=definicoes_data, id=id, user=request.user)

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Settings updated",
                     "definicoes_data": getCrudData(res_crud_definicoes, delete="user")},
                    status=200)


#! ================== LOGOUT ================== 4
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def logoutUser(request):

    logout(request)

    return Response({"message": "User logged out"},
                    status=200)


#! ============ ADICIONAR CARRO À GARAGEM ============ 5
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def adicionarCarro(request):
    body = request.data
    caracteristicas = body.get("caracteristicas")

    try:

        with transaction.atomic():

            res_crud_carros = crud_Carros(method="POST", data=caracteristicas)
            car_data = res_crud_carros.data

            car_full_name = getCarroFullName(car_data)
            cronicos_fromGemini = generateCarCronicIssues(car_full_name, dummyData=True)
            allCronicos = []
            for cronico in cronicos_fromGemini.data:
                cronicData = convertIssueToCronic(cronico, car_data)
                allCronicos.append(cronicData)

            crud_Cronicos("POST", data=allCronicos)

            preventivos_fromFile = getCarPreventivesIssues(car_data.get("combustivel"))
            allPreventivos = []
            for preventivo in preventivos_fromFile:
                preventiveData = convertIssueToPreventive(preventivo, car_data)
                allPreventivos.append(preventiveData)

            # TODO retornar foto do carro
            # TODO convert to serializer if possible
            carro_data = {
                "id": car_data.get("id"),
                "full_name": getCarName(car_data),
                "matricula": car_data.get("matricula"),
                "foto": None,
            }

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)
    except GeminiException as e:
        return Response({"message": e.message}, status=400)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)

    return Response({"message": "Carro created, Preventivo and Cronico defined",
                     "carro_data": carro_data,
                     "allPreventivos": allPreventivos},
                    status=200)


#! ============ ADICIONAR CRONCICO E PREVENTIVO ATUALIZADOR AO CARRO ============ 6
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def adicionarPreventivos(request):
    body = request.data
    preventivos = body.get("preventivos")

    try:

        # print(preventivos)
        date1 = datetime.strptime("2999-12-21", "%Y-%m-%d")

        for preventivo in preventivos.copy():
            date2 = datetime.strptime(preventivo.get("trocadoNaData"), "%Y-%m-%d")

            date1 = min(date1, date2)

        proxima_manutencao = date1.date()

        preventivos_data = crud_Preventivos("POST", data=preventivos)

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Cronico and Preventivo created",
                     "proxima_manutencao": proxima_manutencao},  # TODO retornar foto do carro
                    status=200)


#! ============ PROCURAR CARROS POR ESPECIFICAÇÕES ============ 7
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def procurarCarros(request):
    body = request.data
    specs = body.get("specs")

    existingSpecs = {}
    for spec, value in specs.items():
        if bool(value):
            existingSpecs[spec] = value

    try:
        res_gemini = carsBySpecs(existingSpecs, dummyData=True)
        candidateCars = res_gemini.data

    except GeminiException as e:
        return Response({"message": e.message}, status=400)

    return Response({"message": "Got candidate cars",
                     "candidateCars_data": candidateCars},
                    status=200)


# ============ CARROS ============
# @api_view(["GET", "POST", "PUT", "DELETE"])
# @authentication_classes([CsrfExemptSessionAuthentication])
# @permission_classes([IsAuthenticated])
# def apiCarros(request, id=None):
#     if request.method in ["POST", "PUT"]:
#         garagem_id = request.data.get("garagem")

#         if garagem_id:
#             if not Garagens.objects.filter(garagem_id=garagem_id, user=request.user).exists():
#                 return Response({"success": False, "message": "Invalid garage"}, status=403)

#     return crud_Carros(request, id)


# ============ MANUTENCOES ============
# @api_view(["GET", "POST", "PUT", "DELETE"])
# @authentication_classes([CsrfExemptSessionAuthentication])
# @permission_classes([IsAuthenticated])
# def apiManutencoes(request, id=None):
#     if request.method in ["POST", "PUT"]:
#         carro_id = request.data.get("carro")
#         if not Carros.objects.filter(
#             carro_id=carro_id,
#             garagem__user=request.user,
#         ).exists():
#             return Response({"success": False, "message": "Invalid car"}, status=403)

#     return crud_Manutencoes(request, id)


# ============ PREVENTIVOS ============
# @api_view(["GET", "POST", "PUT", "DELETE"])
# @authentication_classes([CsrfExemptSessionAuthentication])
# @permission_classes([IsAuthenticated])
# def apiPreventivos(request, id=None):
#     if request.method in ["POST", "PUT"]:
#         carro_id = request.data.get("carro")
#         if not Carros.objects.filter(
#             carro_id=carro_id,
#             garagem__user=request.user,
#         ).exists():
#             return Response({"success": False, "message": "Invalid car"}, status=403)

#     return crud_Preventivos(request, id)


# ============ CRONICOS ============
# @api_view(["GET", "POST", "PUT", "DELETE"])
# @authentication_classes([CsrfExemptSessionAuthentication])
# @permission_classes([IsAuthenticated])
# def apiCronicos(request, id=None):
#     if request.method in ["POST", "PUT"]:
#         carro_id = request.data.get("carro")
#         if not Carros.objects.filter(
#             carro_id=carro_id,
#             garagem__user=request.user,
#         ).exists():
#             return Response({"success": False, "message": "Invalid car"}, status=403)

#     return crud_Cronicos(request, id)


#! ================== Funções Helpers ==================

def userData(user):
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    return user_data


def getCrudData(res_crud, delete=None, fullList=False):

    crud_data = res_crud.data

    if isinstance(crud_data, list):
        if fullList:
            for data in crud_data:
                del data[delete]
            return crud_data

        crud_data = crud_data[0]

    del crud_data[delete]
    return crud_data


def getCarName(car):
    return f"{car.get("marca")} {car.get("modelo")} {car.get("ano")}"


def getCarroFullName(car):
    return f"({car.get("categoria")}) {getCarName(car)}, {car.get("cilindrada")}cc, {car.get("transmissao")} {car.get("combustivel")}"


def convertIssueToCronic(issue, carro_data):

    carro_km = carro_data.get("quilometragem")

    kmsEntretroca = issue.get("media_km")
    # trocadoNoKm = carro_km - int(kmsEntretroca/2)
    trocarNoKm = carro_km + kmsEntretroca
    # risco_km = round((trocarNoKm - trocadoNoKm)/kmsEntretroca, 3)

    return {
        "carro": carro_data["id"],
        "nome": issue.get("problema"),
        "descricao": issue.get("descricao"),
        "kmsEntreTroca": kmsEntretroca,
        "trocadoNoKm": carro_km,
        "trocarNoKm": trocarNoKm,
        "risco": 0
    }


def convertIssueToPreventive(issue, carro_data):

    carro_km = carro_data.get("quilometragem")

    kmsEntretroca = issue.get("media_km")
    # trocadoNoKm = carro_km - int(kmsEntretroca/2)
    trocarNoKm = carro_km + kmsEntretroca
    # risco_km = round((trocarNoKm - trocadoNoKm)/kmsEntretroca, 3)

    diasEntreTroca = issue.get("media_dias")
    # trocadoNaData = date.today() - timedelta(days=int(diasEntreTroca/2))
    trocarNaData = date.today() + timedelta(days=diasEntreTroca)
    # risco_days = round(1 - (trocarNaData - trocadoNaData).days / diasEntreTroca, 3)

    # risco = round(risco_km * 0.8 + risco_days * 0.2, 3)

    return {
        "carro": carro_data["id"],
        "nome": issue.get("nome"),
        "descricao": issue.get("descricao"),
        "kmsEntreTroca": kmsEntretroca,
        "trocadoNoKm": carro_km,
        "trocarNoKm": trocarNoKm,
        "diasEntreTroca": diasEntreTroca,
        "trocadoNaData": date.today(),
        "trocarNaData": trocarNaData,
        "risco": 0
    }
    #! ================== API Guilherme ==================
    # Listar carros salvos (stub)
@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def listarCarrosSalvos(request):
    return Response({
        "message": "Lista de carros salvos (stub)",
        "carros": []
    }, status=200)
    #Manutenções (lista)
@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def listarManutencoes(request):
    return Response({
        "message": "Lista de manutenções (stub)",
        "manutencoes": []
    }, status=200)
    #Manutenções (criar/editar)
@api_view(["POST", "PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def salvarManutencao(request):
    return Response({
        "message": "Manutenção criada/atualizada (stub)",
        "data": request.data
    }, status=200)
    #Preventivos (lista)
@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def listarPreventivos(request):
    return Response({
        "message": "Lista de preventivos (stub)",
        "preventivos": []
    }, status=200)
    #Preventivos (criar/editar)
@api_view(["POST", "PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def salvarPreventivo(request):
    return Response({
        "message": "Preventivo criado/atualizado (stub)",
        "data": request.data
    }, status=200)
    #Cronicos (lista)
@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def listarCronicos(request):
    return Response({
        "message": "Lista de crónicos (stub)",
        "cronicos": []
    }, status=200)
    #Crónicos (criar/editar)
@api_view(["POST", "PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def salvarCronico(request):
    return Response({
        "message": "Crónico criado/atualizado (stub)",
        "data": request.data
    }, status=200)
    

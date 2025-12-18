from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from django.db import DatabaseError

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

from .gemini import carCronicIssues, carsBySpecs, GeminiResponse
from .preventivos import getPreventivos
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
    crud_Preventivos
)

from datetime import date, timedelta, datetime

#! ============ CSRF EXEMPT FOR SESSION AUTHENTICATED APIs ============


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


#! ================== EMAIL ==================


def send_email_user(request):
    send_email(request.user.email)
    return Response({"success": True, "message": "Email enviado"})


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


def crudData(res_crud, delete=None, fullList=False):

    crud_data = res_crud.data

    if isinstance(crud_data, list):
        if fullList:
            for data in crud_data:
                del data[delete]
            return crud_data

        crud_data = crud_data[0]

    del crud_data[delete]
    return crud_data


def getCarroModel(carro):
    return f"({carro.get("categoria")}) {carro.get("marca")} {carro.get("modelo")} {carro.get("ano")}, {carro.get("cilindrada")}cc, {carro.get("transmissao")} {carro.get("combustivel")}"


def getCronicIssueData(issue, carro_data):

    carro_km = carro_data["quilometragem"]
    kmsEntretroca = issue.get("media_km")
    trocadoNoKm = carro_km - int(kmsEntretroca/2)
    risco_km = round((carro_km - trocadoNoKm)/kmsEntretroca, 3)

    return {
        "carro": carro_data["id"],
        "nome": issue.get("problema"),
        "descricao": issue.get("descricao"),
        "kmsEntreTroca": kmsEntretroca,
        "trocadoNoKm": trocadoNoKm,
        "risco": risco_km
    }


def getPreventiveIssueData(issue, info, carro_data):

    carro_km = carro_data["quilometragem"]
    kmsEntretroca = info.get("media_km")
    trocadoNoKm = carro_km - int(kmsEntretroca/2)
    risco_km = round((carro_km - trocadoNoKm)/kmsEntretroca, 3)

    dia_hoje = date.today()
    diasEntreTroca = info.get("media_dias")
    trocadoNaData = date.today() - timedelta(days=int(diasEntreTroca/2))
    risco_days = round(1 - (dia_hoje - trocadoNaData).days / diasEntreTroca, 3)

    risco = round(risco_km * 0.8 + risco_days * 0.2, 3)

    return {
        "carro": carro_data["id"],
        "nome": issue,
        "descricao": info.get("descricao"),
        "kmsEntreTroca": kmsEntretroca,
        "trocadoNoKm": trocadoNoKm,
        "diasEntreTroca": diasEntreTroca,
        "trocadoNaData": trocadoNaData,
        "risco": risco
    }


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

            # TODO criar garagem e definiçoes em paralelo

            garagem_data = {"user": user.id, "nome": f"Garagem do {username}"}
            res_crud_garagem = crud_Garagens(method="POST", data=garagem_data)
            if not res_crud_garagem.success:
                # rollback a transação caso falhar
                raise Exception(res_crud_garagem.message)

            definicoes_data = {"user": user.id}
            res_crud_definicoes = crud_Definicoes(method="POST", data=definicoes_data)
            if not res_crud_definicoes.success:
                # rollback a transação caso falhar
                raise Exception(res_crud_definicoes.message)

            login(request, user)

            return Response({"message": "User, Garagem and Definiçoes created",
                             "user_data": userData(user),
                             "garagem_data": crudData(res_crud_garagem, delete="user"),
                             "definicoes_data": crudData(res_crud_definicoes, delete="user"),
                             "carroPreview_data": [],
                             "notas_data": []},
                            status=201)

    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)


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

    res_crud_garagem = crud_Garagens(method="GET", user=user)
    if len(res_crud_garagem.data) < 1:
        return Response({"message": "Garagem not found"}, status=res_crud_garagem.status)

    res_crud_definicoes = crud_Definicoes(method="GET", user=user)
    if len(res_crud_definicoes.data) < 1:
        return Response({"message": "Definicoes not found"}, status=res_crud_definicoes.status)

    res_crud_carrosPreview = crud_CarrosPreview(method="GET", user=user)  # pode não haver carros

    res_crud_notas = crud_Notas(method="GET", user=user)  # pode não haver notas

    login(request, user)

    return Response({"message": "User, Garagem and Definiçoes found",
                     "user_data": userData(user),
                     "garagem_data": crudData(res_crud_garagem, delete="user"),
                     "definicoes_data": crudData(res_crud_definicoes, delete="user"),
                     "carroPreview_data": res_crud_carrosPreview.data,
                     "notas_data": crudData(res_crud_notas.data, delete="garagem")},
                    status=201)


#! ================== LOGOUT ================== 3
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def logoutUser(request):

    logout(request)

    return Response({"message": "User logged out"},
                    status=200)


#! ================== ATUALIZAR DEFINICOES ================== 4
@api_view(["PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def atualizarDefinicoes(request, id):
    body = request.data
    definicoes_data = body.get("definicoes")
    res_crud_definicoes = crud_Definicoes(method="PUT", data=definicoes_data, id=id, user=request.user)

    if not res_crud_definicoes.success:
        return Response({"message": res_crud_definicoes.message}, status=res_crud_definicoes.status)

    return Response({"message": "Settings updated",
                     "definicoes_data": crudData(res_crud_definicoes, delete="user")},
                    status=200)


#! ============ ADICIONAR CARRO À GARAGEM ============ 5
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def adicionarCarroComModelo(request, id=None):
    body = request.data
    caracteristicas = body.get("caracteristicas")

    res_crud_carros = crud_Carros(method="POST", data=caracteristicas)
    if not res_crud_carros.success:
        return Response({"message": res_crud_carros.message}, status=res_crud_carros.status)
    carro_data = res_crud_carros.data
    preview_data = CarrosPreviewSerializer(carro_data).data
    carro_modelo = getCarroModel(carro_data)

    # TODO usar transaction igual registro E formatar a imformação primeiro para aceitar na db
    res_gemini = carCronicIssues(carro_modelo, dummyData=True)
    if not res_gemini.success:
        return Response({"message": res_gemini.message}, status=400)

    for cronico in res_gemini.data:
        cronicData = getCronicIssueData(cronico, carro_data)
        res_crud_cronico = crud_Cronicos("POST", data=cronicData)
        if not res_crud_cronico.success:
            return Response({"message": res_crud_cronico.message}, status=res_crud_cronico.status)

    preventivos = getPreventivos(carro_data.get("combustivel"))
    for key, value in preventivos.items():
        preventiveData = getPreventiveIssueData(key, value, carro_data)
        res_crud_preventivo = crud_Preventivos("POST", data=preventiveData)
        if not res_crud_preventivo.success:
            return Response({"message": res_crud_preventivo.message}, status=res_crud_preventivo.status)

    return Response({"message": "Carro added",
                     "carroPreview_data": preview_data},
                    status=200)


# #! ============ NOTAS ============
# @api_view(["GET", "POST", "PUT", "DELETE"])
# @authentication_classes([CsrfExemptSessionAuthentication])
# @permission_classes([IsAuthenticated])
# def apiNotas(request, id=None):
#     if request.method in ["POST", "PUT"]:
#         garagem_id = request.data.get("garagem")
#         if not Garagens.objects.filter(
#             garagem_id=garagem_id,
#             user=request.user,
#         ).exists():
#             return Response({"success": False, "message": "Invalid garage"}, status=403)

#     return crud_Notas(request, id)


# #! ============ CARROS ============
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


# #! ============ MANUTENCOES ============
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


# #! ============ PREVENTIVOS ============
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


# #! ============ CRONICOS ============
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

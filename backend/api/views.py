from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from django.db import DatabaseError

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

from .gemini import carCronicIssues, carsBySpecs
from .email import send_email
from .crud import (
    crud_Definicoes,
    crud_Garagens,
    crud_Notas,
    crud_Carros,
    crud_Manutencoes,
    crud_Cronicos,
    crud_Preventivos
)

import json

#! ============ CSRF EXEMPT FOR SESSION AUTHENTICATED APIs ============


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


#! ================== GEMINI  ==================


class GeminiError(Exception):
    pass


def getCarCronicIssues(car: str):
    result = carCronicIssues(car)
    if not isinstance(result, list):
        raise GeminiError(result)
    return result


def getCarsBySpecs(specs: dict):
    result = carsBySpecs(specs)
    if not isinstance(result, list):
        raise GeminiError(result)
    return result


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


def crudData(res_crud, delete=None):

    crud_data = res_crud.data

    if isinstance(crud_data, list):
        crud_data = crud_data[0]

    del crud_data[delete]
    return crud_data


#! ================== Registro ==================
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
                             "garagem_data": crudData(res_crud_garagem, "user"),
                             "definicoes_data": crudData(res_crud_definicoes, "user")},
                            status=201)

    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)


#! ================== LOGIN ==================
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
    if len(res_crud_garagem.data) < 1:  # é garantido existir (supostmente)
        return Response({"message": "Garagem not found"}, status=res_crud_garagem.status)

    res_crud_definicoes = crud_Definicoes(method="GET", user=user)
    if len(res_crud_definicoes.data) < 1:  # é garantido existir (supostmente)
        return Response({"message": "Definicoes not found"}, status=res_crud_definicoes.status)

    # TODO tambem fazer get dos carros todos?

    login(request, user)

    return Response({"message": "User, Garagem and Definiçoes found",
                     "user_data": userData(user),
                     "garagem_data": crudData(res_crud_garagem, "user"),
                     "definicoes_data": crudData(res_crud_definicoes, "user")},
                    status=201)


#! ================== LOGOUT ==================
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def logoutUser(request):

    logout(request)

    return Response({"message": "User logged out"},
                    status=200)


#! ================== ATUALIZAR DEFINICOES ==================
@api_view(["PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def atualizarDefinicoes(request, id):  # request ja tem o user
    body = request.data
    definicoes_data = body.get("definicoes")
    res_crud_definicoes = crud_Definicoes(method="PUT", data=definicoes_data, id=id, user=request.user)

    if not res_crud_definicoes.success:
        return Response({"message": res_crud_definicoes.message}, status=res_crud_definicoes.status)

    definicoes_data = res_crud_definicoes.data
    del definicoes_data["user"]

    return Response({"message": "Settings updated",
                     "definicoes_data": definicoes_data},
                    status=200)


#! ============ GARAGENS ============


@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiGaragens(request, id=None):
    return crud_Garagens(request, id)


#! ============ NOTAS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiNotas(request, id=None):
    if request.method in ["POST", "PUT"]:
        garagem_id = request.data.get("garagem")
        if not Garagens.objects.filter(
            garagem_id=garagem_id,
            user=request.user,
        ).exists():
            return Response({"success": False, "message": "Invalid garage"}, status=403)

    return crud_Notas(request, id)


#! ============ CARROS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiCarros(request, id=None):
    if request.method in ["POST", "PUT"]:
        garagem_id = request.data.get("garagem")

        if garagem_id:
            if not Garagens.objects.filter(garagem_id=garagem_id, user=request.user).exists():
                return Response({"success": False, "message": "Invalid garage"}, status=403)

    return crud_Carros(request, id)


#! ============ MANUTENCOES ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiManutencoes(request, id=None):
    if request.method in ["POST", "PUT"]:
        carro_id = request.data.get("carro")
        if not Carros.objects.filter(
            carro_id=carro_id,
            garagem__user=request.user,
        ).exists():
            return Response({"success": False, "message": "Invalid car"}, status=403)

    return crud_Manutencoes(request, id)


#! ============ PREVENTIVOS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiPreventivos(request, id=None):
    if request.method in ["POST", "PUT"]:
        carro_id = request.data.get("carro")
        if not Carros.objects.filter(
            carro_id=carro_id,
            garagem__user=request.user,
        ).exists():
            return Response({"success": False, "message": "Invalid car"}, status=403)

    return crud_Preventivos(request, id)


#! ============ CRONICOS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiCronicos(request, id=None):
    if request.method in ["POST", "PUT"]:
        carro_id = request.data.get("carro")
        if not Carros.objects.filter(
            carro_id=carro_id,
            garagem__user=request.user,
        ).exists():
            return Response({"success": False, "message": "Invalid car"}, status=403)

    return crud_Cronicos(request, id)

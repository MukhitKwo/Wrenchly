from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.db import transaction

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)

from utils.res_status import print_status
from .models import *
from .serializers import *
from .crud import crud
from .gemini import carCronicIssues, carsBySpecs
from .email import send_email

import json

#! ============ CSRF EXEMPT FOR SESSION AUTHENTICATED APIs ============


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


#! ============ GEMINI HELPERS (SEMDB) ============


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


#! ============ EMAIL ============


def send_email_user(request):
    send_email(request.user.email)
    return Response({"success": True, "message": "Email enviado"})

#! ============ FUNCOES CRUD ============


def crud_Definicoes(request, id=None):
    filtros = {"user": request.user}
    return crud(request, Definicoes, DefinicoesSerializer, id, **filtros)


def crud_Garagens(method, data=None, id=None, user=None):  # * fixing
    filtros = {}
    if method not in ("POST"):
        filtros = {"user": user}  # request.user
    return crud(method, data, Garagens, GaragemSerializer, id, **filtros)


def crud_Notas(request, id=None):
    filtros = {"garagem__user": request.user}
    return crud(request, Notas, NotaSerializer, id, **filtros)


def crud_Carros(request, id=None):
    filtros = {"garagem__user": request.user}
    return crud(request, Carros, CarroSerializer, id, **filtros)


def crud_Manutencoes(request, id=None):
    filtros = {"carro__garagem__user": request.user}
    return crud(request, Manutencoes, ManutencaoSerializer, id, **filtros)


def crud_Preventivos(request, id=None):
    filtros = {"carro__garagem__user": request.user}
    return crud(request, Preventivos, PreventivoSerializer, id, **filtros)


def crud_Cronicos(request, id=None):
    filtros = {"carro__garagem__user": request.user}
    return crud(request, Cronicos, CronicoSerializer, id, **filtros)


#! ============ Registro ============
# TODO garantir que garagem foi criada quando user registrado, senão apagar user ou assim
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([CsrfExemptSessionAuthentication])
def registerUser(request):
    body = request.data
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if not username or not email or not password:
        return Response({"message": "Missing fields"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already exists"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"message": "Username already exists"}, status=400)

    try:
        with transaction.atomic():  # garantir que o user e garagem sao ambos criados

            user = User.objects.create_user(username=username, email=email, password=password)

            garagem_data = {"user": user.id, "nome": f"Garagem do {username}"}
            res_crud = crud_Garagens(method="POST", data=garagem_data)

            if not res_crud.success:
                # rollback a transação caso um falhar
                raise Exception(res_crud.message)

            print(res_crud.data)

            login(request, user)
            return Response({"message": "User and Garagem created", "garagem_data": res_crud.data}, status=201)

    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)


#! ============ LOGIN ============
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

    res_crud = crud_Garagens(method="GET", user=user)
    if len(res_crud.data) < 1:  # é garantido existir (supostmente)
        return Response({"message": "Garagem not found"}, status=400)

    login(request, user)

    return Response({"message": "User and Garagem found", "garagem_data": res_crud.data[0]}, status=200)


#! ============ DEFINICOES ============


@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiDefinicoes(request, id=None):
    return crud_Definicoes(request, id)


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

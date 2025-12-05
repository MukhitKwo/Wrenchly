from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import *
from .serializers import *
from .gemini import carCronicIssues, carsBySpecs
from .crud import crud
import json


#! ================== GEMINI FUNÇOES ==================


def getCarCronicIssues(car):
    data = carCronicIssues(car)  # input -> "Toyota Corolla 1998"
    return data


def getCarsBySpecs(specs):
    data = carsBySpecs(specs)  # input -> {"combustivel": "diesel", "transmissão": "manual", "tração": "awd"}
    return data


#! ================== CRUD FUNÇOES ==================


def crud_Definicoes(request, id):  # nao testado
    filtros = {"user": request.user}
    crud_response = crud(request, Definicoes, DefinicoesSerializer, id, **filtros)
    return crud_response


def crud_Garagens(request, id):  # nao testado
    filtros = {"user": request.user}
    crud_response = crud(request, Garagens, GaragemSerializer, id, **filtros)
    return crud_response


def crud_Notas(request, id):  # nao testado
    filtros = {"garagem__user": request.user}
    crud_response = crud(request, Notas, NotaSerializer, id, **filtros)
    return crud_response


def crud_Carros(request, id):
    filtros = {"garagem__user": request.user}
    crud_response = crud(request, Carros, CarroSerializer, id, **filtros)
    return crud_response


def crud_Manutencoes(request, id):  # nao testado
    filtros = {"carro__garagem__user": request.user}
    crud_response = crud(request, Manutencoes, ManutencaoSerializer, id, **filtros)
    return crud_response


def crud_Preventivos(request, id):  # nao testado
    filtros = {"carro__garagem__user": request.user}
    crud_response = crud(request, Preventivos, PreventivoSerializer, id, **filtros)
    return crud_response


def crud_Cronicos(request, id):  # nao testado
    filtros = {"carro__garagem__user": request.user}
    crud_response = crud(request, Cronicos, CronicoSerializer, id, **filtros)
    return crud_response


# * converter uma JsonResponse do crud() para um dicionario
def to_dict(response):
    return json.loads(response.content.decode('utf-8'))


#! ================== FRONTEND FUNÇOES ==================

# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated]) # so users autenticados
# @permission_classes([IsAdminUser]) # so admins
# @permission_classes([AllowAny]) # qualquer um pode ler
# @permission_classes([IsAuthenticatedOrReadOnly]) # autenticados podem escrever, nao-autenticados so ler

@csrf_exempt  # ! trocar para api_view([POST, GET, ...])
def registerUser(request):
    body = json.loads(request.body)
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if User.objects.filter(email=email).exists():  # verificar se já existe um user com esse email
        return JsonResponse({"sucess": False, "message": "Email already exists"}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse({"success": True}, status=201)


@csrf_exempt  # ! trocar para api_view([POST, GET, ...])
def loginUser(request):

    body = json.loads(request.body)
    username = body.get("username")
    password = body.get("password")

    user = authenticate(request, username=username, password=password)  # verificar se existe o utilizador na bd
    if user:
        login(request, user)  # fazer login
        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)


# função a ser chamada por api pelo frontend
@csrf_exempt  # converter para api_view([...])
# permission_classes([...])
def apiCarros(request, id=None):

    # verificar auth

    # definir garagem id

    # transformar data (se necessario)

    # chamar crud
    crud_response = crud_Carros(request, id)

    # retornar resposta
    return crud_response

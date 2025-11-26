from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import *
from .serializers import *
from .gemini import geminiCarCronicIssues, geminiCarsBySpecs
from .crud import crud
import json


# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated]) # so users autenticados
# @permission_classes([IsAdminUser]) # so admins
# @permission_classes([AllowAny]) # qualquer um pode ler
# @permission_classes([IsAuthenticatedOrReadOnly]) # autenticados podem escrever, nao-autenticados so ler

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getCarCronicIssues(request):
    car = request.GET.get("car")
    data = geminiCarCronicIssues(car)  # "Toyota Corolla 1998"
    if data is None:
        return JsonResponse({"message": "Failed to get car issues"}, status=500)
    return JsonResponse(data, safe=False, json_dumps_params={"ensure_ascii": False, "indent": 2})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getCarsBySpecs(request):
    specs = request.GET.dict()
    data = geminiCarsBySpecs(specs)  # {"combustivel": "diesel", "transmissão": "manual", "tração": "awd"}
    if data is None:
        return JsonResponse({"message": "Failed to get cars by specs"}, status=500)
    return JsonResponse(data, safe=False)


@csrf_exempt
def tabelaGaragem(request, id=None):  # nao testado
    filtros = {"user": request.user}
    return crud(request, Garagens, GaragemSerializer, id, **filtros)


@csrf_exempt
def tabelaCarro(request, id=None):
    filtros = {"garagem__user": request.user}
    return crud(request, Carros, CarroSerializer, id, **filtros)


#! ================== FRONTEND FUNÇOES ==================


@csrf_exempt
def registerUser(request):
    body = json.loads(request.body)
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if User.objects.filter(email=email).exists():  # verificar se já existe um user com esse email
        return JsonResponse({"sucess": False, "message": "Email already exists"}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse({"success": True}, status=201)


@csrf_exempt  # trocar para api_view([POST, GET, ...])
def loginUser(request):

    body = json.loads(request.body)
    username = body.get("username")
    password = body.get("password")

    user = authenticate(request, username=username, password=password)  # verificar se existe o utilizador na bd
    if user:
        login(request, user)  # fazer login
        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

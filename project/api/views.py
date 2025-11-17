from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from rest_framework import viewsets
from .models import *
from .serializers import *
from .gemini import geminiCarCronicIssues
from .crud import crud
import json


class CarroViewSet(viewsets.ModelViewSet):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer


def getCarCronicIssues(car_model):
    data = geminiCarCronicIssues(car_model)
    if data is None:
        return JsonResponse({"error": "Failed to get car issues"}, status=500)
    return JsonResponse(data, safe=False, json_dumps_params={"ensure_ascii": False, "indent": 2})


#! estas são as funções que vao ser chamadas no frontend por api
@csrf_exempt
def tabelaUser(request, id=None):
    return crud(request, User, UserSerializer, id)


@csrf_exempt
def tabelaGaragem(request, id=None):
    return crud(request, Garagem, GaragemSerializer, id)
    # garagem__user=request.user


@csrf_exempt
def tabelaCarro(request, id=None):
    print(request.user.id)
    return crud(request, Carro, CarroSerializer, id)


@csrf_exempt
def registerUser(request):
    body = json.loads(request.body)
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )
    return JsonResponse({"success": True})

@csrf_exempt
def loginUser(request):

    body = json.loads(request.body)
    username = body.get("username")
    password = body.get("password")

    user = authenticate(request, username=username, password=password)  # verificar se existe o utilizador na bd
    if user:
        login(request, user)  # fazer login
        return JsonResponse({"success": True, "user_id": user.id})

    return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

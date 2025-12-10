from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

from .models import *
from .serializers import *
from .crud import crud
from .gemini import carCronicIssues, carsBySpecs
from .email import send_email

import json


# ==================================================
#   CSRF EXEMPT FOR APIS AUTHENTICATED BY SESSION
# ==================================================
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


#! ============ GEMINI APIs ============
def getCarCronicIssues(car):
    return carCronicIssues(car) if isinstance(car, str) else None


def getCarsBySpecs(specs):
    return carsBySpecs(specs) if isinstance(specs, dict) else None


#! ============ EMAIL ============

def send_email_user(request):

    user_email = request.user.email
    send_email(user_email)

    return JsonResponse({"email": "enviado (provavelmente)"})

#! ============ REGISTER USER ============


@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([AllowAny])
def registerUser(request):
    body = json.loads(request.body or "{}")
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if not username or not email or not password:
        return Response({"success": False, "message": "Missing username, email or password"}, status=400)

    # username nao precisa ser unico porque é uma aplicação individual, temos o id e email para isso
    # trocar o auth para verificar email e pass primeiro
    if User.objects.filter(username=username).exists():
        return Response({"success": False, "message": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"success": False, "message": "Email already exists"}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return Response({"success": True}, status=201)


#! ============ LOGIN ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([AllowAny])
def loginUser(request):
    body = json.loads(request.body or "{}")
    username = body.get("username")  # devia ser email
    password = body.get("password")

    if not username or not password:
        return Response({"success": False, "message": "Missing username or password"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({"success": True})

    return Response({"success": False, "message": "Invalid credentials"}, status=401)


#! ============ DEFINIÇOES ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiDefinicoes(request, id=None):
    return crud(request, Definicoes, DefinicoesSerializer, id, user=request.user)


#! ============ GARAGENS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiGaragens(request, id=None):
    return crud(request, Garagens, GaragemSerializer, id, user=request.user)


#! ============ NOTAS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiNotas(request, id=None):
    if request.method in ["POST", "PUT"]:
        body = json.loads(request.body or "{}")
        garagem_id = body.get("garagem")

        if not Garagens.objects.filter(garagem_id=garagem_id, user=request.user).exists():
            return Response({"success": False, "message": "Invalid garage"}, status=403)

    return crud(request, Notas, NotaSerializer, id, garagem__user=request.user)


#! ============ CARROS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiCarros(request, id=None):
    if request.method in ["POST", "PUT"]:
        body = json.loads(request.body or "{}")
        garagem_id = body.get("garagem")

        if garagem_id:
            if not Garagens.objects.filter(garagem_id=garagem_id, user=request.user).exists():
                return Response({"success": False, "message": "Invalid garage"}, status=403)

        else:
            garagem, _ = Garagens.objects.get_or_create(
                user=request.user, nome=f"Garagem do {request.user.username}"
            )
            body["garagem"] = garagem.garagem_id
            request._body = json.dumps(body).encode()

    return crud(request, Carros, CarroSerializer, id, garagem__user=request.user)


#! ============ MANUTENÇÕES ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiManutencoes(request, id=None):
    if request.method in ["POST", "PUT"]:
        body = json.loads(request.body or "{}")
        carro_id = body.get("carro")

        if not Carros.objects.filter(carro_id=carro_id, garagem__user=request.user).exists():
            return Response({"success": False, "message": "Invalid car"}, status=403)

    return crud(request, Manutencoes, ManutencaoSerializer, id, carro__garagem__user=request.user)


#! ============ PREVENTIVOS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiPreventivos(request, id=None):
    if request.method in ["POST", "PUT"]:
        body = json.loads(request.body or "{}")
        carro_id = body.get("carro")

        if not Carros.objects.filter(carro_id=carro_id, garagem__user=request.user).exists():
            return Response({"success": False, "message": "Invalid car"}, status=403)

    return crud(request, Preventivos, PreventivoSerializer, id, carro__garagem__user=request.user)


#! ============ CRONICOS ============
@api_view(["GET", "POST", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apiCronicos(request, id=None):
    if request.method in ["POST", "PUT"]:
        body = json.loads(request.body or "{}")
        carro_id = body.get("carro")

        if not Carros.objects.filter(carro_id=carro_id, garagem__user=request.user).exists():
            return Response({"success": False, "message": "Invalid car"}, status=403)

    return crud(request, Cronicos, CronicoSerializer, id, carro__garagem__user=request.user)

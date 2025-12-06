from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from .models import *
from .serializers import *
from .gemini import carCronicIssues, carsBySpecs
from .crud import crud
import json

# ===========================================
# =============== GEMINI FUNÇÕES ============
# ===========================================


def getCarCronicIssues(car):
    return carCronicIssues(car)


def getCarsBySpecs(specs):
    return carsBySpecs(specs)


@csrf_exempt
def api_getCarCronicIssues(request):
    if request.method not in ["GET", "POST"]:
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)

    car = None
    if request.method == "GET":
        car = request.GET.get("car")
    else:
        try:
            body = json.loads(request.body or "{}")
            car = body.get("car") or body.get("modelo")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

    if not car:
        return JsonResponse({"success": False, "message": "Field 'car' is required"}, status=400)

    data = getCarCronicIssues(car)
    return JsonResponse({"success": True, "car": car, "data": data}, status=200)


@csrf_exempt
def api_getCarsBySpecs(request):
    if request.method not in ["GET", "POST"]:
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)

    specs = {}

    if request.method == "GET":
        for key, value in request.GET.items():
            specs[key] = value
    else:
        try:
            body = json.loads(request.body or "{}")
            specs = body.get("specs") or body
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

    if not specs:
        return JsonResponse({"success": False, "message": "Specs cannot be empty"}, status=400)

    data = getCarsBySpecs(specs)
    return JsonResponse({"success": True, "specs": specs, "data": data}, status=200)


# ===========================================
# =============== CRUD FUNÇÕES ==============
# ===========================================

def crud_Garagens(request, id):
    filtros = {"user": request.user}
    return crud(request, Garagens, GaragemSerializer, id, **filtros)


def crud_Notas(request, id):
    filtros = {"garagem__user": request.user}
    return crud(request, Notas, NotaSerializer, id, **filtros)


def crud_Carros(request, id):
    filtros = {"garagem__user": request.user}
    return crud(request, Carros, CarroSerializer, id, **filtros)


def crud_Manutencoes(request, id):
    filtros = {"carro__garagem__user": request.user}
    return crud(request, Manutencoes, ManutencaoSerializer, id, **filtros)


def crud_Preventivos(request, id):
    filtros = {"carro__garagem__user": request.user}
    return crud(request, Preventivos, PreventivoSerializer, id, **filtros)


def crud_Cronicos(request, id):
    filtros = {"carro__garagem__user": request.user}
    return crud(request, Cronicos, CronicoSerializer, id, **filtros)


def to_dict(response):
    return json.loads(response.content.decode("utf-8"))


# LOGIN
@csrf_exempt  # ! trocar para api_view([POST, GET, ...])
def registerUser(request):

    if request.method == "GET":
        return JsonResponse({"success": False, "message": "Use POST to register"}, status=400)

    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)

    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if not username or not email or not password:
        return JsonResponse({"success": False, "message": "Missing username, email or password"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"success": False, "message": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"success": False, "message": "Email already exists"}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse({"success": True}, status=201)


# REGISTAR
@csrf_exempt
def loginUser(request):

    if request.method == "GET":
        return JsonResponse({"success": False, "message": "Use POST to login"}, status=400)

    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)

    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

    username = body.get("username")
    password = body.get("password")

    if not username or not password:
        return JsonResponse({"success": False, "message": "Missing username or password"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)


# API NOTAS
@csrf_exempt
def apiNotas(request, id=None):

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)

    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = json.loads(request.body or "{}")
        except:
            return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

        garagem_id = body.get("garagem")
        if not garagem_id:
            return JsonResponse({"success": False, "message": "Field 'garagem' is required"}, status=400)

        try:
            Garagens.objects.get(garagem_id=garagem_id, user=request.user)
        except Garagens.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid garage for this user"}, status=403)

        request._body = json.dumps(body).encode("utf-8")

    return crud_Notas(request, id)


# API GARAGENS
@csrf_exempt
def apiGaragens(request, id=None):

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)

    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = json.loads(request.body or "{}")
        except:
            return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

        body["user"] = request.user.id
        request._body = json.dumps(body).encode("utf-8")

    return crud_Garagens(request, id)


# API CARROS
@csrf_exempt
def apiCarros(request, id=None):

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)

    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = json.loads(request.body or "{}")
        except:
            return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

        garagem_id = body.get("garagem")

        if garagem_id:
            try:
                Garagens.objects.get(garagem_id=garagem_id, user=request.user)
            except Garagens.DoesNotExist:
                return JsonResponse({"success": False, "message": "Invalid garage for this user"}, status=403)
        else:
            garagem, created = Garagens.objects.get_or_create(
                user=request.user,
                nome=None,
                defaults={"nome": f"Garagem do {request.user.username}"}
            )
            body["garagem"] = garagem.garagem_id

        request._body = json.dumps(body).encode("utf-8")

    return crud_Carros(request, id)


# API MANUTENÇÕES
@csrf_exempt
def apiManutencoes(request, id=None):

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)

    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = json.loads(request.body or "{}")
        except:
            return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

        carro_id = body.get("carro")
        if not carro_id:
            return JsonResponse({"success": False, "message": "Field 'carro' is required"}, status=400)

        try:
            Carros.objects.get(carro_id=carro_id, garagem__user=request.user)
        except Carros.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid car for this user"}, status=403)

        request._body = json.dumps(body).encode("utf-8")

    return crud_Manutencoes(request, id)


# API PREVENTIVOS
@csrf_exempt
def apiPreventivos(request, id=None):

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)

    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = json.loads(request.body or "{}")
        except:
            return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

        carro_id = body.get("carro")
        if not carro_id:
            return JsonResponse({"success": False, "message": "Field 'carro' is required"}, status=400)

        try:
            Carros.objects.get(carro_id=carro_id, garagem__user=request.user)
        except Carros.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid car for this user"}, status=403)

        request._body = json.dumps(body).encode("utf-8")

    return crud_Preventivos(request, id)


# API CRÓNICOS
@csrf_exempt
def apiCronicos(request, id=None):

    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)

    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = json.loads(request.body or "{}")
        except:
            return JsonResponse({"success": False, "message": "Invalid JSON body"}, status=400)

        carro_id = body.get("carro")
        if not carro_id:
            return JsonResponse({"success": False, "message": "Field 'carro' is required"}, status=400)

        try:
            Carros.objects.get(carro_id=carro_id, garagem__user=request.user)
        except Carros.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid car for this user"}, status=403)

        request._body = json.dumps(body).encode("utf-8")

    return crud_Cronicos(request, id)

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
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
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, timedelta, datetime
import hashlib

from .models import *
from .serializers import *

from .gemini import generateCarCronicIssues, findCarsBySpecs, getSpecsOfCar, generateCarPreventiveIssues, GeminiException
from .email import EmailException, sendSecretCodeEmail
from .crud import (
    crud_Definicoes,
    crud_Garagens,
    crud_Notas,
    crud_Carros,
    crud_CarrosImagens,
    crud_Corretivos,
    crud_Cronicos,
    crud_Preventivos,
    crud_CarrosGuardados,
    CRUDException
)
from .storage import StorageException, uploadImageToDB

useDummyData = True if not settings.GEMINI_API_KEY else False


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

            garagem_data = {"user": user.id, "nome": f"Garagem de {username}"}
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
                     "garagem_data": clearCrudData(res_crud_garagem, delete="user"),
                     "definicoes_data": clearCrudData(res_crud_definicoes, delete="user"),
                     "carroPreview_data": [],
                     "notas_data": []},
                    status=201)


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

    login(request, user)

    try:
        with transaction.atomic():

            res_crud_garagem = crud_Garagens(method="GET", user=user)

            res_crud_definicoes = crud_Definicoes(method="GET", user=user)

            res_crud_notas = crud_Notas(method="GET", user=user)

            closest_date = Preventivos.objects.filter(
                carro=OuterRef("pk")
            ).order_by("trocarNaData").values("trocarNaData")[:1]

            # Fetch all cars for this user with annotation and related image
            carros = (
                Carros.objects
                .annotate(proxima_manutencao=Subquery(closest_date))
                .select_related("imagem")  # matches related_name
                .filter(garagem__user=user)
            )

            carrosPreview_data = CarrosPreviewSerializer(carros, many=True).data

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)

    return Response({"message": "User, Garagem and Definiçoes found",
                     "user_data": userData(user),
                     "garagem_data": clearCrudData(res_crud_garagem, delete="user"),
                     "definicoes_data": clearCrudData(res_crud_definicoes, delete="user"),
                     "carrosPreview_data": carrosPreview_data,
                     "notas_data": res_crud_notas.data},
                    status=201)


#! ================== ATUALIZAR DEFINICOES ==================
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
                     "definicoes_data": clearCrudData(res_crud_definicoes, delete="user")},
                    status=200)


#! ================== PEDIR CODIGO SECRETO PARA ATUALIZAR PASSWORD ==================
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def pedirCodigoSecreto(request):

    try:
        email = request.user.email
        hashedCode = sendSecretCodeEmail(email)
    except EmailException as e:
        return Response({"message": e.message}, status=400)

    return Response({"message": f"Secret Code send to email {email}",
                     "hashed_code": hashedCode},
                    status=200)


#! ==================  ATUALIZAR PASSWORD ==================
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def atualizarPassword(request):

    body = request.data
    password = body.get("password")
    codigoHashed = body.get("codigoHashed")
    codigoInput = body.get("codigoInput")

    hashed = hashlib.sha256(codigoInput.encode()).hexdigest()
    if hashed != codigoHashed:
        return Response({"message": "Code not the same"}, status=400)

    user = User.objects.get(id=request.user.id)  # or request.user
    user.set_password(password)
    user.save()
    login(request, user)

    return Response({"message": "Password updated"},
                    status=200)


#! ================== LOGOUT ==================
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def logoutUser(request):

    logout(request)

    return Response({"message": "User logged out"},
                    status=200)


#! ================== APAGAR CONTA ==================
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarUser(request):

    try:
        user = User.objects.get(id=request.user.id)
        user.delete()
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

    return Response({"message": "User deleted"},
                    status=200)


#! ============ ADICIONAR CARRO À GARAGEM ============
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
            carro_km = int(car_data.get("quilometragem"))
            full_name = getCarroFullName(car_data)

            # deve tornar as respostas gemini mais rapido poruqe é feito em pararelo

            with ThreadPoolExecutor() as executor:
                futures = {
                    executor.submit(generateCarCronicIssues, full_name, dummyData=useDummyData): "cronicos",
                    executor.submit(generateCarPreventiveIssues, full_name, dummyData=useDummyData): "preventivos",
                }

                results = {}
                for future in as_completed(futures):
                    key = futures[future]
                    results[key] = future.result()

            # --- Process cronicos ---
            allCronicos = [
                convertIssueToCronic(c, car_data)
                for c in results["cronicos"].data
            ]

            # --- Process preventivos ---
            allPreventivos = [
                convertIssueToPreventive(p, car_data)
                for p in results["preventivos"].data
            ]

            carro_data = {
                "id": car_data.get("id"),
                "full_name": getCarName(car_data),
                "matricula": car_data.get("matricula"),
                "imagem_url": None,
            }

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)
    except GeminiException as e:
        return Response({"message": e.message}, status=400)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)

    return Response({"message": "Carro created, Cronicos and Preventivos defined",
                     "carro_data": carro_data,
                     "carro_kms": carro_km,
                     "allCronicos": allCronicos,
                     "allPreventivos": allPreventivos},
                    status=200)


#! ============ ADICIONAR IMAGEM AO CARRO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def adicionarCarroImagem(request):
    carro_id = request.POST.get("carro_id")
    uploaded_file = request.FILES.get("image")

    try:
        # crud_Carros(method="PUT", data={"imagem_url": imageData.url}, id=carro_id, user=request.user)

        imageData = uploadImageToDB(uploaded_file)
        carroImagemData = {"carro": carro_id, "nome": imageData.original, "uuid": imageData.uuid}
        crud_CarrosImagens(method="POST", data=carroImagemData)

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)
    except StorageException as e:
        return Response({"message": e.message}, status=400)

    return Response({"message": "Image added to car",
                     "imagem_url": imageData.url}, status=201)


#! ============ ADICIONAR PREVENTIVO ATUALIZADO AO CARRO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def adicionarPreventivos(request):
    body = request.data
    preventivos = body.get("preventivos")
    cronicos = body.get("cronicos")

    try:
        with transaction.atomic():

            closestDate = datetime.strptime("2999-12-21", "%Y-%m-%d").date()

            for preventivo in preventivos.copy():

                preventivo["trocarNokm"] = getTrocarNoKm(preventivo)

                preventivo["trocarNaData"] = getTrocarNaData(preventivo)

                closestDate = min(closestDate, preventivo.get("trocarNaData"))

            crud_Preventivos("POST", data=preventivos)

            crud_Cronicos("POST", data=cronicos)

    except CRUDException as e:
        return Response({"message": f"ola {e.message}"}, status=e.status)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)

    return Response({"message": "Preventivo and Cronico added to car",
                     "proxima_manutencao": closestDate},
                    status=200)


#! ============ PROCURAR CARROS POR ESPECIFICAÇÕES ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def procurarCarros(request):
    body = request.data
    specs = body.get("specs")

    try:
        res_gemini = findCarsBySpecs(specs, dummyData=useDummyData)
        candidateCars = res_gemini.data

    except GeminiException as e:
        return Response({"message": e.message}, status=400)

    return Response({"message": "Got candidate cars",
                     "candidateCars_data": candidateCars},
                    status=200)


#! ============ SALVAR CARROS ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def salvarCarros(request):
    body = request.data
    savedCars = body.get("savedCars")

    try:
        crud_CarrosGuardados(method="POST", data=savedCars)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Cars saved"},
                    status=200)


#! ============ LISTA TODOS CARROS GUARDADOS ============
@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def listarCarrosGuardados(request):

    try:
        res_crud_carrosGuardados = crud_CarrosGuardados(method="GET", user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Lista de carros salvos",
        "carrosGuardados_data": clearCrudData(res_crud_carrosGuardados, delete="garagem", wholeList=True)
    }, status=200)


#! ============ OBTER SPECS DO CARRO GUARDADO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def obterCarroSpecs(request):
    car_name = request.data.get("nome")

    try:
        gemini_carSpecs = getSpecsOfCar(car_name, dummyData=useDummyData).data
        gemini_carSpecs["quilometragem"] = ""
        gemini_carSpecs["matricula"] = ""
        gemini_carSpecs["imagem_url"] = ""
        # gemini_carSpecs["garagem"] = ""
    except GeminiException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Specs do carro obtido",
        "carro_data": gemini_carSpecs
    }, status=200)
#! ============ EDITAR CARRO ============


@api_view(["PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def editarCarro(request):
    body = request.data
    carro_id = int(body.get("carro_id"))
    caracteristicas = body.get("caracteristicas")

    try:
        carro_data = crud_Carros(method="PUT", data=caracteristicas, id=carro_id, user=request.user).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Carro atualizado",
        "carro_data": carro_data
    }, status=200)


#! ============ APAGAR CARRO GUARDADO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarCarroGuardado(request):
    id = int(request.data.get("id"))

    try:
        crud_CarrosGuardados(method="DELETE", id=id, user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Carro guardado apagado",
    }, status=200)


#! ============ LISTA TODAS MANUTENÇÕES ============
@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def obterTodasManutencoes(request):
    carro_id = int(request.GET.get("carro_id"))

    try:
        with transaction.atomic():
            res_crud_carro = crud_Carros(method="GET", id=carro_id, user=request.user)
            res_crud_corretivos = crud_Corretivos(method="GET", user=request.user, car_id=carro_id)
            res_crud_preventivos = crud_Preventivos(method="GET", user=request.user, car_id=carro_id)
            res_crud_cronicos = crud_Cronicos(method="GET", user=request.user, car_id=carro_id)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=400)

    return Response({
        "message": "Manutencoes found",
        "carro_data": res_crud_carro.data,
        "corretivos_data": res_crud_corretivos.data,
        "preventivos_data": res_crud_preventivos.data,
        "cronicos_data": res_crud_cronicos.data,
    }, status=200)


#! ============ CRIAR CORRETIVO ============
@api_view(["POST", "PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def criarCorretivo(request):
    body = request.data
    corretivo = body.get("manutencao")
    carro_kms = int(body.get("carro_kms"))

    nota = corretivo.get("nota")

    try:
        corretivo_data = crud_Corretivos(method="POST", data=corretivo).data
        car_id = int(corretivo.get("carro"))
        if int(corretivo.get("quilometragem")) > carro_kms:
            new_kms = int(corretivo.get("quilometragem"))
            updated_carro_data = crud_Carros(method="PUT", data={"quilometragem": new_kms}, id=car_id, user=request.user).data
            carro_kms = updated_carro_data.get("quilometragem")

        if nota:
            nota_data = {"carro": car_id, "nota": nota}
            crud_Notas("POST", data=nota_data)

    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Corretivo created",
                     "corretivo_data": corretivo_data,
                     "carro_km": carro_kms},
                    status=200)
#! ============ LISTAR TODAS AS NOTAS ============


@api_view(["GET"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def listarNotas(request):
    try:
        res_crud_notas = crud_Notas(method="GET", user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Notas encontradas",
        "notas_data": res_crud_notas.data
    }, status=200)


#! ============ CRIAR NOTA MANUAL ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def criarNotaManual(request):
    body = request.data
    carro_id = body.get("carro_id")
    texto = body.get("texto")

    if not carro_id or not texto:
        return Response({"message": "Dados em falta"}, status=400)

    try:
        nota_data = {
            "carro": int(carro_id),
            "nota": texto
        }
        nota = crud_Notas("POST", data=nota_data).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Nota criada",
        "nota_data": nota
    }, status=201)


#! ============ EDITAR NOTA ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def editarNota(request):
    body = request.data
    nota_id = int(body.get("id"))
    texto = body.get("texto")

    try:
        nota_data = crud_Notas(
            method="PUT",
            data={"nota": texto},
            id=nota_id,
            user=request.user
        ).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Nota atualizada",
        "nota_data": nota_data
    }, status=200)


#! ============ APAGAR NOTA ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarNota(request):
    nota_id = int(request.data.get("id"))

    try:
        crud_Notas(
            method="DELETE",
            id=nota_id,
            user=request.user
        )
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({
        "message": "Nota apagada"
    }, status=200)


#! ============ EDITAR CORRETIVO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def editarCorretivo(request):
    body = request.data
    corretivo = body.get("manutencao")

    id = int(corretivo.pop("id"))
    carro_id = int(corretivo.pop("carro"))

    try:
        corretivo_data = crud_Corretivos(method="PUT", data=corretivo, id=id, car_id=carro_id, user=request.user).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Corretivo updated",
                     "corretivo_data": corretivo_data},
                    status=200)


#! ============ APAGAR CORRETIVO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarCorretivo(request):
    body = request.data
    id = int(body.get("id"))
    carro_id = int(body.get("carro_id"))

    try:
        crud_Corretivos(method="DELETE", id=id, car_id=carro_id, user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Corretivo deleted"},
                    status=200)


#! ============ CRIAR PREVENTIVO ============
@api_view(["POST", "PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def criarPreventivo(request):
    body = request.data
    preventivo = body.get("manutencao")
    carro_kms = int(body.get("carro_kms"))

    preventivo["trocarNoKm"] = getTrocarNoKm(preventivo)

    preventivo["trocarNaData"] = getTrocarNaData(preventivo)

    # preventivo["risco"] = round(float(km.get("risco_km")) * 0.8 + float(data.get("risco_dias")) * 0.2, 3)

    try:
        preventivo_data = crud_Preventivos(method="POST", data=preventivo).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Corretivo created",
                     "preventivo_data": preventivo_data},
                    status=200)

 #! ============ EDITAR PREVENTIVO ============


@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def editarPreventivo(request):
    body = request.data
    preventivo = body.get("manutencao")
    carro_km = int(body.get("carro_km"))

    id = int(preventivo.pop("id"))
    carro_id = int(preventivo.pop("carro"))

    preventivo["trocarNoKm"] = getTrocarNoKm(preventivo)

    preventivo["trocarNaData"] = getTrocarNaData(preventivo)

    try:
        preventivo_data = crud_Preventivos(method="PUT", data=preventivo, id=id, car_id=carro_id, user=request.user).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Preventivo updated",
                     "preventivo_data": preventivo_data},
                    status=200)


#! ============ APAGAR PREVENTIVO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarPreventivo(request):
    body = request.data
    id = int(body.get("id"))
    carro_id = int(body.get("carro_id"))

    try:
        crud_Preventivos(method="DELETE", id=id, car_id=carro_id, user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Preventivo deleted"},
                    status=200)


#! ============ CRIAR CRONICO ============
@api_view(["POST", "PUT"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def criarCronico(request):
    body = request.data
    cronico = body.get("manutencao")
    carro_kms = int(body.get("carro_kms"))

    cronico["trocarNoKm"] = getTrocarNoKm(cronico)

    # cronico["risco"] = float(km.get("risco_km"))

    try:
        cronico_data = crud_Cronicos(method="POST", data=cronico).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Cronico created",
                     "cronico_data": cronico_data},
                    status=200)


#! ============ EDITAR CRONICO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def editarCronico(request):
    body = request.data
    cronico = body.get("manutencao")
    carro_km = int(body.get("carro_km"))

    id = int(cronico.pop("id"))
    carro_id = int(cronico.pop("carro"))

    cronico["trocarNoKm"] = getTrocarNoKm(cronico)

    # cronico["risco"] = float(km.get("risco_km"))

    try:
        cronico_data = crud_Cronicos(method="PUT", data=cronico, id=id, car_id=carro_id, user=request.user).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Cronico updated",
                     "cronico_data": cronico_data},
                    status=200)


#! ============ APAGAR CRONICO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarCronico(request):
    body = request.data
    id = int(body.get("id"))
    carro_id = int(body.get("carro_id"))

    try:
        crud_Cronicos(method="DELETE", id=id, car_id=carro_id, user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Cronico deleted"},
                    status=200)


#! ============ ATUALIZAR PREVENTIVO DATA KM ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def atualizarPreventivoDataKm(request):
    body = request.data
    manutencaoData = body.get("manutencaoData")
    km = int(body.get("km"))
    data = body.get("data")

    print(manutencaoData)

    try:

        id = manutencaoData.get("id")
        carro_id = manutencaoData.get("carro")

        manutencaoData["trocadoNoKm"] = km
        manutencaoData["trocarNoKm"] = getTrocarNoKm(manutencaoData)

        manutencaoData["trocadoNaData"] = data
        print(manutencaoData)
        manutencaoData["trocarNaData"] = getTrocarNaData(manutencaoData)

    except Exception as e:
        return Response({"message": "error"}, status=400)

    try:
        preventivo_data = crud_Preventivos(method="PUT", data=manutencaoData, id=id, car_id=carro_id, user=request.user).data
        pass
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Preventivo Km e Data updated",
                     "trocadoNoKm": preventivo_data.get("trocadoNoKm"),
                     "trocarNoKm": preventivo_data.get("trocarNoKm"),
                     "trocadoNaData": preventivo_data.get("trocadoNaData"),
                     "trocarNaData": preventivo_data.get("trocarNaData")},
                    status=200)


#! ============ ATUALIZAR CRONICO KM ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def atualizarCronicoKm(request):
    body = request.data
    manutencaoData = body.get("manutencaoData")
    km = int(body.get("km"))

    id = manutencaoData.get("id")
    carro_id = manutencaoData.get("carro")

    manutencaoData["trocadoNoKm"] = km
    manutencaoData["trocarNoKm"] = getTrocarNoKm(manutencaoData)

    try:
        cronico_data = crud_Cronicos(method="PUT", data=manutencaoData, id=id, car_id=carro_id, user=request.user).data
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Cronico Km updated",
                     "trocadoNoKm": cronico_data.get("trocadoNoKm"),
                     "trocarNoKm": cronico_data.get("trocarNoKm")},
                    status=200)


#! ============ APAGAR CARRO ============
@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def apagarCarro(request):
    body = request.data
    carro_id = int(body.get("carro_id"))

    try:
        # TODO also delete image of car (if exists)
        crud_Carros(method="DELETE", id=carro_id, user=request.user)
    except CRUDException as e:
        return Response({"message": e.message}, status=e.status)

    return Response({"message": "Carro deleted"},
                    status=200)


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


def clearCrudData(res_crud, delete=None, wholeList=False):

    crud_data = res_crud.data

    if isinstance(crud_data, list):
        if wholeList:
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

    carro_kms = int(carro_data.get("quilometragem"))
    kmsEntretroca = int(issue.get("media_km"))

    kmsAtras = carro_kms % (kmsEntretroca * 1.5)

    trocadoNoKm = carro_kms - kmsAtras if kmsAtras < carro_kms else 0
    trocarNoKm = trocadoNoKm + kmsEntretroca
    # risco = round((carro_kms - trocadoNoKm)/kmsEntretroca, 3)

    return {
        "carro": carro_data["id"],
        "nome": issue.get("problema"),
        "descricao": issue.get("descricao"),
        "kmsEntreTroca": kmsEntretroca,
        "trocadoNoKm": carro_kms,
        "trocarNoKm": trocarNoKm,
        # "risco": risco
    }


def convertIssueToPreventive(issue, carro_data):

    carro_kms = int(carro_data.get("quilometragem"))

    kmsEntretroca = int(issue.get("media_km"))
    # trocadoNoKm = carro_kms - int(kmsEntretroca/2)
    trocarNoKm = carro_kms + kmsEntretroca
    # risco_km = round((trocarNoKm - trocadoNoKm)/kmsEntretroca, 3)

    diasEntreTroca = int(issue.get("media_dias"))
    # trocadoNaData = date.today() - timedelta(days=int(diasEntreTroca/2))
    trocarNaData = date.today() + timedelta(days=diasEntreTroca)
    # risco_days = round(1 - (trocarNaData - trocadoNaData).days / diasEntreTroca, 3)

    # risco = round(risco_km * 0.8 + risco_days * 0.2, 3)

    return {
        "carro": carro_data["id"],
        "nome": issue.get("nome"),
        "descricao": issue.get("descricao"),
        "kmsEntreTroca": kmsEntretroca,
        "trocadoNoKm": carro_kms,
        "trocarNoKm": trocarNoKm,
        "diasEntreTroca": diasEntreTroca,
        "trocadoNaData": date.today(),
        "trocarNaData": trocarNaData,
        # "risco": 0
    }


def getTrocarNoKm(manutencao):
    trocarNoKm = int(manutencao.get("trocadoNoKm")) + int(manutencao.get("kmsEntreTroca"))

    # risco_km = round((carro_kms - int(manutencao.get("trocadoNoKm"))) / int(manutencao.get("kmsEntreTroca")), 3)

    return trocarNoKm


def getTrocarNaData(manutencao):
    trocadoNaData = datetime.strptime(manutencao.get("trocadoNaData"), "%Y-%m-%d").date()  # definido como data
    diasEntreTroca = int(manutencao.get("diasEntreTroca"))

    trocarNaData = (trocadoNaData + timedelta(days=diasEntreTroca))  # é criado como uma data

    # diasDifferenca = (date.today() - trocadoNaData).days

    # risco_dias = round(diasDifferenca / diasEntreTroca, 3)  # data - data, funciona sem .date()

    return trocarNaData

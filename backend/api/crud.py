from django.http import JsonResponse
from rest_framework.exceptions import ValidationError
import json
from .models import *
from .serializers import *


def crud(method, data, model, serializer, id=None, **filters):
    """
    O CRUD deteta automaticamente o tipo de request e retorna o json correspondente
    """

    if method == "POST":
        return create_object(data, serializer)
    elif method == "GET":
        return get_object(model, serializer, id, **filters)
    elif method == "PUT":
        return update_object(data, model, serializer, id, **filters)
    elif method == "DELETE":
        return delete_object(model, id, **filters)


#! ================== Funções CRUD ==================

def create_object(Data, Serializer):
    try:
        serializer = Serializer(data=Data)  # converte o json para o objeto do serializer
        serializer.is_valid(raise_exception=True)  # verifica se os dados são válidos (se não, devolve 400)
        serializer.save()  # guarda no BD
        return CRUDResponse(status=201, message="created", data=serializer.data)
    except ValidationError as e:
        return CRUDResponse(status=400, message=e.detail)


def get_object(Model, Serializer, ID, **filters):

    if ID:  # se foi passado um id, significa que quer um objeto específico
        try:
            obj = Model.objects.filter(**filters).get(pk=ID)  # procura o objeto com a chave primária correta
            serializer = Serializer(obj)  # converte o objeto para json
            return CRUDResponse(status=200, message="obtained", data=serializer.data)
        except Model.DoesNotExist:
            return CRUDResponse(status=404, message="id not found")

    objects = Model.objects.filter(**filters)  # busca todos os primeiros 25 registos
    serializer = Serializer(objects, many=True)  # converte todos para json
    return CRUDResponse(status=200, message="obtained", data=serializer.data)


def update_object(Data, Model, Serializer, ID, **filters):

    if not ID:  # sem id não há como atualizar
        return JsonResponse({"message": "ID required"}, status=400)

    try:
        obj = Model.objects.get(pk=ID, **filters)  # procura o objeto

        serializer = Serializer(obj, data=Data, partial=True)  # atualiza só os campos fornecidos
        serializer.is_valid(raise_exception=True)  # verifica se os dados são válidos (se não, devolve 400)
        serializer.save()  # guarda alterações
        return CRUDResponse(status=200, message="updated", data=serializer.data)
    except Model.DoesNotExist:
        return CRUDResponse(status=404, message="id not found")
    except ValidationError as e:
        return CRUDResponse(status=400, message=e.detail)


def delete_object(Model, ID, **filters):

    if not ID:  # sem id não há o que apagar
        CRUDResponse(status=400, message="ID required")

    try:
        obj = Model.objects.get(pk=ID, **filters)  # procura o objeto
        obj.delete()  # apaga o registo
        CRUDResponse(status=200, message="deleted")
    except Model.DoesNotExist:
        CRUDResponse(status=404, message="ID not found")


#! ================== Classe CRUDResponse ==================

class CRUDResponse:
    def __init__(self, status=200, message="", data=None):
        self.success = status in (200, 201)
        self.status = status
        self.message = message
        self.data = data


#! ================== Funções CRUD_model ==================

def crud_Definicoes(method, data=None, id=None, user=None):  # * fixed?
    filtros = {}
    if method not in ("POST"):
        filtros = {"user": user}
    return crud(method, data, Definicoes, DefinicoesSerializer, id, **filtros)


def crud_Garagens(method, data=None, id=None, user=None):  # * fixed?
    filtros = {}
    if method not in ("POST"):
        filtros = {"user": user}
    return crud(method, data, Garagens, GaragensSerializer, id, **filtros)


def crud_Notas(method, data=None, id=None, user=None):
    filtros = {}
    if method not in ("POST"):
        filtros = {"garagem__user": user}
    return crud(method, data, Notas, NotaSerializer, id, **filtros)


def crud_Carros(method, data=None, id=None, user=None):
    filtros = {}
    if method not in ("POST"):
        filtros = {"garagem__user": user}
    return crud(method, data, Carros, CarrosSerializer, id, **filtros)


def crud_CarrosPreview(method, data=None, id=None, user=None):
    filtros = {}
    if method not in ("POST"):
        filtros = {"garagem__user": user}
    return crud(method, data, Carros, CarrosPreviewSerializer, id, **filtros)


def crud_Manutencoes(method, data=None, id=None, user=None):
    filtros = {}
    if method not in ("POST"):
        filtros = {"carro__garagem__user": user}
    return crud(method, data, Manutencoes, ManutencoesSerializer, id, **filtros)


def crud_Preventivos(method, data=None, id=None, user=None):
    filtros = {}
    if method not in ("POST"):
        filtros = {"carro__garagem__user": user}
    return crud(method, data, Preventivos, PreventivosSerializer, id, **filtros)


def crud_Cronicos(method, data=None, id=None, user=None):
    filtros = {}
    if method not in ("POST"):
        filtros = {"carro__garagem__user": user}
    return crud(method, data, Cronicos, CronicosSerializer, id, **filtros)

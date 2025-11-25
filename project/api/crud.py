from django.http import JsonResponse
from rest_framework.exceptions import ValidationError
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


def crud(request, model, serializer, id=None, **filters):
    """
    O CRUD deteta automaticamente o tipo de request e retorna o json correspondente
    """

    if request.method == "POST":
        return create_object(request, serializer)
    elif request.method == "GET":
        return get_object(model, serializer, id)
    elif request.method == "PUT":
        return update_object(request, model, serializer, id)
    elif request.method == "DELETE":
        return delete_object(model, id)


#! ================== Funções CRUD ==================

def create_object(request, Serializer):

    try:
        data = json.loads(request.body)  # recebe o json enviado no request
        serializer = Serializer(data=data)  # converte o json para o objeto do serializer
        serializer.is_valid(raise_exception=True)  # verifica se os dados são válidos (se não, devolve 400)
        serializer.save()  # guarda no BD
        return JsonResponse({"message": "created", "data": serializer.data}, status=201)  # resposta ok
    except ValidationError as e:
        return JsonResponse({"message": e.detail}, status=400)


def get_object(Model, Serializer, id, **filters):

    if id:  # se foi passado um id, significa que quer um objeto específico

        try:
            obj = Model.objects.get(pk=id)  # procura o objeto com a chave primária correta
            serializer = Serializer(obj)  # converte o objeto para json
            return JsonResponse({"message": "obtained", "data": serializer.data}, status=200)  # devolve o json
        except Model.DoesNotExist:
            return JsonResponse({"message": "id not found"}, status=404)  # não encontrou

    objects = Model.objects.filter(**filters).order_by('-id')[:25]  # busca todos os primeiros 25 registos
    serializer = Serializer(objects, many=True)  # converte todos para json
    return JsonResponse({"message": "obtained", "data": serializer.data}, safe=False, status=200)  # devolve lista jsons


def update_object(request, Model, Serializer, id, **filters):

    if not id:  # sem id não há como atualizar
        return JsonResponse({"message": "ID required"}, status=400)

    try:
        obj = Model.objects.get(pk=id, **filters)  # procura o objeto

        data = json.loads(request.body)  # recebe o json com os dados a atualizar

        serializer = Serializer(obj, data=data, partial=True)  # atualiza só os campos fornecidos
        serializer.is_valid(raise_exception=True)  # verifica se os dados são válidos (se não, devolve 400)
        serializer.save()  # guarda alterações
        return JsonResponse({"message": "updated", "data": serializer.data}, status=200)  # resposta ok
    except Model.DoesNotExist:
        return JsonResponse({"message": "id not found"}, status=404)
    except ValidationError as e:
        return JsonResponse({"message": e.detail}, status=400)


def delete_object(Model, id, **filters):

    if not id:  # sem id não há o que apagar
        return JsonResponse({"message": "ID required"}, status=400)

    try:
        obj = Model.objects.get(pk=id, **filters)  # procura o objeto
        obj.delete()  # apaga o registo
        return JsonResponse({"message": "deleted"}, status=200)  # confirma eliminação
    except Model.DoesNotExist:
        return JsonResponse({"message": "id not found"}, status=404)

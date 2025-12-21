from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class DefinicoesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Definicoes
        fields = '__all__'


class GaragensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garagens
        fields = '__all__'


class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notas
        fields = '__all__'


class CarrosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Carros
        fields = '__all__'


class CarrosPreviewSerializer(serializers.ModelSerializer):
    next_trocarNaData = serializers.DateField(read_only=True)

    class Meta:
        model = Carros
        fields = ["id", "marca", "modelo", "ano", "matricula", "next_trocarNaData"]


class ManutencoesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manutencoes
        fields = '__all__'


class PreventivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preventivos
        fields = '__all__'


class CronicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cronicos
        fields = '__all__'

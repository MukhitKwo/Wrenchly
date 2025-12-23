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
    next_trocarNaData = serializers.DateField(read_only=True, allow_null=True)
    full_name = serializers.SerializerMethodField()  # new field

    class Meta:
        model = Carros
        fields = ["id", "full_name", "matricula", "next_trocarNaData", "imagem_url"]  # remove marca, modelo, ano

    def get_full_name(self, obj):
        return f"{obj.marca} {obj.modelo} {obj.ano}"


class CorretivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Corretivos
        fields = '__all__'


class PreventivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preventivos
        fields = '__all__'


class CronicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cronicos
        fields = '__all__'

class CarrosSalvosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarrosSalvos
        fields = '__all__'
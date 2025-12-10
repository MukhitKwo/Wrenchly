from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()  # type: ignore


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class DefinicoesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Definicoes
        fields = '__all__'


class GaragemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garagens
        fields = '__all__'


class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notas
        fields = '__all__'


class CarroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carros
        fields = '__all__'


class ManutencaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manutencoes
        fields = '__all__'


class PreventivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preventivos
        fields = '__all__'


class CronicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cronicos
        fields = '__all__'

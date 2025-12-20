from typing import Text
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User


class Definicoes(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)  # type: ignore

    tema = models.CharField(max_length=50, default="light")  # type: ignore  #* light, dark

    notificacoes = models.BooleanField(default=True)  # type: ignore

    linguagem = models.CharField(max_length=10, default="pt")  # type: ignore  #* pt, en, etc

    def __str__(self):
        return f"Definições de {self.user.username}"


class Garagens(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=50, blank=True, null=True)  # type: ignore

    def __str__(self):
        return f"{self.nome or f'Garagem do {self.user.username}'}"


class Notas(models.Model):

    garagem = models.ForeignKey(Garagens, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nota = models.TextField("Nota")  # type: ignore

    def __str__(self):
        return f"{self.garagem.id} - {self.nota}"


class Carros(models.Model):

    garagem = models.ForeignKey(Garagens, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    categoria = models.CharField("Categoria", max_length=20)  # type: ignore

    marca = models.CharField("Marca", max_length=100)  # type: ignore

    modelo = models.CharField("Modelo", max_length=100)  # type: ignore

    ano = models.PositiveIntegerField("Ano")  # type: ignore

    # ano_produzido = models.PositiveIntegerField("Ano Produzido")  # type: ignore

    combustivel = models.CharField("Combustivel", max_length=20)  # type: ignore

    cilindrada = models.PositiveIntegerField("Cilindrada")  # type: ignore

    cavalos = models.PositiveIntegerField("Cavalos", blank=True, null=True)  # type: ignore

    transmissao = models.CharField("Transmissao", max_length=20)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    matricula = models.CharField('Matricula', max_length=8, blank=True, null=True)  # type: ignore

    def __str__(self):
        return f"{self.marca} {self.modelo} {self.ano}"


class Manutencoes(models.Model):

    carro = models.ForeignKey(Carros, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    # TIPO_MANUTENCAO = [
    #     ('corretivo', 'Corretivo'),
    #     ('preventivo', 'Preventivo'),
    #     ('cronico', 'Crônico'),
    # ]
    # * definir escolhas no frontend
    tipo = models.CharField("Tipo", max_length=10)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    custo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)   # type: ignore

    data = models.DateField("Data da Manutenção")  # type: ignore

    def __str__(self):
        return f"{self.nome} - {self.quilometragem}km - {self.data}"


class Preventivos(models.Model):

    carro = models.ForeignKey(Carros, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    diasEntreTroca = models.PositiveIntegerField("Dias entre troca")  # type: ignore

    trocadoNaData = models.DateField("Trocado na data", null=True)  # type: ignore

    trocarNaData = models.DateField("Trocar na data", null=True)  # type: ignore

    kmsEntreTroca = models.PositiveIntegerField("kms entre troca")  # type: ignore

    trocadoNoKm = models.PositiveIntegerField("Trocado no km", default=0, null=True)  # type: ignore

    trocarNoKm = models.PositiveIntegerField("Trocar no km", default=0,  null=True)  # type: ignore

    risco = models.FloatField("Risco (normalizado)", default=0.0, null=True)  # type: ignore

    def __str__(self):
        return f"{self.nome} - {self.carro.quilometragem}/{self.trocadoNoKm + self.kmsEntreTroca} kms"


class Cronicos(models.Model):

    carro = models.ForeignKey(Carros, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    kmsEntreTroca = models.PositiveIntegerField("kms entre troca")  # type: ignore

    trocadoNoKm = models.PositiveIntegerField("Trocado no km", default=0, null=True)  # type: ignore

    trocarNoKm = models.PositiveIntegerField("Trocar no km", default=0, null=True)  # type: ignore

    risco = models.FloatField("Risco (normalizado)", default=0.0, null=True)  # type: ignore

    def __str__(self):
        return f"{self.nome} -  {self.carro.quilometragem}/{self.trocadoNoKm + self.kmsEntreTroca} kms"


class CarrosSalvos(models.Model):

    garagem = models.ForeignKey(Garagens, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    carro_nome = models.CharField("Nome", max_length=100)  # type: ignore

    # TODO adicionar mais campos dps

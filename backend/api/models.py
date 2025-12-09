from typing import Text
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User


class Definicoes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # type: ignore

    # Configurações do utilizador (exemplos práticos)
    tema = models.CharField(max_length=50, default="light")  # type: ignore  #* light, dark
    notificacoes = models.BooleanField(default=True)  # type: ignore
    linguagem = models.CharField(max_length=10, default="pt")  # type: ignore  #* pt, en, etc

    def __str__(self):
        return f"Definições de {self.user.username}"


class Garagens(models.Model):

    garagem_id = models.AutoField(primary_key=True)  # type: ignore

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=50, blank=True, null=True)  # type: ignore

    def __str__(self):
        return f"{self.garagem_id} - {self.nome or f'Garagem do {self.user.username}'}"


class Notas(models.Model):

    garagem = models.ForeignKey(Garagens, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nota = models.TextField("Nota")  # type: ignore

    def __str__(self):
        return f"{self.garagem.garagem_id} - {self.nota}"


class Carros(models.Model):

    carro_id = models.AutoField(primary_key=True)  # type: ignore

    garagem = models.ForeignKey(Garagens, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    modelo = models.CharField("Modelo", max_length=100)  # type: ignore

    TIPOS_COMBUSTIVEL = (
        ('gasolina', 'Gasolina'),
        ('gasoleo', 'Gasoleo'),
        ('hibrido', 'Hibrido'),
        ('eletrico', 'Eletrico'),
        ('outro', 'Outro'),
    )
    combustivel = models.CharField("Combustivel", max_length=20, choices=TIPOS_COMBUSTIVEL)  # type: ignore

    cc = models.PositiveIntegerField("CC")  # type: ignore

    cavalos = models.PositiveIntegerField("Cavalos", blank=True, null=True)  # type: ignore

    TIPOS_TRANSMISSAO = (
        ('manual', 'Manual'),
        ('automatico', 'Automatico'),
        ('semi-automatico', 'Semi-automatico'),
        ('cvt', 'CVT'),
        ('outro', 'Outro'),
    )
    transmissao = models.CharField("Transmissao", max_length=20, choices=TIPOS_TRANSMISSAO)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    ano_produzido = models.PositiveIntegerField("Ano Produzido")  # type: ignore

    TIPOS_CORPO = [
        ('seda', 'Sedã'),
        ('hatchback', 'Hatchback'),
        ('suv', 'SUV'),
        ('cope', 'Cupê'),
        ('conversivel', 'Conversível'),
        ('carrinha', 'Carrinha'),
        ('van', 'Van'),
        ('pickup', 'Pickup'),
        ('outro', 'Outro'),
    ]
    tipo_corpo = models.CharField("Tipo Corpo", max_length=20, choices=TIPOS_CORPO,
                                  null=True, blank=True)  # type: ignore

    matricula = models.CharField('Matricula', max_length=8, blank=True, null=True)  # type: ignore

    def __str__(self):
        return f"{self.carro_id} - {self.modelo} {self.ano_produzido}"


class Manutencoes(models.Model):

    registro_id = models.AutoField(primary_key=True)  # type: ignore

    carro = models.ForeignKey(Carros, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    TIPO_MANUTENCAO = [
        ('corretivo', 'Corretivo'),
        ('preventivo', 'Preventivo'),
        ('cronico', 'Crônico'),
    ]
    tipo = models.CharField("Tipo", max_length=10, choices=TIPO_MANUTENCAO,)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    custo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)   # type: ignore

    data = models.DateField("Data da Manutenção")  # type: ignore

    def __str__(self):
        return f"({self.carro.modelo}) {self.nome} - {self.quilometragem}km - {self.data}"


class Preventivos(models.Model):
    periodico_id = models.AutoField(primary_key=True)  # type: ignore

    carro = models.ForeignKey(Carros, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    dataEntreTroca = models.DateField("Tempo entre troca", null=True, blank=True)  # type: ignore

    # ? verificar somando data trocoado com data entre troca e vericar se > ou < que data atual
    dataTrocado = models.DateField("Data na ultima troca", null=True, blank=True)  # type: ignore

    kmsEntreTroca = models.PositiveIntegerField("kms entre troca")  # type: ignore

    # ? verificar somando km trocoado com km entre troca e vericar se > ou < que km atual
    kmTrocado = models.PositiveIntegerField("Kms na ultima troca", default=0)  # type: ignore

    risco_normalizado = models.FloatField("Risco (normalizado)", default=0.0)  # type: ignore

    def __str__(self):
        return f"({self.carro.modelo}) {self.nome} - {self.carro.quilometragem}/{self.kmTrocado + self.kmsEntreTroca}km"


class Cronicos(models.Model):

    problema_id = models.AutoField(primary_key=True)  # type: ignore

    carro = models.ForeignKey(Carros, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    # NIVEIS_RISCO = [
    #     ('nenhum', 'Nenhum risco'),
    #     ('baixo', 'Risco baixo'),
    #     ('moderado', 'Risco moderado'),
    #     ('elevado', 'Risco elevado'),
    #     ('muito_alto', 'Risco muito alto')
    # ]
    # risco = models.CharField("Risco", max_length=7, choices=NIVEIS_RISCO)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    kmsEntreTroca = models.PositiveIntegerField("kms entre troca")  # type: ignore

    # ? verificar somando km trocoado com km entre troca e vericar se > ou < que km atual
    kmTrocado = models.PositiveIntegerField("Kms na ultima troca", default=0)  # type: ignore

    risco_normalizado = models.FloatField("Risco (normalizado)", default=0.0)  # type: ignore

    def __str__(self):
        return f"({self.carro.modelo}) {self.nome} - {self.carro.quilometragem}/{self.kmTrocado + self.kmsEntreTroca}km"

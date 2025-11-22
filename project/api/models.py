from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


# class Utilizador(models.Model):

#     user_id = models.AutoField(primary_key=True)  # type: ignore

#     email = models.EmailField(unique=True)  # type: ignore

#     username = models.CharField(max_length=50, unique=True)  # type: ignore

#     password = models.CharField(max_length=128)  # type: ignore  #! guardar encriptado

#     def __str__(self):
#         return self.username


class Garagem(models.Model):

    garagem_id = models.AutoField(primary_key=True)  # type: ignore

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    def __str__(self):
        return self.nome


class Carro(models.Model):

    carro_id = models.AutoField(primary_key=True)  # type: ignore

    garagem = models.ForeignKey(Garagem, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    modelo = models.CharField("Modelo", max_length=100)  # type: ignore

    FUEL_CHOICES = (
        ('Gasolina', 'Gasolina'),
        ('Gasoleo', 'Gasoleo'),
        ('Hibrido', 'Hibrido'),
        ('Eletrico', 'Eletrico'),
        ('Outro', 'Outro'),
    )
    combustivel = models.CharField("Combustivel", max_length=20, choices=FUEL_CHOICES)  # type: ignore

    tdi = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)  # type: ignore

    cavalos = models.PositiveIntegerField("Cavalos", blank=True, null=True)  # type: ignore

    TRANSMISSION_CHOICES = (
        ('Manual', 'Manual'),
        ('Automatico', 'Automatico'),
        ('Semi-automatico', 'Semi-automatico'),
        ('CVT', 'CVT'),
        ('Outro', 'Outro'),
    )
    transmissao = models.CharField("Transmissao", max_length=20, choices=TRANSMISSION_CHOICES)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    ano_produzido = models.PositiveIntegerField("Ano Produzido")  # type: ignore

    BODY_TYPE_CHOICES = [
        ('Seda', 'Sedã'),
        ('Hatchback', 'Hatchback'),
        ('SUV', 'SUV'),
        ('Cope', 'Cupê'),
        ('Conversivel', 'Conversível'),
        ('Carrinha', 'Carrinha'),
        ('Van', 'Van'),
        ('Pickup', 'Pickup'),
        ('Outro', 'Outro'),
    ]
    tipo_corpo = models.CharField("Tipo Corpo", max_length=20, choices=BODY_TYPE_CHOICES,
                                  null=True, blank=True)  # type: ignore

    vin = models.CharField("VIN", max_length=17, blank=True, null=True)  # type: ignore

    matricula = models.CharField('Matricula', max_length=8, blank=True, null=True)  # type: ignore

    def __str__(self):
        return f"{self.modelo} {self.combustivel} ({self.transmissao})"


class Manutencao(models.Model):

    registro_id = models.AutoField(primary_key=True)  # type: ignore

    carro = models.ForeignKey(Carro, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    custo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)   # type: ignore

    data = models.DateField("Dia da Manutenção", null=True, blank=True)  # type: ignore

    def __str__(self):
        return f"({self.carro_id.modelo}) {self.nome} - {self.quilometragem}km"


class Cronico(models.Model):

    problema_id = models.AutoField(primary_key=True)  # type: ignore

    carro = models.ForeignKey(Carro, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

    nome = models.CharField("Nome", max_length=100)  # type: ignore

    SEVERIDADE_CHOICES = [
        ('nenhuma', 'Nenhuma'),
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente')
    ]
    severidade = models.CharField("Severidade", max_length=7, choices=SEVERIDADE_CHOICES,
                                  null=True, blank=True)  # type: ignore

    resolvido = models.BooleanField(default=False)  # type: ignore

    descricao = models.TextField("Descrição", blank=True, null=True)  # type: ignore

    quilometragem = models.PositiveIntegerField("Quilometragem")  # type: ignore

    def __str__(self):
        return f"({self.carro_id.modelo}) {self.nome} - {self.quilometragem}km ({"Resolvido" if self.resolvido else "Severidade: " + self.severidade})"


class Defenicoes(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # type: ignore #! chave estrangeira

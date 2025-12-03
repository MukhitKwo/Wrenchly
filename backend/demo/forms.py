from django import forms


class createCarroForm(forms.Form):

    modelo = forms.CharField(label="Modelo", max_length=100)

    FUEL_CHOICES = (
        ('Gasolina', 'Gasolina'),
        ('Gasoleo', 'Gasoleo'),
        ('Hibrido', 'Hibrido'),
        ('Eletrico', 'Eletrico'),
        ('Outro', 'Outro'),
    )
    combustivel = forms.ChoiceField(label="Combustivel", choices=FUEL_CHOICES)

    tdi = forms.FloatField(label='TDI (if Diesel)', required=False)

    cavalos = forms.IntegerField(label="Cavalos", help_text="Opcional", required=False, min_value=0)

    TRANSMISSION_CHOICES = (
        ('Manual', 'Manual'),
        ('Automatico', 'Automatico'),
        ('Semi-automatico', 'Semi-automatico'),
        ('CVT', 'CVT'),
        ('Outro', 'Outro'),
    )
    transmissao = forms.ChoiceField(label="Transmissao", choices=TRANSMISSION_CHOICES)

    quilometragem = forms.IntegerField(label="Kilometragem", min_value=0)

    ano_produzido = forms.IntegerField(label="Ano Produzido", min_value=0)

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
    tipo_corpo = forms.ChoiceField(
        label="Tipo Corpo",
        choices=BODY_TYPE_CHOICES,
        required=False
    )

    vin = forms.CharField(label="VIN", help_text="Opcional", max_length=17, required=False)

    matricula = forms.CharField(label="Matricula", help_text="Opcional", max_length=8, required=False)


class getCarroForm(forms.Form):

    id = forms.IntegerField(label="Id Carro", required=False)

class updateCarroFrom(forms.Form):
    pass

from django.urls import path
from .views import *
from .api_testing import *

urlpatterns = [
    
    path("email/", send_email_user),

    # GEMINI API (APENAS PARA TESTE)
    path("cronicIssues/", api_getCarCronicIssues),
    path("carSpecs/", api_getCarsBySpecs),

    # REGISTRO E LOGIN
    path("registerUser/", registerUser),
    path("loginUser/", loginUser),

    # GARAGENS
    path("tabelaGaragem/", apiGaragens),
    path("tabelaGaragem/<int:id>/", apiGaragens),

    # NOTAS
    path("tabelaNota/", apiNotas),
    path("tabelaNota/<int:id>/", apiNotas),

    # CARROS
    path("tabelaCarro/", apiCarros),
    path("tabelaCarro/<int:id>/", apiCarros),

    # MANUTENÇÕES
    path("tabelaManutencao/", apiManutencoes),
    path("tabelaManutencao/<int:id>/", apiManutencoes),

    # PREVENTIVOS
    path("tabelaPreventivo/", apiPreventivos),
    path("tabelaPreventivo/<int:id>/", apiPreventivos),

    # CRÓNICOS
    path("tabelaCronico/", apiCronicos),
    path("tabelaCronico/<int:id>/", apiCronicos),

    # DEFINIÇÕES
    #! nao precisas de usar re_path, o path normal ja trata automaticamente do / no final e estas so a complicar
    # Aceita /definicoes e /definicoes/
    # re_path(r"^definicoes/?$", apiDefinicoes, name="definicoes_list"),

    # Aceita /definicoes/1 e /definicoes/1/
    # re_path(r"^definicoes/(?P<id>\d+)/?$", apiDefinicoes, name="definicoes_detail"),

    path("definicoes/", apiDefinicoes)  # id nao precisas por agora
]

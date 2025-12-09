from django.urls import path, re_path
from .views import *
from .api_testing import *

urlpatterns = [

    # GEMINI API (APENAS PARA TESTE)
    path("cronicIssues/", api_getCarCronicIssues),
    path("carSpecs/", api_getCarsBySpecs),

    # =====================================
    #            AUTENTICAÇÃO
    # =====================================
    path("registerUser/", registerUser),
    path("loginUser/", loginUser),

    # =====================================
    #                CARROS
    # =====================================
    path("tabelaCarro/", apiCarros),
    path("tabelaCarro/<int:id>/", apiCarros),

    # =====================================
    #               GARAGENS
    # =====================================
    path("tabelaGaragem/", apiGaragens),
    path("tabelaGaragem/<int:id>/", apiGaragens),

    # =====================================
    #                NOTAS
    # =====================================
    path("tabelaNota/", apiNotas),
    path("tabelaNota/<int:id>/", apiNotas),

    # =====================================
    #             MANUTENÇÕES
    # =====================================
    path("tabelaManutencao/", apiManutencoes),
    path("tabelaManutencao/<int:id>/", apiManutencoes),

    # =====================================
    #             PREVENTIVOS
    # =====================================
    path("tabelaPreventivo/", apiPreventivos),
    path("tabelaPreventivo/<int:id>/", apiPreventivos),

    # =====================================
    #               CRÓNICOS
    # =====================================
    path("tabelaCronico/", apiCronicos),
    path("tabelaCronico/<int:id>/", apiCronicos),

    # =====================================
    #               DEFINIÇÕES
    # =====================================
    # Aceita /definicoes e /definicoes/
    re_path(r"^definicoes/?$", apiDefinicoes, name="definicoes_list"),

    # Aceita /definicoes/1 e /definicoes/1/
    re_path(r"^definicoes/(?P<id>\d+)/?$", apiDefinicoes, name="definicoes_detail"),
]

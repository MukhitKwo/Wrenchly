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
    path("logoutUser", logoutUser),

    path("atualizarDefinicoes/<int:id>", atualizarDefinicoes),


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
]

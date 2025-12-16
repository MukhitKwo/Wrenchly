from django.urls import path
from .views import *

urlpatterns = [

    path("email/", send_email_user),


    # REGISTRO E LOGIN
    path("registerUser/", registerUser),
    path("loginUser/", loginUser),
    path("logoutUser", logoutUser),

    # DEFINIÇÔES
    path("atualizarDefinicoes/<int:id>", atualizarDefinicoes),

    # ADICIONAR CARRO
    path("adicionarCarroComModelo/", adicionarCarroComModelo),

    # # NOTAS
    # path("tabelaNota/", apiNotas),
    # path("tabelaNota/<int:id>/", apiNotas),

    # # CARROS
    # path("tabelaCarro/", apiCarros),
    # path("tabelaCarro/<int:id>/", apiCarros),

    # # MANUTENÇÕES
    # path("tabelaManutencao/", apiManutencoes),
    # path("tabelaManutencao/<int:id>/", apiManutencoes),

    # # PREVENTIVOS
    # path("tabelaPreventivo/", apiPreventivos),
    # path("tabelaPreventivo/<int:id>/", apiPreventivos),

    # # CRÓNICOS
    # path("tabelaCronico/", apiCronicos),
    # path("tabelaCronico/<int:id>/", apiCronicos),
]

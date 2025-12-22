from django.urls import path
from .views import *
from .views import dev_log

urlpatterns = [

    path("email/", send_email_user),

    path("dev-log/", dev_log),

    # REGISTRO E LOGIN
    path("registerUser/", registerUser),
    path("loginUser/", loginUser),
    path("logoutUser/", logoutUser),

    # DEFINIÇÔES
    path("atualizarDefinicoes/<int:id>", atualizarDefinicoes),

    # ADICIONAR CARRO
    path("adicionarCarro/", adicionarCarro),
    path("adicionarCarroImagem/", adicionarCarroImagem),
    path("adicionarPreventivos/", adicionarPreventivos),

    # PROCURAR CARROS
    path("procurarCarros/", procurarCarros),
    path("salvarCarros/", salvarCarros),

    path("carrosSalvos/", listarCarrosSalvos),

    path("listarManutencoes/", listarManutencoes),

    path("manutencao/", salvarManutencao),
    path("preventivos/", listarPreventivos),
    path("preventivo/", salvarPreventivo),
    path("cronicos/", listarCronicos),
    path("cronico/", salvarCronico),

]

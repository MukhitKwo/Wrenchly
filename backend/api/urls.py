from django.urls import path
from .views import *
from .views import dev_log

urlpatterns = [

    path("dev-log/", dev_log),

    # REGISTRO E LOGIN
    path("registerUser/", registerUser),
    path("loginUser/", loginUser),
    path("logoutUser/", logoutUser),
    path("apagarUser/", apagarUser),

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

    # MANUTENÇÕES
    path("obterTodasManutencoes/", obterTodasManutencoes),
    path("criarCorretivo/", criarCorretivo),
    path("criarPreventivo/", criarPreventivo),
    path("criarCronico/", criarCronico),

]

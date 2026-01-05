from django import views
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
    path("pedirCodigoSecreto/", pedirCodigoSecreto),
    path("atualizarPassword/", atualizarPassword),

    # ADICIONAR CARRO
    path("adicionarCarro/", adicionarCarro),
    path("adicionarCarroImagem/", adicionarCarroImagem),
    path("adicionarPreventivos/", adicionarPreventivos),

    # PROCURAR CARROS
    path("procurarCarros/", procurarCarros),
    path("salvarCarros/", salvarCarros),
    path("listarCarrosGuardados/", listarCarrosGuardados),
    path("obterCarroSpecs/", obterCarroSpecs),
    path("apagarCarroGuardado/", apagarCarroGuardado),


    # MANUTENÇÕES
    path("obterTodasManutencoes/", obterTodasManutencoes),
    path("criarCorretivo/", criarCorretivo),
    path("editarCorretivo/", editarCorretivo),
    path("apagarCorretivo/", apagarCorretivo),

    path("criarPreventivo/", criarPreventivo),
    path("editarPreventivo/", editarPreventivo),
    path("apagarPreventivo/", apagarPreventivo),

    path("criarCronico/", criarCronico),
    path("editarCronico/", editarCronico),
    path("apagarCronico/", apagarCronico),
    
    path("atualizarPreventivoDataKm/", atualizarPreventivoDataKm),
    path("atualizarCronicoKm/", atualizarCronicoKm),
    
    # EDITAR CARROS
    path("apagarCarro/", apagarCarro),
    path("editarCarro/", editarCarro),
    
    #NOTAS
    path("notas/", listarNotas),
    path("apagarNota/", apagarNota),
    path("editarNota/", editarNota),
    path("criarNota/", criarNotaManual),
]

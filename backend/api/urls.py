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
    
    path("procurarCarros/", procurarCarros),
    
    # DEV / DEBUG
    path("adicionarPreventivos/", adicionarPreventivos),

    

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

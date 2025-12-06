from django.urls import path
from .views import (
    api_getCarCronicIssues,
    api_getCarsBySpecs,
    registerUser,
    loginUser,
    apiCarros,
    apiGaragens,
    apiNotas,
    apiManutencoes,
    apiPreventivos,
    apiCronicos,
)

urlpatterns = [

    # GEMINI APIs
    path('cronicIssues/', api_getCarCronicIssues),
    path('carSpecs/', api_getCarsBySpecs),

    # AUTENTICAÇÃO
    path('registerUser/', registerUser),
    path('loginUser/', loginUser),

    # GARAGENS
    path('tabelaGaragem/', apiGaragens),
    path('tabelaGaragem/<int:id>/', apiGaragens),

    # NOTAS
    path('tabelaNota/', apiNotas),
    path('tabelaNota/<int:id>/', apiNotas),

    # CARROS
    path('tabelaCarro/', apiCarros),
    path('tabelaCarro/<int:id>/', apiCarros),

    # MANUTENÇÕES
    path('tabelaManutencao/', apiManutencoes),
    path('tabelaManutencao/<int:id>/', apiManutencoes),

    # PREVENTIVOS
    path('tabelaPreventivo/', apiPreventivos),
    path('tabelaPreventivo/<int:id>/', apiPreventivos),

    # CRÓNICOS
    path('tabelaCronico/', apiCronicos),
    path('tabelaCronico/<int:id>/', apiCronicos),
]


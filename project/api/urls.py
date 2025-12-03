from django.urls import path, include
from .views import *
from .api_testing import *

urlpatterns = [
    path('cronicIssues/', api_getCarCronicIssues),
    path('carSpecs/', api_getCarsBySpecs),
    path('tabelaCarro/', apiCarros),  # POST, GET ALL
    path('tabelaCarro/<int:id>/', apiCarros),  # GET, PUT, DELETE
    path('loginUser/', loginUser),
    path('registerUser/', registerUser),
]

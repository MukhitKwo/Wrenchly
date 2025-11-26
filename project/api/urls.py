from django.urls import path, include
from .views import *

urlpatterns = [
    path('cronicIssues/', getCarCronicIssues),
    path('carSpecs/', getCarsBySpecs),
    path('tabelaCarro/', tabelaCarro),  # POST, GET ALL
    path('tabelaCarro/<int:id>/', tabelaCarro),  # GET, PUT, DELETE
    path('loginUser/', loginUser),
    path('registerUser/', registerUser),
]

from django.urls import path
from .views import *

urlpatterns = [
    path('createCarro/', createCarroView, name='createCarro'),
    path('getCarro/', getCarroView, name='getCarro'),
    path('updateCarro/', updateCarroView, name='updateCarro'),
    path('deleteCarro/', deleteCarroView, name='deleteCarro'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup')
]

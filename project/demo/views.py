from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import requests
from .forms import *
from utils.res_status import *


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        #! mandar os dados para backend e fazer auth e login la
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('/demo/getCarro/')

        return render(request, 'demo/login.html', {'error': 'Invalid credentials'})

    return render(request, 'demo/login.html')


def signup_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        
        print(username, email, password)

        #! mandar os dados para backend e fazer create la
        User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        return redirect('/demo/getCarro/')

    return render(request, "demo/signup.html")


def createCarroView(request):

    form = createCarroForm(request.POST or None)

    if form.is_valid():

        carInfo = form.cleaned_data
        carInfo["garagem"] = request.user.id or 1 # 1 is test user

        res = requests.post('http://127.0.0.1:8001/api/tabelaCarro/', json=carInfo, cookies=request.COOKIES)
        print_status(res)
        print(res.text)

    return render(request, 'demo/Carro/createCarro.html', {'form': form})


def getCarroView(request):

    oneCar = None
    multipleCars = None

    form = getCarroForm(request.POST or None)

    if form.is_valid():
        car_id = request.POST.get("id")
        if car_id:
            # com react é so fazer fetch que ja tem incluido o user na request
            res = requests.get(f'http://127.0.0.1:8001/api/tabelaCarro/{car_id}/', cookies=request.COOKIES)
            oneCar = res.json()
        else:
            res = requests.get('http://127.0.0.1:8001/api/tabelaCarro/')
            multipleCars = res.json()

    return render(request, 'demo/Carro/getCarro.html', {"form": form, 'oneCar': oneCar, "multipleCars": multipleCars})


def updateCarroView(request):
    pass


def deleteCarroView(request):
    pass

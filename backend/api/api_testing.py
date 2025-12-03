from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http import JsonResponse
from .views import getCarCronicIssues, getCarsBySpecs


@api_view(['GET'])
@permission_classes([IsAdminUser])
def api_getCarCronicIssues(request):
    car = request.GET.get("car")
    data = getCarCronicIssues(car)
    if data is None:
        return JsonResponse({"message": "Failed to get car issues"}, status=500)
    return JsonResponse(data, safe=False, json_dumps_params={"ensure_ascii": False, "indent": 2})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def api_getCarsBySpecs(request):
    specs = request.GET.dict()
    data = getCarsBySpecs(specs)
    if data is None:
        return JsonResponse({"message": "Failed to get cars by specs"}, status=500)
    return JsonResponse(data, safe=False)

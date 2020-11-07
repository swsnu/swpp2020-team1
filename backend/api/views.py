from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from json import JSONDecodeError
from .models import Category, Barcode, Item, ItemCount

# Create your views here.

def index(request):
    return HttpResponse('Hello, world!')

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_list(request):
    return

def item_user(request, id=0):
    if request.method == 'GET':
        # TODO: check user existence
        item_list = [item for item in Item.objects.filter(user_id = id).values()]
        return JsonResponse(item_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_count_list(request, id=0):
    if request.method == 'GET':
        # TODO: check user existence
        item_count_list = [item_count for item_count in ItemCount.objects.filter(item_id = id).values()]
        return JsonResponse(item_count_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
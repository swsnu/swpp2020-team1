from django.shortcuts import render

from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
from json import JSONDecodeError

"""
`api/signup`
POST:
    Create new user
"""
def signup(request):
    if request.method not in ['POST']:
        return HttpResponse('Method not allowed', status=405)
    try:
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        User.objects.create_user(username=username, password=password)
        return HttpResponse('Created User', status=201)
    except (ValueError, KeyError):
        return HttpResponse('Bad Request', status=400)

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

"""
`api/signin`
POST:
    Log in
"""
def signin(request):
    if request.method not in ['POST']:
        return HttpResponse('Method not allowed', status=405)
    try:
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse('Authorized User logged in', status=204)
        else:
            return HttpResponse('Unauthorized User', status=401)
    except (ValueError, KeyError):
        return HttpResponse('Bad Request', status=400)

"""
`api/signout`
GET:
    Log out
"""
def signout(request):
    if request.method not in ['GET']:
        return HttpResponse('Method not allowed', status=405)
    if request.user.is_authenticated:
        logout(request)
        return HttpResponse('Authorized User logged out', status=204)
    else:
        return HttpResponse('Unauthorized', status=401)

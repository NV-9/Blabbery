from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import render
from django.utils._os import safe_join
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.static import serve as static_serve
from pathlib import Path
import posixpath
from blabbery.helpers import parse_request_body
from blabbery.serializers import UserSerializer


@ensure_csrf_cookie
def serve_react(request, path, document_root=None):
    path = posixpath.normpath(path).lstrip("/")
    fullpath = Path(safe_join(document_root, path))
    if fullpath.is_file():
        return static_serve(request, path, document_root)
    else:
        return static_serve(request, "index.html", document_root)

@require_POST
def login_view(request):
    data = parse_request_body(request)
    if not data.status:
        return JsonResponse({'detail': 'Invalid JSON provided.', 'success': False}, status = 401)
    username = data.detail.get('username')
    password = data.detail.get('password')
    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.', 'success': False})
    user = authenticate(username = username, password = password)
    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.', 'success': False})
    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.', 'success': True})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.', 'success': False})
    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.', 'success': True})

def session_view(request):
    return JsonResponse({'isAuthenticated': request.user.is_authenticated, 'isStaff': request.user.is_staff})

def me_view(request):
    if request.user.is_authenticated:
        user_data = UserSerializer(request.user).data
        user_data.update({'success': True})
        return JsonResponse(user_data)
    else:
        return JsonResponse({'detail': "You're not logged in.", 'success': False})


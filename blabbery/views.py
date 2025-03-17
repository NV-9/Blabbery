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
from blabbery.models import User
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
    
    username = data.detail.get('username', None)
    password = data.detail.get('password', None)

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.', 'success': False})
    
    user = authenticate(username = username, password = password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.', 'success': False})
    
    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.', 'success': True})

@require_POST
def signup_view(request):
    data = parse_request_body(request)
    
    if not data.status:
        return JsonResponse({'detail': 'Invalid JSON provided.', 'success': False}, status=400)

    username = data.detail.get('username')
    email_address = data.detail.get('email_address')
    date_of_birth = data.detail.get('date_of_birth')
    password = data.detail.get('password')
    confirm_password = data.detail.get('confirm_password')

    if not all([username, email_address, date_of_birth, password, confirm_password]):
        return JsonResponse({'detail': 'All fields are required.', 'success': False}, status=400)

    if password != confirm_password:
        return JsonResponse({'detail': 'Passwords do not match.', 'success': False}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'detail': 'Username already taken.', 'success': False}, status=400)

    if User.objects.filter(email_address=email_address).exists():
        return JsonResponse({'detail': 'Email already registered.', 'success': False}, status=400)

    user = User.objects.create_user(username=username, email_address=email_address, date_of_birth=date_of_birth, password=password)
    login(request, user)

    return JsonResponse({'detail': 'Successfully signed up.', 'success': True}, status=201)

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


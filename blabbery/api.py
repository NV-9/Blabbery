from django.urls import path
from blabbery.views import login_view, logout_view, me_view, session_view

api_urlpatterns = [
    path('login/', login_view, name='api-login'),
    path('logout/', logout_view, name='api-logout'),
    path('me/', me_view, name='api-me'),
    path('session/', session_view, name='api-session'),
]

from django.conf import settings 
from django.contrib import admin
from django.urls import path, include
from blabbery.urls import url_patterns as blabbery_url_patterns

urlpatterns = [
    path('jet/', include('jet.urls', 'jet')),
    path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
    path(settings.ADMIN_URL, admin.site.urls),
    path(settings.API_URL, include('config.api')),
    *blabbery_url_patterns,
]

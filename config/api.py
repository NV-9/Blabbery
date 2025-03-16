from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from blabbery.api import api_urlpatterns
from blabbery.viewsets import UserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()
router.register("user", UserViewSet)

app_name = "api"
urlpatterns = api_urlpatterns + router.urls

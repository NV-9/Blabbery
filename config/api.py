from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from blabbery.api import api_urlpatterns
from blabbery.viewsets import UserViewSet, BaseChatViewSet, DirectChatViewSet, GroupChatViewSet, PublicGroupChatViewSet, MessageViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()
router.register("user", UserViewSet)
router.register("base-chat", BaseChatViewSet)
router.register("direct-chat", DirectChatViewSet)
router.register("group-chat", GroupChatViewSet)
router.register("public-group-chat", PublicGroupChatViewSet, basename="public-group-chat")
router.register("message", MessageViewSet)

app_name = "api"
urlpatterns = api_urlpatterns + router.urls

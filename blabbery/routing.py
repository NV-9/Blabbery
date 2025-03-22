from django.urls import re_path
from blabbery.consumers import DirectChatConsumer, GroupChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/direct/(?P<room_name>[0-9a-fA-F-]{36})/$", DirectChatConsumer.as_asgi()),
    re_path(r"ws/chat/group/(?P<room_name>[0-9a-fA-F-]{36})/$", GroupChatConsumer.as_asgi()),
]
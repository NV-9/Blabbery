from rest_framework.viewsets import ModelViewSet

from blabbery.models import User, BaseChat, DirectChat, GroupChat, Message
from blabbery.permissions import IsOwnerOrAdmin
from blabbery.serializers import UserSerializer, BaseChatSerializer, DirectChatSerializer, GroupChatSerializer, MessageSerializer

class BaseChatViewSet(ModelViewSet):
    queryset = BaseChat.objects.all()
    serializer_class = BaseChatSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'room_uuid'
    filterset_fields = ['limit']

class DirectChatViewSet(ModelViewSet):
    queryset = DirectChat.objects.all()
    serializer_class = DirectChatSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'room_uuid'
    filterset_fields = ['limit', 'users', 'online']

class GroupChatViewSet(ModelViewSet):
    queryset = GroupChat.objects.all()
    serializer_class = GroupChatSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'room_uuid'
    filterset_fields = ['limit', 'name', 'users', 'online', 'staff', 'rules', 'code']

class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'message_uuid'
    filterset_fields = ['chat', 'user', 'content', 'timestamp']

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'user_uuid'
    filterset_fields = ['email_address', 'is_active', 'username']

    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(id = self.request.user.id)
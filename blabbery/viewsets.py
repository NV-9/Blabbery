from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from blabbery.models import User
from blabbery.permissions import IsOwnerOrAdmin
from blabbery.serializers import UserSerializer

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
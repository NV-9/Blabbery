from rest_framework import serializers
from blabbery.models import BaseChat, DirectChat, GroupChat, Message, User

class UserSerializer(serializers.ModelSerializer):
    """
    User serializer
    """

    class Meta:
        model = User
        fields = ['id', 'user_uuid', 'username', 'is_staff']
        read_only_fields = ['id', 'user_uuid', 'username']
    
    def get_full_name(self, obj):
        return obj.full_name

    def get_is_student(self, obj):
        return obj.is_student


class BaseChatSerializer(serializers.ModelSerializer):
    """
    BaseChat serializer
    """

    class Meta:
        model = BaseChat
        fields = ['id', 'room_uuid', 'limit']
        read_only_fields = ['id', 'room_uuid']

class DirectChatSerializer(serializers.ModelSerializer):
    """
    DirectChat serializer
    """
    users = UserSerializer(many=True, read_only=True)
    online = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = DirectChat
        fields = ['id', 'room_uuid', 'limit', 'users', 'online']
        read_only_fields = ['id', 'room_uuid']
        depth = 2

class GroupChatSerializer(serializers.ModelSerializer):
    """
    GroupChat serializer
    """
    users = UserSerializer(many=True, read_only=True)
    online = UserSerializer(many=True, read_only=True)
    staff = UserSerializer(many=True, read_only=True)

    class Meta:
        model = GroupChat
        fields = ['id', 'room_uuid', 'limit', 'name', 'users', 'online', 'staff', 'rules', 'code', 'public']
        read_only_fields = ['id', 'room_uuid']

class MessageSerializer(serializers.ModelSerializer):
    """
    Message serializer
    """

    class Meta:
        model = Message
        fields = ['id', 'message_uuid', 'chat', 'user', 'content', 'timestamp']
        read_only_fields = ['id', 'message_uuid', 'timestamp']

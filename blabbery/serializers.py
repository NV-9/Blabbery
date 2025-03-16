from rest_framework import serializers
from blabbery.models import BaseChat, DirectChat, GroupChat, Message, User

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
    
    class Meta:
        model = DirectChat
        fields = ['id', 'room_uuid', 'limit', 'users', 'online']
        read_only_fields = ['id', 'room_uuid']

class GroupChatSerializer(serializers.ModelSerializer):
    """
    GroupChat serializer
    """

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

class UserSerializer(serializers.ModelSerializer):
    """
    User serializer
    """

    class Meta:
        model = User
        fields = ['id', 'user_uuid', 'username', 'email_address', 'date_of_birth', 'is_staff', 'is_active']
        read_only_fields = ['id', 'user_uuid', 'username', 'email_address']
    
    def get_full_name(self, obj):
        return obj.full_name

    def get_is_student(self, obj):
        return obj.is_student

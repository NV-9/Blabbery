from rest_framework import serializers
from blabbery.models import User

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

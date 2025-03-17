from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from blabbery.models import User, Message, DirectChat, GroupChat

@admin.register(User)
class UserAdmin(BaseUserAdmin):

    list_display = ['id', 'username', 'email_address']
    list_filter = ['is_active', 'is_staff']
    ordering = ['id', 'username' ,'email_address']
    filter_horizontal = []

    fieldsets = (
        (
            'Ids', {
                'fields': (
                    ('id', 'user_uuid'),
                )
            }
        ),
        (
            'Details', {
                'fields': (('username', 'email_address', 'date_of_birth'),),
            }
        ),
        (
            'Permissions', {
                'fields': (('is_active','is_staff',)),
            }
        ),
        (
            'Timestamps', {
                'fields': (('created_at', 'updated_at', 'last_login',),),
            }
        ),
    )
    readonly_fields = ['id', 'user_uuid', 'created_at', 'updated_at', 'last_login']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = ['id', 'message_uuid', 'user', 'chat', 'timestamp']
    list_filter = ['user', 'chat']
    ordering = ['id', 'message_uuid', 'user', 'chat', 'timestamp']
    filter_horizontal = []

    fieldsets = (
        (
            'Ids', {
                'fields': (
                    ('id', 'message_uuid'),
                )
            }
        ),
        (
            'Details', {
                'fields': (('user', 'chat', 'content'),),
            }
        ),
        (
            'Timestamps', {
                'fields': (('timestamp',),),
            }
        ),
    )
    readonly_fields = ['id', 'message_uuid', 'timestamp']


@admin.register(DirectChat)
class DirectChatAdmin(admin.ModelAdmin):

    list_display = ['id', 'room_uuid', 'limit']
    list_filter = ['limit']
    ordering = ['id', 'room_uuid']
    filter_horizontal = []

    fieldsets = (
        (
            'Ids', {
                'fields': (
                    ('id', 'room_uuid'),
                )
            }
        ),
        (
            'Group', {
                'fields': ('users', 'online'),
            }
        ),
    )
    readonly_fields = ['id', 'room_uuid']

@admin.register(GroupChat)
class GroupChatAdmin(admin.ModelAdmin):

    list_display = ['id', 'room_uuid', 'name', 'limit']
    list_filter = ['limit']
    ordering = ['name', 'id']
    filter_horizontal = []

    fieldsets = (
        (
            'Ids', {
                'fields': (
                    ('id', 'room_uuid'),
                )
            }
        ),
        (
            'Details', {
                'fields': (('limit', 'name', 'code', 'public',),),
            }
        ),
        (
            'Group', {
                'fields': (('users', 'online', 'staff')),
            }
        ),
        (
            'Rules', {
                'fields': (('rules'),),
            }
        ),
    )
    readonly_fields = ['id', 'room_uuid']

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.blabbery.models import User

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


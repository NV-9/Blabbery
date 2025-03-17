from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models import Model, AutoField, BooleanField, CASCADE, CharField, DateField, EmailField, ForeignKey, IntegerField, ManyToManyField, OneToOneField, TextField, UUIDField
from django.utils.translation import gettext_lazy as _
from typing import ClassVar
from uuid import uuid4
from blabbery.mixins import TimeStampMixin
from blabbery.managers import UserManager

class User(AbstractBaseUser, TimeStampMixin, PermissionsMixin):
    """
    Custom user model
    """

    id        = AutoField(primary_key = True)
    user_uuid = UUIDField(verbose_name = _('User UUID'), default = uuid4, editable = False)

    email_address  = EmailField(verbose_name = _('Email Address'), max_length = 255, unique = True)
    username       = CharField(verbose_name = _('Username'), max_length = 25, unique = True)
    date_of_birth  = DateField(verbose_name = _('Date of Birth'))
    
    is_active   = BooleanField(verbose_name = _('Account Active'), default = True)
    is_staff    = BooleanField(verbose_name = _('Account Admin'),  default = False)

    USERNAME_FIELD  = 'username'
    EMAIL_FIELD     = 'email_address'
    REQUIRED_FIELDS = ['email_address', 'date_of_birth']

    objects: ClassVar[UserManager] = UserManager()

    def has_perm(self, perm, obj=None): 
        return True
    def has_module_perms(self, app_label): 
        return True
    
    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.username:
            self.username = self.username.lower()
        super().save(*args, **kwargs)

class BaseChat(Model):
    """
    BaseChat model
    """
    id        = AutoField(primary_key = True)
    room_uuid = UUIDField(verbose_name = _('Room UUID'), default = uuid4, editable = False)
    limit     = IntegerField(verbose_name = _('Limit'), default = 2, blank = True)

    class Meta:
        verbose_name = _('Base Room')
        verbose_name_plural = _('Base Rooms')

    def __str__(self):
        return f"BaseChat-{self.id}"
    
class DirectChat(BaseChat):
    """
    DirectChat model
    """
    base   = OneToOneField(BaseChat, on_delete = CASCADE, parent_link = True, related_name = 'direct_chat')
    users  = ManyToManyField(User, verbose_name = _('Users'), related_name = 'direct_chat', blank = True)
    online = ManyToManyField(User, verbose_name = _('Online'), related_name = 'direct_chat_online', blank = True)

    class Meta:
        verbose_name = _('Direct Chat')
        verbose_name_plural = _('Direct Chats')

    def __str__(self):
        return f"DirectChat-{self.id}"

class GroupChat(BaseChat):
    """
    GroupChat model
    """
    base   = OneToOneField(BaseChat, on_delete = CASCADE, parent_link = True, related_name = 'group_chat')
    name   = CharField(verbose_name = _('Name'), max_length = 255, unique = True)
    users  = ManyToManyField(User, verbose_name = _('Users'), related_name = 'group_chat', blank = True)
    online = ManyToManyField(User, verbose_name = _('Online'), related_name = 'group_chat_online', blank = True)
    staff  = ManyToManyField(User, verbose_name = _('Staff'), related_name = 'group_chat_staff', blank = True)
    rules  = TextField(verbose_name = _('Rules'), blank = True)
    code   = CharField(verbose_name = _('Invite Code'), max_length = 255, default = '', blank = True)
    public = BooleanField(verbose_name = _('Public'), default = False)

    class Meta:
        verbose_name = _('Group Chat')
        verbose_name_plural = _('Group Chats')

    def __str__(self):
        return self.name
    
class Message(Model):
    """
    Message model
    """
    id           = AutoField(primary_key = True)
    message_uuid = UUIDField(verbose_name = _('Message UUID'), default = uuid4, editable = False)
    user         = ForeignKey(User, verbose_name = _('User'), on_delete = CASCADE, related_name = 'message')
    chat         = ForeignKey(BaseChat, verbose_name = _('Chat'), on_delete = CASCADE, related_name = 'message')
    content      = TextField(verbose_name = _('Content'))
    timestamp    = DateField(verbose_name = _('Timestamp'), auto_now_add = True)

    class Meta:
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')

    def __str__(self):
        return f'[{self.timestamp}]: {self.user} - {self.chat}'


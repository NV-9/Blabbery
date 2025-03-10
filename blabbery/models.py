from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models.constraints import UniqueConstraint
from django.db.models.fields import AutoField, BooleanField, CharField, DateField, EmailField, UUIDField
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

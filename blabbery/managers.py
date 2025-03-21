from typing import TYPE_CHECKING

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import BaseUserManager

if TYPE_CHECKING:
    from blabbery.models import User  # noqa: F401

class UserManager(BaseUserManager["User"]):
    """Custom manager for the User model."""

    def _create_user(self, email_address: str, password: str | None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email_address:
            msg = "The given email must be set"
            raise ValueError(msg)
        email_address = self.normalize_email(email_address)
        user: User = self.model(email_address=email_address, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email_address: str, password: str | None = None, **extra_fields):  # type: ignore[override]
        """
        Create and save a regular user with the given email and password.
        """
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email_address, password, **extra_fields)

    def create_superuser(self, email_address: str, password: str | None = None, **extra_fields):  # type: ignore[override]
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        if extra_fields.get("is_staff") is not True:
            msg = "Superuser must have is_staff=True."
            raise ValueError(msg)
        return self._create_user(email_address, password, **extra_fields)

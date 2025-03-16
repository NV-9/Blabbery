from pathlib import Path
from decouple import config, Csv

# File Paths
BASE_DIR  = Path(__file__).resolve().parent.parent
APPS_DIR  = BASE_DIR / 'apps'
BUILD_DIR = BASE_DIR / 'build'

# Folder Paths
STATIC_ROOT = config('BLABBERY_STATIC_ROOT', default = BASE_DIR / 'static')
MEDIA_ROOT  = config('BLABBERY_MEDIA_ROOT', default = BASE_DIR / 'media')

# URL Paths
ADMIN_URL  = config('BLABBERY_ADMIN_URL', default = 'admin/')
API_URL    = config('BLABBERY_API_URL', default = 'api/')
STATIC_URL = config('BLABBERY_STATIC_URL', default = 'static/')
MEDIA_URL  = config('BLABBERY_MEDIA_URL', default = 'media/')

# Configuration Paths
ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Security Settings
SECRET_KEY = config('BLABBERY_SECRET_KEY')
DOMAIN_NAME = config("BLABBERY_DOMAIN_NAME")
DEBUG = config('BLABBERY_DEBUG', default = False, cast = bool)
ALLOWED_HOSTS = config('BLABBERY_ALLOWED_HOSTS', cast = Csv())
X_FRAME_OPTIONS = 'SAMEORIGIN'
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    f'http://{DOMAIN_NAME}',
    f'https://{DOMAIN_NAME}',
]
CSRF_TRUSTED_ORIGINS = [
    f'http://{DOMAIN_NAME}',
    f'https://{DOMAIN_NAME}',
]
CSRF_COOKIE_HTTPONLY = False 
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SAMESITE = "Lax"
if DEBUG:
    CORS_ALLOWED_ORIGINS.append(f'http://{DOMAIN_NAME}:5173')
    CORS_ALLOWED_ORIGINS.append(f'http://{DOMAIN_NAME}:8000')
    CSRF_TRUSTED_ORIGINS.append(f'http://{DOMAIN_NAME}:5173')
    CSRF_TRUSTED_ORIGINS.append(f'http://{DOMAIN_NAME}:8000')

# Misc Settings
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Apps
DEFAULT_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
THIRD_PARTY_APPS = [
    'drf_material',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'django_celery_results',
]
ORDER_FIRST_APPS = [
    'jet.dashboard',
    'jet',
    'daphne',
]
LOCAL_APPS = [
    'blabbery',
]
INSTALLED_APPS = ORDER_FIRST_APPS + DEFAULT_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Template Settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database settings
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config("POSTGRES_DB"),
        'USER': config("POSTGRES_USER"),
        'PASSWORD': config("POSTGRES_PASSWORD"),
        'HOST': config("POSTGRES_HOST"),
        'PORT': config("POSTGRES_PORT"),
    },
}

# Users and Authentication
AUTH_USER_MODEL = "blabbery.User"
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# REST FRAMEWORK
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
}

# CHANNELS
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(config("REDIS_HOST", default = 'localhost'), config("REDIS_PORT", default = 6379, cast = int))],
        },
    },
}

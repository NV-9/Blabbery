from django.conf import settings
from django.urls import re_path
from blabbery.views import serve_react

url_patterns = [
    re_path(r"^(?!static/|media/)(?P<path>.*)$", serve_react, {"document_root": settings.BUILD_DIR}),
]
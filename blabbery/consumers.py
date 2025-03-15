import json
from datetime import datetime

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from blabbery.models import DirectChat, GroupChat, Message, User
from blabbery.serializers import MessageSerializer, UserSerializer


# tbc
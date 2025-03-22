import json
from datetime import datetime
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from blabbery.models import DirectChat, GroupChat, Message, User
from blabbery.serializers import MessageSerializer, UserSerializer

class DirectChatConsumer(WebsocketConsumer):

    current_class = DirectChat

    def __get_current_user(self, user_uuid):
        try:
            return User.objects.get(user_uuid = user_uuid)
        except User.DoesNotExist:
            return None
    
    def __get_current_room(self, room_uuid):
        try:
            return self.current_class.objects.get(room_uuid = room_uuid)
        except self.current_class.DoesNotExist:
            return None

    def __add_online_user(self, room_uuid, user_uuid):
        user = self.__get_current_user(user_uuid)
        room = self.__get_current_room(room_uuid)
        if user is None or room is None:
            return self.close()
        if not room.users.contains(user):
            self.send_unauthorised()
            return self.close()
        room.online.add(user)
        room.save()
    
    def __remove_online_user(self, room_uuid, user_uuid):
        user = self.__get_current_user(user_uuid)
        room = self.__get_current_room(room_uuid)
        if user is None or room is None:
            return self.close()
        room.online.remove(user)
        room.save()

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"direct_chat_{self.room_name}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

        self.__add_online_user(self.room_name, self.scope['user'].user_uuid)
        self.send_online()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        try:
            room = self.current_class.objects.get(room_uuid = self.room_name)
        except self.current_class.DoesNotExist:
            return self.close()
        self.__remove_online_user(self.room_name, self.scope['user'].user_uuid)
        self.send_online()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if "type" not in text_data_json:
            return self.close()
        match text_data_json["type"]:
            case "message":
                self.send_message(text_data_json)
            case "online":
                self.send_online()
            case _:
                self.close()
            
    def send_unauthorised(self):
        self.send(text_data = json.dumps({"type": "unauthorised"}))
    
    def send_online(self):
        try:
            room = self.current_class.objects.get(room_uuid = self.room_name)
        except self.current_class.DoesNotExist:
            return self.close()
        users = room.online.all()
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {"type": "online", "users": [{
            'username': user.username,
            'user_uuid': str(user.user_uuid)
        } for user in users]})

    def online(self, event):
        users = event["users"]
        self.send(text_data=json.dumps({"type": "online", "users": users}))

    def send_message(self, text_data_json):
        user = self.__get_current_user(self.scope['user'].user_uuid)
        room = self.__get_current_room(self.room_name)
        message = Message.objects.create(user = user, chat = room, content = text_data_json["content"], timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        message_data = MessageSerializer(message).data
        message_data.update({"type": "message", "user": UserSerializer(user).data})
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "direct.message", "message": message_data}
        )

    def direct_message(self, event):
        message = event["message"]
        self.send(text_data=json.dumps(message))


class GroupChatConsumer(DirectChatConsumer):

    current_class = GroupChat

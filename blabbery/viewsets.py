from django.contrib.auth import authenticate, login, logout

from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


from blabbery.models import User, BaseChat, DirectChat, GroupChat, Message
from blabbery.permissions import IsOwnerOrAdmin, GroupStaffOrAdmin
from blabbery.serializers import UserSerializer, BaseChatSerializer, DirectChatSerializer, GroupChatSerializer, MessageSerializer

class BaseChatViewSet(ModelViewSet):
    queryset = BaseChat.objects.all()
    serializer_class = BaseChatSerializer
    permission_classes = []
    lookup_field = 'room_uuid'
    filterset_fields = ['limit']

class DirectChatViewSet(ModelViewSet):
    queryset = DirectChat.objects.all()
    serializer_class = DirectChatSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'room_uuid'
    filterset_fields = ['limit', 'users', 'online']

    def get_queryset(self):
        return super().get_queryset().filter(users = self.request.user)

    @action(detail = False, methods = ['post'], url_name='join', url_path='join')
    def join(self, request):
        if username:=request.data.get('username', None) is None:
            return Response({'detail': 'Please provide a username to start a direct chat.', 'success': False}, status = 400)
        if user:= User.objects.filter(username=username).first() is None:
            return Response({'detail': 'User not found.', 'success': False}, status=404)
        if user == request.user:
            return Response({'detail': 'You cannot start a chat with yourself.', 'success': False}, status=400)
        users_set = {user, request.user}
        possible_chats = DirectChat.objects.filter(users__in=users_set).distinct()
        for chat in possible_chats:
            chat_users = set(chat.users.all())  
            if chat_users == users_set: 
                data = DirectChatSerializer(chat).data
                data.update({'success': False, 'detail': f'Chat already exists with {username}.'})  
                return Response(data, status=200)
        direct_chat = DirectChat.objects.create()
        direct_chat.users.set(users_set) 
        success = True
        data = DirectChatSerializer(direct_chat).data
        data.update({'success': success})
        return Response(data, status=201)

class GroupChatViewSet(ModelViewSet):
    queryset = GroupChat.objects.all()
    serializer_class = GroupChatSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'room_uuid'
    filterset_fields = ['limit', 'name', 'users', 'online', 'staff', 'rules', 'public']

    def get_queryset(self):
        return super().get_queryset().filter(users = self.request.user)

    @action(detail = False, methods = ['post'], url_name='join_private', url_path='join-private')
    def join_private(self, request):
        if code:= request.data.get('invite_code', None) is None:
            return Response({'detail': 'Please provide a code to join a public group chat.', 'success': False}, status = 400)
        group_chat = GroupChat.objects.filter(code = code).first()
        if group_chat is None:
            return Response({'detail': 'Invalid code provided.', 'success': False}, status = 400)
        group_chat.users.add(request.user)
        group_chat.save()
        return Response({'detail': 'Successfully joined the group chat.', 'success': True})
    
    @action(detail = True, methods = ['post'], url_name='join_public', url_path='join-public', permission_classes=[IsAuthenticated])
    def join_public(self, request, room_uuid):
        group_chat = GroupChat.objects.filter(room_uuid = room_uuid).first()

        if group_chat is None:
            return Response({'detail': 'Group chat not found.', 'success': False}, status = 404)

        if not group_chat.public:
            return Response({'detail': 'Group chat is not public.', 'success': False}, status = 400)

        group_chat.users.add(request.user)
        group_chat.save()

        return Response({'detail': 'Successfully joined the group chat.', 'success': True})

    @action(detail = True, methods = ['post'], url_name='leave', url_path='leave')
    def leave(self, request, room_uuid):
        group_chat = GroupChat.objects.filter(room_uuid = room_uuid).first()

        if group_chat is None:
            return Response({'detail': 'Group chat not found.', 'success': False}, status = 404)

        group_chat.users.remove(request.user)
        group_chat.save()

        return Response({'detail': 'Successfully left the group chat.', 'success': True})
    
    @action(detail=False, methods=['get'], url_name='public', url_path='public', permission_classes=[AllowAny])
    def public(self, request):
        return Response(self.get_serializer(super().get_queryset().filter(public=True), many=True).data)

class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'message_uuid'
    filterset_fields = ['chat', 'user', 'content', 'timestamp', 'chat__room_uuid']

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'user_uuid'
    filterset_fields = ['email_address', 'is_active', 'username']

    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(id = self.request.user.id)

    @action(detail = False, methods = ['get'], url_name='me', url_path='me')
    def me(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Not authenticated.'}, status=401)
        return Response(UserSerializer(request.user).data)

    @action(detail = False, methods = ['post'], url_name='logout', url_path='logout', permission_classes=[IsAuthenticated])
    def logout(self, request):
        logout(request)
        return Response({'detail': 'Successfully logged out.', 'success': True})

    @action(detail = False, methods = ['post'], url_name='login', url_path='login', permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        if username is None or password is None:
            return Response({'detail': 'Please provide username and password.', 'success': False})

        user = authenticate(username = username, password = password)

        if user is None:
            return Response({'detail': 'Invalid credentials.', 'success': False})

        login(request, user)
        return Response({'detail': 'Successfully logged in.', 'success': True})

    @action(detail = False, methods = ['post'], url_name='signup', url_path='signup', permission_classes=[AllowAny])
    def signup(self, request):
        username = request.data.get('username', None)
        email_address = request.data.get('email_address', None)
        date_of_birth = request.data.get('date_of_birth', None)
        password = request.data.get('password', None)
        confirm_password = request.data.get('confirm_password', None)

        if not all([username, email_address, date_of_birth, password, confirm_password]):
            return Response({'detail': 'All fields are required.', 'success': False}, status=400)

        if password != confirm_password:
            return Response({'detail': 'Passwords do not match.', 'success': False}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already taken.', 'success': False}, status=400)

        if User.objects.filter(email_address=email_address).exists():
            return Response({'detail': 'Email already registered.', 'success': False}, status=400)

        user = User.objects.create_user(username=username, email_address=email_address, date_of_birth=date_of_birth, password=password)
        login(request, user)

        return Response({'detail': 'Successfully signed up.', 'success': True}, status=201)

    @action(detail = False, methods = ['get'], url_name='session', url_path='session', permission_classes=[AllowAny])
    def session(self, request):
        return Response({'isAuthenticated': request.user.is_authenticated, 'isStaff': request.user.is_staff})
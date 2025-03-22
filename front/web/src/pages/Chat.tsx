import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout, Card, Input, List, Avatar, Typography, Button, notification, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { User, Room } from "../utils/Interfaces";
import { NotificationType } from "../utils/Types";
import { ApiRouter } from "../utils/Api";

const { Content, Sider } = Layout;
const { Title } = Typography;

const WS_ENDPOINTS = {
    DIRECT_CHAT: (room_uuid: string) => `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws/chat/direct/${room_uuid}/`,
    GROUP_CHAT: (room_uuid: string) => `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws/chat/group/${room_uuid}/`
};

const ChatList: React.FC<{
    rooms: Room[];
    searchUsername: string;
    setSearchUsername: (val: string) => void;
    onSearch: (val: string) => void;
}> = ({ rooms, searchUsername, setSearchUsername, onSearch }) => {
    const navigate = useNavigate();
    const renderChat = (chat: Room) => (
        <List.Item onClick={() => navigate('/chat/' + (chat.isGroup ? 'group/' : 'user/') + chat.room_uuid)} style={{ cursor: "pointer" }}>
            <List.Item.Meta avatar={<Avatar style={{ backgroundColor: "#1890ff" }}>{chat.name.charAt(0)}</Avatar>} title={chat.name} />
        </List.Item>
    );
    return (
        <Card title="Chats" style={{ height: "100%" }}>
            <Input.Search placeholder="Chat to user..." onSearch={onSearch} allowClear value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} />
            <List itemLayout="horizontal" dataSource={rooms} renderItem={renderChat} />
        </Card>
    );
};

const UserList: React.FC<{ users: User[]; title: string }> = ({ users, title }) => (
    <>
        <Title level={4}>{title}</Title>
        <List itemLayout="horizontal" dataSource={users} renderItem={(user: User) => (
            <List.Item>
                <List.Item.Meta avatar={<Avatar style={{ backgroundColor: "#1890ff" }}>{user.username.charAt(0)}</Avatar>} title={user.username} />
            </List.Item>
        )} />
    </>
);

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const { type, chat_uuid } = useParams();
    const [api, contextHolder] = notification.useNotification();
    const [currentUserData, setCurrentUserData] = useState<User>();
    const [currentRoomData, setCurrentRoomData] = useState<Room>();
    const [searchUsername, setSearchUsername] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [publicRooms, setPublicRooms] = useState<Room[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<{ sender: string, content: string }[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const showNotification = (title: string, message: string, type: NotificationType) =>
        api[type]({ message: title, description: message, placement: "topRight", duration: 3 });

    const sendNewMessage = () => {
        if (!newMessage || !currentUserData || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
        const data = { type: "message", content: newMessage };
        socketRef.current.send(JSON.stringify(data));
        setNewMessage("");
    };

	const onBackClicked = () => {
		if (socketRef.current) {
			socketRef.current.close();
			socketRef.current = null;
		};
		setCurrentRoomData(undefined);
		setMessages([]);
		navigate("/chat/");
	};

	const joinDirectChat = () => {
		if (!searchUsername) return;
		ApiRouter.post("direct-chat/join/", { username: searchUsername })
			.then((res) => {
				if (res.success) navigate(`/chat/user/${res.room_uuid}`);
                else showNotification("Error", res.detail, "error");

			})
			.catch(() => showNotification("Error", "Failed to join or create direct chat.", "error"));
		setSearchUsername("");
	};
	
	const joinPrivateGroupChat = () => {
		if (!inviteCode) return;
		ApiRouter.post("group-chat/join-private/", { invite_code: inviteCode })
			.then((res) => {
				if (res.success) navigate(`/chat/group/${res.room_uuid}`);
                else showNotification("Error", res.detail, "error");
			})
			.catch(() => showNotification("Error", "Failed to join group chat.", "error"));
		setInviteCode("");
	};

	const joinPublicGroupChat = (room_uuid: string) => {
		ApiRouter.post(`group-chat/${room_uuid}/join-public/`, {})
		.then((res) => {
			if (res.success) navigate(`/chat/group/${res.room_uuid}`);
            else showNotification("Error", res.detail, "error");
		})
		.catch(() => showNotification("Error", "Failed to join group chat.", "error"));
	}
	

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        ApiRouter.get("user/me/").then((userResponse) => {
            if (!userResponse || !userResponse.username) return navigate("/authenticate/");
            setCurrentUserData(userResponse);
            if (type && (type === "user" || type === "group")) {
                ApiRouter.get(`${type === 'user' ? 'direct' : 'group'}-chat/${chat_uuid}/`).then((response) => {
                    if (response) {
                        setCurrentRoomData({
                            ...response,
                            isGroup: type === 'group',
                            name: type === 'group' ? response.name : response.users.find((u: User) => u.user_uuid !== userResponse.user_uuid).username
                        });
                        setMessages([]);
                        ApiRouter.get(`message/?chat__room_uuid=${chat_uuid}`).then((roomMessages) => {
                            if (roomMessages) {
                                setMessages(roomMessages.map((msg: any) => ({ sender: msg.user.username, content: msg.content })));
                            }
                        }).catch(() => showNotification("Error", "Failed to fetch chat messages.", "error"));
                    }
                }).catch(() => showNotification("Error", "Failed to fetch chat room data.", "error"));
            }
        });
    }, [type, chat_uuid]);

    useEffect(() => {
        if (!currentUserData) return;
        Promise.all([
            ApiRouter.get("direct-chat/"),
            ApiRouter.get("group-chat/"),
            ApiRouter.get("group-chat/public/")
        ]).then(([directChats, groupChats, publicChats]) => {
            const directRooms = directChats?.map((roomData: any) => {
                const otherUser = roomData.users.find((u: User) => u.user_uuid !== currentUserData.user_uuid);
                return { id: roomData.id, room_uuid: roomData.room_uuid, user: otherUser, name: otherUser?.username, isGroup: false };
            }) || [];
            const groupRooms = groupChats?.map((roomData: any) => ({ id: roomData.id, room_uuid: roomData.room_uuid, isGroup: true, ...roomData })) || [];
            setRooms([...directRooms, ...groupRooms]);
            if (publicChats?.length > 0) setPublicRooms(publicChats);
        }).catch(() => showNotification("Error", "Failed to fetch chat rooms.", "error"));
    }, [currentUserData]);

    useEffect(() => {
        if (!currentRoomData) return;
        if (socketRef.current) socketRef.current.close();
        const url = currentRoomData.isGroup ? WS_ENDPOINTS.GROUP_CHAT(currentRoomData.room_uuid) : WS_ENDPOINTS.DIRECT_CHAT(currentRoomData.room_uuid);
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "online") setOnlineUsers(data.users);
            else if (data.type === "message" && data.user && data.content) {
                setMessages((prev) => [...prev, { sender: data.user.username, content: data.content }]);
            } else if (data.type === "unauthorised") navigate("/authenticate/");
        };
        socketRef.current = ws;
        return () => {
            ws.close();
            socketRef.current = null;
        };
    }, [currentRoomData]);

    const offlineUsers = currentRoomData?.users?.filter((user: User) => !onlineUsers.some((u) => u.user_uuid === user.user_uuid)) || [];

    return (
        <Layout>
            {contextHolder}
            <Sider width={250} theme="light" style={{ borderRight: "1px solid #ddd" }}>
                <ChatList rooms={rooms} searchUsername={searchUsername} setSearchUsername={setSearchUsername} onSearch={joinDirectChat} />
            </Sider>
            <Layout>
                {chat_uuid && type ? (
                    <Content style={{ padding: "20px", display: "flex", flexDirection: "column", height: "80vh" }}>
                        <Row justify="space-between" align="middle" style={{ marginBottom: "10px" }}>
                            <Button icon={<ArrowLeftOutlined />} onClick={onBackClicked} />
                            <Col flex="auto" style={{ textAlign: "center" }}>
                                <Title level={4} style={{ margin: 0 }}>{currentRoomData?.name}</Title>
                            </Col>
                            <div style={{ width: 48 }}></div>
                        </Row>
                        <Card style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: msg.sender === currentUserData?.username ? "flex-end" : "flex-start", padding: "5px 10px" }}>
                                    <Card size="small" style={{ backgroundColor: msg.sender === currentUserData?.username ? "#e6f7ff" : "#f0f0f0", borderRadius: "8px", maxWidth: "70%" }}>
                                        <strong>{msg.sender}</strong>
                                        <div>{msg.content}</div>
                                    </Card>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </Card>
                        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onPressEnter={sendNewMessage} />
                            <Button type="primary" onClick={sendNewMessage}>Send</Button>
                        </div>
                    </Content>
                ) : (
                    <Content style={{ padding: "20px", display: "flex", flexDirection: "column", height: "80vh" }}>
                        <Title level={4}>Join a group</Title>
                        <Input.Search placeholder="Invite code..." onSearch={joinPrivateGroupChat} allowClear value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
                        <Title level={4}>Public Groups</Title>
                        {publicRooms.map((room: Room) => {
                            const alreadyJoined = rooms.some((r: Room) => r.room_uuid === room.room_uuid);
                            return (
                                <Card key={room.room_uuid} title={room.name} style={{ marginBottom: "10px" }}>
                                    <Button type="primary" onClick={() => alreadyJoined ? navigate(`/chat/group/${room.room_uuid}`) : joinPublicGroupChat(room.room_uuid)}>
                                        {alreadyJoined ? "Resume" : "Join"}
                                    </Button>
                                </Card>
                            );
                        })}
                    </Content>
                )}
            </Layout>
            {chat_uuid && type && (
                <Sider width={250} theme="light" style={{ padding: "20px", borderLeft: "1px solid #ddd" }}>
                    <UserList title="Online Users" users={onlineUsers} />
                    <div style={{ marginTop: "20px" }}>
                        <UserList title="Offline Users" users={offlineUsers} />
                    </div>
                </Sider>
            )}
        </Layout>
    );
};

export default Chat;

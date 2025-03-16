import React, { useEffect, useState } from "react";
import { Card, Input, Button, Row, Col, Typography, Form, message, Layout, Carousel} from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { ApiRouter } from "../utils/Api";
import { GroupRoom, DirectRoom } from "../utils/Interfaces";

const { Title, Text } = Typography;
const { Content } = Layout;

const ChatList: React.FC = () => {
    const [publicRooms, setPublicRooms] = useState<GroupRoom[]>([]);
    const [joinedPublicRooms, setJoinedPublicRooms] = useState<GroupRoom[]>([]);
    const [joinedDirectRooms, setjoinedDirectRooms] = useState<DirectRoom[]>([]);

    const [directChatForm] = Form.useForm();

    useEffect(() => { 
        ApiRouter.get("public-group-chat/")
        .then((response) => {
            if (response) setPublicRooms(response);
            else console.error("Failed to fetch public rooms.");
        })
        .catch((error) => {
            console.error("Fetch Public Rooms Error:", error);
        });
        ApiRouter.get("public-group-chat/")
        .then((response) => {
            if (response) setJoinedPublicRooms(response);
            else console.error("Failed to fetch joined public rooms.");
        })
        .catch((error) => {
            console.error("Fetch Joined Public Rooms Error:", error);
        });
        ApiRouter.get("direct-chat/")
        .then((response) => {
            if (response) setjoinedDirectRooms(response);
            else console.error("Failed to fetch direct rooms.");
        })
        .catch((error) => {
            console.error("Fetch Direct Rooms Error:", error);
        });
    }, []);

    const handleStartDirectChat = async (values: { username: string }) => {
        try {
            const response = await ApiRouter.post("start-direct-chat/", values);

            if (response.success) {
                message.success(`Chat started with ${values.username}`);
                directChatForm.resetFields();
            } else {
                message.error("Failed to start direct chat. User may not exist.");
            }
        } catch (error) {
            message.error("Error starting direct chat.");
            console.error("Direct Chat Error:", error);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", padding: "20px" }}>
            <Content>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Title level={3} style={{ textAlign: "center" }}>Direct Chats</Title>
                        <Carousel autoplay>
                            {joinedDirectRooms.length > 0 ? (
                                joinedDirectRooms.map((chat) => (
                                    <Card
                                        key={chat.id}
                                        title={chat.user.username}
                                        hoverable
                                        style={{ textAlign: "center" }}
                                        actions={[
                                            <Button
                                                type="primary"
                                                icon={<MessageOutlined />}
                                                onClick={() => console.log("Opening chat with:", chat.user.username)}
                                            >
                                                Chat
                                            </Button>
                                        ]}
                                    >
                                    
                                    </Card>
                                ))
                            ) : (
                                <Card style={{ textAlign: "center" }}>No direct chats available</Card>
                            )}
                        </Carousel>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={3} style={{ textAlign: "center" }}>Group Chats</Title>
                        <Carousel autoplay>
                            {joinedPublicRooms.length > 0 ? (
                                joinedPublicRooms.map((room) => (
                                    <Card
                                        key={room.id}
                                        title={room.name}
                                        hoverable
                                        style={{ textAlign: "center" }}
                                        actions={[
                                            <Button
                                                type="primary"
                                                onClick={() => console.log("Joining group:", room.name)}
                                            >
                                                Resume
                                            </Button>
                                        ]}
                                    >
                                        <Text>
                                            {room.rules.length > 100 ? `${room.rules.substring(0, 100)}...` : room.rules}
                                        </Text>
                                    </Card>
                                ))
                            ) : (
                                <Card style={{ textAlign: "center" }}>No group chats available</Card>
                            )}
                        </Carousel>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card>
                            <Title level={4}>Start a Direct Chat</Title>
                            <Form form={directChatForm} layout="vertical" onFinish={handleStartDirectChat}>
                                <Form.Item
                                    label="Enter Username"
                                    name="username"
                                    rules={[{ required: true, message: "Please enter a username!" }]}
                                >
                                    <Input placeholder="Enter username" prefix={<UserOutlined />} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        Start Chat
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={3} style={{ textAlign: "center" }}>Public Rooms</Title>
                        <Carousel autoplay dots={false}>
                            {publicRooms.length > 0 ? (
                                publicRooms.map((room) => (
                                    <Card key={room.id} title={room.name} hoverable>
                                        <Text>{room.rules.substring(0, 100)}...</Text>
                                        <Button type="primary" block style={{ marginTop: "10px" }}>
                                            Join Room
                                        </Button>
                                    </Card>
                                ))
                            ) : (
                                <Card style={{ textAlign: "center" }}>No public rooms available</Card>
                            )}
                        </Carousel>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ChatList;

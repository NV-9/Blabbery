import React, { useEffect, useState } from "react";
import { Card, Input, Button, Row, Col, Typography, Space, Modal, Form, InputNumber, Switch, message } from "antd";
import { PlusOutlined, LockOutlined } from "@ant-design/icons";
import { ApiRouter } from "../utils/Api";

const { Title, Text } = Typography;

interface Room {
    id: string;
    name: string;
    room_uuid: string;
    description: string;
}

const ChatList: React.FC = () => {
    const [publicRooms, setPublicRooms] = useState<Room[]>([]);
    const [inviteCode, setInviteCode] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [isPrivateRoom, setIsPrivateRoom] = useState(false);
    const [form] = Form.useForm();


    useEffect(() => {
        const fetchPublicRooms = async () => {
            try {
                const response = await ApiRouter.get("public-group-chat/");
                if (response) {
                    setPublicRooms(response);
                } else {
                    message.error("Failed to fetch public rooms.");
                }
            } catch (error) {
                message.error("Error fetching public rooms.");
                console.error("Fetch Public Rooms Error:", error);
            }
        };

        fetchPublicRooms();
    }, []);

    const handleJoinRoom = () => {
        if (inviteCode.trim()) {
            console.log("Joining room with invite code:", inviteCode);
        }
    };

    const handleOpenModal = (isPrivate: boolean) => {
        setIsPrivateRoom(isPrivate);
        setModalVisible(true);
    };

    const handleCreateRoom = async (values: { name: string; limit: number; rules?: string; code?: string }) => {
        try {
            const data = {
                ...values,
                public: !isPrivateRoom, 
            };
            const response = await ApiRouter.post("create-group/", data);

            if (response.success) {
                message.success(`Room "${values.name}" created successfully!`);
                setModalVisible(false);
                form.resetFields();
            } else {
                message.error("Failed to create room. Please try again.");
            }
        } catch (error) {
            message.error("Error creating room.");
            console.error("Create Room Error:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                Public Chat Rooms
            </Title>

            <Row gutter={[16, 16]}>
                {publicRooms.map((room) => (
                    <Col xs={24} sm={12} md={8} key={room.id}>
                        <Card
                            title={room.name}
                            bordered={false}
                            hoverable
                            onClick={() => console.log("Joining room:", room.name)}
                        >
                            <Text>{room.description}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <Title level={4}>Join a Room with an Invite Code</Title>
                <Space direction="horizontal">
                    <Input
                        placeholder="Enter invite code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" onClick={handleJoinRoom}>
                        Join
                    </Button>
                </Space>
            </div>
            <div style={{ marginTop: "40px", textAlign: "center" }}>
                <Title level={4}>Create a New Room</Title>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal(false)}
                    >
                        Create Public Room
                    </Button>
                    <Button
                        type="default"
                        icon={<LockOutlined />}
                        onClick={() => handleOpenModal(true)}
                    >
                        Create Private Room
                    </Button>
                </Space>
            </div>
            <Modal
                title={isPrivateRoom ? "Create Private Room" : "Create Public Room"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateRoom}>
                    <Form.Item
                        label="Room Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter a room name!" }]}
                    >
                        <Input placeholder="Enter room name" />
                    </Form.Item>
                    <Form.Item
                        label="Room Limit"
                        name="limit"
                        initialValue={2}
                        rules={[{ required: true, message: "Please enter a room limit!" }]}
                    >
                        <InputNumber min={2} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Rules (Optional)" name="rules">
                        <Input.TextArea placeholder="Enter room rules (optional)" />
                    </Form.Item>
                    {isPrivateRoom && (
                        <Form.Item
                            label="Invite Code"
                            name="code"
                            rules={[{ required: true, message: "Invite code is required for private rooms!" }]}
                        >
                            <Input placeholder="Enter invite code for private room" />
                        </Form.Item>
                    )}
                    <Form.Item name="public" hidden initialValue={!isPrivateRoom}>
                        <Switch defaultChecked={!isPrivateRoom} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Create Room
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChatList;

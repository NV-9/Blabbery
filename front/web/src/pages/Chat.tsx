import React, { useState } from "react";
import { Layout, Card, Input, Button, List, Avatar, Typography } from "antd";
import { User, Message } from "../utils/Interfaces";

const {  Sider, Content } = Layout;
const { Title } = Typography;


const Chat: React.FC = () => {
	const [onlineUsers] = useState<User[]>([
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
		{ id: 3, name: "Charlie" },
	]);

	const [messages, setMessages] = useState<Message[]>([
		{ sender: "Alice", content: "Hey there! 😊" },
		{ sender: "You", content: "Hello Alice! 👋" },
	]);

	const [newMessage, setNewMessage] = useState("");

	const sendMessage = () => {
		if (newMessage.trim()) {
		setMessages([...messages, { sender: "You", content: newMessage }]);
		setNewMessage("");
		}
	};

	return (


		<Layout>
			<Sider width={250} theme="light" style={{ padding: "20px", borderRight: "1px solid #ddd" }}>
			<Title level={4}>Online Users</Title>
			<List
				itemLayout="horizontal"
				dataSource={onlineUsers}
				renderItem={(user) => (
				<List.Item>
					<List.Item.Meta
					avatar={<Avatar style={{ backgroundColor: "#1890ff" }}>{user.name.charAt(0)}</Avatar>}
					title={user.name}
					/>
				</List.Item>
				)}
			/>
			</Sider>

			{/* Main Chat Area */}
			<Layout>
			<Content style={{ padding: "20px", display: "flex", flexDirection: "column", height: "80vh" }}>
				<Card
				title="Chat Room"
				style={{ flex: 1, overflow: "auto" }}
				bodyStyle={{ display: "flex", flexDirection: "column", height: "100%" }}
				>
				<div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
					{messages.map((msg, index) => (
					<div
						key={index}
						style={{
						display: "flex",
						justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
						marginBottom: "10px",
						}}
					>
						<Card
						size="small"
						style={{
							backgroundColor: msg.sender === "You" ? "#e6f7ff" : "#f0f0f0",
							borderRadius: "8px",
							padding: "10px",
							maxWidth: "70%",
						}}
						>
						<strong>{msg.sender}</strong>
						<p style={{ margin: 0 }}>{msg.content}</p>
						</Card>
					</div>
					))}
				</div>
				</Card>

				{/* Message Input Box */}
				<div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
				<Input
					placeholder="Type a message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onPressEnter={sendMessage}
				/>
				<Button type="primary" onClick={sendMessage}>
					Send
				</Button>
				</div>
			</Content>
			</Layout>
		</Layout>
	);
};

export default Chat;

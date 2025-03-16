import React from "react";
import { Card, Typography, Button } from "antd";
import { AuthProps } from "../utils/Interfaces";

const { Title, Paragraph } = Typography;

const Home: React.FC<AuthProps> = ({ isAuthenticated }) => {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
			<Card title="Welcome!" style={{ width: 500, textAlign: "center" }}>
				<Title level={3}>Chat freely with your friends 🚀</Title>
				<Paragraph>
					Blabbery is a real-time chat platform that makes it easy to stay connected.
					Join a room, start a conversation, and enjoy seamless messaging.
				</Paragraph>
				<Button type="primary" size="large" href={isAuthenticated ? "/chats" : "/authenticate"}>
					{isAuthenticated ? "Go to Chats" : "Get Started"}
				</Button>
			</Card>
		</div>
	);
};

export default Home;

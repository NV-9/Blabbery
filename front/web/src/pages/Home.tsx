import React from "react";
import { Button, Card, Layout, Typography } from "antd";
import { AuthProps } from "../utils/Interfaces";

const { Title, Paragraph } = Typography;

const Home: React.FC<AuthProps> = ({ isAuthenticated }) => {
    return (
        <Layout style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", position: "relative", padding: "20px" }}>
            <Card title="Welcome!" style={{ width: "90%", maxWidth: 500, textAlign: "center" }}>
                <Title level={3}>Chat freely with your friends!</Title>
                <Paragraph>
                    Blabbery is a real-time chat platform that makes it easy to stay connected.
                    Join a room, start a conversation, and enjoy seamless messaging.
                </Paragraph>
                <Button type="primary" size="large" href={isAuthenticated ? "/chat" : "/authenticate"}>
                    {isAuthenticated ? "Go to Chats" : "Get Started"}
                </Button>
            </Card>
        </Layout>
    );		
};

export default Home;

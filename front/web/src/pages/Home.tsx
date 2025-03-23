import React from "react";
import { Layout, Typography } from "antd";
import { AuthProps } from "../utils/Interfaces";
import Card from "../components/Card";
import Button from "../components/Button";


const { Title, Paragraph } = Typography;

const Home: React.FC<AuthProps> = ({ isAuthenticated }) => {
    return (
        <Layout style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", height: "100vh", background: "linear-gradient(to right, #6a11cb, #2575fc)" }}>
            <Card title={<Title level={3} style={{ color: "#fff", margin: 0 }}>Welcome!</Title>} style={{ width: "90%", maxWidth: 500, textAlign: "center", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)", borderRadius: "12px" }}>
                <Title level={3} style={{ color: "#fff" }}>Chat freely with your friends!</Title>
                <Paragraph style={{ color: "#f0f0f0" }}>
                    Blabbery is a real-time chat platform that makes it easy to stay connected.
                    Join a room, start a conversation, and enjoy seamless messaging.
                </Paragraph>
                <Button type="primary" size="large" href={isAuthenticated ? "/chat" : "/authenticate"} style={{ background: "#00c6ff", border: "none", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    {isAuthenticated ? "Go to Chats" : "Get Started"}
                </Button>
            </Card>
        </Layout>
    );		
};

export default Home;

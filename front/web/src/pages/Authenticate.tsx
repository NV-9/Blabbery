import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, notification } from "antd";
import { ApiRouter } from "../utils/Api";
import { BaseProps } from "../utils/Interfaces";
import { NotificationType } from "../utils/Types";

const { Title, Paragraph } = Typography;

const Authenticate: React.FC<BaseProps> = ({ isAuthenticated, setAuthenticated}) => {
	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
    const [isRegister, setIsRegister] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/chats");
		}
	}, [isAuthenticated, navigate]);

	const showNotification = (title: string, message: string, type: NotificationType) => {
		api[type]({
			message: title,
			description: message,
			placement: "topRight",
			duration: 3,
		});
	}

    const onSubmit = async (values: any) => {
		try {
			ApiRouter.post(isRegister ? "register/" : "login/", values)
				.then((response) => {
					if (response && response.success) {
						showNotification("Success 🎉", isRegister
							? "Registration successful! Welcome to Blabbery."
							: "Login successful! Redirecting...", "success");
						setAuthenticated(true);
						setTimeout(() => navigate("/chats"), 1500);
					} else {
						showNotification("Login Failed ❌", response?.message || "Invalid credentials. Please try again.", "error");
					}
				})
				.catch((error) => {
					showNotification("Server Error 🚨", "Unable to process your request. Please try again later.", "error");
					console.error("Request Error:", error);
				});
		} catch (error) {
			showNotification("Unexpected Error ⚠️", "An unexpected error occurred. Please try again.", "error");
			console.error("Unexpected Error:", error);
		}
	};

    return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
			{contextHolder}
			<Card title={isRegister ? "Register for Blabbery" : "Login to Blabbery"} style={{ width: 400, textAlign: "center" }}>
				<Title level={3}>{isRegister ? "Create an account" : "Welcome back!"}</Title>
				<Paragraph>
					{isRegister ? "Sign up to start chatting!" : "Log in to continue your conversations."}
				</Paragraph>
				<Form name="authForm" layout="vertical" onFinish={onSubmit}>
					<Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
						<Input placeholder="Enter your username" />
					</Form.Item>
					<Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
						<Input.Password placeholder="Enter your password" />
					</Form.Item>
					{isRegister && (
						<Form.Item label="Confirm Password" name="confirmPassword" dependencies={["password"]}
							rules={[{ required: true, message: "Please confirm your password!" },
							({ getFieldValue }) => ({
								validator(_, value) {
								return value && value === getFieldValue("password")
									? Promise.resolve()
									: Promise.reject(new Error("Passwords do not match!"));
								},
							}),
							]}
						>
							<Input.Password placeholder="Confirm your password" />
						</Form.Item>
					)}
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							{isRegister ? "Register" : "Login"}
						</Button>
					</Form.Item>
				</Form>

				<Button type="link" onClick={() => setIsRegister(!isRegister)}>
					{isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
				</Button>
			</Card>
		</div>
    );
};

export default Authenticate;

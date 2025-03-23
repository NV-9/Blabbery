import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker, Form, Input, Typography, notification } from "antd";
import dayjs from "dayjs";
import { ApiRouter } from "../utils/Api";
import { BaseProps } from "../utils/Interfaces";
import Button from "../components/Button";
import Card from "../components/Card";
import { showNotification } from "../utils/Helpers";

const { Paragraph } = Typography;

const Authenticate: React.FC<BaseProps> = ({ isAuthenticated, setAuthenticated }) => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/chat");
    }, [isAuthenticated, navigate]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        if (isSignup) {
            values.date_of_birth = values.date_of_birth ? dayjs(values.date_of_birth).format("YYYY-MM-DD") : null;
        }

        ApiRouter.post(isSignup ? "user/signup/" : "user/login/", values)
            .then((response) => {
                if (response && response.success) {
                    showNotification(api, 
                        "Success :)",
                        isSignup ? "Registration successful! Welcome to Blabbery." : "Login successful! Redirecting...",
                        "success"
                    );
                    setAuthenticated(true);
                    setTimeout(() => navigate("/chat/"), 1500);
                } else {
                    showNotification(api, 
                        isSignup ? "Signup Error" : "Login Error",
                        response?.detail || "Invalid credentials. Please try again.",
                        "error"
                    );
                }
            })
            .catch(() => {
                showNotification(api, "Server Error 🚨", "Unable to process your request. Please try again later.", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            {contextHolder}
            <Card title={isSignup ? "Create an account" : "Welcome back!"} style={{ width: 400, textAlign: "center" }}>
                <Paragraph>
                    {isSignup ? "Sign up to start chatting!" : "Log in to continue your conversations."}
                </Paragraph>
                <Form name="authForm" layout="vertical" onFinish={onSubmit}>
                    <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    {isSignup && (
                        <>
                            <Form.Item
                                label="Email"
                                name="email_address"
                                rules={[
                                    { required: true, message: "Please enter your email!" },
                                    { type: "email", message: "Invalid email address!" },
                                ]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>

                            <Form.Item
                                label="Date of Birth"
                                name="date_of_birth"
                                rules={[{ required: true, message: "Please enter your date of birth!" }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    {isSignup && (
                        <Form.Item
                            label="Confirm Password"
                            name="confirm_password"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password!" },
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
                        <Button htmlType="submit" loading={loading} block>
                            {isSignup ? "Register" : "Login"}
                        </Button>
                    </Form.Item>
                </Form>

                <Button type="text" onClick={() => setIsSignup(!isSignup)} block>
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Register"}
                </Button>
            </Card>
        </div>
    );
};

export default Authenticate;

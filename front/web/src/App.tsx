import { lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ApiRouter } from "./utils/Api";

const Home = lazy(() => import("./pages/Home"));
const Authenticate = lazy(() => import("./pages/Authenticate"));
const Logout = lazy(() => import("./pages/Logout"));
const Chats = lazy(() => import("./pages/Chats"));
const Chat = lazy(() => import("./pages/Chat"));

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        ApiRouter.get("session/")
            .then((response) => {
                if (response) {
                    setIsAuthenticated(response.isAuthenticated);                    
                }
            })
            .catch((error) => {
                console.error("Session Error:", error);
            });
    }, []);

	useEffect(() => {
		ApiRouter.get("me/").then((res) => {
			if (res && res.success) {
				setUsername(res.username);
			}
		});
	}, [isAuthenticated]);

    
    const menuItems = isAuthenticated
        ? 	[
            	{
					key: "username",
					label: `Logged in as: ${username}`,
					disabled: true,
				},
				{
					key: "logout",
					label: "Logout",
					onClick: () => navigate("/logout"),
				},
				{
					key: "settings",
					label: "Settings",
					onClick: () => navigate("/settings"),
				},
		]: 	[
				{
					key: "login",
					label: "Login / Signup",
					onClick: () => navigate("/authenticate"),
				},
		];

    return (
        <Layout>
            <Header
                style={{
                    background: "#000000",
                    color: "#FCEE0C",
                    fontSize: "36px",
                    fontFamily: "Roboto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <span>BLABBERY</span>
                <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                    <Button
                        type="default"
                        style={{
                            position: "absolute",
                            right: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        {isAuthenticated ? username : "Login/Signup"} <DownOutlined />
                    </Button>
                </Dropdown>
            </Header>
            <Content style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/authenticate" element={<Authenticate isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />} />
					<Route path="/logout" element={<Logout isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />} />
					<Route path="/chats" element={<Chats />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                Blabbery ©{new Date().getFullYear()} Created by User
            </Footer>
        </Layout>
    );
};

export default App;

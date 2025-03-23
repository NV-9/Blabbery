import { lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout, Flex } from "antd";
import { ApiRouter } from "./utils/Api";
import { generateMenuItems } from "./utils/Helpers";
import Header from "./components/Header";
import "./assets/App.css";

const Home = lazy(() => import("./pages/Home"));
const Authenticate = lazy(() => import("./pages/Authenticate"));
const Logout = lazy(() => import("./pages/Logout"));
const Chat = lazy(() => import("./pages/Chat"));
const PageNotFound = lazy(() => import("./pages/404"));
const DropDownMenu = lazy(() => import("./components/Menu"));

const { Content, Footer } = Layout;
const authorName = import.meta.env.VITE_AUTHOR || "a cool dude";

const App: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        ApiRouter.get("user/session/").then((response) => {
            if (response) setIsAuthenticated(response.isAuthenticated);
        }).catch((error) => console.error("Session Error:", error));
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        ApiRouter.get("user/me/").then((res) => {
            if (res?.username) setUsername(res.username);
        });
    }, [isAuthenticated]);

    const menuItems = generateMenuItems(isAuthenticated, username, navigate);

    return (
        <Flex vertical style={{ height: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "linear-gradient(to right, #141e30, #243b55)", color: "#00ffff" }}>
            <Header style={{ background: "transparent", fontSize: "36px", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", padding: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }}>
                BLABBERY
                <div style={{ position: "absolute", right: "20px" }}>
                    <DropDownMenu items={menuItems} authenticated={username} />
                </div>
            </Header>

            <Content style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Routes>
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                    <Route path="/authenticate/" element={<Authenticate isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />} />
                    <Route path="/logout/" element={<Logout isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />} />
                    <Route path="/chat/" element={<Chat />} />
                    <Route path="/chat/:type/:chat_uuid/" element={<Chat />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Content>

            <Footer style={{ textAlign: "center", padding: "10px 0", background: "transparent", color: "#00ffff" }}>
                Blabbery ©{new Date().getFullYear()} Created by {authorName}
            </Footer>
        </Flex>
    );
};

export default App;

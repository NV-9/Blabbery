import { lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { ApiRouter } from "./utils/Api";
import { generateMenuItems } from "./utils/Menu";

const Home = lazy(() => import("./pages/Home"));
const Authenticate = lazy(() => import("./pages/Authenticate"));
const Logout = lazy(() => import("./pages/Logout"));
const Chat = lazy(() => import("./pages/Chat"));
const PageNotFound = lazy(() => import("./pages/404"));
const DropDownMenu = lazy(() => import("./utils/Menu"));

const { Header, Content, Footer } = Layout;
const authorName = import.meta.env.VITE_AUTHOR || "a cool dude";

const App: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        ApiRouter.get("user/session/").then((response) => {
            if (response) 
                setIsAuthenticated(response.isAuthenticated);
        })
        .catch((error) => {
            console.error("Session Error:", error);
        });        
    }, []);

	useEffect(() => {
        if (!isAuthenticated) return;
		ApiRouter.get("user/me/").then((res) => {
			if (res && res.username) 
				setUsername(res.username);
		});
	}, [isAuthenticated]);

    const menuItems = generateMenuItems(isAuthenticated, username, navigate);

    return (
        <Layout style={{ display: "flex", flexDirection: "column", height: "98vh" }}>
            <Header style={{ background: "#000000", color: "teal", fontSize: "36px", fontFamily: "Helvetica", display: "flex", justifyContent: "center", position: "relative" }}>
                BLABBERY
                <DropDownMenu items={menuItems} authenticated={username} />
            </Header>
            
            <Content style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Routes>
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                    <Route path="/authenticate/" element={<Authenticate isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />} />
                    <Route path="/logout/" element={<Logout isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />} />
                    <Route path="/chat/" element={<Chat />} />
                    <Route path="/chat/:type/:chat_uuid/" element={<Chat />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Content>

            <Footer style={{ textAlign: "center" }}>
                Blabbery ©{new Date().getFullYear()} Created by {authorName}
            </Footer>
        </Layout>
    );
};

export default App;

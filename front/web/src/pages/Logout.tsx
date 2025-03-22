import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { ApiRouter } from "../utils/Api";
import { BaseProps } from "../utils/Interfaces";


const Logout: React.FC<BaseProps> = ({isAuthenticated, setAuthenticated}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate("/");
        ApiRouter.post("user/logout/", {})
            .then((response) => {
                if (response && response.success) {
                    setAuthenticated(false);
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Session Error:", error);
            });
    }, []);

  
    return (
        <Layout>
           Logging out...
        </Layout>
    );
};

export default Logout;

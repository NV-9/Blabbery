import React from "react";
import { Button, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { MenuItem } from "./Interfaces";


export const generateMenuItems = (isAuthenticated: boolean, username: string, navigate: (path: string) => void): MenuItem[] => {
    if (isAuthenticated) {
        return [
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
        ];
    } else {
        return [
            {
                key: "login",
                label: "Login / Signup",
                onClick: () => navigate("/authenticate"),
            },
        ];
    }
};

const DropDownMenu: React.FC<{ items: MenuItem[]; authenticated: boolean | string }> = ({ items, authenticated }) => (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Button type="default" style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)" }}>
            {authenticated ? authenticated : "Login/Signup"} <DownOutlined />
        </Button>
    </Dropdown>
);

export default DropDownMenu;

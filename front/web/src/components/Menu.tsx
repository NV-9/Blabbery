import React from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { MenuItem } from "../utils/Interfaces";
import StyledButton from "./Button";

const DropDownMenu: React.FC<{ items: MenuItem[]; authenticated: boolean | string }> = ({
    items,
    authenticated,
}) => (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <StyledButton>
            {authenticated ? authenticated : "Login/Signup"} <DownOutlined />
        </StyledButton>
    </Dropdown>
);

export default DropDownMenu;

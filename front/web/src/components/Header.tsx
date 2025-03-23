import styled from "styled-components";
import { Layout } from "antd";

const StyledHeader = styled(Layout.Header)`
    background: linear-gradient(90deg, #1c1c1c, #333);
    color: #4fffb0;
    font-size: 36px;
    font-family: "Orbitron", sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    text-shadow: 0 0 10px rgba(79, 255, 176, 0.8);
`;

export default StyledHeader;
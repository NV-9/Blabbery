import styled from "styled-components";
import { Button } from "antd";

const StyledButton = styled(Button)`
    background-color: #4fffb0 !important;
    border: none;
    color: #000;
    font-weight: bold;
    &:hover {
        background-color: #39d3a6 !important;
        color: #000 !important;
    }
`;

export default StyledButton;
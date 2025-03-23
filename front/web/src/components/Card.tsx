import styled from "styled-components";
import { Card } from "antd";

const StyledCard = styled(Card)`
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
`;

export default StyledCard;
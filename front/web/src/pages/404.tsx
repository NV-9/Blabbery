import React from "react";
import { Card, Typography, Button } from "antd";

const { Paragraph } = Typography;

const PageNotFound: React.FC = () => {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
			<Card title="Page Not Found" style={{ width: 500, textAlign: "center" }}>
				<Paragraph>
					The page you are looking for does not exist. Please check the URL or click the button below to return to the home page.
				</Paragraph>
				<Button type="primary" size="large" href="/">
					Return Home
				</Button>
			</Card>
		</div>
	);
};

export default PageNotFound;

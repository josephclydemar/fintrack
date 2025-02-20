import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
    return (
        <Content className="bg-white p-8">
            <Title level={4}>Home</Title>
            <Paragraph>Take control of your financial future with our cutting-edge finance tracking system. Designed to simplify money management, our web app offers intuitive tools to track income, expenses, budgets, and investments all in one place. With real-time analytics and customizable insights, you can easily identify spending trends, set achievable financial goals, and optimize your savings strategy. Whether you&apos;re planning for a big purchase, managing debt, or simply looking to stay on top of your finances, our app is your ultimate companion for smarter money decisions.</Paragraph>
        </Content>
    );
}

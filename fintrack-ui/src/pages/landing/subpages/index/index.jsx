import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Index() {
    return (
        <Content className="bg-white p-8">
            <Title level={4}>Index</Title>
            <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod beatae voluptatum ab, in, iure obcaecati nihil adipisci magnam rerum nobis tempore quidem nostrum pariatur? Doloremque mollitia ad illum delectus facere?</Paragraph>
            <Paragraph>Dignissimos assumenda sequi voluptate placeat, sed voluptates suscipit consectetur. Beatae aspernatur velit deserunt. Velit necessitatibus labore quo delectus debitis totam laboriosam iste impedit, aliquam sunt repellat odio quia voluptatibus reprehenderit.</Paragraph>
        </Content>
    );
}

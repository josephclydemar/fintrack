import { Layout, Typography } from "antd";
const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function About() {
    return (
        <Content className="bg-white p-8">
            <Title level={4}>About</Title>
            <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi amet quibusdam in at a ullam tempore, odio dolor officiis rem quam? Earum, voluptate sapiente harum repudiandae incidunt ab excepturi. Neque. Perspiciatis suscipit ex quia doloribus a laudantium at nostrum odit, laboriosam accusamus est praesentium optio, quo illo magni esse, sapiente quod dicta ducimus asperiores! Perferendis iste saepe fugit provident repudiandae!</Paragraph>
            <Paragraph>Sunt, facilis? Cum quidem, culpa, enim atque sint repellat doloribus eligendi quo voluptatem assumenda ut explicabo pariatur quas perspiciatis, consequatur vel dicta dolorum itaque tempore consectetur consequuntur veniam! Debitis, ea? Aliquam architecto incidunt, voluptates veritatis itaque est at dolorem esse ipsam tempore sed sunt maiores suscipit iure unde sit quae doloribus odio! Labore ut magnam consectetur placeat rem nobis obcaecati? Aut est sunt nemo debitis ipsa officiis enim tempora cupiditate eaque hic aliquam tempore sequi sed laudantium adipisci, veniam veritatis quia soluta placeat? Consequatur, incidunt? Explicabo nulla qui quas dicta!</Paragraph>
        </Content>
    );
}

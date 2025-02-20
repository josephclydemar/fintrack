import {
    Typography,
    Tabs,
} from "antd";
import Helper from "@/utils/helper";

const { Title } = Typography;

export default function Dashboard() {
    const user = Helper.getSavedUserData();
    console.log({ user });

    return (
        <>
        <Title level={4}>Dashboard</Title>
        <Tabs items={[
            {
                key: "tab01",
                label: "Tab 01",
                children: <Title level={4}>Tab 01</Title>,
            },
            {
                key: "tab02",
                label: "Tab 02",
                children: <Title level={4}>Tab 02</Title>,
            },
            {
                key: "tab03",
                label: "Tab 03",
                children: <Title level={4}>Tab 03</Title>,
            },
        ]}/>
        </>
    );
}

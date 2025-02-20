import {
    Typography,
    Tabs,
} from "antd";
import { BellOutlined, SafetyOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import Notification from "@/pages/main_menu/subpages/settings/tabs/notifications";
import Security from "@/pages/main_menu/subpages/settings/tabs/security";
import Currency from "@/pages/main_menu/subpages/settings/tabs/currency";
import { TabKeys } from "@/pages/main_menu/subpages/settings/settings_keys";

const { Title } = Typography;

export default function Settings() {
    return (
        <>
        <Title level={4}>Settings</Title>
        <Tabs items={[
            {
                key: TabKeys.notification,
                label: "Notification",
                icon: <BellOutlined/>,
                children: <Notification/>,
            },
            {
                key: TabKeys.security,
                label: "Security",
                icon: <SafetyOutlined/>,
                children: <Security/>,
            },
            {
                key: TabKeys.currency,
                label: "Currency",
                icon: <MoneyCollectOutlined/>,
                children: <Currency/>,
            },
        ]}/>
        </>
    );
}

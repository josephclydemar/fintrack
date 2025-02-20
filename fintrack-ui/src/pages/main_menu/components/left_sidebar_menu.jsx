/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Menu } from "antd";
import { DesktopOutlined, CodepenOutlined, TransactionOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";
import { PageKeys } from "@/utils/keys";

export default function LeftSidebarMenu({ collapseMenu }) {
    const menuRef = useRef();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const navigate = useNavigate();

    function handleSelect({ key }) {
        setSelectedKeys([key]);
        navigate(`/main/${key}`);
    }
    
    function handleOutsideClick(event) {
        if(menuRef.current && !menuRef.current.contains(event.target)) {
            setSelectedKeys([]);
        }
    }

    useEffect(function () {
        document.addEventListener("click", handleOutsideClick);
        return function () {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <span ref={menuRef}>
            <Menu
                selectedKeys={selectedKeys}
                mode="inline"
                onSelect={handleSelect}
                inlineCollapsed={collapseMenu}
                items={[
                    {
                        key: PageKeys.dashboard,
                        label: "Dashboard",
                        icon: <DesktopOutlined/>,
                    },
                    {
                        key: PageKeys.financial_targets,
                        label: "Financial Targets",
                        icon: <CodepenOutlined/>,
                    },
                    {
                        key: PageKeys.transactions,
                        label: "Transactions",
                        icon: <TransactionOutlined/>,
                    },
                    {
                        key: PageKeys.reports,
                        label: "Reports",
                        icon: <BarChartOutlined/>,
                    },
                    {
                        key: PageKeys.settings,
                        label: "Settings",
                        icon: <SettingOutlined/>,
                    },
                ]}/>
        </span>
    );
}

/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Menu, Typography, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useMessageContext, useModalContext } from "@/hooks/contexts";
import Auth from "@/utils/auth";
import { PageKeys } from "@/utils/keys";

export default function RightSidebarMenu({ collapseMenu }) {
    const { messageApi } = useMessageContext();
    const { modalApi } = useModalContext();

    const menuRef = useRef();
    const [selectedKeys, setSelectedKeys] = useState([]);

    const navigate = useNavigate();
        
    useEffect(function () {
        document.addEventListener("click", handleOutsideClick);
        return function () {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);
    
    function handleOutsideClick(event) {
        if(menuRef.current && !menuRef.current.contains(event.target)) {
            setSelectedKeys([]);
        }
    }
    function onSelectCallback({ key }) {
        setSelectedKeys([key]);
        if(key === PageKeys.logout) {
            modalApi.confirm({
                title: "Confirm Logout",
                content: (
                    <Space className="mb-4" direction="vertical">
                    <Typography.Text>Are you sure you want to log out?</Typography.Text>
                    <Typography.Text>Make sure you’ve saved your work before proceeding.</Typography.Text>
                    </Space>
                ),
                okText: "Logout",
                onOk: function () {
                    messageApi.open({
                        key: "register_login_logout",
                        type: "loading",
                        content: "Logging out",
                        duration: 10,
                    });
                    Auth.logout(
                        function () {
                            navigate("/login");
                        },
                        function () {},
                    );
                },
                okButtonProps: {
                    danger: true,
                },
                centered: true,
            });
            return;
        }
        navigate(`/main/${key}`);
    }

    return (
        <span ref={menuRef}>
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                onSelect={onSelectCallback}
                inlineCollapsed={collapseMenu}
                items={[
                    {
                        key: PageKeys.account_settings,
                        label: "Account Settings",
                        icon: <UserOutlined/>,
                    },
                    {
                        key: PageKeys.logout,
                        label: "Logout",
                        icon: <LogoutOutlined/>,
                    },
                ]}/>
        </span>
    );
}

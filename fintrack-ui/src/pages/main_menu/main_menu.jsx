import { useState, useMemo, useEffect } from "react";
import { Outlet } from "react-router";
import { Typography, Layout, Space, Switch, Image, Flex, Row, Col, Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import ManageCategoriesModal from "@/pages/main_menu/components/manage_categories_modal";
import { useMessageContext } from "@/hooks/contexts";
import Queries from "@/hooks/queries";
import Helper from "@/utils/helper";
import { PopupMessageKeys } from "@/utils/keys";

import FTLogo from "@/assets/connecthub-logo.svg";

import LeftSidebarMenu from "@/pages/main_menu/components/left_sidebar_menu";
import RightSidebarMenu from "@/pages/main_menu/components/right_sidebar_menu";

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

export default function MainMenu() {
    const { messageApi } = useMessageContext();
    const financialProfile = Queries.useRetrieveFinancialProfile();

    const [openManageCategoriesModal, setOpenManageCategoriesModal] = useState(false);

    const [isLeftSiderCollapsed, setIsLeftSiderCollapsed] = useState(false);
    const [isRightSiderCollapsed, setIsRightSiderCollapsed] = useState(false);
    const [showAppName, setShowAppName] = useState(true);

    useEffect(function () {
        const _user = Helper.getSavedUserData();
        if(_user?.status === 1) {
            messageApi.open({
                key: PopupMessageKeys.register_login_logout,
                type: "success",
                content: `You are registered as ${_user.firstName} ${_user.lastName}!`,
                duration: 5,
            });
        } else if(_user?.status === 2) {
            messageApi.open({
                key: PopupMessageKeys.register_login_logout,
                type: "success",
                content: `Logged in as ${_user.firstName} ${_user.lastName}!`,
                duration: 5,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(function () {
        setTimeout(function () {
            setShowAppName(!isLeftSiderCollapsed);
        }, 120);
    }, [isLeftSiderCollapsed]);

    const leftSiderTrigger = useMemo(function () {
        return (
            <Switch 
                defaultValue={true}
                onChange={(value) => setIsLeftSiderCollapsed(!value)} 
                checkedChildren={<CloseOutlined/>}
                unCheckedChildren={<MenuOutlined/>}/>
            );
    }, []);
    const rightSiderTrigger = useMemo(function () {
        return (
            <Switch 
                defaultValue={true}
                onChange={(value) => setIsRightSiderCollapsed(!value)} 
                checkedChildren={<CloseOutlined/>}
                unCheckedChildren={<MenuOutlined/>}/>
        );
    }, []);

    const user = Helper.getSavedUserData();

    function openManageCategoriesModalCallback() {
        setOpenManageCategoriesModal(true);
    }
    
    return (
        <Layout
            style={{ height: "100%" }}>
            <Layout
                hasSider={true}>
                <Sider 
                    theme="light"
                    className="bg-white"
                    trigger={leftSiderTrigger}
                    collapsible={true}
                    collapsed={isLeftSiderCollapsed}
                    width={170}
                    collapsedWidth={64}>
                    <Space className="mt-2 ml-3">
                        { !isLeftSiderCollapsed && showAppName ?
                            <>
                                <Image 
                                    src={FTLogo}
                                    preview={false}
                                    alt="fintrack" 
                                    width={40} 
                                    height={40}>
                                </Image>
                                <Title level={3}>FinTrack</Title>
                            </>
                        : 
                            <Image 
                                src={FTLogo}
                                preview={false}
                                alt="fintrack" 
                                width={40} 
                                height={40}>
                            </Image>
                        }
                    </Space>
                    <LeftSidebarMenu collapseMenu={isLeftSiderCollapsed}/>
                </Sider>
                <Flex vertical={true} className="bg-white w-full">
                <Row className="px-4 border-b-[1px] border-l-[1px] border-solid border-gray-200 bg-white">
                    <span>
                        <Text className="mx-1 font-semibold text-xs">{user?.firstName} {user?.lastName}</Text>
                        <Text>{user?.email}</Text>
                    </span>
                </Row>
                <Row justify="space-between">
                    <Col span={20}>
                        <Content className="bg-white">
                            <Layout>
                                <Header className="h-12 px-4 pt-0 bg-white">
                                    <Row>
                                        <Col span={6}>
                                            <Button 
                                                type="primary"
                                                onClick={openManageCategoriesModalCallback}>Manage Categories
                                            </Button>
                                            <ManageCategoriesModal 
                                                state={{
                                                    openModal: openManageCategoriesModal,
                                                    setOpenModal: setOpenManageCategoriesModal
                                                }}
                                            />
                                        </Col>
                                        {financialProfile.isSuccess ? 
                                            <>
                                            <Col span={6}>
                                                <Flex vertical={true} className="bg-white pt-1">
                                                    <Row>
                                                        <Text className="text-[10px]">TOTAL SAVINGS</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text className="text-[20px] font-semibold">{Helper.formatCurrency(financialProfile?.data["total_savings"])}</Text>
                                                    </Row>
                                                </Flex>
                                            </Col>
                                            <Col span={6}>
                                                <Flex vertical={true} className="bg-white pt-1">
                                                    <Row>
                                                        <Text className="text-[10px]">UNALLOCATED SAVINGS</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text className="text-[20px] font-semibold">{Helper.formatCurrency(financialProfile?.data["unallocated_savings"])}</Text>
                                                    </Row>
                                                </Flex>
                                            </Col>
                                            <Col span={6}>
                                                <Flex vertical={true} className="bg-white pt-1">
                                                    <Row>
                                                        <Text className="text-[10px]">ALLOCATED SAVINGS</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text className="text-[20px] font-semibold">{Helper.formatCurrency(financialProfile?.data["allocated_savings"])}</Text>
                                                    </Row>
                                                </Flex>
                                            </Col>
                                            </>
                                        : <></>}
                                    </Row>
                                </Header>
                                <Content className="h-[88vh] bg-white">
                                    <Outlet/>
                                </Content>
                            </Layout>
                        </Content>
                    </Col>
                    <Col>
                        <Sider
                            theme="light"
                            collapsible={true}
                            collapsed={isRightSiderCollapsed}
                            trigger={rightSiderTrigger}
                            width={170}
                            collapsedWidth={64}>
                            <RightSidebarMenu collapseMenu={isRightSiderCollapsed} />
                        </Sider>
                    </Col>
                </Row>
                </Flex>
            </Layout>
        </Layout>
    );
};


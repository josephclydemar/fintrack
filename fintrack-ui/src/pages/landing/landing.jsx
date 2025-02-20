import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router";
import { Layout, Image, Menu, Button, Row, Col } from "antd";
import { HomeOutlined, InfoOutlined } from "@ant-design/icons";
import { useMessageContext } from "@/hooks/contexts";

import { PageKeys, PopupMessageKeys } from "@/utils/keys";
import FTLogo from "@/assets/connecthub-logo.svg";
import Helper from "@/utils/helper";

const { Header, Content } = Layout;


export default function Landing() {
    const { messageApi } = useMessageContext();
    const navigate = useNavigate();

    useEffect(function () {
        const _user = Helper.getSavedUserData();
        if(_user !== null) {
            messageApi.open({
                key: PopupMessageKeys.register_login_logout,
                type: "success",
                content: "Logged out!",
                duration: 3,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function onSelectCallback(info) {
        navigate(`/${info["key"]}`);
    }
    function navigateToLogin() {
        navigate("/login");
    }
    function navigateToRegister() {
        navigate("/register");
    }
    return (
        <Layout
            style={{ height: "100%" }}>
            <Header className="bg-white pt-2 pl-3">
            <Row>
                <Col span={3}>
                    <Link to="/">
                        <Image 
                            src={FTLogo}
                            preview={false}
                            alt="fintrack" 
                            width={40} 
                            height={40}/>
                    </Link>
                </Col>
                <Col span={18}>
                    <Menu
                        mode="horizontal"
                        onSelect={onSelectCallback}
                        items={[
                            {
                                key: PageKeys.home,
                                label: "Home",
                                icon: <HomeOutlined/>,
                            },
                            {
                                key: PageKeys.about,
                                label: "About",
                                icon: <InfoOutlined/>,
                            },
                        ]}/>
                </Col>
                <Col>
                    <Button onClick={navigateToLogin}>Log-In</Button>
                    <Button onClick={navigateToRegister}>Register</Button>
                </Col>
            </Row>
        </Header>
        <Content className="bg-white flex justify-center">
            <Outlet/>
        </Content>
    </Layout>
    );
}


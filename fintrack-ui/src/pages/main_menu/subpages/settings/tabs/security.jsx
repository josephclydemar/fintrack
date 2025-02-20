import { Col, Flex, Row, Switch, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { use2faEnabled } from "@/stores/two_factor_authentication_enabled";

const { Text } = Typography;

export default function Security() {
    const { enabled, set2fa} = use2faEnabled(function (state) {
        return state;
    });


    return (
        <div className="mx-16">
            <Flex 
                className="mt-8"
                vertical={true}>
                <Row>
                    <Col span={8}>
                        <Text>2FA Authentication</Text>
                    </Col>
                    <Col span={16}>
                        <Switch
                            defaultValue={enabled}
                            onChange={function (value) {
                                set2fa(value);
                            }}
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}/>
                    </Col>
                </Row>
            </Flex>
        </div>
    );
}

import { useState } from "react";
import { Flex, Row, Steps, Typography } from "antd";
import { LoginOutlined, KeyOutlined } from "@ant-design/icons";
import EmailAndPasswordForm from "@/pages/landing/subpages/login/components/email_and_password_form";
import OtpForm from "@/pages/landing/subpages/login/components/otp_form";
import { use2faEnabled } from "@/stores/two_factor_authentication_enabled";

const { Title } = Typography;


export default function Login() {
    const [currentStep, setCurrentStep] = useState(0);
    const enabled = use2faEnabled(function (state) {
        return state.enabled;
    });

    return (
        <div className="mt-5">
            <Title level={4}>Login</Title>
            <div className="w-[35vw] h-[60vh] mt-10 pt-5 px-10">
                { enabled ? (
                    <Flex vertical={true}>
                    <Row className="w-full flex justify-center">
                        <Steps
                            current={currentStep}
                            items={[
                                {
                                    title: <Title level={5}>Credentials</Title>,
                                    icon: <LoginOutlined/>,
                                    description: "Enter your email and password.",
                                },
                                {
                                    title: <Title level={5}>OTP</Title>,
                                    icon: <KeyOutlined/>,
                                    description: "Enter the 6 digit OTP number that was sent to your email.",
                                },
                            ]}/>
                    </Row>

                    <Row className="w-full h-52 mt-10 flex justify-center">
                        { currentStep === 0 ? <EmailAndPasswordForm setCurrentStep={setCurrentStep}/> : <OtpForm/> }
                    </Row>
                </Flex>
                ) : (
                    <EmailAndPasswordForm/>
                ) }
            </div>
        </div>
    );
}

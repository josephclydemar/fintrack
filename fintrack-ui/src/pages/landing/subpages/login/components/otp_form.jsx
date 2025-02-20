import { useState, useRef,  useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input } from "antd";
import { useMessageContext } from "@/hooks/contexts";
import Api from "@/utils/api";
import Auth from "@/utils/auth";
import { PopupMessageKeys } from "@/utils/keys";

const Otp = Input.OTP;
const OTP_LENGTH = 6;


export default function OtpForm() {
    const { messageApi } = useMessageContext();
    const navigate = useNavigate();
    const formRef = useRef();
    const inputRef = useRef();
    const [refocusInput, setRefocusInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpCode, setOtpCode] = useState("");

    useEffect(function () {
        console.log({ otpCode });
    }, [otpCode]);

    useEffect(function () {
        inputRef.current?.focus();
    }, [inputRef, refocusInput]);

    useEffect(function () {
        messageApi.open({
            key: PopupMessageKeys.register_login_logout,
            type: "info",
            content:"Email and password authenticated", 
            duration: 10,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function clearFields() {
        formRef.current.resetFields();
        setRefocusInput(function (prev) {
            return !prev;
        });
    }

    async function onResendOtp() {
        const user = Auth.getUserData();
        messageApi.open({
            key: PopupMessageKeys.otp_resend,
            type: "loading",
            content:"Resending OTP",
            duration: 20,
        });
        await Api.requestAsync(
            "/api/auth/otp/resend",
            "POST",
            {
                email: user.email,
            },
        );
        messageApi.open({
            key: PopupMessageKeys.otp_resend,
            type: "success",
            content:`Sent OTP to ${user?.email}`, 
            duration: 10,
        });
    }

    function onSubmitCallback() {
        setIsSubmitting(true);
        messageApi.open({
            key: PopupMessageKeys.register_login_logout,
            type: "loading",
            content: "Authenticating OTP", 
            duration: 20,
        });
        console.log("onSubmit:", { otpCode });
        Auth.loginOtp(
            otpCode,
            function () {
                navigate("/main/dashboard");
            },
            function (message) {
                messageApi.open({
                    key: PopupMessageKeys.register_login_logout,
                    type: "error",
                    content: message, 
                    duration: 8,
                });
                setIsSubmitting(false);
                setAllowSubmit(false);
                clearFields();
            },
        );
    };

    return (
        <div>
            <Form 
                ref={formRef}
                onValuesChange={function (_, values) {
                    setAllowSubmit(true);
                    console.log(values, values.otp_code);
                    setOtpCode(values.otp_code);
                }}>
                <Form.Item 
                    name="otp_code">
                    <Otp
                        ref={inputRef}
                        disabled={isSubmitting}
                        size="large"
                        length={OTP_LENGTH}/>
                </Form.Item>
            </Form>
            <div className="flex justify-between">
                <Button 
                    disabled={isSubmitting}
                    onClick={clearFields}>
                    Clear
                </Button>
                <Button 
                    disabled={isSubmitting}
                    onClick={onResendOtp}>
                    Resend OTP
                </Button>
                <Button 
                    type="primary"
                    disabled={!allowSubmit || isSubmitting}
                    onClick={onSubmitCallback}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

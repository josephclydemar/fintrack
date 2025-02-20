/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useMessageContext } from "@/hooks/contexts";
import Auth from "@/utils/auth";
import { PopupMessageKeys } from "@/utils/keys";

export default function EmailAndPasswordForm({ setCurrentStep=null }) {
    const navigate = useNavigate();
    const { messageApi } = useMessageContext();
    const formRef = useRef();
    const inputRef = useRef();
    const [refocusInput, setRefocusInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(function () {
        inputRef.current?.focus();
    }, [inputRef, refocusInput]);
    
    function clearFields() {
        formRef.current.resetFields();
        setRefocusInput(function (prev) {
            return !prev;
        });
    }

    function onSubmitCallback() {
        setIsSubmitting(true);
        messageApi.open({
            key: PopupMessageKeys.register_login_logout,
            type: "loading",
            content: "Authenticating", 
            duration: 20,
        });
        Auth.login(
            email, 
            password, 
            function () {
                setCurrentStep(function (prev) {
                    return prev + 1;
                });
            },
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
    }

    async function onValuesChangeCallback(_, values) {
        try {
            await formRef.current.validateFields();
        } catch(error) {
            console.log(error.errorFields);
            setAllowSubmit(error.errorFields.length === 0);
        }
        setEmail(values["email"]);
        setPassword(values["password"]);
    }
    
    return (
        <div>
            <Form 
                ref={formRef}
                requiredMark={false}
                onValuesChange={onValuesChangeCallback}>
                <Form.Item 
                    colon={false}
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
                        { pattern: /\w+@\w+\.\w+/, message: "Please enter a valid email address." },
                        { pattern: /^\S*$/, message: "Must not contain spaces!" },
                    ]}
                    label="Email"
                    labelAlign="left"
                    labelCol={{ span: 6 }} 
                    wrapperCol={{ span: 20 }}>
                    <Input 
                        ref={inputRef}
                        prefix={<MailOutlined/>}
                        disabled={isSubmitting}
                        style={{ width: 240 }}/>
                </Form.Item>
                <Form.Item 
                    colon={false}
                    name="password"
                    rules={[
                        { required: true, message: "Password is required" },
                        { max: 64, message: "Must not exceed 64 characters." },
                        { pattern: /^\S*$/, message: "Must not contain spaces!" },
                    ]}
                    label="Password"
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 20 }}>
                    <Input.Password 
                        prefix={<LockOutlined/>}
                        disabled={isSubmitting}
                        style={{ width: 240 }}/>
                </Form.Item>
            </Form>
            <div className="mt-6 flex justify-between">
                <Button
                    disabled={isSubmitting} 
                    onClick={clearFields}>Clear Fields</Button>
                <Button 
                    type="primary"
                    disabled={!allowSubmit || isSubmitting} 
                    onClick={onSubmitCallback}>Log In</Button>
            </div>
        </div>
    );
}

import { useState, useRef,  useEffect } from "react";
import { useNavigate } from "react-router";
import { Typography, Form, Button, Input } from "antd";
import { UserOutlined, IdcardOutlined, MailOutlined, LockOutlined, CheckOutlined } from "@ant-design/icons";
import { useMessageContext } from "@/hooks/contexts";
import Auth from "@/utils/auth";

const { Title } = Typography;

/**
 *     //     let chars = [
    //         ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    //         ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    //         ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    //         ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "\\", "|", ";", ":", "'", "\"", ",", ".", "<", ">", "/", "?", "`", "~"]
    //     ];
 */

export default function Register() {
    const { messageApi } = useMessageContext();
    const navigate = useNavigate();
    const formRef = useRef();
    const inputRef = useRef();
    const [refocusInput, setRefocusInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    useEffect(function () {
        inputRef.current?.focus();
    }, [inputRef, refocusInput]);

    async function onValuesChangeCallback(_, values) {
        try {
            await formRef.current.validateFields();
        } catch(error) {
            console.log(error.errorFields);
            setAllowSubmit(error.errorFields.length === 0);
        }
        setFirstName(values["first_name"]);
        setLastName(values["last_name"]);
        setEmail(values["email"]);
        setPassword(values["password"]);
        setPasswordConfirmation(values["password_confirmation"]);
    }

    function onSubmitCallback() {
        setIsSubmitting(true);
        messageApi.open({
            key: "register_login_logout",
            type: "loading",
            content:"Registering new user", 
            duration: 20,
        });
        Auth.register(
            firstName,
            lastName,
            email,
            password,
            passwordConfirmation,
            function () {
                navigate("/main/dashboard");
            },
            function () {},
        );
    }

    function clearFields() {
        formRef.current.resetFields();
        setRefocusInput(function (prev) {
            return !prev;
        });
    }

    return (
        <>
        <Title level={4}>Register</Title>
        <div className="w-[450px] mx-64 mt-10">
            <Form
                ref={formRef}
                requiredMark={false}
                initialValues={{
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                }}
                onValuesChange={onValuesChangeCallback}>
                <Form.Item 
                    colon={false}
                    name="first_name"
                    hasFeedback={true}
                    rules={[
                        { required: true, message: "First Name is required!" },
                        { pattern: /^\S(.*\S)?$/, message: "First Name must not contain leading or trailing spaces!" },
                    ]}
                    label="First Name"
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 20 }}>
                    <Input 
                        ref={inputRef}
                        prefix={<UserOutlined/>}
                        disabled={isSubmitting}
                        style={{ width: 240 }}/>
                </Form.Item>
                <Form.Item 
                    colon={false}
                    name="last_name"
                    hasFeedback={true}
                    rules={[
                        { required: true, message: "Last Name is required!" },
                        { pattern: /^\S(.*\S)?$/, message: "Last Name must not contain leading or trailing spaces!" },
                    ]}
                    label="Last Name" 
                    labelAlign="left" 
                    labelCol={{ span: 6 }} 
                    wrapperCol={{ span: 20 }}>
                    <Input 
                        prefix={<IdcardOutlined/>}
                        disabled={isSubmitting}
                        style={{ width: 240 }}/>
                </Form.Item>
                <Form.Item 
                    colon={false}
                    name="email"
                    hasFeedback={true}
                    rules={[
                        { required: true, message: "Email is required!" },
                        { pattern: /\w+@\w+\.\w+/, message: "Please enter a valid email address." },
                        { pattern: /^\S*$/, message: "Must not contain spaces!" },
                    ]}
                    label="Email" 
                    labelAlign="left" 
                    labelCol={{ span: 6 }} 
                    wrapperCol={{ span: 20 }}>
                    <Input 
                        prefix={<MailOutlined/>}
                        disabled={isSubmitting}
                        style={{ width: 240 }}/>
                </Form.Item>
                <Form.Item 
                    colon={false}
                    name="password"
                    hasFeedback={true}
                    rules={[
                        { required: true, message: "Password is required!" },
                        { min: 8, message: "Must be at least 8 characters long!" },
                        { max: 64, message: "Must not exceed 64 characters!" },
                        { pattern: /[A-Z]/, message: "Must include at least one uppercase letter! (A B C ...)" },
                        { pattern: /[a-z]/, message: "Must include at least one lowercase letter! (a b c ...)" },
                        { pattern: /[!@#$%^&*(),.?":{}|<>]/, message: "Must include at least one special character! (@ $ & ...)" },
                        { pattern: /\d/, message: "Must include at least one number!" },
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
                <Form.Item 
                    colon={false}
                    name="password_confirmation" 
                    dependencies={["password"]}
                    hasFeedback={true}
                    rules={[
                        { required: true, message: "Confirm Password is required!" },
                        { pattern: /^\S*$/, message: "Must not contain spaces!" },
                        function ({ getFieldValue }) {
                            return {
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("The new password that you entered do not match!"));
                                },
                            };
                        },
                    ]}
                    label="Confirm Password" 
                    labelAlign="left" 
                    labelCol={{ span: 6 }} 
                    wrapperCol={{ span: 20 }}>
                    <Input.Password
                        prefix={<CheckOutlined/>}
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
                    onClick={onSubmitCallback}>Submit</Button>
            </div>
        </div>
        </>
    );
}

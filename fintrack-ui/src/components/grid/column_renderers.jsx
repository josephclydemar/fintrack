/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Input, Modal, Form, Typography, Flex, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useNotificationContext, useModalContext } from "@/hooks/contexts";
import Api from "@/utils/api";
import Queries from "@/hooks/queries";
import Helper from "@/utils/helper";

const OptionIcons = {
    add: <PlusOutlined/>,
    edit: <EditOutlined/>,
    detail: <EyeOutlined/>,
};



function AddNewTransaction({ dataKey, dataProp }) {
    const { notificationApi } = useNotificationContext();
    const { modalApi } = useModalContext();

    const [openModal, setOpenModal] = useState(true);
    const [formValues, setFormValues] = useState({});
    const [refocusInput, setRefocusInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const formRef = useRef();
    const inputRef = useRef();
    const invalidateResource = Queries.useInvalidateResource();


    useEffect(function () {
        inputRef.current?.focus();
    }, [inputRef, refocusInput]);

    function handleCancel() {
        if(Object.keys(formValues).length === 0) {
            setOpenModal(false);
            return;
        }
        modalApi.confirm({
            title: "Confirm Close",
            content: <Typography.Text>You have unsaved changes. If you close this form, your progress will be lost. Would you like to continue?</Typography.Text>,
            okText: "Confirm",
            onOk: function () {
                clearFields();
                setOpenModal(false);
            },
            centered: true,
        });
    }

    function clearFields() {
        formRef.current?.resetFields();
        setFormValues({});
        setRefocusInput(function (prev) {
            return !prev;
        });
    }
    async function onValuesChangeCallback(_, values) {
        try {
            await formRef.current.validateFields();
        } catch(error) {
            console.log(error.errorFields);
            setAllowSubmit(error.errorFields.length === 0);
        }
        setFormValues(values);
    }

    function onSubmitCallback() {
        setIsSubmitting(true);
        Api.createTransaction(
            dataProp[dataKey],
            formValues["name"],
            formValues["description"],
            formValues["amount"],
        ).then(function (data) {
            const userId = Helper.getSavedUserData("userId");
            invalidateResource(`api/v1/users/${userId}/financial_targets?with_transactions=true`);
            setIsSubmitting(false);
            setAllowSubmit(false);
            setOpenModal(false);
            clearFields();
            notificationApi.success({
                message: "Successfully created new Financial Target",
                description: data.name,
                placement: "bottomLeft",
            });
        }).catch(function ({ response }) {
            notificationApi.error({
                message: "Failed to create new Transaction",
                description: response.message,
                placement: "bottomLeft",
            });
            setIsSubmitting(false);
        });
    }

    return (
        <Modal 
            title={`Add New Transaction | [ID:${Helper.padNumber(dataProp[dataKey])}] ${dataProp["name"]}`}
            open={openModal}
            onCancel={handleCancel}
            footer={<></>}
            centered={true}>
            <div className="w-full py-4">
                <Form
                    layout="horizontal"
                    ref={formRef}
                    requiredMark={false}
                    initialValues={{
                        name: "",
                        description: "",
                        amount: 0.01,
                    }}
                    onValuesChange={onValuesChangeCallback}>
                    <Form.Item
                        colon={false}
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: "Name is required" },
                        ]}
                        labelAlign="left"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 10 }}>
                        <Input 
                            ref={inputRef}
                            className="w-[300px]" 
                            disabled={isSubmitting}/>
                    </Form.Item>
                    <Form.Item
                        colon={false}
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: "Description is required" },
                        ]}
                        labelAlign="left"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 10 }}>
                        <Input 
                            className="w-[300px]" 
                            disabled={isSubmitting}/>
                    </Form.Item>
                    <Form.Item
                        colon={false}
                        name="amount"
                        label="Amount"
                        rules={[
                            { required: true, message: "Amount is required" },
                        ]}
                        labelAlign="left"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 10 }}>
                        <Input 
                            className="w-[300px]" 
                            type="number" 
                            disabled={isSubmitting}
                            min={0} 
                            step={0.01}
                            prefix={"₱"}/>
                    </Form.Item>
                </Form>
                <div className="w-full my-4 flex justify-between">
                    <Button 
                        disabled={isSubmitting}
                        onClick={clearFields}>
                        Clear
                    </Button>
                    <Button 
                        type="primary"
                        disabled={!allowSubmit || isSubmitting} 
                        loading={isSubmitting}
                        onClick={onSubmitCallback}>
                        {isSubmitting ? "Submitting" : "Submit" }
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

function EditFinancialTarget({ dataKey, dataProp }) {
    const [openModal, setOpenModal] = useState(true);
    function handleOk() {
        setOpenModal(false);
    }
    function handleCancel() {
        setOpenModal(false);
    }

    return (
        <Modal 
            title={`Edit Financial Target | [ID:${Helper.padNumber(dataProp[dataKey])}] ${dataProp["name"]}`}
            open={openModal}
            onOk={handleOk}
            onCancel={handleCancel}
            centered={true}>
        </Modal>
    );
}

function ViewFullDetails({ dataKey, dataProp }) {
    const [openModal, setOpenModal] = useState(true);
    function handleOk() {
        setOpenModal(false);
    }
    function handleCancel() {
        setOpenModal(false);
    }

    return (
        <Modal 
            title={`Full Details | [ID:${Helper.padNumber(dataProp[dataKey])}] ${dataProp["name"]}`}
            open={openModal}
            onOk={handleOk}
            onCancel={handleCancel}
            centered={true}>
                <Flex vertical={true} gap={8} className="w-full py-4">
                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>ID</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{Helper.padNumber(dataProp[dataKey])}</Typography.Text>
                        </Col>
                    </Row>
                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>Name</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{dataProp["name"]}</Typography.Text>
                        </Col>
                    </Row>
                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>Category</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{dataProp["category"]}</Typography.Text>
                        </Col>
                    </Row>
                    
                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>Balance</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{Helper.formatCurrency(dataProp["balance"])}</Typography.Text>
                        </Col>
                    </Row>
                    
                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>Base Balance</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{Helper.formatCurrency(dataProp["base_balance"])}</Typography.Text>
                        </Col>
                    </Row>

                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>Transactions Count</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{dataProp["transactions"].length}</Typography.Text>
                        </Col>
                    </Row>

                    <Row className="w-full h-32">
                        <Col span={6}>
                            <Typography.Text>Description</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Paragraph className="h-24 px-2 border-solid border-black border-[1px] overflow-y-scroll text-justify">{dataProp["description"]}</Typography.Paragraph>
                        </Col>
                    </Row>

                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>Start Date</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{dataProp["start_date"]}</Typography.Text>
                        </Col>
                    </Row>
                    <Row className="w-full">
                        <Col span={6}>
                            <Typography.Text>End Date</Typography.Text>
                        </Col>
                        <Col span={18}>
                            <Typography.Text>{dataProp["end_date"]}</Typography.Text>
                        </Col>
                    </Row>
                </Flex>
        </Modal>
    );
}







export function IdRenderer({ value }) {
    return (
        <pre>{value}</pre>
    );
}




export function OptionsDropdownRenderer({ data, details }) {
    const dataKey = details["data_key"];
    const items = details["items"];

    const menuItems = items.map(function (item) {
        return {
            key: item.key,
            label: <>{item.label}</>,
            icon: OptionIcons[item.key],
        };
    });


    const [key, setKey] = useState("");
    function handleClick(event) {
        setKey(event.key);
    }
    function renderContent(key) {
        switch(key) {
            case "add":
                return <AddNewTransaction dataKey={dataKey} dataProp={data}/>;
            case "edit":
                return <EditFinancialTarget dataKey={dataKey} dataProp={data}/>;
            case "detail":
                return <ViewFullDetails dataKey={dataKey} dataProp={data}/>;
            default:
                return <></>;
        }
    }
    
    return (
        <>
        <Dropdown
            className="mx-2 mt-0"
            placement="bottomLeft"
            menu={{
                onClick: handleClick,
                items: menuItems,
            }}>
            <Button icon={<EllipsisOutlined/>}/>
        </Dropdown>
        {renderContent(key)}
        </>
    );
}







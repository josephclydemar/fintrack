/* eslint-disable react/prop-types */
import { useState, useRef, memo, useEffect } from "react";
import { Flex, Form, Input, Modal, Select, Row, Button, Typography } from "antd";
import FTGrid from "@/components/grid/fintrack_grid";
import Api from "@/utils/api";
import Queries from "@/hooks/queries";
import { useNotificationContext, useModalContext } from "@/hooks/contexts";
import { QueryKeys, GridKeys } from "@/utils/keys";

export default memo(function ManageCategoriesModal({ state }) {
    const { notificationApi } = useNotificationContext();
    const { modalApi } = useModalContext();

    const ftGridRef = useRef();
    const invalidateResource = Queries.useInvalidateResource();
    const blueprint = Queries.useRetrieveGridBlueprint(QueryKeys.categories);
    
    const [refocusInput, setRefocusInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {openModal, setOpenModal} = state;
    const [formValues, setFormValues] = useState({});
    const formRef = useRef();
    const inputRef = useRef();

    useEffect(function () {
        inputRef.current?.focus();
    }, [inputRef, refocusInput]);

    function clearFields() {
        formRef.current?.resetFields();
        setFormValues({});
        setRefocusInput(function (prev) {
            return !prev;
        });
    }
    function onSubmitCallback() {
        console.log({formValues});
        setIsSubmitting(true);
        Api.createCategory(
            formValues["name"],
            formValues["type"],
        ).then(function () {
            invalidateResource(blueprint?.data[GridKeys.params][GridKeys.query][GridKeys.url_endpoint]);
            setIsSubmitting(false);
            setAllowSubmit(false);
            clearFields();
        }).catch(function ({ response }) {
            notificationApi.error({
                // key: "create_new_category",
                message: "Failed to create new Category",
                description: response.message,
                placement: "bottomLeft",
            });
            setIsSubmitting(false);
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

    return (
        <Modal 
            open={openModal}
            title="Manage Categories"
            onCancel={handleCancel}
            footer={<></>}
            centered={true}>
                <>
                <Flex vertical={true} className="mt-4">
                    <Row className="w-full">
                        <Flex vertical={true} className="w-full">
                            <Row className="w-full">
                                <Form 
                                    className="w-full"
                                    layout="horizontal" 
                                    ref={formRef}
                                    requiredMark={false}
                                    initialValues={{
                                        name: "",
                                        type: null,
                                    }}
                                    onValuesChange={onValuesChangeCallback}>
                                    <Form.Item
                                        colon={false}
                                        name="name"
                                        label={"Name"}
                                        rules={[
                                            { required: true, message: "Name is required" },
                                        ]}
                                        labelAlign="left"
                                        labelCol={{ offset: 2, span: 10 }}
                                        wrapperCol={{ span: 10 }}>
                                        <Input
                                            ref={inputRef}
                                            disabled={isSubmitting}
                                            style={{ width: 200 }}/>
                                    </Form.Item>
                                    <Form.Item
                                        colon={false}
                                        name="type"
                                        label="Type"
                                        rules={[
                                            { required: true, message: "Type is required" },
                                        ]}
                                        labelAlign="left"
                                        labelCol={{ offset: 2, span: 10 }}
                                        wrapperCol={{ span: 10 }}>
                                        <Select
                                            disabled={isSubmitting}
                                            placeholder="Select the type (e.g. EXPENSE)"
                                            style={{ width: 200 }}
                                            options={[
                                                {
                                                    value: "EXPENSE",
                                                    label: "EXPENSE",
                                                },
                                                {
                                                    value: "INCOME",
                                                    label: "INCOME",
                                                },
                                                {
                                                    value: "TRANSFER",
                                                    label: "TRANSFER",
                                                },
                                            ]}/>
                                    </Form.Item>
                                </Form>
                            </Row>
                            <Row className="px-12 flex justify-between">
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
                            </Row>
                        </Flex>
                    </Row>
                    <Row className="w-full mt-8">
                        <Flex vertical={true} className="w-full">
                            {blueprint.isSuccess ? 
                            <FTGrid 
                                gridId="categories_grid"
                                gridRef={ftGridRef}
                                gridOptions={{}}
                                gridComponentBlueprint={blueprint.data}
                                gridStyles={{ height: "180px" }}
                                eventHandlers={{}}
                                /> : <></>}
                        </Flex>
                    </Row>
                </Flex>
                </>
        </Modal>
    );
});

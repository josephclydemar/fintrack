/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Form, Button, Select, Input, DatePicker } from "antd";
import Helper from "@/utils/helper";
import Api from "@/utils/api";
import Queries from "@/hooks/queries";
import { useNotificationContext } from "@/hooks/contexts";
import { QueryKeys, GridKeys } from "@/utils/keys";

export default function AddRowModalContent({ gridBlueprint, setModalIsOpen }) {
    const userId = Helper.getSavedUserData("userId");
    const { notificationApi } = useNotificationContext();
    const [formValues, setFormValues] = useState({});
    const [categoryOptions, setCategoryOptions] = useState([]);
    const formRef = useRef();
    const inputRef = useRef();

    const invalidateResource = Queries.useInvalidateResource();
    const resource = Queries.useRetrieveResource(`/api/v1/users/${userId}/${QueryKeys.categories}`, "GET");

    const [refocusInput, setRefocusInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCategoryIncome, setIsCategoryIncome] = useState(false);

    useEffect(function () {
        inputRef.current?.focus();
    }, [inputRef, refocusInput]);

    useEffect(function () {
        if(resource.isSuccess) {
            if(formValues?.category !== undefined && formValues?.category !== null) {
                const data = Helper.arrayToHashmap(resource.data, "category_id", true);
                setIsCategoryIncome(data[formValues["category"]]?.type === "INCOME");
            }

            setCategoryOptions(resource.data.map(function (item) {
                return {
                    value: item.category_id,
                    label: `${item.name} (${item.type})`,
                };
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource.isSuccess, resource.isFetching, formValues]);

    function clearFields() {
        formRef.current?.resetFields();
        setRefocusInput(function (prev) {
            return !prev;
        });
    }

    function onSubmitCallback() {
        setIsSubmitting(true);
        const startDateRaw = formValues["range_date"][0];
        const endDateRaw = formValues["range_date"][1];
        const startDate = startDateRaw.format("YYYY-MM-DD HH:mm:ss");
        const endDate = endDateRaw.format("YYYY-MM-DD HH:mm:ss");
        Api.createFinancialTarget(
            formValues["category"],
            formValues["name"],
            formValues["description"],
            isCategoryIncome ? 0 : formValues["balance"],
            startDate,
            endDate,
        ).then(function (data) {
            invalidateResource(gridBlueprint?.data[GridKeys.params][GridKeys.query][GridKeys.url_endpoint]);
            setIsSubmitting(false);
            setAllowSubmit(false);
            setModalIsOpen(false);
            clearFields();
            notificationApi.success({
                // key: "create_new_financial_target",
                message: "Successfully created new Financial Target",
                description: data.name,
                placement: "bottomLeft",
                // showProgress: true,
            });
        }).catch(function ({ response }) {
            notificationApi.error({
                // key: "create_new_financial_target",
                message: "Failed to create new Financial Target",
                description: response.message,
                placement: "bottomLeft",
                // showProgress: true,
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

    return (
        <>
        <Form 
            layout="horizontal" 
            ref={formRef}
            requiredMark={false}
            initialValues={{
                category: null,
                description: "",
                balance: 0.01,
                range_date: null,
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
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}>
                <Input
                    style={{ width: 300 }}
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
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}>
                <Input
                    style={{ width: 300 }}
                    disabled={isSubmitting}/>
            </Form.Item>
            <Form.Item 
                colon={false}
                name="category"
                label="Category"
                rules={[
                    { required: true, message: "Category is required" },
                ]}
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}>
                <Select 
                    style={{ width: 300 }}
                    disabled={isSubmitting}
                    options={categoryOptions}/>
            </Form.Item>
            <Form.Item 
                colon={false}
                name="balance"
                label="Balance"
                rules={[
                    { required: true, message: "Balance is required" },
                ]}
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}>
                <Input
                    style={{ width: 300 }}
                    disabled={isCategoryIncome || isSubmitting}
                    type="number"
                    min={0}
                    step={0.01}
                    prefix={"₱"}/>
            </Form.Item>
            <Form.Item 
                colon={false}
                name="range_date"
                label="Range Date"
                rules={[
                    { required: true, message: "Range is required" },
                ]}
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}>
                <DatePicker.RangePicker
                    style={{ width: 300 }}
                    disabled={isSubmitting}
                    // showTime={true}
                    disabledDate={function (current) {
                        const today = new Date();
                        // Set the time to midnight for comparison
                        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        return current && current.toDate() < todayStart;
                    }}/>
            </Form.Item>
        </Form>
        <div className="w-full mb-12 flex justify-between">
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
        </>
    );
}

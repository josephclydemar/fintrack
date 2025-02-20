/* eslint-disable react/prop-types */
import { useState } from "react";
import { Input, Button, Modal, Typography } from "antd";
import { SyncOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useModalContext } from "@/hooks/contexts";

export function Search({ callback, searchByText }) {
    return (
        <Input.Search 
            className="w-52 mr-2"
            allowClear={true}
            onChange={callback}
            placeholder={`Search by ${searchByText}`}/>
    );
}

export function ReloadData({ callback }) {
    return (
        <Button 
            type="primary" 
            className="w-20 mr-2"
            icon={<SyncOutlined/>}
            iconPosition="start"
            onClick={callback}>Reload
        </Button>
    );
}

export function ResetData({ callback }) {
    return (
        <Button 
            type="primary"
            className="w-20 mr-2"
            icon={<ReloadOutlined/>}
            iconPosition="start"
            onClick={callback}>Reset
        </Button>
    );
}

export function AddRowData({ utilityCallback, modalParams }) {
    const ContentComponent = modalParams.contentComponent;
    const contentComponentProps = modalParams.contentComponentProps;

    const { modalApi } = useModalContext();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function handleCancel() {
        modalApi.confirm({
            title: "Confirm Close",
            content: <Typography.Text>You have unsaved changes. If you close this form, your progress will be lost. Would you like to continue?</Typography.Text>,
            okText: "Confirm",
            onOk: function () {
                setModalIsOpen(false);
            },
            centered: true,
        });
    }

    return (
        <>
        <Button 
            type="primary"
            className="w-20 mr-2"
            icon={<PlusOutlined/>}
            iconPosition="start"
            onClick={function (event) {
                setModalIsOpen(!modalIsOpen);
                utilityCallback(event);
            }}>Add
        </Button>
        {modalParams !== undefined && Object.keys(modalParams).length > 0 ?
            <Modal 
                destroyOnClose={true}
                title={modalParams?.title}
                okText={modalParams?.okText}
                onCancel={handleCancel}
                cancelText={modalParams?.cancelText}
                open={modalIsOpen}
                footer={<></>}
                centered={true}>
                    <div className="pt-4">
                        <ContentComponent {...contentComponentProps} setModalIsOpen={setModalIsOpen} />
                    </div>
            </Modal>
        : <></>}
        </>
    );
}

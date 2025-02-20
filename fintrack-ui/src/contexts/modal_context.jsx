/* eslint-disable react-refresh/only-export-components */
import { useMemo, createContext } from "react";
import { Modal } from "antd";

export const ModalContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function ModalContextProvider({ children }) {
    const [modalApi, contextHolder] = Modal.useModal();
    const contextValue = useMemo(function () {
        return { modalApi };
    }, [modalApi]);
    return (
        <ModalContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </ModalContext.Provider>
    );
}
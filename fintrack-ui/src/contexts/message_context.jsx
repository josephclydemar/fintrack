/* eslint-disable react-refresh/only-export-components */
import { useMemo, createContext } from "react";
import { message } from "antd";

export const MessageContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function MessageContextProvider({ children }) {
    const [messageApi, contextHolder] = message.useMessage();
    const contextValue = useMemo(function () {
        return { messageApi };
    }, [messageApi]);
    return (
        <MessageContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
}
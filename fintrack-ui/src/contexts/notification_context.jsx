/* eslint-disable react-refresh/only-export-components */
import { useMemo, createContext } from "react";
import { notification } from "antd";

export const NotificationContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function NotificationContextProvider({ children }) {
    const [notificationApi, contextHolder] = notification.useNotification();
    const contextValue = useMemo(function () {
        return { notificationApi };
    }, [notificationApi]);
    return (
        <NotificationContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

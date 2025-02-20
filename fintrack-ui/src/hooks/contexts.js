import { useContext } from "react";
import { MessageContext } from "@/contexts/message_context";
import { NotificationContext } from "@/contexts/notification_context";
import { ModalContext } from "@/contexts/modal_context";

/**
 * @typedef {Object} MessageContextValue
 * @property {MessageInstance} messageApi
 * 
 * @returns {MessageContextValue}
 */
export function useMessageContext() {
    return useContext(MessageContext);
}

/**
 * @typedef {Object} NotificationContextValue
 * @property {NotificationInstance} notificationApi
 * 
 * @returns {NotificationContextValue}
 */
export function useNotificationContext() {
    return useContext(NotificationContext);
}

/**
 * @typedef {Object} ModalContextValue
 * @property {HookAPI} modalApi
 * 
 * @returns {ModalContextValue}
 */
export function useModalContext() {
    return useContext(ModalContext);
}

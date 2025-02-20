/* eslint-disable react/prop-types */

export function GridLoadingCustomComponent({ loadingMessage }) {
    return <>{loadingMessage}</>;
}

export function GridNoRowsToShowCustomComponent({ noRowsMessageFunc }) {
    return <>{noRowsMessageFunc()}</>;
}
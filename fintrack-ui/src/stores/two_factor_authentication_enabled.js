import { create } from "zustand";

export const use2faEnabled = create(function (set) {
    return {
        enabled: true,
        /**
         * 
         * @param {boolean} value 
         * @returns {Function}
         */
        set2fa: function (value) {
            return set(function () {
                return { enabled: value };
            });
        },
    };
});

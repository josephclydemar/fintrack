import Helper from "@/utils/helper";
import { InvalidArgumentException, ApiRequestFailedException } from "@/utils/exceptions";

const Api = {
    initAbortController: function () {
        return new AbortController();
    },

    /**
     * Generate HTTP headers
     * 
     * @returns {object}
     */
    getHeaders: function () {
        const apiAccessToken = Helper.getSavedApiAccessToken();
        return {
            "Authorization": `Bearer ${apiAccessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
    },

    /**
     * 
     * @param {object} params 
     * @returns {string}
     */
    createQueryString: function (params) {
        const urlParams = new URLSearchParams();
        Object.keys(params).forEach(function (key) {
            const isValid = (typeof key === "string") && (typeof params[key] === "string");
            console.log({ params, isValid });
            if(isValid) {
                urlParams.set(key, params[key]);
            }
        });
        return urlParams.toString();
    },

    /**
     * 
     * @param {string} apiEndpoint 
     * @param {string} method 
     * @param {object} httpPayload 
     * @param {function} successFn 
     * @param {function} errorFn 
     * @returns {AbortController}
     */
    requestWithCallback: function (apiEndpoint, method, httpPayload, successFn, errorFn) {
        if(typeof httpPayload !== "object") throw new InvalidArgumentException("httpPayload", "object");
        if(typeof successFn !== "function") throw new InvalidArgumentException("successFn", "function");
        if(typeof errorFn !== "function") throw new InvalidArgumentException("errorFn", "function");
        
        const apiHost = import.meta.env.VITE_API_URL;

        const abortController = this.initAbortController();
        let apiUrl = apiEndpoint;
        let payloadString = null;
        let requestParams = {
            method: method,
            headers: this.getHeaders(),
            signal: abortController.signal,
        };

        if(apiHost !== undefined) {
            apiUrl = `${apiHost}${apiUrl}`;
        }
        if(Object.keys(httpPayload).length > 0) {
            if(method === "GET") {
                payloadString = this.createQueryString(httpPayload);
                apiUrl += `?${payloadString}`;
            } else {
                payloadString = JSON.stringify(httpPayload);
                requestParams.body = payloadString;
            }
        }

        let responseCode = 200;
        fetch(apiUrl, requestParams)
        .then(function (res) {
            responseCode = res.status;
            return res.json();
        })
        .then(function (data) {
            successFn({
                code: responseCode,
                ...data,
            });
        })
        .catch(function (err) {
            errorFn({
                code: 500,
                success: false,
                message: err.message,
                data: null,
                error: [],
            });
        });
        return abortController;
    },

    /**
     * 
     * @param {string} apiEndpoint 
     * @param {string} method 
     * @param {object} httpPayload 
     * @returns {Promise<any>}
     */
    requestAsync: async function (apiEndpoint, method, httpPayload) {
        if(typeof apiEndpoint !== "string") throw new InvalidArgumentException("apiEndpoint", "string");
        if(typeof method !== "string") throw new InvalidArgumentException("method", "string");
        if(typeof httpPayload !== "object") throw new InvalidArgumentException("httpPayload", "object");
        
        const apiHost = import.meta.env.VITE_API_URL;

        let apiUrl = apiEndpoint;
        let payloadString = null;
        let requestParams = {
            method: method,
            headers: this.getHeaders(),
        };
        if(apiHost !== undefined) {
            apiUrl = `${apiHost}${apiUrl}`;
        }
        if(Object.keys(httpPayload).length > 0) {
            if(method === "GET") {
                payloadString = this.createQueryString(httpPayload);
                apiUrl += `?${payloadString}`;
            } else {
                payloadString = JSON.stringify(httpPayload);
                requestParams.body = payloadString;
            }
        }

        /**
         * {
         *   code: 200,
         *   success: true,
         *   message: "",
         *   data: [],
         *   error: [],
         * };
         */
        try {
            const res = await fetch(apiUrl, requestParams);
            const data = await res.json();
            return {
                code: res.status,
                ...data,
            };
        } catch (err) {
            return {
                code: 500,
                success: false,
                message: err.message,
                data: null,
                error: [],
            };
        }
    },

    /**
     * Retrieve generic resource from the API for the grid
     * 
     * @param {string} urlEndpoint
     * @param {string} method
     * @returns {Promise<Array<Resource>>}
     * @throws ApiRequestFailedException
     */
    retrieveResource: async function (urlEndpoint, method) {
        const response = await this.requestAsync(
            urlEndpoint,
            method,
            {},
        );
        if(!response.success) {
            console.log({response});
            throw new ApiRequestFailedException(urlEndpoint, response);
        }
        return response.data;
    },




    /**
     * Retrieve user financial profile
     * 
     * @returns {Promise<Array<FinancialProfile>>}
     * @throws ApiRequestFailedException
     */
    retrieveFinancialProfile: async function () {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/financial_profile`,
            "GET",
            {},
        );
        if(!response.success) {
            console.log({response});
            throw new ApiRequestFailedException("financial_profile", response);
        }
        return response.data;
    },


    /**
     * Retrieve all categories of the user from the API
     * 
     * @returns {Promise<Array<Category>>}
     */
    retrieveCategories: async function () {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/categories`,
            "GET",
            {},
        );
        if(!response.success) {
            console.log({response});
            return [];
        }
        return response.data;
    },

    /**
     * Create new Category
     * 
     * @param {string} name 
     * @param {string} type
     * 
     * @returns {Promise<Category|null>}
     */
    createCategory: async function (name, type) {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/categories`,
            "POST",
            { name, type },
        );
        if(!response.success) {
            console.log({response});
            throw new ApiRequestFailedException("categories", response);
        }
        return response.data;
    },

    /**
     * Create new Financial Target
     * 
     * @param {string} category 
     * @param {string} name 
     * @param {string} description 
     * @param {number} balance 
     * @param {string} startDate 
     * @param {string} endDate 
     * @returns {Promise<FinancialTarget|null>}
     */
    createFinancialTarget: async function (category, name, description, balance, startDate, endDate) {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/financial_targets`,
            "POST",
            {
                category_id: category,
                name: name,
                description: description,
                balance: Math.floor(balance * 100),
                start_date: startDate,
                end_date: endDate,
            },
        );
        if(!response.success) {
            console.log({response});
            throw new ApiRequestFailedException("financial_targets", response);
        }
        return response.data;
        
    },

    /**
     * 
     * @param {string} financialTargetId 
     * @param {string} name 
     * @param {string} description 
     * @param {number} amount 
     * @returns {Promise<Transaction|null>}
     */
    createTransaction: async function (financialTargetId, name, description, amount) {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/transactions`,
            "POST",
            {
                financial_target_id: financialTargetId,
                name: name,
                description: description,
                amount: Math.floor(amount * 100),
            },
        );
        if(!response.success) {
            console.log({response});
            throw new ApiRequestFailedException("transactions", response);
        }
        return response.data;
    },

    /**
     * 
     * @returns {Promise<UserSetting|null>}
     */
    retrieveUserSettings: async function () {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/user_settings`,
            "GET",
            {},
        );
        if(!response.success) {
            console.log({response});
            return [];
        }
        return response.data;
    },

    /**
     * 
     * @returns {Promise<UserSetting|null>}
     */
    updateUserSetting: async function (key, value) {
        const userId = Helper.getSavedUserData("userId");
        const response = await this.requestAsync(
            `/api/v1/users/${userId}/user_settings`,
            "PATCH",
            { [key]: value },
        );
        if(!response.success) {
            console.log({response});
            return null;
        }
        return response.data;
    },
};

export default Api;

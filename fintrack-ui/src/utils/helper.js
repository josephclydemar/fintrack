import { InvalidArgumentException } from "@/utils/exceptions";
import { AuthKeys } from "@/utils/keys";

const Helper = {
    /**
     * 
     * @param {number} num 
     * @returns 
     */
    padNumber: function (num) {
        const digitCount = 8;
        let numStr = num.toString();
        if(numStr.length >= digitCount) return numStr;
        return numStr.padStart(digitCount, '0');
    },
    
    /**
     * 
     * @param {number} amount 
     * @returns 
     */
    formatCurrency: function (amount) {
        return Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 2,
        }).format(amount);
    },
    
    /**
     * Transforms array to hashmap.
     * 
     * @param {Array} arr 
     * @param {string} key 
     * @param {boolean} castKey
     * @returns {object}
     */
    arrayToHashmap: function (arr, key, castKey = false) {
        let hashMap = {};
        if(typeof key !== "string") throw new InvalidArgumentException("key", "string");
        arr.forEach(function (item) {
            let hashMapKey = item[key];
            if(castKey) {
                hashMapKey = `${hashMapKey}`;
            }
            if(typeof hashMapKey !== "string") throw new InvalidArgumentException("item[key]", "string");
            hashMap[hashMapKey] = item;
        });
        return hashMap;
    },

    /**
     * Shallow clone objects.
     * 
     * @param {object} obj 
     * @returns {object}
     */
    cloneObject: function (obj) {
        if(typeof obj !== "object") throw new InvalidArgumentException("obj", "object");
        return JSON.parse(JSON.stringify(obj));
    },


    /**
     * Save data to Session storage.
     * 
     * @param {string} key 
     * @param {string|number|boolean} value 
     */
    saveToSessionStorage: function (key, value) {
        if(!(
            typeof value === "string" || 
            typeof value === "number" || 
            typeof value === "boolean")) throw new InvalidArgumentException("value", "string, number, boolean");
        if(typeof key !== "string") throw new InvalidArgumentException("key", "string");
        sessionStorage.setItem(key, value);
    },

    /**
     * Get data from Session storage.
     * 
     * @param {string} key 
     * @returns {string|null}
     */
    getFromSessionStorage: function (key) {
        if(typeof key !== "string") throw new InvalidArgumentException("key", "string");
        return sessionStorage.getItem(key);
    },

    /**
     * Save data to Local storage.
     * 
     * @param {string} key 
     * @param {string|number|boolean} value 
     */
    saveToLocalStorage: function (key, value) {
        if(!(
            typeof value === "string" || 
            typeof value === "number" || 
            typeof value === "boolean")) throw new InvalidArgumentException("value", "string, number, boolean");
        if(typeof key !== "string") throw new InvalidArgumentException("key", "string");
        localStorage.setItem(key, value);
    },
    
    /**
     * Get data from Local storage.
     * 
     * @param {string} key 
     * @returns {string|null}
     */
    getFromLocalStorage: function (key) {
        if(typeof key !== "string") throw new InvalidArgumentException("key", "string");
        return localStorage.getItem(key);
    },

    /**
     * Save the user data
     * 
     * @param {object} data 
     */
    saveUserData: function (data) {
        if(typeof data !== "object") throw new InvalidArgumentException("data", "object");
        this.saveToLocalStorage(AuthKeys.user, JSON.stringify(data));
    },

    /**
     * Get the saved user data
     * 
     * @param {string} key 
     * @returns {object|null} 
     */
    getSavedUserData: function (key = "") {
        if(typeof key !== "string") throw new InvalidArgumentException("key", "string");
        const raw = this.getFromLocalStorage(AuthKeys.user);
        if(raw === null) return null;
        const data = JSON.parse(raw);
        if(key === "") return data;
        return data !== null ? (data[key] ?? null) : null;
    },

    /**
     * Save the api access token
     * 
     * @param {string} token 
     */
    saveApiAccessToken: function (token) {
        if(typeof token !== "string") throw new InvalidArgumentException("token", "string");
        this.saveToLocalStorage(AuthKeys.api_access_token, token);
    },

    /**
     * Get the saved api access token
     * 
     * @returns {string|null} 
     */
    getSavedApiAccessToken: function () {
        return this.getFromLocalStorage(AuthKeys.api_access_token);
    },

    /**
     * Save the login status
     * 
     * @param {boolean} status 
     */
    saveLoginStatus: function (status) {
        if(typeof status !== "boolean") throw new InvalidArgumentException("status", "boolean");
        this.saveToLocalStorage(AuthKeys.login_status, status);
    },

    /**
     * Get the saved login status
     * 
     * @returns {boolean|null} 
     */
    getSavedLoginStatus: function () {
        return this.getFromLocalStorage(AuthKeys.login_status);
    },
};


export default Helper;

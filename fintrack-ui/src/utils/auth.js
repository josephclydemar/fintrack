import Api from "@/utils/api";
import Helper from "@/utils/helper";
import { AuthKeys } from "@/utils/keys";

const Auth = {
    /**
     * Attempt to login the user.
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {Function} mfaEnabledCallback 
     * @param {Function} mfaDisabledCallback
     * @param {Function} onFailCallback 
     * @returns {Promise<void>}
     */
    login: async function (email, password, mfaEnabledCallback, mfaDisabledCallback, onFailCallback) {
        const response = await Api.requestAsync(
            "/api/auth/login",
            "POST",
            {
                email: email,
                password: password,
            }
        );
        if(!response.success) {
            console.log({response});
            onFailCallback(response.message);
            return;
        }
        const data = response.data;
        if(data.mfa) {
            Helper.saveToSessionStorage(AuthKeys.authenticated_email, data[AuthKeys.authenticated_email]);
            mfaEnabledCallback();
            return;
        }
        const user = data[AuthKeys.user];
        const apiAccessToken = data[AuthKeys.api_access_token];
        console.log({ user });
        Helper.saveLoginStatus(true);
        Helper.saveUserData({
            userId: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            status: 2,
        });
        Helper.saveApiAccessToken(apiAccessToken);
        mfaDisabledCallback();
    },

    /**
     * 
     * @param {string} otpCode 
     * @param {Function} onFinishCallback
     * @param {Function} onFailCallback 
     * @returns {Promise<void>}
     */
    loginOtp: async function (otpCode, onFinishCallback, onFailCallback) {
        const userEmail = Helper.getFromSessionStorage(AuthKeys.authenticated_email);
        console.log("onOtp:", { otpCode });
        const response = await Api.requestAsync(
            "/api/auth/login/otp",
            "POST",
            {
                email: userEmail,
                otp_code: otpCode,
            },
        );
        if(!response.success) {
            console.log({response});
            onFailCallback(response.message);
            return;
        }
        const data = response.data;
        const user = data[AuthKeys.user];
        const apiAccessToken = data[AuthKeys.api_access_token];
        console.log({ user });
        Helper.saveLoginStatus(true)
        Helper.saveUserData({
            userId: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            status: 2,
        });
        Helper.saveApiAccessToken(apiAccessToken);
        onFinishCallback();
    },

    /**
     * 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} email 
     * @param {string} password 
     * @param {string} passwordConfirmation 
     * @param {Function} onFinishCallback
     * @param {Function} onFailCallback 
     * @returns 
     */
    register: async function (firstName, lastName, email, password, passwordConfirmation, onFinishCallback, onFailCallback) {
        const response = await Api.requestAsync(
            "/api/auth/register",
            "POST",
            {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
            },
        );
        if(!response.success) {
            console.log({response});
            onFailCallback(response.message);
            return;
        }
        const data = response.data;
        const user = data[AuthKeys.user];
        Helper.saveLoginStatus(true);
        Helper.saveUserData({
            userId: user["id"],
            email: user["email"],
            firstName: user["first_name"],
            lastName: user["last_name"],
            status: 1,
        });
        Helper.saveApiAccessToken(data[AuthKeys.api_access_token]);
        onFinishCallback();
    },

    /**
     * 
     * @param {Function} onFinishCallback
     * @param {Function} onFailCallback 
     * @returns
     */
    logout: async function (onFinishCallback, onFailCallback) {
        const userId = Helper.getSavedUserData("userId");
        const response = await Api.requestAsync(`/api/auth/users/${userId}/logout`, "POST", {});
        if(!response.success) {
            console.log({response});
            onFailCallback(response.message);
            return;
        }
        Helper.saveLoginStatus(false);
        Helper.saveUserData({});
        Helper.saveApiAccessToken("");
        onFinishCallback();
    },
};

export default Auth;

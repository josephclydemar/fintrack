import Api from "@/utils/api";
import Helper from "@/utils/helper";
import { ApiRequestFailedException } from "@/utils/exceptions";

const Grid = {
    /**
     * 
     * @param {string} key 
     */
    retrieveComponentBlueprint: async function (key) {
        const userId = Helper.getSavedUserData("userId");
        const response = await Api.requestAsync(
            `/api/v1/users/${userId}/grid_blueprints/${key}`,
            "GET",
            {},
        );
        if(!response.success) {
            console.log({response});
            throw new ApiRequestFailedException(key, response);
        }
        return response.data;
    },
};

export default Grid;

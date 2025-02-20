import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Api from "@/utils/api";
import Grid from "@/utils/grid";
import { QueryKeys } from "@/utils/keys";


const Queries = {
    /**
     * 
     * @param {string} urlEndpoint 
     * @param {string} method 
     * @returns {UseQueryResult<Resource[], Error>}
    */
   useRetrieveResource: function (urlEndpoint, method) {
       return useQuery({
           queryKey: [QueryKeys.resource, urlEndpoint],
           queryFn: function () {
               return Api.retrieveResource(urlEndpoint, method);
            },
        });
    },
    
    /**
     * 
     * @returns {Function}
    */
   useInvalidateResource: function () {
        const queryClient = useQueryClient();
        /**
         * 
         * @param {string} urlEndpoint 
         */
        return function (urlEndpoint) {
           queryClient.invalidateQueries([QueryKeys.resource, urlEndpoint]);
        };
    },
    
    useCreateCategory: function () {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: function ({ name, type }) {
                return Api.createCategory(name, type);
            },
            onSuccess: function () {
                queryClient.invalidateQueries({
                    queryKey: [QueryKeys.resource],
                });
            },
        });
    },
    
    /**
     * 
     * @param {string} key 
     * @returns {UseQueryResult<GridBlueprint, Error>}
     */
    useRetrieveGridBlueprint: function (key) {
        return useQuery({
            queryKey: [QueryKeys.grid, key],
            queryFn: function () {
                return Grid.retrieveComponentBlueprint(key);
            },
            // staleTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchInterval: 1800000,
        });
    },

    /**
     * 
     * @param {string} key 
     * @returns {UseQueryResult<FinancialProfile, Error>}
     */
    useRetrieveFinancialProfile: function () {
        return useQuery({
            queryKey: [QueryKeys.financial_profile],
            queryFn: function () {
                return Api.retrieveFinancialProfile();
            },
        });
    },
};

export default Queries;
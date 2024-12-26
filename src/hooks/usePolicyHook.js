import { useGetPoliciesIdQuery, useGetPoliciesQuery, usePostPoliciesMutation, useUpdatePoliciesMutation } from "../BLL/policyApi";


export const usePolicyHook = (policyId) => {
    const {
        activeDirectives = [],
        draftDirectives = [],
        archiveDirectives = [],
        activeInstructions = [],
        draftInstructions = [],
        archiveInstructions = [],
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies
    } = useGetPoliciesQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            activeDirectives: data?.activeDirectives || [],
            draftDirectives: data?.draftDirectives || [],
            archiveDirectives: data?.archiveDirectives || [],
            activeInstructions: data?.activeInstructions || [],
            draftInstructions: data?.draftInstructions || [],
            archiveInstructions: data?.archiveInstructions || [],
            isLoadingGetPolicies: isLoading,
            isErrorGetPolicies: isError,
            isFetchingGetPolicies: isFetching,
        }),
    });

    const {
        currentPolicy = {},
        isLoadingGetPoliciesId,
        isFetchingGetPoliciesId,
        isErrorGetPoliciesId,
    } = useGetPoliciesIdQuery(
        { policyId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentPolicy: data?.currentPolicy || {},
                isLoadingGetPoliciesId: isLoading,
                isErrorGetPoliciesId: isError,
                isFetchingGetPoliciesId: isFetching,
            }),
            skip: !policyId
        }
    );

    const [
        postPolicy,
        {
            isLoading: isLoadingPostPoliciesMutation,
            isSuccess: isSuccessPostPoliciesMutation,
            isError: isErrorPostPoliciesMutation,
            error: ErrorPostPoliciesMutation,
        },
    ] = usePostPoliciesMutation();

    const [
        updatePolicy,
        {
            isLoading: isLoadingUpdatePoliciesMutation,
            isSuccess: isSuccessUpdatePoliciesMutation,
            isError: isErrorUpdatePoliciesMutation,
            error: ErrorUpdatePoliciesMutation,
        },
    ] = useUpdatePoliciesMutation();

    return {
        //useGetPoliciesQuery
        activeDirectives,
        draftDirectives,
        archiveDirectives,
        activeInstructions,
        draftInstructions,
        archiveInstructions,
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies,

        //useGetPoliciesIdQuery
        currentPolicy,
        isLoadingGetPoliciesId,
        isFetchingGetPoliciesId,
        isErrorGetPoliciesId,


        postPolicy,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,


        updatePolicy,
        isLoadingUpdatePoliciesMutation,
        isSuccessUpdatePoliciesMutation,
        isErrorUpdatePoliciesMutation,
        ErrorUpdatePoliciesMutation,
    }
}
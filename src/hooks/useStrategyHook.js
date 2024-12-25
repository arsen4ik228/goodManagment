import { useGetStrategyQuery, usePostStrategyMutation } from "../BLL/strategyApi";


export const useStartegyHook = () => {


    const {
        activeAndDraftStrategies = [],
        archiveStrategies = [],
        isLoadingStrateg,
        isErrorStrateg,
    } = useGetStrategyQuery(
        undefined,
        {
            selectFromResult: ({ data, isLoading, isError }) => ({
                archiveStrategies: data?.archiveStrategies || [],
                activeAndDraftStrategies: data?.activeAndDraftStrategies || [],
                isLoadingStrateg: isLoading,
                isErrorStrateg: isError,
            }),
        }
    );

    const [
        postStrategy,
        {
            isLoading: isLoadingPostStrategyMutation,
            isSuccess: isSuccessPostStrategyMutation,
            isError: isErrorPostStrategyMutation,
            error: errorPostStrategyMutation,
        },
    ] = usePostStrategyMutation();


    return {
        activeAndDraftStrategies,
        archiveStrategies,
        isLoadingStrateg,
        isErrorStrateg,

        postStrategy,
        isLoadingPostStrategyMutation,
        isSuccessPostStrategyMutation,
        isErrorPostStrategyMutation,
        errorPostStrategyMutation,
    }
}
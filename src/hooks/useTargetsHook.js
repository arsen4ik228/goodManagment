import { useGetTargetsQuery, usePostTargetsMutation } from "../BLL/targetsApi"

export const useTargetsHook = () => {

    const {
        currentTargets = [],
        otherTargets = [],
        personalTargets = [],
        ordersTargets = [],
        projectTragets = [],
        userPosts = [],
        isLoadingGetTargets,
        isErrorGetTargets,
    } = useGetTargetsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, }) => ({
            currentTargets: data?.personalTargets?.currentTargets || [],
            otherTargets: data?.personalTargets?.otherTargets || [],
            personalTargets: data?.personalTargets || [],
            ordersTargets: data?.ordersTargets || [],
            projectTragets: data?.projectTargets || [],
            userPosts: data?.userPosts || [],
            isLoadingGetTargets: isLoading,
            isErrorGetTargets: isError,
        }),
    })

    const [
        postTargets,
        {
            isLoading: isLoadingPostTargetsMutation,
            isSuccess: isSuccessPostTargetsMutation,
            isError: isErrorPostTargetsMutation,
            error: ErrorPostTargetsMutation,
        },
    ] = usePostTargetsMutation();

    return {
        // getTargets
        currentTargets,
        otherTargets,
        personalTargets,
        ordersTargets,
        projectTragets,
        userPosts,
        isLoadingGetTargets,
        isErrorGetTargets,

        //postTargets
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation,
    }
}
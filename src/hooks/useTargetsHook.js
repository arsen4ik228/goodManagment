import { useDeleteTargetMutation, useGetArchiveTargetsQuery, useGetTargetsQuery, usePostTargetsMutation, useUpdateTargetsMutation } from "../BLL/targetsApi"

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

    const {
        archivePersonalTargets = [],
        archiveOrdersTargets = [],
        archiveProjectTragets = [],
        isLoadingGetArchiveTargets,
        isErrorGetArchiveTargets,
    } = useGetArchiveTargetsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, }) => ({
            archivePersonalTargets: data?.personalArchiveTargets || [],
            archiveOrdersTargets: data?.ordersArchiveTargets || [],
            archiveProjectTragets: data?.projectArchiveTargets || [],
            isLoadingGetArchiveTargets: isLoading,
            isErrorGetArchiveTargets: isError,
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

    const [
        updateTargets,
        {
            isLoading: isLoadingUpdateTargetsMutation,
            isSuccess: isSuccessUpdateTargetsMutation,
            isError: isErrorUpdateTargetsMutation,
            error: ErrorUpdateTargetsMutation,
        }
    ] = useUpdateTargetsMutation()

    const [
        deleteTarget,
        {
            isLoading: isLoadingDeleteTargetsMutation,
            isSuccess: isSuccessDeleteTargetsMutation,
            isError: isErrorDeleteTargetsMutation,
            error: ErrorDeleteTargetsMutation,
        }
    ] = useDeleteTargetMutation()

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

        //getArchiveTargets
        archivePersonalTargets,
        archiveOrdersTargets,
        archiveProjectTragets,
        isLoadingGetArchiveTargets,
        isErrorGetArchiveTargets,

        //postTargets
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation,

        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,

        deleteTarget,
        isLoadingDeleteTargetsMutation,
        isSuccessDeleteTargetsMutation,
        isErrorDeleteTargetsMutation,
        ErrorDeleteTargetsMutation,
    }
}
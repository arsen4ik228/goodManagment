import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, formattedDate } from "./constans";
import { prepareHeaders } from "./Function/prepareHeaders.js"

export const targetsApi = createApi({
    reducerPath: "targets",
    tagTypes: ["Targets"],
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    endpoints: (build) => ({
        getTargets: build.query({
            query: () => ({
                url: `targets`,
            }),
            transformResponse: (response) => {
                console.log('getTargets:    ', response)

                const transformTargetsArray = (array) => {
                    const currentDate = new Date().toISOString().split('T')[0];
                    const groupedItems = {};
                
                    array.forEach(item => {
                        const dateStart = item.dateStart;
                        const dateWithoutTime = new Date(dateStart).toISOString().split('T')[0];
                        const isFutureOrPastCurrent = dateWithoutTime > currentDate;
                
                        if (!groupedItems[dateWithoutTime]) {
                            groupedItems[dateWithoutTime] = [];
                        }
                
                        groupedItems[dateWithoutTime].push({
                            ...item,
                            isFutureOrPastCurrent: isFutureOrPastCurrent
                        });
                    });
                
                    const currentTargets = Object.values(groupedItems)
                        .filter(items => !items.some(item => item.isFutureOrPastCurrent))
                        .flat();
                
                    const otherTargets = Object.values(groupedItems)
                        .filter(items => items.some(item => item.isFutureOrPastCurrent))
                        .map(items => ({
                            date: formattedDate(items[0].dateStart).slice(0,5),
                            items: items.filter(item => item.isFutureOrPastCurrent)
                        }));
                
                    return {
                        currentTargets,
                        otherTargets
                    };
                };
                
                

                const newPersonalTargets = transformTargetsArray(response?.personalTargets)
                console.log(newPersonalTargets)
                return {
                    userPosts: response?.userPosts,
                    personalTargets: newPersonalTargets,
                }
            },
            providesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),

        getArchiveTargets: build.query({
            query: () => ({
                url: 'targets/archive',
            }),
            transformResponse: (response) => {
                console.log('getArchiveTargets    ', response)
                return response
            },
            providesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],

        }),

        updateTargets: build.mutation({
            query: (body) => ({
                url: `targets/${body._id}/update`,
                method: "PATCH",
                body,
            }),
            // Обновляем теги, чтобы перезагрузить getStrategiesId
            invalidatesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),

        postTargets: build.mutation({
            query: (body) => ({
                url: `targets/new`,
                method: "POST",
                body,
            }),
            // transformResponse: (response) => ({
            //     id: response.id
            // }),
            providesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),

        deleteTarget: build.mutation({
            query: ({targetId}) => ({
                url: `targets/${targetId}/remove`,
                method: "DELETE",
                // body,
            }),
            // transformResponse: (response) => ({
            //     id: response.id
            // }),
            invalidatesTags: (result) => result ? [{ type: "Targets", id: "LIST" }] : [],
        }),        
    })
})

export const {
    useGetTargetsQuery,
    useGetArchiveTargetsQuery,
    usePostTargetsMutation,
    useUpdateTargetsMutation,
    useDeleteTargetMutation,
} = targetsApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "./constans";

export const strategyApi = createApi({
    reducerPath: "strategy",
    tagTypes: ["Strategy"],
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints:(build) => ({
        getStrategy: build.query({
            query: ({userId, organizationId}) => ({
                url: `${userId}/strategies/organization/${organizationId}`,
            }),
            transformResponse: (response) => {
                const sortedStrategies = response?.strategies
                sortedStrategies?.sort((a, b) => {
                    const stateA = a.state || '';
                    const stateB = b.state || '';
                    
                    if (stateA === 'Активный' && stateB !== 'Активный') return -1;
                    if (stateB === 'Активный' && stateA !== 'Активный') return 1;
                    
                    if (stateA === 'Черновик' && stateB !== 'Черновик') return -1;
                    if (stateB === 'Черновик' && stateA !== 'Черновик') return 1;
                    
                    return 0;
                  });
              
                const activeAndDraftStrategies = sortedStrategies.filter(strategy => 
                  strategy.state === 'Активный' || strategy.state === 'Черновик'
                );
              
                const otherStrategies = sortedStrategies.filter(strategy => 
                  strategy.state !== 'Активный' && strategy.state !== 'Черновик'
                );
              
                return {
                  activeAndDraftStrategies: activeAndDraftStrategies,
                  archiveStrategies: otherStrategies,  
                };
              },

              providesTags: (result) => result ? [{ type: "Strateg", id: "LIST" }] : [],
        }),

        getStrategyId: build.query({
            query: ({ userId, strategyId }) => ({
                url: `${userId}/strategies/${strategyId}`,
            }),

            // Добавляем теги для этой query
            providesTags: (result, error,  {strategyId}) => result ? [{type: "Strateg1", id: strategyId }]: []
        }),
        updateStrategy: build.mutation({
            query: ({ userId, strategyId, ...body }) => ({
                url: `${userId}/strategies/${strategyId}/update`,
                method: "PATCH",
                body,
            }),
            // Обновляем теги, чтобы перезагрузить getStrategiesId
            invalidatesTags: (result,  error,  {strategyId}) => result ? [{type: "Strateg1", id: strategyId},{ type: "Strateg", id: "LIST" }]: []
        }),
        postStrategy: build.mutation({
            query: ({ userId, ...body }) => ({
                url: `${userId}/strategies/new`,
                method: "POST",
                body,
            }),
            transformResponse: (response) => ({
                id: response.id
            }),
            invalidatesTags: (result) => result ? [{type: "Strateg", id: "LIST" }] : []
        }),
        getStrategyNew: build.query({
            query: (userId = "") => ({
                url: `${userId}/strategies/new`,
            }),
            // transformResponse: (response) => ({
            //     organizations: response.organizations || [],
            // }),
            providesTags: (result) => result ? [{ type: "Strateg", id: "LIST" }] : [],
        }),
    })
})

export const {useGetStrategyQuery,
    useGetStrategyIdQuery,
    useUpdateStrategyMutation,
    useGetStrategyNewQuery,
    usePostStrategyMutation,
} = strategyApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const strategyApi = createApi({
    reducerPath: "strategy",
    tagTypes: ["Strategy"],
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/" }),
    endpoints:(build) => ({
        getStrategy: build.query({
            query: (userId = "") => ({
                url: `${userId}/strategies`,
            }),

            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: "Strategy", id })),
                        { type: "Strategy", id: "LIST" },
                    ]
                    : [{ type: "Strategy", id: "LIST" }],
        }),

        getStrategyId: build.query({
            query: ({ userId, strategyId }) => ({
                url: `${userId}/strategies/${strategyId}`,
            }),

            // Добавляем теги для этой query
            providesTags: (result, error, { strategyId }) =>
                result ? [{ type: "Strategy", id: strategyId }] : [],
        }),
        updateStrategy: build.mutation({
            query: ({ userId, strategyId, ...body }) => ({
                url: `${userId}/strategies/${strategyId}/update`,
                method: "PATCH",
                body,
            }),
            // Обновляем теги, чтобы перезагрузить getStrategiesId
            invalidatesTags: (result, error, { strategyId }) => [
                { type: "Strategy", id: strategyId },
            ],
        }),
        postStrategy: build.mutation({
            query: ({ userId, ...body }) => ({
                url: `${userId}/strategies/new`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Strategy", id: "LIST" }],
        }),
        getStrategyNew: build.query({
            query: (userId = "") => ({
                url: `${userId}/strategies/new`,
            }),
            // transformResponse: (response) => ({
            //     organizations: response.organizations || [],
            // }),
        }),
    })
})

export const {useGetStrategyQuery,
    useGetStrategyIdQuery,
    useUpdateStrategyMutation,
    useGetStrategyNewQuery,
    usePostStrategyMutation,
} = strategyApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";


export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  tagTypes: ["Statistics", "Statistics1"],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({

    getStatistics: build.query({
      query: ({ userId, statisticData = true }) => ({
        url: `${userId}/statistics/?statisticData=${statisticData}`,
      }),
      transformResponse: (response) => {
        console.log('response:  ', response)

        if (!Array.isArray(response)) {
          console.error('Response is not an array');
          return [];
        }

        const transformData = response?.map(item => {
          return {
            id: item.id || '',
            name: item.name || '',
            ...(item.post && {
              post: {
                id: item?.post?.id || '',
                name: item.post?.postName || ''
              }
            }),
            organization: {
              ...(item.post.organization && {
                id: item?.post.organization?.id || '',
                name: item.post.organization?.organizationName || '',
                reportDay: item.post.organization?.reportDay || ''
              })
            } || {},
          }

        })

        console.log('Transform Data:  ', transformData)
        return transformData
      },
      providesTags: (result) => result ? [{ type: 'Statistics', id: "LIST" }] : [],
    }),

    postStatistics: build.mutation({
      query: ({ userId = "", ...body }) => ({
        url: `${userId}/statistics/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => result ? [{ type: "Statistics", id: "LIST" }] : []
    }),

    getStatisticsNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/statistics/new`,
      }),
      transformResponse: (response) => {
        return {
          posts: response || [],
        };
      },
    }),

    getStatisticsId: build.query({
      query: ({ userId, statisticId }) => ({
        url: `${userId}/statistics/${statisticId}`,
      }),
      transformResponse: (response) => {
        return {
          currentStatistic: response || {},
          statisticDatas: response.statisticDatas || [],
        };
      },
      providesTags: (result, error, { statisticId }) => result ? [{ type: "Statistics1", id: statisticId }] : []
    }),

    updateStatistics: build.mutation({
      query: ({ userId, statisticId, ...body }) => ({
        url: `${userId}/statistics/${statisticId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { statisticId }) => result ? [{ type: "Statistics1", id: statisticId }] : []
    }),


  }),
});

export const { usePostStatisticsMutation, useGetStatisticsNewQuery, useGetStatisticsIdQuery, useGetStatisticsQuery, useUpdateStatisticsMutation, useUpdateStatisticsToPostIdMutation } = statisticsApi;
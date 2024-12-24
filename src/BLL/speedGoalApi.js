import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";
import {prepareHeaders} from "./Function/prepareHeaders.js"


export const speedGoalApi = createApi({
  reducerPath: "speedSpeedGoalApi",
  tagTypes: ["SpeedGoal"],
  baseQuery: fetchBaseQuery({ baseUrl,prepareHeaders }),
  endpoints: (build) => ({

    getSpeedGoals: build.query({
      query: (userId = "") => ({
        url: `${userId}/objectives`,
      }),
      transformResponse: (response) => {
        const sortedStrategies = response
          ?.flatMap(objective => objective.strategy)
          .sort((a, b) => {
            const stateA = a.state || '';
            const stateB = b.state || '';
            
            if (stateA === 'Черновик' && stateB !== 'Черновик') return -1;
            if (stateB === 'Черновик' && stateA !== 'Черновик') return 1;

            if (stateA === 'Активный' && stateB !== 'Активный') return -1;
            if (stateB === 'Активный' && stateA !== 'Активный') return 1;

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


      providesTags: (result, error, userId) =>
        result ? [{ type: "SpeedGoal", id: userId }] : [],
    }),


    getSpeedGoalId: build.query({
      query: ({strategyId}) => ({
        url: `objectives/${strategyId}/objective`,
      }),
      transformResponse: (response) => {
        console.log('getSpeedGoalId   ', response)
        // const isArchive = response?.strategy.state === 'Завершено' ? true : false
        return {
          currentSpeedGoal: response || {},
          // isArchive
        };
      },
      providesTags: (result, error, { strategyId }) =>
        result ? [{ type: "SpeedGoal", id: strategyId }] : [],
    }),

    updateSpeedGoal: build.mutation({
      query: (body) => ({
        url: `objectives/${body._id}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { objectiveId, strategId }) => [
        { type: "SpeedGoal", id: objectiveId }, // Обновляем текущую цель
        { type: "SpeedGoal", id: strategId },   // Обновляем стратегию для getSpeedGoalId
        { type: "SpeedGoal", id: "LIST" },      // Обновляем список
      ],
    }),
  }),
});

export const {
  useGetSpeedGoalIdQuery,
  useUpdateSpeedGoalMutation,
  useGetSpeedGoalsQuery
} = speedGoalApi;

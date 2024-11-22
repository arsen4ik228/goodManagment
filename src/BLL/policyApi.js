import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "./constans";

export const policyApi = createApi({
  reducerPath: "policy",
  tagTypes: ["Policy"],
  baseQuery: fetchBaseQuery({ baseUrl}),
  endpoints: (build) => ({
    getPolicies: build.query({
      query: (userId = "") => ({
        url: `${userId}/policies`,
      }),

      transformResponse: (response) => {
        const directivesDB = response.directives;
        const instructionsDB = response.instructions

        const sortArray = (array) => array.sort((a, b) => {
          if (a.policyName < b.policyName) return -1;
          if (a.policyName > b.policyName) return 1;
          return 0;
      });

      const sortedDirectives = sortArray(directivesDB)
      const sortedInstructions = sortArray(instructionsDB)
  
      const activeDirectives = sortedDirectives.filter(item => item.state === 'Активный')
      const draftDirectives = sortedDirectives.filter(item => item.state === 'Черновик')
      const archiveDirectives = sortedDirectives.filter(item => item.state === 'Отменён')
  
      const activeInstructions = sortedInstructions.filter(item => item.state === 'Активный')
      const draftInstructions = sortedInstructions.filter(item => item.state === 'Черновик')
      const archiveInstructions = sortedInstructions.filter(item => item.state === 'Отменён')

        

        return {
          activeDirectives: activeDirectives,
          draftDirectives: draftDirectives,
          archiveDirectives: archiveDirectives,
          activeInstructions: activeInstructions,
          draftInstructions: draftInstructions,
          archiveInstructions: archiveInstructions,
        };

      },

      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Policy", id })),
              { type: "Policy", id: "LIST" },
            ]
          : [{ type: "Policy", id: "LIST" }],
    }),

    postPolicies: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/policies/new`,
        method: "POST",
        body,
      }), 
      invalidatesTags: [{ type: "Policy", id: "LIST" }],
    }),

    getPoliciesNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/policies/new`,
      }),
      transformResponse: (response) => ({
        organizations: response.organizations || [],
      }),
    }),

    getPoliciesId: build.query({
      query: ({ userId, policyId }) => ({
        url: `${userId}/policies/${policyId}`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          currentPolicy: response.currentPolicy || {},
          organizations: response.organizations || [],
        };
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyId }) =>
        result ? [{ type: "Policy", id: policyId }] : [],
    }),

    updatePolicies: build.mutation({
      query: ({ userId, policyId, ...body }) => ({
        url: `${userId}/policies/${policyId}/update`,
        method: "PATCH",
        body,
      }),
      // Обновляем теги, чтобы перезагрузить getPoliciesId
      invalidatesTags: (result, error, { policyId }) => [
        { type: "Policy", id: policyId }, {type: "Policy", id: "LIST" }
      ],
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useGetPoliciesNewQuery,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
} = policyApi;

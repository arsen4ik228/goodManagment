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

        const activeAndDraftDirectives = directivesDB.filter(item => item.state !== 'Отменён')
        const archiveDirectives = directivesDB.filter(item => item.state === 'Отменён')

        const activeAndDraftInstructions = instructionsDB.filter(item => item.state !== 'Отменён')
        const archiveInstructions = instructionsDB.filter(item => item.state === 'Отменён')

        activeAndDraftDirectives?.sort((a, b) => {
          const stateA = a.state || '';
          const stateB = b.state || '';

          if (stateA === 'Черновик' && stateB !== 'Черновик') return -1;
          if (stateB === 'Черновик' && stateA !== 'Черновик') return 1;

          if (stateA === 'Активный' && stateB !== 'Активный') return -1;
          if (stateB === 'Активный' && stateA !== 'Активный') return 1;
          
          return 0;
        });

        activeAndDraftInstructions?.sort((a, b) => {
          const stateA = a.state || '';
          const stateB = b.state || '';

          if (stateA === 'Черновик' && stateB !== 'Черновик') return -1;
          if (stateB === 'Черновик' && stateA !== 'Черновик') return 1;

          if (stateA === 'Активный' && stateB !== 'Активный') return -1;
          if (stateB === 'Активный' && stateA !== 'Активный') return 1;
          
          return 0;
        });

        return {
          activeAndDraftInstructions: activeAndDraftInstructions,
          archiveInstructions: archiveInstructions,
          activeAndDraftDirectives: activeAndDraftDirectives,
          archiveDirectives: archiveDirectives,
          
        };

      },

      // transformResponse: (response) => {
      //   const sortedStrategies = response?.strategies
      //   sortedStrategies?.sort((a, b) => {
      //       const stateA = a.state || '';
      //       const stateB = b.state || '';
            
      //       if (stateA === 'Активный' && stateB !== 'Активный') return -1;
      //       if (stateB === 'Активный' && stateA !== 'Активный') return 1;
            
      //       if (stateA === 'Черновик' && stateB !== 'Черновик') return -1;
      //       if (stateB === 'Черновик' && stateA !== 'Черновик') return 1;
            
      //       return 0;
      //     });
      
      //   const activeAndDraftStrategies = sortedStrategies.filter(strategy => 
      //     strategy.state === 'Активный' || strategy.state === 'Черновик'
      //   );
      
      //   const otherStrategies = sortedStrategies.filter(strategy => 
      //     strategy.state !== 'Активный' && strategy.state !== 'Черновик'
      //   );
      
      //   return {
      //     activeAndDraftStrategies: activeAndDraftStrategies,
      //     archiveStrategies: otherStrategies,  
      //   };
      // },

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
        { type: "Policy", id: policyId },
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

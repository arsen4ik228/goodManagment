import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "./constans";

export const policyDirectoriesApi = createApi({
  reducerPath: "policyDirectories",
  tagTypes: ["PolicyDirectories"],
  baseQuery: fetchBaseQuery({ baseUrl}),
  endpoints: (build) => ({
    getPolicyDirectories: build.query({
      query: (userId = "") => ({
        url: `${userId}/policyDirectory`,
      }),

    //   transformResponse: (response) => ({
    //     directives: response.directives || [],
    //     instructions: response.instructions || [],
    //   }),

      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "PolicyDirectories", id })),
              { type: "PolicyDirectories", id: "LIST" },
            ]
          : [{ type: "PolicyDirectories", id: "LIST" }],
    }),

    postPolicyDirectory: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/policyDirectory/new`,
        method: "POST",
        body,
      }), 
      invalidatesTags: [{ type: "PolicyDirectories", id: "LIST" }],
    }),

//     getPoliciesNew: build.query({
//       query: (userId = "") => ({
//         url: `${userId}/policies/new`,
//       }),
//       transformResponse: (response) => ({
//         organizations: response.organizations || [],
//       }),
//     }),

//     getPoliciesId: build.query({
//       query: ({ userId, policyId }) => ({
//         url: `${userId}/policies/${policyId}`,
//       }),
//       transformResponse: (response) => {
//         console.log(response); // Отладка ответа
//         return {
//           currentPolicy: response.currentPolicy || {},
//           organizations: response.organizations || [],
//         };
//       },
//       // Добавляем теги для этой query
//       providesTags: (result, error, { policyId }) =>
//         result ? [{ type: "PolicyDirectories", id: policyId }] : [],
//     }),

//     updatePolicies: build.mutation({
//       query: ({ userId, policyId, ...body }) => ({
//         url: `${userId}/policies/${policyId}/update`,
//         method: "PATCH",
//         body,
//       }),
//       // Обновляем теги, чтобы перезагрузить getPoliciesId
//       invalidatesTags: (result, error, { policyId }) => [
//         { type: "PolicyDirectories", id: policyId },
//       ],
//     }),
  }),
});

export const {
usePostPolicyDirectoryMutation,
useGetPolicyDirectoriesQuery,
//   useGetPoliciesNewQuery,
//   useGetPoliciesIdQuery,
//   useUpdatePoliciesMutation,
} = policyDirectoriesApi;

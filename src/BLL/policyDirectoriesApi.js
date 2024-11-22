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

      transformResponse: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          const Data = response.map(item => ({
            id: item.id,
            directoryName: item.directoryName,
            policies: item.policyToPolicyDirectories.flatMap(elem => elem.policy)
          }));
      
          return Data || []
        }
        //  else []
      },
           

      providesTags: [{ type: "policyDirectories", id: "LIST" }],
    }),

    postPolicyDirectories: build.mutation({
      query: ({ userId = "", ...body }) => ({
        url: `${userId}/policyDirectory/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "policyDirectories", id: "LIST"  }] : [],
    }),

    getPolicyDirectoriesId: build.query({
      query: ({ userId, policyDirectoryId }) => ({
        url: `${userId}/PolicyDirectory/${policyDirectoryId}`,
      }),
      transformResponse: (response) => {
          const Data = {
            id: response?.policyDirectory?.id,
            directoryName: response?.policyDirectory?.directoryName,
            policies: response?.policyDirectory?.policyToPolicyDirectories?.flatMap(elem => elem.policy)
      }
      
          return {
            activeDirectives: response?.directives || [],
            activeInstructions: response?.instructions || [],
            policyDirectory: Data || [],
            data: response || []
          }
        
    
      },
      // Добавляем теги для этой query
      providesTags: (result, error, { policyDirectoryId }) =>
        result ? [{ type: "policyDirectories", id: policyDirectoryId }] : [],
    }),

    updatePolicyDirectories: build.mutation({
      query: ({userId, policyDirectoryId , ...body}) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => result ?  [{ type: "policyDirectories", id: "LIST" }]: []
    }), 

    deletePolicyDirectories: build.mutation({
      query: ({userId, policyDirectoryId}) => ({
        url: `${userId}/policyDirectory/${policyDirectoryId}/remove`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "policyDirectories", id: "LIST"  }],
    }), 
  }),
});

export const {
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useDeletePolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation,
  useGetPolicyDirectoriesIdQuery
} = policyDirectoriesApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "./constans";

export const organizationsApi = createApi({
  reducerPath: "Organizations",
  tagTypes: ["Organizations"],
  baseQuery: fetchBaseQuery({ baseUrl}),
  endpoints: (build) => ({
    getOrganizations: build.query({
      query: (userId = "") => ({
        url: `${userId}/organizations`,
      }),

      transformResponse: (response) => ({
        organizations: response || [],
        transformOrganizations: response?.map(org => ({
          id: org.id,
          organizationName: org.organizationName,
          reportDay: org.reportDay || 0
        })) || [],
      }),
      

      providesTags: (result) => result ? [{type: "Organizations", id: "LIST" }] : []
    }),

    updateOrganizations: build.mutation({
      query: ({userId, organizationId , ...body}) => ({
        url: `${userId}/organizations/${organizationId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error) => result ? [{type: "Organizations", id: "LIST" }] : []
    }),
    


  }),
});

export const {
  useGetOrganizationsQuery,
  useUpdateOrganizationsMutation
} = organizationsApi;

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
          organizationName: org.organizationName
        })) || [],
      }),
      

      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Organizations", id })),
              { type: "Organizations", id: "LIST" },
            ]
          : [{ type: "Organizations", id: "LIST" }],
    }),

  }),
});

export const {
  useGetOrganizationsQuery,
} = organizationsApi;

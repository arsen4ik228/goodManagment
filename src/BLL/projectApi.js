import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";

export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Project", "Project1"],
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (build) => ({
    getProject: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects`,
      }),
      providesTags: (result) => result ? [{type: 'Project', id: "LIST"}] : [],
    }),

    getProgramNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects/program/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          strategies: response?.strategies || [],
          organizations: response?.organizations || [],
          projects: response?.projects || [],
        };
      },
    }),

    postProject: build.mutation({
      query: ({ userId, ...body }) => ({
        url: `${userId}/projects/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => result ? [{type: 'Project', id: "LIST"}] : [],
    }),


    getProjectNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/projects/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          strategies: response?.strategies || [],
          organizations: response?.organizations || [],
          programs: response?.programs || [],
        };
      },
    }),

    getProjectId: build.query({
      query: ({userId, projectId}) => ({
        url: `${userId}/projects/${projectId}`,
      }),
      transformResponse: (response) => ({ 
        currentProject: response.project || {}, 
        targets: response?.project?.targets || [], 
        strategies: response?.strategies || [] 
      }),
      providesTags: (result, error,  {projectId}) => result ? [{type: "Project1", id: projectId }]: []
    }),

    getProgramId: build.query({
      query: ({userId, programId}) => ({
        url: `${userId}/projects/${programId}/program`,
      }),
      transformResponse: (response) => ({ 
        currentProgram: response?.program || {}, 
        currentProjects: response?.projects || [],
        targets: response?.program?.targets || [] 
      }),
      providesTags: (result, error,  {programId}) => result ? [{type: "Project1", id: programId }]: []
    }),

    updateProject: build.mutation({
      query: ({userId, projectId , ...body}) => ({
        url: `${userId}/projects/${projectId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error,  {projectId}) => result ? [{type: "Project1", id: projectId }]: []
    }),
  }),
});

export const { useGetProjectQuery, useGetProgramIdQuery,useGetProgramNewQuery, useGetProjectNewQuery, usePostProjectMutation, useGetProjectIdQuery, useUpdateProjectMutation } = projectApi;

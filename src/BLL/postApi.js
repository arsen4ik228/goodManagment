import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constans";

export const postApi = createApi({
  reducerPath: "postApi",
  tagTypes: ["Post", "PostNew"],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getPosts: build.query({
      query: (userId = "") => ({
        url: `${userId}/posts`,
      }),
      providesTags: (result, error, userId) => [{ type: "Post", id: "LIST" }],
    }),

    postPosts: build.mutation({
      query: ({ userId, addPolicyId = "null", ...body }) => ({
        url: `${userId}/posts/new?addPolicyId=${addPolicyId}`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        id: response.id
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }, { type: "PostNew", id: "NEW" }],
    }),

    getPostNew: build.query({
      query: (userId = "") => ({
        url: `${userId}/posts/new`,
      }),
      transformResponse: (response) => {
        console.log(response); // Отладка ответа
        return {
          workers: response?.workers || [],
          policies: response?.policies || [],
          posts: response?.posts || [],
          organizations: response?.organizations || [],
          maxDivisionNumber: response?.maxDivisionNumber || null
        };
      },
      providesTags: (result, error, userId) => [{ type: "PostNew", id: "NEW" }],
    }),

    getPostId: build.query({
      query: ({ userId, postId }) => ({
        url: `${userId}/posts/${postId}`,
      }),
      providesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
      transformResponse: (response) => {
        const currentPostId = response?.currentPost?.id
        console.log(response); // Отладка ответа
        return {
          currentPost: response?.currentPost || {},
          parentPost: response?.parentPost || {},
          policiesActive: response?.policiesActive || [],
          posts: response?.posts.filter(post => post.id !== currentPostId) || [],
          workers: response?.workers || [],
          organizations: response?.organizations || [],
        };
      },
    }),

    updatePosts: build.mutation({
      query: ({ userId, postId, ...body }) => ({
        url: `${userId}/posts/${postId}/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: "LIST" },  // Инвалидация списка постов
        { type: "Post", id: postId },  // Инвалидация конкретного поста
      ],
    }),
  }),
});

export const { useGetPostsQuery, useGetPostNewQuery, usePostPostsMutation, useGetPostIdQuery, useUpdatePostsMutation } = postApi;

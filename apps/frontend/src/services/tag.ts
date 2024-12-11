import { type Tag, type TagPayload } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
      providesTags: ['Tags']
    }),
    createTag: builder.mutation<Tag, TagPayload>({
      query: (body: TagPayload) => ({
        url: "/tags",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Tags']
    }),
  }),
});

export const { useGetTagsQuery, useCreateTagMutation } = tagApi;

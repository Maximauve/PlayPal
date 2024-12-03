import { type Tag } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
    }),
  }),
});

export const { useGetTagsQuery } = tagApi;

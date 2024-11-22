import { type User } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshUser: builder.query<User, void>({
      query: () => "/users/me",
    }),
  }),
});

export const { useRefreshUserQuery } = userApi;

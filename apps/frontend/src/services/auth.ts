import { type LoginDto, type LoginResponse } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (body: LoginDto) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']
    }),
    register: builder.mutation<LoginResponse, FormData>({
      query: (body: FormData) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User']
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ['User']
    })
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;

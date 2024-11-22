import { type LoginDto, type LoginResponse, type RegisterDto } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (body: LoginDto) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<LoginResponse, RegisterDto>({
      query: (body: RegisterDto) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    })
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

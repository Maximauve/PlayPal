import { type Loan, type RegisterDto, type User } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshUser: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ['User']
    }),
    getUserLoans: builder.query<Loan[], void>({
      query: () => "/users/me/loans",
    }),
    editUser: builder.mutation<User, { id: string, body: Partial<RegisterDto> }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: body ,
      }),
    }),
  }),
});

export const { useRefreshUserQuery, useEditUserMutation, useGetUserLoansQuery } = userApi;

import { type Wish, type WishPayload } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const wishApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllWishByUser: builder.query<Wish[], void>({
      query: () => `/users/me/wish`,
      providesTags: ['Wish']
    }),
    createWish: builder.mutation<Wish, WishPayload>({
      query: (body: WishPayload) => ({
        url: "/wish",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Wish'],
    }),
    deleteWish: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/wish/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Wish'],
    })
  }),
});

export const { useGetAllWishByUserQuery, useCreateWishMutation, useDeleteWishMutation } = wishApi;

import { type Product, type ProductDto } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: '/product',
        method: "GET"
      }),
      providesTags: ['Products']
    }),
    createProduct: builder.mutation<Product, ProductDto>({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery, useCreateProductMutation } = productApi;

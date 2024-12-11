import { type Loan } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoans: builder.query<Loan[], void>({
      query: () => "/loan",
    }),
    getWaintingLoans: builder.query<Loan[], void>({
      query: () => "/loan/waiting",
    }),
  }),
});

export const { useGetLoansQuery, useGetWaintingLoansQuery } = loanApi;

import { type Loan, type LoanDto } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoans: builder.query<Loan[], void>({
      query: () => "/loan",
    }),
    getWaintingLoans: builder.query<Loan[], void>({
      query: () => "/loan/waiting",
    }),
    createLoan: builder.mutation<Loan, LoanDto>({
      query: (body) => ({
        url: "/loan",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetLoansQuery, useGetWaintingLoansQuery, useCreateLoanMutation } = loanApi;

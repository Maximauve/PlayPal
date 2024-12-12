import { type Loan, type LoanDto, LoanStatus } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoans: builder.query<Loan[], void>({
      query: () => "/loan",
    }),
    getWaintingLoans: builder.query<Loan[], void>({
      query: () => "/loan/waiting",
      providesTags: ["waitingLoans"],
    }),
    createLoan: builder.mutation<Loan, LoanDto>({
      query: (body) => ({
        url: "/loan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Games", "Game"],
    }),
    acceptLoan: builder.mutation<Loan, string>({
      query: (id) => ({
        url: `/loan/${id}`,
        body: { status: LoanStatus.USING },
        method: "PUT",
      }),
      invalidatesTags: ["waitingLoans"],
    }),
    declineLoan: builder.mutation<Loan, {id : string, body : Partial<Loan>}>({
      query: ({ id, body }) => ({
        url: `/loan/${id}/decline`,
        method: "PUT",
        body: body
      }),
      invalidatesTags: ["waitingLoans"],
    }),
  }),
});

export const { useGetLoansQuery, useGetWaintingLoansQuery, useCreateLoanMutation, useAcceptLoanMutation, useDeclineLoanMutation } = loanApi;

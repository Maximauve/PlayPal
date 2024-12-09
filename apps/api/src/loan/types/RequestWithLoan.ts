import { type Loan } from "@playpal/schemas";

export interface RequestWithLoan extends Request {
  params: {
    loanId: string;
  };
  loan?: Loan;
}

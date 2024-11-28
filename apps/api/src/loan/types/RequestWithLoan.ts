import { type Loan } from "@playpal/schemas";

export interface RequestWithLoan extends Request {
  params: {
    gameId: string;
    loanId: string;
    productId: string;
  };
  loan?: Loan;
}

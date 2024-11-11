import { type Loan } from "@/loan/loan.entity";

export interface RequestWithLoan extends Request {
  params: {
    gameId: string;
    loanId: string;
    productId: string;
  };
  loan?: Loan;
}
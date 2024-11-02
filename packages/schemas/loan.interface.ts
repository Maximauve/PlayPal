import { type Product } from "./product.interface";
import { type User } from "./user.interface";

export type Loan = {
    id: number;
    product: Product;
    user: User;
    type: string;
    startDate: Date;
    endDate: Date;
}
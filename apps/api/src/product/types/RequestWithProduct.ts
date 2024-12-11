import { type Product } from "@playpal/schemas";

export interface RequestWithProduct extends Request {
  params: {
    productId: string
  };
  product?: Product;
}

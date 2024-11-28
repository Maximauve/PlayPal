import { type Product } from "@playpal/schemas";

export interface RequestWithProduct extends Request {
  params: {
    gameId: string
    productId: string
  };
  product?: Product;
}

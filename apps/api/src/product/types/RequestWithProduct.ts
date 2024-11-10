import { type Product } from "@/product/product.entity";

export interface RequestWithProduct extends Request {
  params: {
    gameId: string
    productId: string
  };
  product?: Product;
}
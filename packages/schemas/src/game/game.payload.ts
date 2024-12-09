import { Tag } from "tag.interface";

export interface GamePayload {
  tags?: Tag[];
  page?: number;
  limit?: number;
  search?: string;
}
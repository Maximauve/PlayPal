import { Tag } from "../tag/tag.entity";

export interface GamePayload {
  tags?: Tag[];
  page?: number;
  limit?: number;
  search?: string;
}
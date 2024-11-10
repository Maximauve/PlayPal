import { type Tag } from "@/tag/tag.entity";

export interface RequestWithTag extends Request {
  params: {
    gameId: string
    tagId: string
  };
  tag?: Tag;
}
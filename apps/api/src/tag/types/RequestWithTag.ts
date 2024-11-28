import { type Tag } from "@playpal/schemas";

export interface RequestWithTag extends Request {
  params: {
    gameId: string
    tagId: string
  };
  tag?: Tag;
}

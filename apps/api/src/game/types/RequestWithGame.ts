import { type Game } from "@playpal/schemas";

export interface RequestWithGame extends Request {
  params: {
    gameId: string
  };
  game?: Game;
}

import { type Game } from "@/game/game.entity";

export interface RequestWithGame extends Request {
  params: {
    gameId: string
  };
  game?: Game;
}
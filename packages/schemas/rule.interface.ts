import { Game } from "./game.interface";

export type Rule = {
  id: string;
  youtubeId?: string;
  title: string;
  description: string;
  game: Game;
}
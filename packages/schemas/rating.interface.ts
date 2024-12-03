import { type Game } from "./game.interface";
import { type User } from "./user.interface";

export type Rating = {
  id: string;
  game: Game;
  user: User;
  comment: string;
  date: Date;
  note: number;
}
import { type Game } from "./game.interface";
import { type User } from "./user.interface";

export type Wishlist = {
  id: number;
  game: Game;
  user: User;
  date: Date;
}
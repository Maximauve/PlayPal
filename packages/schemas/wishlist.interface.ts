import { type Game } from "./game.interface";
import { type User } from "./user.interface";

export type Wishlist = {
  id: number;
  games: Wish[];
  user: User;
}

export type Wish = {
  id: number;
  game: Game;
  date: Date;
}
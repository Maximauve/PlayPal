import { type Game } from "./game.interface";
import { type User } from "./user.interface";


export type Wish = {
  id: number;
  game: Game;
  user: User;
  date: Date;
}
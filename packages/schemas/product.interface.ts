import { type Game } from "./game.interface";

export enum State {
  NEW = 'NEUF',
  USED = 'ABIME',
  BROKEN = 'CASSE',
  TO_BE_REPAIRED = 'A_REPARER',
  TO_BUY = 'A_RACHETER',
}

export type Product = {
  id: string;
  game: Game;
  state: State;
  available: boolean;
}
import { Game } from "game.interface";

export type GameResponse = {
  data: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
import { Game } from "./game.entity";

export type GameResponse = {
  data: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: any[];
}
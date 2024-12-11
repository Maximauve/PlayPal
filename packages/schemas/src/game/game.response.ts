import { GameWithStats } from "./game.stats";

export type GameResponse = {
  data: GameWithStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
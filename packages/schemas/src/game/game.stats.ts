import { Game } from "./game.entity";

export interface GameWithStats extends Game {
    averageRating: number | null;
    count? : GameStatsCount[];
}

export interface GameStatsCount {
    rating: number;
    count: number;
}
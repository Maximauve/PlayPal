type Game = {
    id: number;
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    avgDuration: string;
    minYears: number;
    difficulty: number;
    tags: Tag[];
}
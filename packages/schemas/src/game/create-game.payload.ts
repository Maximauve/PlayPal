export interface CreateGamePayload {
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  difficulty: number;
  duration: string;
  minYear: number;
  brand: string;
  tagIds: string[];
}
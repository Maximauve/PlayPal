export interface CreateGamePayload {
  name: string;
  description: string;
  minPlayers: number | null;
  maxPlayers: number | null;
  difficulty: number | null;
  duration: string;
  minYear: number | null;
  brand: string;
  tagIds: string[];
  image?: File;
}
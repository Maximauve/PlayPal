import { type Tag } from "./tag.interface";
import { type Rating } from "./rating.interface";
import { type Rule } from "./rule.interface";

export type Game = {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  minYear: number;
  brand: string;
  difficulty: number;
  image?: string;
  tags: Tag[];
  rating: Rating[];
  rules: Rule[];
}

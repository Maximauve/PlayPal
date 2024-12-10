import { type CreateGamePayload } from '@playpal/schemas';
import { z } from 'zod';

export const createGameSchema = z.object({
  name: z.string(),
  description: z.string(),
  minPlayers: z.number(),
  maxPlayers: z.number(),
  difficulty: z.number(),
  duration: z.string(),
  minYear: z.number(),
  brand: z.string(),
  tagsIds: z.array(z.string())
});

export const createGameInitalValues: CreateGamePayload = {
  name: '',
  description: '',
  minPlayers: 1,
  maxPlayers: 2,
  difficulty: 1,
  duration: '',
  minYear: 3,
  brand: '',
  tagsIds: []
};

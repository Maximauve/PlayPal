import { type CreateGamePayload } from '@playpal/schemas';
import { z } from 'zod';

export const createGameSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  description: z.string().min(1, 'validation.required'),
  minPlayers: z.number(),
  maxPlayers: z.number(),
  difficulty: z.number(),
  duration: z.string().min(1, 'validation.required'),
  minYear: z.number(),
  brand: z.string().min(1, 'validation.required'),
  tagIds: z.array(z.string()).optional(),
  image: z
    .any()
    .refine((file) => file instanceof File, 'validation.invalid_image')
    .optional(),
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
  tagIds: [],
  image: undefined,
};

/* zod name convention */
/* eslint-disable @typescript-eslint/naming-convention */
import { type CreateGamePayload } from '@playpal/schemas';
import { z } from 'zod';

export const createGameSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  description: z.string().min(1, 'validation.required'),
  minPlayers: z.number({ invalid_type_error: 'validation.required' }),
  maxPlayers: z.number({ invalid_type_error: 'validation.required' }),
  difficulty: z.number({ invalid_type_error: 'validation.required' }),
  duration: z.string().min(1, 'validation.required'),
  minYear: z.number({ invalid_type_error: 'validation.required' }),
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

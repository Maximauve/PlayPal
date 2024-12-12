/* zod name convention */
/* eslint-disable @typescript-eslint/naming-convention */
import { type UpdateGamePayload } from '@playpal/schemas';
import { z } from 'zod';

export const updateGameSchema = z.object({
  name: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.string({ invalid_type_error: 'validation.required' }).min(1, 'validation.required')
  ),
  description: z.string().min(1, 'validation.required'),
  minPlayers: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number')
  ),
  maxPlayers: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number')
  ),
  difficulty: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number')
  ),
  duration: z.string().min(1, 'validation.required'),
  minYear: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number')
  ),
  brand: z.string().min(1, 'validation.required'),
  tagIds: z.array(z.string()).optional(),
  image: z
    .any()
    .refine((file) => file instanceof File, 'validation.invalid_image')
    .optional(),
}).refine(
  (data) => data.maxPlayers >= data.minPlayers,
  {
    message: 'min_max',
  }
);

export const updateGameInitalValues: UpdateGamePayload = {
  id: '',
  name: '',
  description: '',
  minPlayers: null,
  maxPlayers: null,
  difficulty: null,
  duration: '',
  minYear: null,
  brand: '',
  tagIds: [],
  image: undefined,
};

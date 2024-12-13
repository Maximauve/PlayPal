/* zod convention */
/* eslint-disable @typescript-eslint/naming-convention */
import { type CreateGamePayload } from '@playpal/schemas';
import { z } from 'zod';

export const editGameSchema = z.object({
  name: z.string().min(1, 'validation.required').optional(),
  description: z.string().min(1, 'validation.required').optional(),
  minPlayers: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number').optional()
  ),
  maxPlayers: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number').optional()
  ),
  difficulty: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number').optional()
  ),
  duration: z.string().min(1, 'validation.required').optional(),
  minYear: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number({ invalid_type_error: 'validation.required' }).min(1, 'validation.min_number').optional()
  ),
  brand: z.string().min(1, 'validation.required').optional(),
  tagIds: z.array(z.string()).optional(),
  image: z
    .union([
      z.string().url('validation.invalid_url'),
      z.instanceof(File).refine((file) => file instanceof File, 'validation.invalid_image'),
    ])
    .optional(),
}).refine(
  (data) => data.maxPlayers === undefined || data.minPlayers === undefined || data.maxPlayers >= data.minPlayers,
  {
    message: 'min_max',
  }
);

export const editGameInitialValues: Partial<CreateGamePayload> = {
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

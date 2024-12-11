import { type RegisterDto } from '@playpal/schemas';
import { z } from 'zod';

export const editUserSchema = z.object({
  username: z.string().min(1, 'validation.required').optional(),
  email: z.string().email('validation.email').min(1, 'validation.required').optional(),
  image: z
    .union([
      z.string().url('validation.invalid_url'),
      z.instanceof(File).refine((file) => file instanceof File, 'validation.invalid_image'),
    ])
    .optional(),
});

export const editUserInitialValues:Partial<RegisterDto> = {
  username: '',
  email: '',
  image: undefined,
};
import { type LoginDto } from '@playpal/schemas';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('validation.email').min(1, 'validation.required'),
  password: z.string().min(1, 'validation.required'),
});

export const loginInitalValues: LoginDto = {
  email: '',
  password: '',
};

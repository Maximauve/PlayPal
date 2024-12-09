import { type RegisterDto } from '@playpal/schemas';
import { z } from 'zod';

export const editUserSchema = z.object({
  username: z.string().min(1, 'validation.required').optional(),
  email: z.string().email('validation.email').min(1, 'validation.required').optional(),
  profilePicture: z.string().optional(),
});

export const editUserInitialValues:Partial<RegisterDto> = {
  username: '',
  email: '',
  profilePicture: '',
};
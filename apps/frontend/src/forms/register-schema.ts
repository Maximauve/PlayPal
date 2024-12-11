import { type RegisterDto } from '@playpal/schemas';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("validation.email"),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\dA-Za-z])([\dA-Za-z]|[^\dA-Za-z]){12,45}$/, "validation.password_invalid"),
  confirmPassword: z.string(),
  username: z.string().min(1, "validation.required"),
  profilePicture: z.string().optional()
}).refine(data => data.password === data.confirmPassword, { path: ['confirmPassword'], message: "validation.passwordMissmatch" });

export const registerInitalValues: RegisterDto = {
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
};

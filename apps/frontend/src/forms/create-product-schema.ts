import { type ProductDto, State } from '@playpal/schemas';
import { z } from 'zod';

export const createProductSchema = z.object({
  state: z.string().min(1, 'validation.required'),
  gameId: z.string().min(1, 'validation.required')
});

export const createProductInitalValues: ProductDto = {
  state: State.NEW,
  gameId: '',
};

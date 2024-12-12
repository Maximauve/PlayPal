import { CreateGamePayload } from './create-game.payload';

export interface EditGamePayload extends Partial<Omit<CreateGamePayload, 'image'>> {
  id?: string;
  image?: File | string;
}
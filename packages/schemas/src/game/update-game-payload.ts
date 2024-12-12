import { CreateGamePayload } from './create-game.payload';

export interface UpdateGamePayload extends Partial<Omit<CreateGamePayload, 'image'>> {
  id: string;
  image?: File | string;
}
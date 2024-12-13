import { State } from "./state.enum";

export interface ProductDto {
    state: State;
    gameId: string;
}

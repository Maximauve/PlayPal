enum State {
    NEW = 'NEUF',
    USED = 'ABIME',
    BROKEN = 'CASSE',
    TO_BE_REPAIRED = 'A_REPARER',
    TO_BUY = 'A_RACHETER',
}

type Product = {
    id: number;
    game: Game;
    state: State;
    available: boolean;
}
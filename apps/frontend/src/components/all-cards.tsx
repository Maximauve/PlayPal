import { type GameResponse, type GameWithStats } from "@playpal/schemas";

import { Card } from "@/components/cards/card";

interface AllCardsProperties {
  games?: GameResponse;
}

export const AllCards = ({ games }: AllCardsProperties ) => {
  
  return (
    <section className="relative flex justify-center mx-8 max-w-screen-2xl mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games?.data && games.data.map((game: GameWithStats) => (
          <Card key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};

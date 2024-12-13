import { type GameResponse, type GameWithStats } from "@playpal/schemas";

import { Card } from "@/components/cards/card";

interface AllCardsProperties {
  games?: GameResponse;
}

export const AllCards = ({ games }: AllCardsProperties ) => {
  
  return (
    <section className="relative flex justify-center mx-8 max-w-screen-2xl mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games?.data && games.data.length > 0 ? (
          games.data.map((game: GameWithStats) => (
            <Card key={game.id} game={game} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg h-20 flex items-center justify-center">
            Aucun résultat pour cette recherche.
          </div>
        )}
      </div>
    </section>
  );
};

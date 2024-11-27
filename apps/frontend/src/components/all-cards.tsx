import { type Game } from "@playpal/schemas";
import { type FC } from "react";

import { Card } from "@/components/card";

interface AllCardsProperties {
  games: Game[];
}

export const AllCards: FC<AllCardsProperties> = ({ games }) => {
  
  return (
    <section className="relative flex justify-center mx-8 max-w-screen-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games && games.map((game: Game) => (
          <Card key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};
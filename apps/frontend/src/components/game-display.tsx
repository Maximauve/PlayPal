import { type Game, type GameResponse } from "@playpal/schemas";
import React from "react";

import image from "@/assets/images/all-games.png";

interface GameDisplayProperties {
  displayMode: "card" | "list";
  games: GameResponse;
}

export default function GameDisplay({ games, displayMode }: GameDisplayProperties) : React.JSX.Element {
  return (
    <div className={"flex gap-2" + (displayMode === 'card' ? ' flex-row flex-wrap' : ' flex-col')} >
      {games?.data && games.data.map((game: Game) => (
        <div
          key={game.id}
          className={"rounded-lg p-3 bg-background-dark text-text-light hover:shadow-[0_0_10px_0px_rgba(255,255,255,0.25)]" + (displayMode === 'card' ? ' w-52 text-center' : ' flex flex-row items-end')}
        >
          {displayMode !== 'list' && (
            game.image ? (
              <img className="w-full h-40 object-cover rounded-lg mb-2" src={game.image} alt={game.name} />
            ): (
              <img className="w-full h-40 object-cover rounded-lg mb-2" src={image} />
            )
          )}

          <h3 className="text-lg">{game.name}</h3>
          {displayMode === "list" && <p className="truncate mr-1 ml-4 text-sm font-light opacity-70">{game.description}</p>}

        </div>
      ))}
    </div>
  );
};

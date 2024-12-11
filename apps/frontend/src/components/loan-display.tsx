import { type Game, type GameResponse } from "@playpal/schemas";
import React from "react";

import image from "@/assets/images/all-games.png";

interface GameDisplayProperties {
  displayMode: "card" | "list";
  games: GameResponse;
}

export default function LoanDisplay({ games, displayMode }: GameDisplayProperties) : React.JSX.Element {
  return (
    <div className={displayMode === "card" ? "game-card" : "game-list"} >
      {games?.data && games.data.map((game: Game) => (
        <div
          key={game.id}
          className={displayMode === "card" ? "game-card-item" : "game-list-item"}
        >
          {game.image ? (
            <img className={displayMode === "list" ? "hidden" : ""} src={game.image} alt={game.name} />
          ): (
            <img className={displayMode === "list" ? "hidden" : ""} src={image} />
          )
          }
          
          <h3 className="">{game.name}</h3>
          {displayMode === "list" && <p className="truncate mx-1">{game.description}</p>}
        
        </div>
      ))}
    </div>
  );
};
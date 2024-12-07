import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

interface Game {
  id: number;
  image: string;
  name: string;
  description?: string | null;
}

interface GameDisplayProperties {
  displayMode: "card" | "list";
  games: Game[];
}

const GameDisplay: React.FC<GameDisplayProperties> = ({ games, displayMode }) => {
  return (
    <div
      className={classNames({
        "game-display": displayMode === "card",
        "game-list": displayMode === "list",
      })}
    >
      {games.map((game) => (
        <div
          key={game.id}
          className={classNames({
            "game-card-item": displayMode === "card",
            "game-list-item ": displayMode === "list",
          })}
        >
          {game.image && (
            <img className={classNames({ "hidden": displayMode === "list" })} src={game.image} alt={game.name} />
          )}
          
          <h3 className="">{game.name}</h3>
          {displayMode === "list" && <p className="truncate mx-1">{game.description}</p>}
        
        </div>
      ))}
    </div>
  );
};
              

GameDisplay.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired
  ).isRequired,
  displayMode: PropTypes.oneOf<"card" | "list">(["card", "list"]).isRequired,
};

export default GameDisplay;

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
            "game-card": displayMode === "card",
            "game-list-item": displayMode === "list",
          })}
        >
          {game.image && (
            <img src={game.image} alt={game.name} />
          )}
          <div>
            <h3>{game.name}</h3>
            {displayMode === "list" && <p>{game.description}</p>}
          </div>
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

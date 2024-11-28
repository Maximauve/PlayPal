import React from "react";

export default function GameList(): React.JSX.Element {
  return (
    <main className="game-list">
      <button className="add-game-button">AddGame</button>
      <div className="list">
        <p>GameList</p>
      </div>
    </main>
  );
}
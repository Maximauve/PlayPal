import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";

import GameDisplay from "@/components/game-display";

const games = [
  {
    id: 1,
    name: "Uno",
    image: "https://cdn1.epicgames.com/ca93b6d41a4e41af864942d8f0a2a826/offer/GameName_Store_Landscape_2560x1440-2560x1440-43068caa839fc392e6bb54e0daf2e8a8.jpg",
    description: "Tout le monde s’amuse avec UNO ! Ce jeu de cartes incontournable, qui consiste à associer des couleurs et des chiffres, comprend désormais des cartes Joker personnalisables.",
  },
  {
    id: 2,
    name: "Skyjo",
    image: "https://cdn.cultura.com/cdn-cgi/image/width=830/media/pim/76_3017472_1_10_FR.PNG",
    description: "Anticipez et soyez audacieux...! Skyjo est un jeu de cartes simple, subtil et terriblement addictif pour 2 à 8 joueurs.",
  },
  {
    id: 3,
    name: "Cluedo",
    image: "https://www.hasbro.com/common/productimages/fr_CH/583FB230960B494AA31338CDF7C1ED79/c3297510441976dce53d57e2ce329801f7fb246b.jpg",
    description: "CLUEDO, le jeu d'enquête classique. Six suspects. Un meurtrier. Une arme. Un lieu. Et, bien entendu, un gagnant. ",
  },
];

export default function GameList(): React.JSX.Element {
  const [displayMode, setDisplayMode] = useState<"card" | "list">("card");

  // Fonction pour basculer entre les modes
  const toggleDisplayMode = () => {
    setDisplayMode((previousMode) => (previousMode === "card" ? "list" : "card"));
  };

  return (
    <main className="games">
      <button className="add-game-button">AddGame</button>
      <div className="list">
        <button onClick={toggleDisplayMode} className="toggle-display-button">
          {displayMode === "card" ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faGrip} />}
        </button>
        <GameDisplay games={games} displayMode={displayMode} />
      </div>
    </main>  );
}
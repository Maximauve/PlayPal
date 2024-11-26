import { type Game } from "@playpal/schemas/game.interface";
import { type FC } from "react";

import { Card } from "@/components/card";

interface AllCardsProperties {}

export const AllCards: FC<AllCardsProperties> = () => {
  const mockGames: Game[] = [
    {
      id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
      name: "6-qui-prends",
      description: "Un jeu de taureaux",
      minPlayers: 3,
      maxPlayers: 8,
      duration: "45",
      difficulty: 3,
      minYear: 10,
      brand: "Gigamic",
      rating: [],
      tags: [{
        "id": "ofezifhu",
        "name": "oui"
      },{
        "id": "fez",
        "name": "Social"
      },{
        "id": "ofefzezzifhu",
        "name": "Evenement"
      },{
        "id": "ofezefzzifhu",
        "name": "jeux"
      },{
        "id": "offezfezifhu",
        "name": "Eveil"
      },{
        "id": "fe",
        "name": "Refléxion"
      },{
        "id": "efzf",
        "name": "Pour"
      },{
        "id": "ezf",
        "name": "Moi"
      }],
      rules: [],
    },
    {
      id: "109ebba9-9823-45bf-88b5-889c621d58f9",
      name: "Skyjo",
      description: "Un jeu de couleurs",
      minPlayers: 2,
      maxPlayers: 8,
      duration: "35",
      difficulty: 1,
      minYear: 3,
      brand: "Magilano",
      rating: [],
      tags: [],
      rules: []
    },
    {
      id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
      name: "6-qui-prends",
      description: "Un jeu de taureaux",
      minPlayers: 3,
      maxPlayers: 8,
      duration: "45",
      difficulty: 3,
      minYear: 10,
      brand: "Gigamic",
      rating: [],
      tags: [],
      rules: [],
    },
    {
      id: "109ebba9-9823-45bf-88b5-889c621d58f9",
      name: "Skyjo",
      description: "Un jeu de couleurs",
      minPlayers: 2,
      maxPlayers: 8,
      duration: "35",
      difficulty: 1,
      minYear: 3,
      brand: "Magilano",
      rating: [],
      tags: [],
      rules: []
    },
    {
      id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
      name: "6-qui-prends",
      description: "Un jeu de taureaux",
      minPlayers: 3,
      maxPlayers: 8,
      duration: "45",
      difficulty: 3,
      minYear: 10,
      brand: "Gigamic",
      rating: [],
      tags: [],
      rules: [],
    },
    {
      id: "109ebba9-9823-45bf-88b5-889c621d58f9",
      name: "Skyjo",
      description: "Un jeu de couleurs",
      minPlayers: 2,
      maxPlayers: 8,
      duration: "35",
      difficulty: 1,
      minYear: 3,
      brand: "Magilano",
      rating: [],
      tags: [],
      rules: []
    },
    {
      id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
      name: "6-qui-prends",
      description: "Un jeu de taureaux",
      minPlayers: 3,
      maxPlayers: 8,
      duration: "45",
      difficulty: 3,
      minYear: 10,
      brand: "Gigamic",
      rating: [],
      tags: [],
      rules: [],
    },
    {
      id: "109ebba9-9823-45bf-88b5-889c621d58f9",
      name: "Skyjo",
      description: "Un jeu de couleurs",
      minPlayers: 2,
      maxPlayers: 8,
      duration: "35",
      difficulty: 1,
      minYear: 3,
      brand: "Magilano",
      rating: [],
      tags: [],
      rules: []
    }
  ];
  return (
    <section className="relative flex justify-center mx-8 max-w-screen-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockGames && mockGames.map((game: Game) => (
          <Card key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};
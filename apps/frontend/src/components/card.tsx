import { type Game } from '@playpal/schemas';

import { Rating } from '@/components/rating';
import { TagsContainer } from '@/components/tags-container';
import useTranslation from '@/hooks/use-translation';

interface CardProps {
  game: Game;
  inStock?: boolean;
}

export const Card = ({
  game,
  inStock = false
}: CardProps) => {
  const i18n = useTranslation();
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full flex flex-col">
      <img
        className="w-full h-48 object-cover"
        src={
          game?.image
            ? `${import.meta.env.VITE_BASE_API_URL}:${import.meta.env.VITE_BASE_API_PORT}/files/${game.image}`
            : '/all-games.png'
        }
        alt="Game image"
      />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold truncate text-black">{game.name}</h3>
            <p className="text-gray-500 font-medium">{game.brand}</p>
          </div>
          <span className={`${inStock ? 'bg-green-700' : 'bg-red-600'} text-white text-xs px-2 py-1 rounded`}>{inStock ? i18n.t("card.inStock") : i18n.t("card.notStock")}</span>
        </div>
        <div className="flex gap-1 my-2">
          <Rating rating={1.2} />
          <span className="text-gray-600 text-sm"> - {game?.rating?.length ?? 0} {i18n.t("card.rating")}</span>
        </div>
        <TagsContainer tags={game.tags}/>
      </div>
      <div className="flex justify-center relative mb-3 mt-auto">
        <button className="w-4/5 bg-black p-3 rounded-md">{i18n.t("card.open")}</button>
      </div>
    </div>
  );
};

import { type GameWithStats } from '@playpal/schemas';
import { useNavigate } from 'react-router-dom';

import AllGame from "@/assets/images/all-games.png";
import BinIcon from "@/assets/images/svg/bin.svg?react";
import { Rating } from '@/components/rating';
import { TagsContainer } from '@/components/tags-container';
import useTranslation from '@/hooks/use-translation';

interface CardProps {
  game: GameWithStats;
  inStock?: boolean;
  onRemove?: () => void;
}

export const Card = ({
  game,
  inStock = false,
  onRemove
}: CardProps) => {
  const i18n = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full flex flex-col">
      <img
        className="w-full h-48 object-cover"
        src={game.image ?? AllGame}
        alt="Game image"
      />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold truncate text-wrap text-black">{game.name}</h3>
            <p className="text-gray-500 font-medium">{game.brand}</p>
          </div>
          <span className={`${inStock ? 'bg-green-700' : 'bg-red-600'} text-white text-xs px-2 py-1 rounded`}>{inStock ? i18n.t("card.inStock") : i18n.t("card.notStock")}</span>
        </div>
        <div className="flex items-center gap-1 my-2">
          <Rating rating={game.averageRating || 0} />
          <span className="text-gray-600 text-sm"> - {game?.rating?.length ?? 0} {i18n.t("card.rating")}</span>
        </div>
        <TagsContainer tags={game.tags}/>
      </div>
      <div className={`flex justify-around relative ${onRemove ? "m-3" : "mb-3"} mt-auto`}>
        <button className={`${onRemove ? "w-3/4" : "w-4/5"} bg-black p-3 rounded-md`} onClick={() => navigate(`/games/${game.id}`)}>{i18n.t("card.open")}</button>
        {onRemove && (
          <button className="w-12 h-12 bg-red-600 flex justify-center items-center rounded-md" onClick={onRemove}><BinIcon color="white" className="w-8 h-8"/></button>
        )}
      </div>
    </div>
  );
};

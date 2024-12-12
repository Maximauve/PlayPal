import { type Game, type Loan } from '@playpal/schemas';
import React from 'react';

import AllGame from "@/assets/images/all-games.png";
import { Rating } from '@/components/rating';
import { TagsContainer } from '@/components/tags-container';
import useTranslation from '@/hooks/use-translation';

interface Props {
  loan: Loan;
}

export default function LoanHistoryCard({ loan }: Props): React.JSX.Element {

  const game: Game | null = loan.product?.game ?? null;
  const inStock: boolean = loan.product?.available ?? false;
  const i18n = useTranslation();
  console.log(loan);
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full flex ">
      <img
        className="h-56 object-cover"
        src={game?.image ?? AllGame}
        alt="Game image"
      />
      <div className="p-4 flex flex-col w-full">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold truncate text-black">{game?.name}</h3>
            <p className="text-gray-500">{game?.brand}</p>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-gray-500 font-medium">{i18n.t("card.loanStartDate")} {new Date(loan.startDate).toLocaleString()}</p>
            <p className="text-gray-500 font-medium">{i18n.t("card.loanEndDate")} {new Date(loan.endDate).toLocaleString()}</p>
          </div>
          <span className={`${inStock ? 'bg-green-700' : 'bg-red-600'} text-white text-xs px-2 py-1 rounded`}>{inStock ? i18n.t("card.inStock") : i18n.t("card.notStock")}</span>
        </div>
        <div className="flex gap-1 my-2">
          <Rating rating={1.2} />
          <span className="text-gray-600 text-sm"> - {game?.rating?.length ?? 0} {i18n.t("card.rating")}</span>
        </div>
        <TagsContainer tags={game?.tags ?? []} />
        <div className="flex justify-start relative mb-3 mt-auto pl-3">
          <button className="w-1/5 bg-black p-3 rounded-md">{i18n.t("card.open")}</button>
        </div>
      </div>

    </div>
  );
}
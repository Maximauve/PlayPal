import { type Game, type Loan } from "@playpal/schemas";
import React from "react";

import AllGame from "@/assets/images/all-games.png";
import useTranslation from "@/hooks/use-translation";


interface LoanDisplayProperties {
  loan: Loan;
}

export default function LoanDisplay({ loan }: LoanDisplayProperties) : React.JSX.Element {
  const game: Game | null = loan.product?.game ?? null;
  const inStock: boolean = loan.product?.available ?? false;
  const i18n = useTranslation();
  
  return (
    <div className="bg-slate-100 shadow-md rounded-lg border-black overflow-hidden w-full flex  my-3">
      <img
        className="h-32 object-cover"
        src={game?.image ?? AllGame}
        alt="Game image"
      />
      <div className="p-4 flex flex-col w-full">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold truncate text-black">{game?.name}</h3>
            <p className="text-gray-500">{game?.brand}</p>
            <p className="text-gray-500">{loan.user?.username}</p>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-gray-500 font-medium">{i18n.t("card.loanStartDate")} {new Date(loan.startDate).toLocaleString()}</p>
            <p className="text-gray-500 font-medium">{i18n.t("card.loanEndDate")} {new Date(loan.endDate).toLocaleString()}</p>
          </div>
          <span className={`${inStock ? 'bg-green-700' : 'bg-red-600'} text-white text-xs px-2 py-1 rounded`}>{inStock ? i18n.t("card.inStock") : i18n.t("card.notStock")}</span>
        </div>
        <div className="flex justify-start relative mb-3 mt-auto pl-3">
          <button className="w-1/6 bg-black p-1 mr-1 rounded-md">{i18n.t("card.open")}</button>
          <button className="w-1/6 bg-green-700 p-1 mr-1 rounded-md">{} Accepter</button>
          <button className="w-1/6 bg-red-600 p-1 mr-1 rounded-md">{} Décliner</button>
        </div>
      </div>
  
    </div>
  );
};
import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type GamePayload } from '@playpal/schemas';
import { useState } from "react";

import GameDisplay from "@/components/game-display";
import useTranslation from '@/hooks/use-translation';
import { useGetGamesQuery } from '@/services/game';

export default function GameList( ) {
  const i18n = useTranslation();

  const { isLoading, data } = useGetGamesQuery({} as GamePayload);
  const [displayMode, setDisplayMode] = useState<"card" | "list">("card");

  const toggleDisplayMode = () => {
    setDisplayMode((previousMode) => (previousMode === "card" ? "list" : "card"));
  };

  return (
    <main className="games">
      <button className="add-game-button">{i18n.t("admin.game.add")}</button>
      <div className="list">
        <button onClick={toggleDisplayMode} className="toggle-display-button">
          {displayMode === "card" ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faGrip} />}
        </button>
        { isLoading ? (
          <p>Loading...</p>
        ) : data && data.data.length > 0 && (
          <>
            <GameDisplay games={data} displayMode={displayMode} />
          </>
        )}
      </div>
    </main>  
  );
};
import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";

// import GameDisplay from "@/components/game-display";
import Loader from '@/components/loader';
// import useTranslation from '@/hooks/use-translation';
import { useGetLoansQuery } from '@/services/loan';

export default function LoanList( ) {
//   const i18n = useTranslation();

  const { isLoading, data } = useGetLoansQuery();
  const [displayMode, setDisplayMode] = useState<"card" | "list">("card");

  const toggleDisplayMode = () => {
    setDisplayMode((previousMode) => (previousMode === "card" ? "list" : "card"));
  };


  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <section className="games">
      <div className="list">
        <button onClick={toggleDisplayMode} className="toggle-display-button">
          {displayMode === "card" ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faGrip} />}
        </button>
        { isLoading ? (
          <Loader />
        ) : data && data.length > 0 && (
          <div>
            {data.map((loan) => (
              <div key={loan.id}>
                <p>{loan.id}</p>
                {/* <p>{loan.user}</p>
                <p>{loan.game}</p> */}
              </div>
            ))}
          </div>
        )}
      </div>

    </section>  
  );
};
import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useEffect, useState } from "react";

import AdminButton from '@/components/_layout/admin/admin-button';
import Loader from '@/components/loader';
import CreateGameModal from '@/components/modals/create-game-modal';
import useModal from '@/hooks/use-modal';
import useTranslation from '@/hooks/use-translation';
import { useGetProductsQuery } from '@/services/product';

export default function ProductLayout() {
  const i18n = useTranslation();

  const { isLoading, data } = useGetProductsQuery();
  const [displayMode, setDisplayMode] = useState<"card" | "list">("card");
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const toggleDisplayMode = () => {
    setDisplayMode((previousMode) => (previousMode === "card" ? "list" : "card"));
  };

  return (
    <Fragment>
      <div className='w-full flex flex-row justify-end'>
        <AdminButton onClick={openModal} className='py-2 px-8'>{i18n.t("admin.game.add")}</AdminButton>
      </div>
      <div className="col-[1/3] row-[2/3] bg-admin-background-light rounded-2xl p-2 shadow-admin h-full">
        <AdminButton onClick={toggleDisplayMode} className='mb-4 py-2 px-4 w-12'>
          {displayMode === "card" ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faGrip} />}
        </AdminButton>
        { isLoading ? (
          <Loader />
        ) : data && data.length > 0 && (
          <p>j'ai de la data wola</p>
        )}
      </div>
      <CreateGameModal isVisible={isOpen} onClose={closeModal} />
    </Fragment>
  );
};
